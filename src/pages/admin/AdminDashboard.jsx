import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { Users, ClipboardList, HelpCircle, TrendingUp, Plus, ArrowRight, CheckCircle, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const { questions, tests, students, results, user } = useApp()
  const navigate = useNavigate()

  const activeTests = tests.filter(t => t.status === 'active')
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0

  const recentActivity = [
    ...results.slice(-4).map(r => ({ type: 'result', label: `${r.studentName} completed "${r.testName}"`, time: new Date(r.submittedAt).toLocaleDateString(), color: 'var(--accent-green)' })),
    ...tests.slice(-2).map(t => ({ type: 'test', label: `Test created: "${t.title}"`, time: new Date(t.createdAt).toLocaleDateString(), color: 'var(--accent-primary)' }))
  ].slice(0, 6)

  return (
    <div style={{ padding: 40 }} className="animate-fade-in-up">
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Good morning, {user?.name?.split(' ')[1] || user?.name} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Here's what's happening in your platform today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        {[
          { label: 'Total Students', value: students.length, icon: <Users size={20} />, color: 'var(--accent-primary)', delta: '+2 this week' },
          { label: 'Active Tests', value: activeTests.length, icon: <ClipboardList size={20} />, color: '#a78bfa', delta: `${tests.length} total` },
          { label: 'Questions', value: questions.length, icon: <HelpCircle size={20} />, color: 'var(--accent-amber)', delta: 'Across all subjects' },
          { label: 'Avg Score', value: `${avgScore}%`, icon: <TrendingUp size={20} />, color: 'var(--accent-green)', delta: `${results.length} tests taken` },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Quick Actions */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Create New Test', desc: 'Set up a test for students', icon: <Plus size={16} />, path: '/admin/create-test', color: 'var(--accent-primary)' },
              { label: 'Add Questions', desc: 'Expand your question bank', icon: <HelpCircle size={16} />, path: '/admin/questions', color: 'var(--accent-amber)' },
              { label: 'View Results', desc: 'Analyze student performance', icon: <TrendingUp size={16} />, path: '/admin/results', color: 'var(--accent-green)' },
              { label: 'Analytics', desc: 'Deep dive into data', icon: <Users size={16} />, path: '/admin/analytics', color: '#a78bfa' },
            ].map(action => (
              <button key={action.label} onClick={() => navigate(action.path)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-card)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${action.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color, flexShrink: 0 }}>
                  {action.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{action.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{action.desc}</p>
                </div>
                <ArrowRight size={14} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <Clock size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>No activity yet. Create your first test!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentActivity.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, marginTop: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{a.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Students table */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Enrolled Students</h2>
          <button className="btn btn-ghost" onClick={() => navigate('/admin/results')} style={{ fontSize: 13 }}>View All <ArrowRight size={13} /></button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Student', 'Stream', 'Class', 'Tests Taken', 'Avg Score'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const studentResults = results.filter(r => r.studentId === student.id)
                const avg = studentResults.length > 0 ? Math.round(studentResults.reduce((s, r) => s + r.percentage, 0) / studentResults.length) : null
                return (
                  <tr key={student.id} style={{ transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{student.avatar}</div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600 }}>{student.name}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                      <span className={`badge ${student.stream === 'JEE' ? 'badge-blue' : 'badge-green'}`}>{student.stream}</span>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--text-secondary)' }}>{student.class}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontSize: 14 }}>{studentResults.length}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                      {avg !== null ? (
                        <span style={{ fontSize: 14, fontWeight: 600, color: avg >= 70 ? 'var(--accent-green)' : avg >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>{avg}%</span>
                      ) : <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No tests</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}