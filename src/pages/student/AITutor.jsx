import React, { useState, useRef, useEffect } from 'react'
import { chatWithTutor } from '../../claude.js'
import { Brain, Send, RotateCcw, BookOpen, Zap, User } from 'lucide-react'

const SUBJECT_OPTIONS = ['General', 'Physics', 'Chemistry', 'Mathematics', 'Biology']

const QUICK_PROMPTS = [
  "Explain Newton's laws of motion with examples",
  "What is the difference between SN1 and SN2 reactions?",
  "How do I solve integration by parts?",
  "Explain the process of mitosis vs meiosis",
  "What is Heisenberg's uncertainty principle?",
  "Explain the Nernst equation for electrochemistry",
]

export default function AITutor() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm NexPrep AI, your personal JEE & NEET tutor. I can help you understand concepts, solve problems step-by-step, and clarify doubts. What would you like to learn today? 🎯"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [subject, setSubject] = useState('General')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text = input) => {
    const messageText = text.trim()
    if (!messageText || loading) return

    const userMsg = { role: 'user', content: messageText }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await chatWithTutor(newMessages, subject)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ I'm unable to respond right now. ${err.message.includes('API key') ? 'Please add your VITE_ANTHROPIC_API_KEY to the .env file to enable AI chat.' : 'Please try again.'}`
      }])
    }
    setLoading(false)
    inputRef.current?.focus()
  }

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat reset! Ask me anything about JEE or NEET. 🚀"
    }])
  }

  const formatMessage = (content) => {
    // Basic formatting: bold text between **
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary)">$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,212,255,0.3)' }}>
            <Brain size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>AI Tutor</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Powered by Claude · Ask anything</p>
          </div>
          <span className="badge badge-blue" style={{ marginLeft: 8 }}><Zap size={10} /> Live</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select className="select" style={{ width: 140, padding: '8px 12px' }} value={subject} onChange={e => setSubject(e.target.value)}>
            {SUBJECT_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={resetChat}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Quick prompts */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16, flexShrink: 0 }}>
        {QUICK_PROMPTS.map(prompt => (
          <button key={prompt} onClick={() => sendMessage(prompt)}
            style={{ padding: '7px 14px', borderRadius: 100, background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s', flexShrink: 0 }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
            {prompt.substring(0, 32)}...
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 4 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            {/* Avatar */}
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: msg.role === 'user' ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: msg.role === 'assistant' ? '0 4px 12px rgba(0,212,255,0.2)' : 'none' }}>
              {msg.role === 'user' ? <User size={15} color="#fff" /> : <Brain size={15} color="#fff" />}
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: '72%',
              padding: '14px 18px',
              borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
              background: msg.role === 'user' ? 'rgba(16,185,129,0.12)' : 'var(--bg-elevated)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
              fontSize: 14,
              lineHeight: 1.75,
              color: 'var(--text-primary)',
            }} dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Brain size={15} color="#fff" />
            </div>
            <div style={{ padding: '14px 18px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{ flexShrink: 0, paddingTop: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '10px 16px', transition: 'border-color 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Ask me anything about JEE/NEET... (Enter to send, Shift+Enter for newline)"
            rows={1}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, maxHeight: 120, overflowY: 'auto' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{ width: 36, height: 36, borderRadius: '50%', background: input.trim() && !loading ? 'var(--gradient-primary)' : 'var(--bg-elevated)', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', boxShadow: input.trim() ? '0 4px 12px rgba(0,212,255,0.3)' : 'none' }}>
            <Send size={15} color={input.trim() && !loading ? '#fff' : 'var(--text-muted)'} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
          AI responses require VITE_ANTHROPIC_API_KEY in .env · Never share personal data
        </p>
      </div>
    </div>
  )
}
