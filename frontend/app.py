import streamlit as st
import requests

st.set_page_config(
    page_title="AI Internet Truth Engine",
    page_icon="🔎",
    layout="centered"
)

# ---------- Custom CSS ----------
st.markdown("""
<style>
.main-title {
    text-align: center;
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 10px;
}

.subtitle {
    text-align: center;
    color: gray;
    margin-bottom: 30px;
}

.score-card {
    padding: 25px;
    border-radius: 16px;
    text-align: center;
    background: linear-gradient(135deg, #4f46e5, #3b82f6);
    color: white;
    font-size: 32px;
    font-weight: bold;
}

.verdict {
    font-size: 22px;
    font-weight: 600;
}

.source-card {
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    margin-bottom: 10px;
}
</style>
""", unsafe_allow_html=True)

# ---------- Header ----------
st.markdown('<div class="main-title">🔎 AI Internet Truth Engine</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Multi-Agent AI system for real-time fact verification</div>', unsafe_allow_html=True)

# ---------- Input ----------
claim = st.text_input("Enter a claim to verify:")

analyze = st.button("Analyze Claim")

# ---------- Analysis ----------
if analyze and claim:
    with st.spinner("Analyzing with AI agents..."):

        try:
            response = requests.post(
                "http://127.0.0.1:8000/analyze",
                json={"text": claim},
                timeout=60
            )

            data = response.json()

            # Check if backend returned an error
            if "error" in data:
                st.error(f"Backend Error: {data.get('error', 'Unknown error')}")
            else:
                # ---------- Truth Score ----------
                st.markdown(
                    f'<div class="score-card">Truth Score: {data["final_truth_score"]}/100</div>',
                    unsafe_allow_html=True
                )

                st.write("")

                # ---------- Verdict ----------
                verdict = data["verification"]["verdict"]

                color = {
                    "TRUE": "green",
                    "FALSE": "red",
                    "UNCERTAIN": "orange"
                }.get(verdict, "gray")

                st.markdown(
                    f'<div class="verdict" style="color:{color}">Verdict: {verdict}</div>',
                    unsafe_allow_html=True
                )

                st.write("")

                # ---------- Bias ----------
                st.write("**Bias Level:**", data["bias_level"])

                # ---------- Reasoning ----------
                st.write("### 🧠 Reasoning")
                st.info(data["verification"]["reasoning"])

                # ---------- Sources ----------
                st.write("### 📚 Sources")

                for src in data["verification"]["sources"]:
                    st.markdown(
                        f"""
                        <div class="source-card">
                            <a href="{src['url']}" target="_blank"><b>{src['title']}</b></a><br>
                            Credibility: <b>{src['credibility']}</b>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )

        except Exception as e:
            st.error(f"Error: {e}")
