import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { CheckCircle, Plus, Minus, Clock, Search } from 'lucide-react'

export default function CreateTest() {
  const { questions, students, addTest } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [testData, setTestData] = useState({
    title: '', description: '', stream: 'JEE', duration: 180,
    scheduledAt: '', status: 'active', assignedTo: []
  })
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [searchQ, setSearchQ] = useState('')
  const [filterSubject, setFilterSubject] = useState('All')

  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology']
  const filteredQ = questions.filter(q => {
    const matchSearch = q.question.toLowerCase().includes(searchQ.toLowerCase())
    const matchSubject = filterSubject === 'All' || q.subject === filterSubject
    const matchStream = q.stream === 'Both' || q.stream === testData.stream
    return matchSearch && matchSubject && matchStream
  })

  const toggleQuestion = (qId) => {
    setSelectedQuestions(prev => prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId])
  }

  const toggleStudent = (sId) => {
    setTestData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(sId) ? prev.assignedTo.filter(id => id !== sId) : [...prev.assignedTo, sId]
    }))
  }

  const handleCreate = () => {
    if (!testData.title) { alert('Please enter test title'); return }
    if (selectedQuestions.length === 0) { alert('Please select at least one question'); return }
    const totalMarks = selectedQuestions.length * 4
    addTest({
      ...testData,
      questionIds: selectedQuestions,
      totalMarks,
      sections: []
    })
    navigate('/admin/tests')
  }

  const steps = ['Test Details', 'Select Questions', 'Assign Students', 'Review']

  return (
    <div style={{ padding: 40 }} className="animate-fade-in-up">
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Create Test</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Build a custom assessment for your students</p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, overflowX: 'auto' }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, cursor: 'pointer' }} onClick={() => i < step && setStep(i + 1)}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                background: i + 1 < step ? 'var(--accent-green)' : i + 1 === step ? 'var(--gradient-primary)' : 'var(--bg-elevated)',
                color: i + 1 <= step ? '#fff' : 'var(--text-muted)',
                border: i + 1 === step ? 'none' : `2px solid ${i + 1 < step ? 'var(--accent-green)' : 'var(--border)'}`,
              }}>
                {i + 1 < step ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span style={{ fontSize: 14, fontWeight: i + 1 === step ? 600 : 400, color: i + 1 === step ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, minWidth: 20, height: 2, background: i + 1 < step ? 'var(--accent-green)' : 'var(--border)', margin: '0 12px', transition: 'background 0.3s' }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Test Details */}
      {step === 1 && (
        <div className="card" style={{ maxWidth: 700 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Test Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="label">Test Title *</label>
              <input className="input" placeholder="e.g. JEE Mains Mock Test — January" value={testData.title} onChange={e => setTestData(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input" rows={3} style={{ resize: 'vertical' }} placeholder="Describe the test coverage, instructions..." value={testData.description} onChange={e => setTestData(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label className="label">Stream</label>
                <select className="select" value={testData.stream} onChange={e => setTestData(p => ({ ...p, stream: e.target.value }))}>
                  <option>JEE</option><option>NEET</option>
                </select>
              </div>
              <div>
                <label className="label">Duration (minutes)</label>
                <input className="input" type="number" value={testData.duration} onChange={e => setTestData(p => ({ ...p, duration: parseInt(e.target.value) }))} />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="select" value={testData.status} onChange={e => setTestData(p => ({ ...p, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Scheduled Date & Time</label>
              <input className="input" type="datetime-local" value={testData.scheduledAt} onChange={e => setTestData(p => ({ ...p, scheduledAt: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginTop: 28 }}>
            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!testData.title}>Next: Select Questions →</button>
          </div>
        </div>
      )}

      {/* Step 2: Questions */}
      {step === 2 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Select Questions</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedQuestions.length} selected • {selectedQuestions.length * 4} total marks</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" style={{ paddingLeft: 40 }} placeholder="Search questions..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
            </div>
            <select className="select" style={{ width: 150 }} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, maxHeight: 500, overflowY: 'auto', paddingRight: 4 }}>
            {filteredQ.map(q => {
              const isSelected = selectedQuestions.includes(q.id)
              return (
                <div key={q.id} className="card" style={{ padding: '14px 18px', cursor: 'pointer', border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border)', background: isSelected ? 'rgba(0,212,255,0.05)' : 'var(--gradient-card)' }}
                  onClick={() => toggleQuestion(q.id)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border)'}`, background: isSelected ? 'var(--accent-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      {isSelected && <CheckCircle size={13} color="#fff" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span className="badge badge-blue" style={{ fontSize: 10 }}>{q.subject}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{q.topic}</span>
                        <span className={`badge ${q.difficulty === 'Easy' ? 'badge-green' : q.difficulty === 'Medium' ? 'badge-amber' : 'badge-red'}`} style={{ fontSize: 10 }}>{q.difficulty}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{q.question}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)} disabled={selectedQuestions.length === 0}>Next: Assign Students →</button>
          </div>
        </div>
      )}

      {/* Step 3: Assign Students */}
      {step === 3 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Assign to Students</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginBottom: 24 }}>
            {students.filter(s => s.stream === testData.stream || true).map(student => {
              const isAssigned = testData.assignedTo.includes(student.id)
              return (
                <div key={student.id} className="card" style={{ padding: '16px 20px', cursor: 'pointer', border: isAssigned ? '1px solid var(--accent-primary)' : '1px solid var(--border)', background: isAssigned ? 'rgba(0,212,255,0.05)' : 'var(--gradient-card)' }}
                  onClick={() => toggleStudent(student.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{student.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{student.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student.class} • {student.stream}</p>
                    </div>
                    {isAssigned && <CheckCircle size={18} color="var(--accent-primary)" />}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(4)}>Next: Review →</button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div style={{ maxWidth: 700 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Review & Create</h2>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{testData.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Stream', testData.stream], ['Duration', `${testData.duration} min`],
                ['Questions', selectedQuestions.length], ['Total Marks', selectedQuestions.length * 4],
                ['Students', testData.assignedTo.length || 'All'], ['Status', testData.status.toUpperCase()]
              ].map(([label, value]) => (
                <div key={label} style={{ padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setStep(3)}>← Back</button>
            <button className="btn btn-primary" onClick={handleCreate}><CheckCircle size={15} /> Create Test</button>
          </div>
        </div>
      )}
    </div>
  )
}