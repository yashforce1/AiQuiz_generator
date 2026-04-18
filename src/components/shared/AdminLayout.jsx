import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Brain, LayoutDashboard, HelpCircle, Plus, ClipboardList, Users, BarChart3, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
  { to: '/admin/questions', icon: <HelpCircle size={18} />, label: 'Question Bank' },
  { to: '/admin/create-test', icon: <Plus size={18} />, label: 'Create Test' },
  { to: '/admin/tests', icon: <ClipboardList size={18} />, label: 'Manage Tests' },
  { to: '/admin/results', icon: <Users size={18} />, label: 'Student Results' },
  { to: '/admin/analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
]

export default function AdminLayout() {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 260 : 72, flexShrink: 0, background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, minHeight: 72 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Brain size={18} color="#fff" />
          </div>
          {sidebarOpen && <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Nex<span className="text-gradient">Prep</span></span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Role badge */}
        {sidebarOpen && (
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
            <span className="badge badge-purple">EDUCATOR PANEL</span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap', overflow: 'hidden',
                background: isActive ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                fontWeight: isActive ? 600 : 400,
              })}>
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 14 }}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {user?.avatar}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Administrator</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: '10px 12px', fontSize: 13 }}>
            <LogOut size={16} />
            {sidebarOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  )
}