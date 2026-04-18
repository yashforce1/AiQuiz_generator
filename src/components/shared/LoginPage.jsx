import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useApp()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = login(email, password)
    setLoading(false)
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : '/student')
    } else {
      setError(result.error)
    }
  }

  const quickLogin = (e, pw) => { setEmail(e); setPassword(pw) }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20 }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 700px 500px at 50% 30%, rgba(0,212,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440 }} className="animate-fade-in-up">
        <button className="btn btn-ghost" style={{ marginBottom: 32, fontSize: 13 }} onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="card" style={{ padding: 40 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(0,212,255,0.3)' }}>
              <Brain size={28} color="#fff" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Welcome to <span className="text-gradient">NexPrep</span>
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Sign in to your account</p>
          </div>

          {/* Quick login */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12, padding: '8px 12px' }}
              onClick={() => quickLogin('admin@nexprep.in', 'admin123')}>
              👨‍🏫 Admin Demo
            </button>
            <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12, padding: '8px 12px' }}
              onClick={() => quickLogin('aryan@student.com', 'student123')}>
              🎓 Student Demo
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or enter manually</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-red)', fontSize: 14 }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '14px', fontSize: 15, justifyContent: 'center', marginTop: 4 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
