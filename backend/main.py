from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os 
from openai import OpenAI
from dotenv  import load_dotenv
import json
from cerebras.cloud.sdk import Cerebras

load_dotenv()

# Load API key from environment variable
cerebras_api_key = os.getenv("CEREBRAS_API_KEY")
if not cerebras_api_key:
    raise ValueError("CEREBRAS_API_KEY environment variable is not set. Please set it in your .env file.")

client = Cerebras(
    api_key=cerebras_api_key,
)

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict this to specific domains)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

class ClaimRequest(BaseModel):
    text :str
@app.get("/")
def read_root():
    return{"message": "AI Truth Engine Running"}
def extract_claim(user_text: str):
    promt = f"""
    You are an expert fact-verification preprocessor.
    Your task is to convert noisy human text into a single clear,
    objective, machine-verifiable factual claim.

    STRICT RULES:

    1. Identify the primary factual statement in the input.
    2. Remove opinions, jokes, emotions, or uncertainty.
    3. Rewrite the claim as one concise declarative sentence.
    4. Do NOT add new information.
    5. If no factual claim exists, return: "NO_VERIFIABLE_CLAIM".
    6. Output ONLY the final sentence.
    Do not explain reasoning.
    Do not include extra words.

    The output must be suitable for automated fact-checking systems.


    Text: {user_text}
    """

    response = client.chat.completions.create(
    model="gpt-oss-120b",
    temperature=0,
    messages=[
        {
            "role": "system",
            "content": promt
        },
        {
            "role": "user",
            "content": user_text
        }
    ],
)

    return response.choices[0].message.content.strip()

def verify_claim_with_grounding(claim: str) -> dict:
    """
    Uses Gemini with search grounding to verify a factual claim
    and return structured verification result.
    """

    verification_prompt = f"""
    You are an advanced fact-verification AI.

    Your job:
    Verify the factual accuracy of the following claim using
    grounded web knowledge.

    CLAIM:
    {claim}

    Return STRICT JSON with this structure:


    {{
      "verdict": "TRUE | FALSE | UNCERTAIN",
      "confidence": number_between_0_and_100,
      "reasoning": "short clear explanation",
      "sources": [
        {{"title": "...", "url": "..."}}
      ]
    }}

    Rules:
    - Use real world knowledge.
    - Do NOT invent sources.
    - Keep reasoning concise.
    - Output ONLY valid JSON.
    Do not wrap in markdown.
    Do not include ```json.
    Do not include explanations.
    """

    response = client.chat.completions.create(
        model="gpt-oss-120b",
        temperature=0,
        messages=[
            {"role": "user", "content": verification_prompt}
        ],
    )

    content = response.choices[0].message.content.strip()

    return json.loads(content)


def score_source_credibility(url: str) -> str:
    """
    Simple rule-based credibility scoring.
    """

    high_domains = [
    ".gov", ".edu",
    "nasa.gov", "who.int", "un.org",
    "nih.gov", "cdc.gov",
    "clevelandclinic.org", "mayoclinic.org",
    "healthline.com"
]

    medium_domains = ["bbc.com", "reuters.com", "nytimes.com", "theguardian.com"]

    for d in high_domains:
        if d in url:
            return "HIGH"

    for d in medium_domains:
        if d in url:
            return "MEDIUM"

    return "LOW"


def detect_bias(reasoning: str) -> str:
    """
    Uses Gemini to classify bias level in reasoning text.
    """

    bias_prompt = f"""
    Classify the bias level of the following explanation.

    Explanation:
    {reasoning}

    Respond with ONLY one word:
    NEUTRAL, SLIGHTLY_BIASED, or HIGHLY_BIASED.
    """

    response = client.chat.completions.create(
        model="gpt-oss-120b",
        temperature=0,
        messages=[{"role": "user", "content": bias_prompt}],
    )

    return response.choices[0].message.content.strip()




def compute_truth_score(verification: dict, bias_level: str) -> int:
    """
    Combines model confidence, source credibility, and bias
    into a final truth score (0–100).
    """

    score = verification.get("confidence", 50)

    # ----- Source credibility adjustment -----
    credibility_adjustments = {
        "HIGH": 5,
        "MEDIUM": 0,
        "LOW": -10
    }

    if verification.get("sources"):
        adj = [
            credibility_adjustments.get(src.get("credibility", "LOW"), -10)
            for src in verification["sources"]
        ]
        score += sum(adj) / len(adj)

    # ----- Bias penalty -----
    bias_penalty = {
        "NEUTRAL": 0,
        "SLIGHTLY_BIASED": -10,
        "HIGHLY_BIASED": -25
    }

    score += bias_penalty.get(bias_level, -10)

    # Clamp between 0 and 100
    score = max(0, min(100, int(score)))

    return score



@app.post("/analyze")
def analyze_claim(request: ClaimRequest):
    try:
        extracted_claim = extract_claim(request.text)
        verification_result = verify_claim_with_grounding(extracted_claim)
         # ---- Bias detection ----
        bias_level = detect_bias(verification_result["reasoning"])

        # ---- Credibility scoring ----
        for src in verification_result["sources"]:
            src["credibility"] = score_source_credibility(src["url"])

        # Step 5: Final truth score
        final_score = compute_truth_score(verification_result, bias_level)
        return {
            "original_text": request.text,
            "extracted_claim": extracted_claim,
            "verification": verification_result,
            "bias_level": bias_level,
            "final_truth_score": final_score,
            "status": "COMPLETED"
        }
    except Exception as e:
        return {
            "error": str(e),
            "type": str(type(e))
        }
