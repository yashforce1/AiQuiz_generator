# NexPrep — JEE & NEET Intelligence Platform

A full-stack quiz platform for JEE and NEET aspirants with AI-powered analysis, question generation, and personalized tutoring — built with React, Vite, and Claude AI.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and add your Anthropic API key

# 3. Start development server
npm run dev
```

Open http://localhost:5173

---

## 🔑 Demo Login Credentials

| Role     | Email                   | Password    |
|----------|-------------------------|-------------|
| Admin    | admin@nexprep.in        | admin123    |
| Student  | aryan@student.com       | student123  |
| Student  | priya@student.com       | student123  |
| Student  | rohan@student.com       | student123  |

---

## 📁 Project Structure

```
nexprep/
├── index.html
├── vite.config.js
├── package.json
├── .env.example                    # Copy to .env and add API key
└── src/
    ├── main.jsx                    # Entry point
    ├── App.jsx                     # Router & route guards
    ├── styles/
    │   └── globals.css             # Design tokens & global styles
    ├── context/
    │   └── AppContext.jsx          # Global state (auth, questions, tests, results)
    ├── api/
    │   └── claude.js               # All Anthropic API integrations
    ├── utils/
    │   └── sampleData.js           # Seed data for demo
    └── pages/
        ├── LandingPage.jsx
        ├── LoginPage.jsx
        ├── admin/
        │   ├── AdminLayout.jsx     # Sidebar + outlet
        │   ├── AdminDashboard.jsx  # Stats, activity, student table
        │   ├── QuestionBank.jsx    # CRUD + AI question generation
        │   ├── CreateTest.jsx      # 4-step test builder wizard
        │   ├── ManageTests.jsx     # View/edit/delete tests
        │   ├── StudentResults.jsx  # All submissions table
        │   └── Analytics.jsx      # Charts: subject, student, difficulty
        └── student/
            ├── StudentLayout.jsx   # Sidebar + outlet
            ├── StudentDashboard.jsx # Stats, pending tests, trend chart
            ├── MyTests.jsx         # Pending & completed tests
            ├── TakeTest.jsx        # Full quiz engine with timer
            ├── TestResults.jsx     # Deep analysis + AI insight tabs
            └── AITutor.jsx         # Chat interface with Claude
```

---

## 🤖 AI Features (require API key)

| Feature | Location | Description |
|---------|----------|-------------|
| AI Question Generator | Admin > Question Bank | Generate JEE/NEET MCQs by subject/topic/difficulty |
| Performance Analysis | Student > Results > AI Analysis tab | Deep analysis: strengths, weaknesses, topic breakdown |
| Study Plan Generator | Student > Results > Study Plan tab | Weekly personalized study plan |
| AI Hints | Student > Take Test | Contextual hints during exam |
| Solution Explainer | Student > Results > Questions tab | Detailed step-by-step AI explanation |
| AI Tutor Chat | Student > AI Tutor | Full conversational tutor with subject filter |

---

## 🎨 Design System

- **Font Display**: Syne (headings)
- **Font Body**: DM Sans (content)
- **Font Mono**: JetBrains Mono (code/timers)
- **Theme**: Dark space aesthetic with cyan/purple gradient accents
- **CSS Variables**: All tokens in `src/styles/globals.css`

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Charts | Recharts |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| State | React Context + localStorage |
| Icons | Lucide React |
| Styling | Pure CSS with variables |

---

## 🔐 Production Deployment Note

For production, **never** expose `VITE_ANTHROPIC_API_KEY` in the frontend.
Instead, create a backend server (Node.js/Express or Next.js API route) that:
1. Receives requests from your React frontend
2. Calls the Anthropic API server-side
3. Returns results to the frontend

This keeps your API key secure.

---

## 📊 Features Overview

### Admin Panel
- Dashboard with platform-wide stats
- Question bank with full CRUD + AI generation
- 4-step test builder wizard (details → questions → students → review)
- Manage test status (active/draft/archived)
- Student results table with grade calculation
- Analytics dashboard with bar charts, pie charts

### Student Panel
- Dashboard with pending tests + score trend line chart
- Test cards with status (pending/completed)
- Full-featured quiz engine:
  - Countdown timer with urgency state
  - Question navigator grid
  - Flag for review system
  - Skip questions
  - AI hints (requires API key)
  - Submit confirmation
- Results & Analysis with 4 tabs:
  - Overview (subject charts, radar, progress bars)
  - Questions (answer review with explanations)
  - AI Analysis (strengths, weaknesses, topic breakdown)
  - Study Plan (weekly personalized schedule)
- AI Tutor chat with subject filter + quick prompts
