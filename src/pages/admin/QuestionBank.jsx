import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { generateQuestions } from '../../claude.js'
import { Plus, Trash2, Brain, Search, Filter, CheckCircle, AlertCircle, Zap, ChevronDown, ChevronUp, Edit3, HelpCircle } from 'lucide-react'

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology']
const TOPICS = {
  Physics: ['Kinematics', 'Dynamics', 'Thermodynamics', 'Optics', 'Electricity', 'Magnetism', 'Modern Physics', 'Waves'],
  Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Electrochemistry', 'Thermochemistry'],
  Mathematics: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Vectors', 'Statistics', 'Probability'],
  Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Plant Physiology', 'Evolution', 'Biotechnology'],
}
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const STREAMS = ['JEE', 'NEET', 'Both']

export default function QuestionBank() {
  const { questions, addQuestion, deleteQuestion } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSubject, setFilterSubject] = useState('All')
  const [filterDifficulty, setFilterDifficulty] = useState('All')
  const [filterStream, setFilterStream] = useState('All')
  const [expandedId, setExpandedId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAIForm, setShowAIForm] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('')
  const [aiParams, setAiParams] = useState({ subject: 'Physics', topic: 'Kinematics', difficulty: 'Medium', stream: 'JEE', count: 3 })

  const [newQ, setNewQ] = useState({ subject: 'Physics', topic: '', difficulty: 'Medium', stream: 'JEE', question: '', options: ['', '', '', ''], correct: 0, explanation: '', marks: 4, negativeMarks: 1 })

  const filtered = questions.filter(q => {
    const matchSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) || q.topic?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchSubject = filterSubject === 'All' || q.subject === filterSubject
    const matchDiff = filterDifficulty === 'All' || q.difficulty === filterDifficulty
    const matchStream = filterStream === 'All' || q.stream === filterStream || q.stream === 'Both'
    return matchSearch && matchSubject && matchDiff && matchStream
  })

  const handleAddManual = () => {
    if (!newQ.question || newQ.options.some(o => !o)) { alert('Please fill all fields'); return }
    addQuestion(newQ)
    setNewQ({ subject: 'Physics', topic: '', difficulty: 'Medium', stream: 'JEE', question: '', options: ['', '', '', ''], correct: 0, explanation: '', marks: 4, negativeMarks: 1 })
    setShowAddForm(false)
  }

  const handleAIGenerate = async () => {
    setAiLoading(true)
    setAiStatus('Generating questions with AI...')
    try {
      const generated = await generateQuestions(aiParams)
      generated.forEach(q => addQuestion(q))
      setAiStatus(`✅ ${generated.length} questions added to question bank!`)
      setTimeout(() => { setShowAIForm(false); setAiStatus('') }, 2000)
    } catch (err) {
      setAiStatus(`❌ ${err.message}`)
    }
    setAiLoading(false)
  }

  const diffColor = { Easy: 'var(--accent-green)', Medium: 'var(--accent-amber)', Hard: 'var(--accent-red)' }
  const diffBadge = { Easy: 'badge-green', Medium: 'badge-amber', Hard: 'badge-red' }

  return (
    <div style={{ padding: 40 }} className="animate-fade-in-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Question Bank</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{questions.length} questions available</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setShowAIForm(!showAIForm)}>
            <Brain size={15} /> AI Generate
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={15} /> Add Question
          </button>
        </div>
      </div>

      
      {showAIForm && (
        <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Zap size={18} color="var(--accent-primary)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>AI Question Generator</h3>
            <span className="badge badge-blue" style={{ fontSize: 10 }}>Powered by Claude</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div>
              <label className="label">Subject</label>
              <select className="select" value={aiParams.subject} onChange={e => setAiParams(p => ({ ...p, subject: e.target.value }))}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Topic</label>
              <select className="select" value={aiParams.topic} onChange={e => setAiParams(p => ({ ...p, topic: e.target.value }))}>
                {(TOPICS[aiParams.subject] || []).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select className="select" value={aiParams.difficulty} onChange={e => setAiParams(p => ({ ...p, difficulty: e.target.value }))}>
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Stream</label>
              <select className="select" value={aiParams.stream} onChange={e => setAiParams(p => ({ ...p, stream: e.target.value }))}>
                {STREAMS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Count (1-5)</label>
              <input className="input" type="number" min={1} max={5} value={aiParams.count} onChange={e => setAiParams(p => ({ ...p, count: parseInt(e.target.value) }))} />
            </div>
          </div>
          {aiStatus && <p style={{ fontSize: 14, marginBottom: 16, color: aiStatus.startsWith('✅') ? 'var(--accent-green)' : aiStatus.startsWith('❌') ? 'var(--accent-red)' : 'var(--accent-primary)' }}>{aiStatus}</p>}
          <button className="btn btn-primary" onClick={handleAIGenerate} disabled={aiLoading}>
            {aiLoading ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Generating...</> : <><Brain size={14} /> Generate Questions</>}
          </button>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>⚠️ Requires VITE_ANTHROPIC_API_KEY in .env file</p>
        </div>
      )}

     
     
      {showAddForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Add Question Manually</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="label">Subject</label>
              <select className="select" value={newQ.subject} onChange={e => setNewQ(q => ({ ...q, subject: e.target.value }))}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Topic</label>
              <input className="input" placeholder="e.g. Kinematics" value={newQ.topic} onChange={e => setNewQ(q => ({ ...q, topic: e.target.value }))} />
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select className="select" value={newQ.difficulty} onChange={e => setNewQ(q => ({ ...q, difficulty: e.target.value }))}>
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Stream</label>
              <select className="select" value={newQ.stream} onChange={e => setNewQ(q => ({ ...q, stream: e.target.value }))}>
                {STREAMS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Question Text</label>
            <textarea className="input" rows={3} style={{ resize: 'vertical' }} placeholder="Enter the question..." value={newQ.question} onChange={e => setNewQ(q => ({ ...q, question: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {newQ.options.map((opt, i) => (
              <div key={i}>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Option {String.fromCharCode(65 + i)}
                  <input type="radio" name="correct" checked={newQ.correct === i} onChange={() => setNewQ(q => ({ ...q, correct: i }))} style={{ accentColor: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: 10, color: newQ.correct === i ? 'var(--accent-green)' : 'var(--text-muted)' }}>{newQ.correct === i ? '✓ Correct' : ''}</span>
                </label>
                <input className="input" placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt} onChange={e => { const opts = [...newQ.options]; opts[i] = e.target.value; setNewQ(q => ({ ...q, options: opts })) }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="label">Explanation</label>
            <textarea className="input" rows={2} style={{ resize: 'vertical' }} placeholder="Explain the correct answer..." value={newQ.explanation} onChange={e => setNewQ(q => ({ ...q, explanation: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={handleAddManual}><CheckCircle size={14} /> Save Question</button>
            <button className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 40 }} placeholder="Search questions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="select" style={{ width: 140 }} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
          <option>All</option>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="select" style={{ width: 130 }} value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)}>
          <option>All</option>
          {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
        </select>
        <select className="select" style={{ width: 120 }} value={filterStream} onChange={e => setFilterStream(e.target.value)}>
          <option>All</option>
          {STREAMS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Questions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            <HelpCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: 16 }}>No questions found</p>
          </div>
        ) : filtered.map(q => (
          <div key={q.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 16 }}
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-blue" style={{ fontSize: 10 }}>{q.subject}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{q.topic}</span>
                  <span className={`badge ${diffBadge[q.difficulty]}`} style={{ fontSize: 10 }}>{q.difficulty}</span>
                  <span className="badge badge-purple" style={{ fontSize: 10 }}>{q.stream}</span>
                  {q.aiGenerated && <span className="badge badge-blue" style={{ fontSize: 10 }}><Brain size={9} /> AI</span>}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: expandedId === q.id ? 'none' : 2, WebkitBoxOrient: 'vertical' }}>
                  {q.question}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: 'var(--accent-green)' }}>+{q.marks}</span>
                <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>-{q.negativeMarks}</span>
                <button onClick={e => { e.stopPropagation(); deleteQuestion(q.id) }} className="btn btn-danger" style={{ padding: '6px 8px' }}>
                  <Trash2 size={13} />
                </button>
                {expandedId === q.id ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
              </div>
            </div>

            {expandedId === q.id && (
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {q.options.map((opt, i) => (
                    <div key={i} style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: `1px solid ${i === q.correct ? 'var(--accent-green)' : 'var(--border)'}`, background: i === q.correct ? 'rgba(16,185,129,0.08)' : 'var(--bg-elevated)', fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 700, color: i === q.correct ? 'var(--accent-green)' : 'var(--text-muted)', flexShrink: 0 }}>{String.fromCharCode(65 + i)}.</span>
                      <span style={{ color: i === q.correct ? 'var(--accent-green)' : 'var(--text-secondary)' }}>{opt}</span>
                      {i === q.correct && <CheckCircle size={13} color="var(--accent-green)" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div style={{ padding: '12px 16px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600, marginBottom: 4 }}>EXPLANATION</p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{q.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
