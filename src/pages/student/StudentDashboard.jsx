import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { ClipboardList, TrendingUp, Target, Award, ArrowRight, Play, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function StudentDashboard() {
  const { user, tests, results, getStudentResults } = useApp()
  const navigate = useNavigate()

  const myResults = getStudentResults(user?.id)
  const assignedTests = tests.filter(t =>
    t.status === 'active' && (t.assignedTo.length === 0 || t.assignedTo.includes(user?.id))
  )
  const completedTestIds = new Set(myResults.map(r => r.testId))
  const pendingTests = assignedTests.filter(t => !completedTestIds.has(t.id))
  const completedTests = assignedTests.filter(t => completedTestIds.has(t.id))

  const avgScore = myResults.length > 0
    ? Math.round(myResults.reduce((s, r) => s + r.percentage, 0) / myResults.length)
    : 0

  const bestScore = myResults.length > 0
    ? Math.max(...myResults.map(r => r.percentage))
    : 0

  const trendData = myResults.slice(-6).map((r, i) => ({
    test: `T${i + 1}`,
    score: r.percentage
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '8px 12px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-green)' }}>{payload[0].value}%</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 40 }} className="animate-fade-in-up">
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Hey, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          {pendingTests.length > 0
            ? `You have ${pendingTests.length} pending test${pendingTests.length > 1 ? 's' : ''}. Let's go!`
            : 'All caught up! Check your results or ask the AI tutor.'
          }
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
        {[
          { label: 'Tests Taken', value: myResults.length, icon: <ClipboardList size={18} />, color: 'var(--accent-primary)' },
          { label: 'Avg Score', value: myResults.length ? `${avgScore}%` : '—', icon: <TrendingUp size={18} />, color: 'var(--accent-green)' },
          { label: 'Best Score', value: myResults.length ? `${bestScore}%` : '—', icon: <Award size={18} />, color: 'var(--accent-amber)' },
          { label: 'Pending Tests', value: pendingTests.length, icon: <Target size={18} />, color: '#a78bfa' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: 22 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, marginBottom: 14 }}>
              {stat.icon}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Pending tests */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Pending Tests</h2>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => navigate('/student/my-tests')}>
              View All <ArrowRight size={12} />
            </button>
          </div>
          {pendingTests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
              <Target size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <p style={{ fontSize: 14 }}>All tests completed!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendingTests.slice(0, 3).map(test => (
                <div key={test.id} style={{ padding: '14px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{test.title}</p>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={10} /> {test.duration} min
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{test.questionIds?.length} questions</span>
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 12, flexShrink: 0 }}
                    onClick={() => navigate(`/student/take-test/${test.id}`)}>
                    <Play size={12} /> Start
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Score trend */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Score Trend</h2>
          {trendData.length < 2 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
              <TrendingUp size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <p style={{ fontSize: 14 }}>Complete more tests to see your trend</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="test" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent results */}
      {myResults.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Recent Results</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myResults.slice(-4).reverse().map(result => (
              <div key={result.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: result.percentage >= 70 ? 'rgba(16,185,129,0.1)' : result.percentage >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: result.percentage >= 70 ? 'var(--accent-green)' : result.percentage >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>{result.percentage}%</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{result.testName}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{result.correct} correct · {result.wrong} wrong · {result.timeTaken} min</p>
                </div>
                <button className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 12px', flexShrink: 0 }}
                  onClick={() => navigate(`/student/results/${result.testId}`)}>
                  Analysis <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}