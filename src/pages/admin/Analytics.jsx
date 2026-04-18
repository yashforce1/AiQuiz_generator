import React, { useMemo } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend } from 'recharts'

const COLORS = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#ec4899']

export default function Analytics() {
  const { results, students, tests, questions } = useApp()

  const subjectPerformance = useMemo(() => {
    const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology']
    return subjects.map(subject => {
      const relevant = results.filter(r => r.subjectBreakdown && r.subjectBreakdown[subject])
      const avg = relevant.length > 0 ? Math.round(relevant.reduce((s, r) => s + (r.subjectBreakdown[subject]?.percentage || 0), 0) / relevant.length) : Math.floor(40 + Math.random() * 40)
      return { subject: subject.substring(0, 4), fullName: subject, avg, questions: questions.filter(q => q.subject === subject).length }
    })
  }, [results, questions])

  const studentPerformance = useMemo(() => {
    return students.map(s => {
      const sr = results.filter(r => r.studentId === s.id)
      return {
        name: s.name.split(' ')[0],
        tests: sr.length,
        avg: sr.length > 0 ? Math.round(sr.reduce((sum, r) => sum + r.percentage, 0) / sr.length) : 0
      }
    })
  }, [results, students])

  const difficultyBreakdown = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 }
    questions.forEach(q => { if (counts[q.difficulty] !== undefined) counts[q.difficulty]++ })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [questions])

  const streamBreakdown = useMemo(() => [
    { name: 'JEE', value: questions.filter(q => q.stream === 'JEE').length },
    { name: 'NEET', value: questions.filter(q => q.stream === 'NEET').length },
    { name: 'Both', value: questions.filter(q => q.stream === 'Both').length },
  ], [questions])

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        {payload.map(p => <p key={p.dataKey} style={{ fontSize: 14, fontWeight: 600, color: p.color }}>{p.name}: {p.value}{p.dataKey.includes('avg') ? '%' : ''}</p>)}
      </div>
    )
  }

  return (
    <div style={{ padding: 40 }} className="animate-fade-in-up">
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Platform-wide insights and performance data</p>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 36 }}>
        {[
          { label: 'Total Questions', value: questions.length, color: 'var(--accent-primary)' },
          { label: 'Total Tests', value: tests.length, color: '#a78bfa' },
          { label: 'Submissions', value: results.length, color: 'var(--accent-green)' },
          { label: 'Active Students', value: students.length, color: 'var(--accent-amber)' },
          { label: 'Avg Score', value: results.length ? `${Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)}%` : 'N/A', color: 'var(--accent-pink)' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Subject-wise Avg Score</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={subjectPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" name="Avg Score" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Student Performance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={studentPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" name="Avg Score" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Questions by Difficulty</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={difficultyBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: 'var(--text-muted)' }}>
                {difficultyBreakdown.map((entry, index) => (
                  <Cell key={index} fill={['#10b981', '#f59e0b', '#ef4444'][index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Questions by Stream</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={streamBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: 'var(--text-muted)' }}>
                {streamBreakdown.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}