import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { ClipboardList, Clock, Users, Trash2, Edit3, Eye, Plus } from 'lucide-react'

export default function ManageTests() {
  const { tests, students, results, deleteTest, updateTest } = useApp()
  const navigate = useNavigate()
  const [filterStream, setFilterStream] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  const filtered = tests.filter(t => {
    const matchStream = filterStream === 'All' || t.stream === filterStream
    const matchStatus = filterStatus === 'All' || t.status === filterStatus
    return matchStream && matchStatus
  })

  const getTestStats = (test) => {
    const testResults = results.filter(r => r.testId === test.id)
    const avg = testResults.length > 0 ? Math.round(testResults.reduce((s, r) => s + r.percentage, 0) / testResults.length) : null
    return { attempts: testResults.length, avg }
  }

  const statusColors = { active: 'badge-green', draft: 'badge-amber', archived: 'badge-red' }

  return (
    <div style={{ padding: 40 }} className="animate-fade-in-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Manage Tests</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{tests.length} tests in your platform</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/create-test')}>
          <Plus size={15} /> Create Test
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select className="select" style={{ width: 140 }} value={filterStream} onChange={e => setFilterStream(e.target.value)}>
          <option>All</option><option>JEE</option><option>NEET</option>
        </select>
        <select className="select" style={{ width: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option>All</option><option>active</option><option>draft</option><option>archived</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
          <ClipboardList size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: 16, marginBottom: 12 }}>No tests found</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/create-test')}>Create Your First Test</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(test => {
            const { attempts, avg } = getTestStats(test)
            const assignedStudents = students.filter(s => test.assignedTo?.includes(s.id))
            return (
              <div key={test.id} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700 }}>{test.title}</h3>
                      <span className={`badge ${test.stream === 'JEE' ? 'badge-blue' : 'badge-green'}`}>{test.stream}</span>
                      <span className={`badge ${statusColors[test.status] || 'badge-amber'}`}>{test.status}</span>
                    </div>
                    {test.description && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>{test.description}</p>}
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <Clock size={14} color="var(--accent-primary)" /> {test.duration} min
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        📝 {test.questionIds?.length || 0} questions
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        🎯 {test.totalMarks} marks
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <Users size={14} color="var(--accent-green)" /> {assignedStudents.length > 0 ? assignedStudents.map(s => s.name.split(' ')[0]).join(', ') : 'All students'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                    {avg !== null ? (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: avg >= 70 ? 'var(--accent-green)' : avg >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>{avg}%</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>avg score ({attempts} attempts)</div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No attempts yet</div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <select className="select" style={{ width: 120, padding: '6px 10px', fontSize: 12 }}
                        value={test.status}
                        onChange={e => updateTest(test.id, { status: e.target.value })}>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button className="btn btn-ghost" style={{ padding: '8px 12px' }} onClick={() => navigate('/admin/results')}>
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '8px 12px' }} onClick={() => window.confirm('Delete this test?') && deleteTest(test.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}