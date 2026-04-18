import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Zap, BarChart3, Users, ArrowRight, CheckCircle, Star } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 800px 600px at 20% 20%, rgba(0,212,255,0.06) 0%, transparent 70%), radial-gradient(ellipse 600px 800px at 80% 80%, rgba(124,58,237,0.06) 0%, transparent 70%)'
      }} />

      {/* Nav */}
      <nav style={{ padding: '20px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100, background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Nex<span className="text-gradient">Prep</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </nav>
      

      {/* Hero */}
      <section style={{ padding: '120px 60px 80px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <div className="badge badge-blue" style={{ marginBottom: 24, display: 'inline-flex' }}>
          <Zap size={11} /> AI-Powered JEE & NEET Platform
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: 24 }}>
          Crack JEE & NEET<br />
          <span className="text-gradient">with Intelligence</span>
        </h1>
        <p style={{ fontSize: 20, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Professional quiz platform for educators. AI-powered analysis for students. Built for India's most competitive exams.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => navigate('/login')}>
            Start as Educator <ArrowRight size={16} />
          </button>
          <button className="btn btn-ghost" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => navigate('/login')}>
            Student Login
          </button>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '40px 60px', display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        {[['10,000+', 'Questions'], ['500+', 'Tests Created'], ['50,000+', 'Students'], ['92%', 'Selection Rate']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800 }} className="text-gradient">{num}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding: '80px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, textAlign: 'center', marginBottom: 60 }}>
          Everything you need to <span className="text-gradient">excel</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { icon: <Brain size={24} />, color: 'var(--accent-primary)', title: 'AI Analysis', desc: 'Deep performance analysis after every test. Get personalized study plans and rank predictions powered by Claude AI.' },
            { icon: <Zap size={24} />, color: 'var(--accent-amber)', title: 'Smart Question Bank', desc: 'Thousands of JEE & NEET questions with AI-generated explanations. Filter by subject, topic, and difficulty.' },
            { icon: <BarChart3 size={24} />, color: 'var(--accent-green)', title: 'Advanced Analytics', desc: 'Visual dashboards showing topic-wise accuracy, time management, and improvement trends over time.' },
            { icon: <Users size={24} />, color: '#a78bfa', title: 'Educator Tools', desc: 'Create custom tests, assign to students, track progress, and get class-wide performance insights.' },
          ].map(f => (
            <div key={f.title} className="card" style={{ padding: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 60px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <Brain size={16} color="var(--accent-primary)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>NexPrep</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2025 NexPrep. Built for JEE & NEET aspirants across India.</p>
      </footer>
    </div>
  )
}