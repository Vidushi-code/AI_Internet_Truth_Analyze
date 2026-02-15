# 🧠 AI Internet Truth Engine

An advanced multi-agent AI-powered fact verification system that analyzes claims using state-of-the-art language models to determine their truthfulness, detect bias, and evaluate source credibility.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.129.0-green)

## 🚀 Live Demo

### 🌐 Production Web Application
> 🔗 **[Frontend Demo]** *(Deploy link coming soon)*

The primary user-facing interface showcasing the complete AI verification workflow with modern UI/UX design.

### ⚙️ Interactive API Documentation
> 📚 **[API Docs]** *(Deploy link coming soon)*

Explore the FastAPI auto-generated documentation with Swagger UI. Test endpoints in real-time and view request/response schemas.

### 🧪 Streamlit Research Prototype
> 🤗 **[Streamlit App]** *(Deploy link coming soon)*

A rapid-prototyping interface designed for experimentation and internal demonstration of AI workflows. Ideal for testing and validation.


## ✨ Features

- **🔍 Intelligent Claim Extraction**: Automatically extracts verifiable claims from noisy human text
- **✅ Multi-Source Verification**: Cross-references claims against real-world knowledge
- **📊 Truth Scoring**: Computes a comprehensive truth score (0-100) based on multiple factors
- **🎯 Bias Detection**: Identifies and classifies bias levels in reasoning
- **🔗 Source Credibility Analysis**: Evaluates the reliability of sources using domain reputation
- **🎨 Modern UI**: Beautiful, responsive interface with real-time results
- **⚡ Fast API Backend**: Built with FastAPI for high-performance asynchronous operations

## 🏗️ Architecture

The system uses a **multi-agent pipeline** approach:

1. **Claim Extraction Agent**: Converts raw user input into structured, verifiable claims
2. **Verification Agent**: Validates claims against grounded web knowledge using AI
3. **Credibility Scoring Agent**: Evaluates source reliability based on domain reputation
4. **Bias Detection Agent**: Analyzes reasoning for potential bias
5. **Truth Score Aggregator**: Combines all metrics into a final truth score

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Cerebras Cloud SDK**: Powers AI inference with Llama 3.3 70B model
- **Pydantic**: Data validation and settings management
- **Python-dotenv**: Environment variable management

### Frontend
- **HTML5/CSS3**: Modern semantic markup and styling
- **Vanilla JavaScript**: No framework overhead, pure performance
- **Google Fonts (Inter)**: Clean, professional typography

### Streamlit UI (Alternative Interface)
- **Streamlit**: Rapid prototyping framework for data apps
- **Requests**: HTTP library for API communication
- **Python-dotenv**: Environment configuration

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- A Cerebras API key (get one at [Cerebras Cloud](https://cloud.cerebras.ai/))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Vidushi-code/AI_Internet_Truth_Analyzer.git
cd "AI Internet Truth Engine(ui)"
```

### 2. Set Up the Backend

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
CEREBRAS_API_KEY=your_cerebras_api_key_here
```

> ⚠️ **Security Note**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 4. Run the Backend Server

```bash
# From the backend directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 5. Launch the Frontend

Open `frontend_ui/index.html` in your web browser, or use a local server:

```bash
# Using Python's built-in server
cd frontend_ui
python -m http.server 3000
```

Then navigate to `http://localhost:3000`

### 6. Launch Streamlit App (Optional)

For an alternative Streamlit-based interface:

```bash
# Navigate to streamlit_app directory
cd streamlit_app

# Install Streamlit dependencies
pip install -r requirements.txt

# Run the Streamlit app
streamlit run app.py
```

The Streamlit app will be available at `http://localhost:8501`

> 💡 **Tip**: The Streamlit interface provides a cleaner, research-focused UI ideal for demonstrations and rapid testing.

## 📖 Usage

1. **Enter a Claim**: Type or paste any claim you want to verify in the text area
   - Example: "The Earth revolves around the Sun"
   - Example: "Drinking 8 glasses of water daily is necessary"

2. **Analyze**: Click the "Analyze Truth" button or press `Ctrl+Enter`

3. **Review Results**: The system will display:
   - **Truth Score**: 0-100 rating of claim accuracy
   - **Verdict**: TRUE, FALSE, or UNCERTAIN
   - **Bias Level**: NEUTRAL, SLIGHTLY_BIASED, or HIGHLY_BIASED
   - **Reasoning**: Clear explanation of the verdict
   - **Sources**: List of references with credibility ratings

## 🔌 API Documentation

### Endpoints

#### `GET /`
Health check endpoint.

**Response:**
```json
{
  "message": "AI Truth Engine Running"
}
```

#### `POST /analyze`
Analyzes a claim and returns verification results.

**Request Body:**
```json
{
  "text": "Your claim here"
}
```

**Response:**
```json
{
  "original_text": "Your original input",
  "extracted_claim": "Extracted verifiable claim",
  "verification": {
    "verdict": "TRUE | FALSE | UNCERTAIN",
    "confidence": 85,
    "reasoning": "Explanation of the verdict",
    "sources": [
      {
        "title": "Source Title",
        "url": "https://example.com",
        "credibility": "HIGH | MEDIUM | LOW"
      }
    ]
  },
  "bias_level": "NEUTRAL | SLIGHTLY_BIASED | HIGHLY_BIASED",
  "final_truth_score": 82,
  "status": "COMPLETED"
}
```

### Interactive API Docs

FastAPI provides automatic interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🧪 Testing

Test the backend API using curl:

```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"text":"The Earth is flat"}'
```

## 📂 Project Structure

```
AI Internet Truth Engine/
├── backend/
│   ├── main.py              # FastAPI application and core logic
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (not in repo)
├── frontend_ui/
│   ├── index.html          # Main UI markup
│   ├── styles.css          # Styling and animations
│   ├── script.js           # Frontend logic
│   └── README.md           # Frontend documentation
├── streamlit_app/
│   ├── app.py              # Streamlit application
│   └── requirements.txt    # Streamlit dependencies
├── requirements.txt        # Root dependencies
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🎯 How It Works

### 1. Claim Extraction
The system first processes raw user input to extract a single, clear, verifiable claim:
- Removes opinions and emotions
- Identifies the primary factual statement
- Rewrites as a concise declarative sentence

### 2. Verification
Uses the Cerebras Llama 3.3 70B model to:
- Cross-reference the claim with grounded knowledge
- Determine verdict (TRUE/FALSE/UNCERTAIN)
- Provide confidence score
- Cite relevant sources

### 3. Credibility Scoring
Evaluates sources based on domain reputation:
- **HIGH**: .gov, .edu, WHO, NASA, CDC, NIH, Mayo Clinic, etc.
- **MEDIUM**: BBC, Reuters, NYTimes, The Guardian
- **LOW**: All other domains

### 4. Bias Detection
Analyzes the reasoning text to detect:
- Neutral language
- Slight bias indicators
- Highly biased explanations

### 5. Final Score Calculation
Combines all factors:
```
Final Score = Base Confidence 
            + Source Credibility Adjustment 
            - Bias Penalty
```

## 🔒 Security Considerations

- API keys are stored in environment variables
- CORS is configured (update in production for specific domains)
- Input validation prevents malformed requests
- No sensitive data is logged

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- API rate limits may apply based on your Cerebras subscription
- Source discovery depends on model's training data cutoff

## 🗺️ Roadmap

- [ ] Add support for multiple AI providers (OpenAI, Google Gemini)
- [ ] Implement user authentication and history tracking
- [ ] Add multi-language support
- [ ] Create browser extension
- [ ] Implement caching for frequently verified claims
- [ ] Add export functionality (PDF, CSV)

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/Vidushi-code/AI_Internet_Truth_Analyzer/issues)
- Contact: [Your contact information]

## 🙏 Acknowledgments

- [Cerebras](https://cerebras.ai/) for providing powerful AI infrastructure
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework
- Open-source community for continuous inspiration

## ⚠️ Disclaimer

This tool is designed to assist with fact-checking but should not be considered 100% accurate. Always cross-reference important claims with multiple authoritative sources. The system's accuracy depends on the AI model's training data and may not reflect the most recent information.

---

**Made with ❤️ by Vidushi**

**⭐ Star this repo if you find it helpful!**
