# 🤖 AI Interviewer - Smart Voice-Based Interview Platform

A next-gen AI-powered interview preparation tool where users can log in, generate mock interviews, respond live using voice, and receive instant feedback — powered by Google Gemini Pro and GPT.

---

## 🧭 Features

### 🔐 User Authentication
- Secure login system for users and clerks using Supabase.
- Email-based authentication with role access control.

### 🧑‍💼 Clerk Dashboard
- Manage users and their interview schedules.
- Add interview questions and view candidate activity.

### 🎯 Interview Workflow
- **Create Interview**: Set up a new mock interview session.

- **Live Interview**: Users answer questions via voice using VAPI.
- **Instant Feedback**: GPT and Gemini Pro evaluate the answers in real-time.

### 📊 Data Management
- **Supabase Integration** with three main tables:
  1. `users` – For login/authentication via email.
  2. `interview_questions` – Dynamically generated using Gemini Pro API.
  3. `interview_feedback` – Stores AI-evaluated feedback for each session.

### 🧠 AI-Powered Question Generator
- Uses Gemini Pro API to generate customized interview questions.
- Questions adapt to candidate background and role.

### 🎤 Real-Time Voice Interaction
- Uses **Vapi.ai** for live voice-to-voice interviews.
- Users can answer questions like a real interview.

### 📈 GPT-Based Evaluation
- After each response, GPT analyzes and gives feedback.
- Future enhancement: Add CV and portfolio to personalize feedback.

---

## 🔧 Tech Stack

| Tool | Usage |
|------|-------|
| Supabase | Backend DB & Auth |
| Next.js | Frontend Framework |
| Vapi.ai | Voice Interaction |
| Gemini Pro API | Question Generation |
| OpenAI GPT | Feedback Evaluation |
| React + Tailwind | UI Components |
| Shadcn | Form & UI management |

---

## 🛠️ Installation

```bash
git clone https://github.com/yourusername/ai-interviewer.git
cd ai-interviewer
npm install
npm run dev
```

## 📌 Roadmap / Future Features

- CV Upload & Analysis
- Personalized Interview Feedback
- Calendar Integration for Scheduling
- Export Feedback as PDF
- Multi-language Support

## 🙌 Contribution
Contributions are welcome! Feel free to fork the repo and open a pull request.





