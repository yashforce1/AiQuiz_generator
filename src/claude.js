const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

// NOTE: In production, this key should come from your backend server, never exposed in frontend
// For demo purposes, set your key in .env as VITE_ANTHROPIC_API_KEY
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''

async function callClaude(systemPrompt, userMessage, maxTokens = 1000) {
  if (!API_KEY) {
    throw new Error('API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env file.')
  }
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  })
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  const data = await response.json()
  return data.content[0].text
}

// ─── AI Features ────────────────────────────────────────────────────────────

export async function analyzeTestPerformance(testData) {
  const system = `You are an expert JEE/NEET academic counselor analyzing student performance.
Provide detailed, actionable insights in JSON format only. No markdown, no preamble.
Return exactly: {
  "overallAssessment": string,
  "strengths": [string],
  "weaknesses": [string],
  "topicWiseAnalysis": [{"topic": string, "score": number, "recommendation": string}],
  "studyPlan": [{"week": number, "focus": string, "hours": number, "resources": string}],
  "predictedRank": string,
  "motivationalMessage": string
}`

  const prompt = `Analyze this student's test performance:
Student: ${testData.studentName}
Test: ${testData.testName}  
Stream: ${testData.stream}
Score: ${testData.score}/${testData.totalMarks} (${testData.percentage}%)
Time taken: ${testData.timeTaken} minutes
Correct: ${testData.correct}, Wrong: ${testData.wrong}, Unattempted: ${testData.unattempted}
Subject breakdown: ${JSON.stringify(testData.subjectBreakdown)}
Topic breakdown: ${JSON.stringify(testData.topicBreakdown)}`

  const raw = await callClaude(system, prompt, 1500)
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch {
    return { overallAssessment: raw, strengths: [], weaknesses: [], topicWiseAnalysis: [], studyPlan: [], predictedRank: 'N/A', motivationalMessage: '' }
  }
}

export async function generateQuestions(params) {
  const system = `You are an expert JEE/NEET question setter with 15+ years experience.
Generate MCQ questions in strict JSON array format only. No markdown, no preamble.
Each question: {"question": string, "options": [4 strings], "correct": 0-3 index, "explanation": string, "difficulty": "Easy"|"Medium"|"Hard", "topic": string}`

  const prompt = `Generate ${params.count} MCQ questions for:
Subject: ${params.subject}
Topic: ${params.topic}
Difficulty: ${params.difficulty}
Stream: ${params.stream}
These should be original, conceptually rigorous questions appropriate for ${params.stream} preparation.`

  const raw = await callClaude(system, prompt, 2000)
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const arr = JSON.parse(cleaned)
    return arr.map((q, i) => ({
      ...q,
      id: `ai_q_${Date.now()}_${i}`,
      subject: params.subject,
      stream: params.stream,
      marks: 4,
      negativeMarks: 1,
      aiGenerated: true
    }))
  } catch {
    throw new Error('Failed to parse AI-generated questions')
  }
}

export async function chatWithTutor(messages, subject) {
  if (!API_KEY) throw new Error('API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env file.')

  const system = `You are NexPrep AI, a brilliant and encouraging tutor specialized in JEE and NEET preparation.
You explain concepts clearly, use analogies, solve problems step-by-step, and motivate students.
Current subject focus: ${subject || 'General'}
Keep responses concise but complete. Use LaTeX-style math notation for formulas when needed.`

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })
  })
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  const data = await response.json()
  return data.content[0].text
}

export async function generateHint(question, studentAnswer) {
  const system = `You are a helpful JEE/NEET tutor. Give a hint (not the full answer) to help the student figure it out themselves.
Be encouraging. Keep it to 2-3 sentences.`

  return callClaude(system, `Question: ${question}\nStudent's attempted answer: ${studentAnswer || 'not attempted yet'}\nGive a helpful hint.`)
}

export async function explainSolution(question, options, correctIndex, explanation) {
  const system = `You are an expert JEE/NEET teacher. Explain the solution clearly and thoroughly.
Break it down step by step. Mention common mistakes students make on this type of problem.`

  return callClaude(system,
    `Question: ${question}\nOptions: ${options.join(', ')}\nCorrect answer: ${options[correctIndex]}\nBase explanation: ${explanation}\n\nProvide a detailed, educational explanation.`,
    800
  )
}