# InterviewIQ AI — README & Repository Guidance

> **Practice Smarter. Interview Better. Get Career-Ready.**

An AI-powered technical and behavioral interview practice platform built for software developers, university students, and job seekers.

---

## 1. Project and Problem

| Section | Details |
| :--- | :--- |
| **Project Name** | InterviewIQ AI |
| **One-Line Summary** | Practice Smarter. Interview Better. Get Career-Ready. An AI-powered technical and behavioral interview practice platform. |
| **Target User** | University students, fresh graduates, junior/full-stack developers, and self-taught programmers preparing for technical interviews. |
| **Problem** | Candidates often lack access to realistic mock interviews, do not know what questions to expect, struggle to evaluate their own technical knowledge, and lack constructive feedback on their specific skills and projects. |
| **Solution** | InterviewIQ AI generates customized technical and behavioral interview workflows tailored to the candidate's target role, programming stack, and GitHub projects. |
| **Core Features** | Role/skill selection, dynamic question generation, adaptive AI interview agent, technical answer evaluation with scoring rubrics, GitHub repository analysis, browser-based voice interview, and comprehensive final evaluation reports. |

---

## 2. AI Component

| Attribute | Specification |
| :--- | :--- |
| **Exact Model Names** | `gpt-oss-120` (Groq-hosted open-weights model) & **Google Gemini API** |
| **Parameter Size / Architecture** | Open-weights transformer-based language models optimized for ultra-high-speed inference. |
| **Runtime / API Provider** | **Groq API** (delivering ultra-low latency token inference) & **Google Gen AI SDK**. |
| **What the Models Do** | The models process candidate answers, evaluate technical correctness, identify knowledge gaps, determine follow-up questions, and generate comprehensive final performance reports. |

---

## 3. Setup and Usage

### Dependencies
- **Python:** `3.12`
- **Backend Framework:** FastAPI, Pydantic, Uvicorn, `httpx`
- **AI SDKs:** Groq Python SDK & Official Google Gen AI SDK
- **Frontend Stack:** React, Vite, Tailwind CSS

### Installation & Execution Commands

```bash
# 1. Clone the repository
git clone https://github.com/your-username/InterviewIQ-AI.git
cd InterviewIQ-AI

# 2. Setup and install backend dependencies
cd backend
pip install fastapi uvicorn groq google-genai pydantic python-dotenv httpx

# 3. Configure Environment Variables (.env)
# Create a .env file inside the backend directory:
GROQ_API_KEY=

# 4. Start FastAPI backend
uvicorn app.main:app --reload

# 5. Install & Start React frontend (in a separate terminal)
cd ../frontend
npm install
npm run dev
```

---

## 4. Testing and Findings

| Test Metric | Findings |
| :--- | :--- |
| **Test Scenario** | Evaluated a candidate's response explaining React hooks and asynchronous JavaScript state management. |
| **Input** | Candidate answer text received via frontend voice-to-text transcription. |
| **Expected Output** | Structured JSON containing a 1–5 score, correct points, missing concepts, and a follow-up question. |
| **Actual Outcome** | Groq successfully processed the `gpt-oss-120` inference request and returned the structured evaluation in under 400 milliseconds. |
| **Pass / Fail Status** | **PASS** |
| **Observed Issues** | Browser speech recognition occasionally misinterprets niche programming terms (e.g., 'useEffect'), requiring manual text fallback. |
| **Known Limitations** | Model-generated scores serve as practice indicators rather than absolute hiring guarantees. |

---

## 5. Team and Licensing

- **Team Members:** Ibrahim Wasim, Muhammad Anas, Shaaf Raheel .
- **Contributions:** System architecture design, FastAPI backend orchestration, Groq & `gpt-oss-120` integration, React frontend development, and voice workflow implementation.
- **License:** MIT Open-Source License.
- **Acknowledgements:** Built using Groq, Google Gen AI, FastAPI, React, and Tailwind CSS ecosystems.