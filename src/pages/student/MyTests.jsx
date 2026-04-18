import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { Play, CheckCircle, Clock, FileText, ArrowRight, Lock } from 'lucide-react'

export default function MyTests() {
  const { user, tests, results } = useApp()
  const navigate = useNavigate()

  const assignedTests = tests.filter(t =>
    t.status === 'active' && (t.assignedTo.length === 0 || t.assignedTo.includes(user?.id))
  )

  const getTestResult = (testId) => results.find(r => r.testId === testId && r.studentId === user?.id)

  const pending = assignedTests.filter(t => !getTestResult(t.id))
  const completed = assignedTests.filter(t => !!getTestResult(t.id))

  return (
    <div style={{ padding: 40 }} className="animate-fade-in-up">
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>My Tests</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{pending.length} pending · {completed.length} completed</p>
      </div>

      {pending.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-amber)', display: 'inline-block', animation: 'pulse-glow 2s infinite' }} />
            Pending Tests
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            {pending.map(test => (
              <div key={test.id} className="card" style={{ padding: 24, border: '1px solid rgba(245,158,11,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span className={`badge ${test.stream === 'JEE' ? 'badge-blue' : 'badge-green'}`}>{test.stream}</span>
                  <span className="badge badge-amber">Pending</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{test.title}</h3>
                {test.description && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>{test.description}</p>}

                <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <Clock size={13} color="var(--accent-amber)" /> {test.duration} min
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    <FileText size={13} style={{ display: 'inline', marginRight: 4 }} />{test.questionIds?.length} questions
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    🎯 {test.totalMarks} marks
                  </div>
                </div>

                <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, marginBottom: 16, fontSize: 12, color: 'var(--accent-amber)' }}>
                  ⚡ Each correct answer: +4 marks · Wrong answer: -1 mark
                </div>

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  onClick={() => navigate(`/student/take-test/${test.id}`)}>
                  <Play size={15} /> Start Test
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} color="var(--accent-green)" /> Completed Tests
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            {completed.map(test => {
              const result = getTestResult(test.id)
              return (
                <div key={test.id} className="card" style={{ padding: 24, opacity: 0.85 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span className={`badge ${test.stream === 'JEE' ? 'badge-blue' : 'badge-green'}`}>{test.stream}</span>
                    <span className="badge badge-green"><CheckCircle size={10} /> Completed</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>{test.title}</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                    {[
                      { label: 'Score', value: `${result.percentage}%`, color: result.percentage >= 70 ? 'var(--accent-green)' : result.percentage >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)' },
                      { label: 'Correct', value: result.correct, color: 'var(--accent-green)' },
                      { label: 'Time', value: `${result.timeTaken}m`, color: 'var(--text-secondary)' },
                    ].map(item => (
                      <div key={item.label} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-elevated)', borderRadius: 8 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: item.color }}>{item.value}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => navigate(`/student/results/${test.id}`)}>
                    View Full Analysis <ArrowRight size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {assignedTests.length === 0 && (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
          <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: 16, marginBottom: 8 }}>No tests assigned yet</p>
          <p style={{ fontSize: 14 }}>Your educator will assign tests to you soon.</p>
        </div>
      )}
    </div>
  )
}