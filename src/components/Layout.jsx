import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { getCyclePhase } from '../utils/helpers'
import ChatPanel from './ChatPanel'

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    to: '/planner',
    label: 'Planner',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    to: '/chat',
    label: 'Ask Biome',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
]

export default function Layout() {
  const user = useStore((s) => s.user)
  const cycleDay = useStore((s) => s.cycleDay)
  const cycleLength = useStore((s) => s.cycleLength)
  const startFlow = useStore((s) => s.startFlow)
  const notifications = useStore((s) => s.notifications)
  const markNotificationRead = useStore((s) => s.markNotificationRead)
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead)
  const navigate = useNavigate()
  const [chatOpen, setChatOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close notification panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const phase = getCyclePhase(cycleDay, cycleLength)

  const handleFlow = (mode) => {
    startFlow(mode)
    navigate(`/flow/${mode}/check-in`)
  }

  return (
    <div className="flex h-screen bg-[#F8F7FA] overflow-hidden">

      {/* ── Sidebar (desktop) ── */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-gray-200 shrink-0 transition-all duration-300 ${collapsed ? 'w-[60px]' : 'w-56'}`}>
        {/* Logo */}
        <div className={`flex items-center h-[60px] border-b border-gray-100 shrink-0 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 rounded-xl bg-brand-purple flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold leading-none">B</span>
          </div>
          {!collapsed && <span className="text-[15px] font-bold text-gray-900 tracking-tight">Biome</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg text-[13px] font-medium
                 transition-all duration-150
                 ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'}
                 ${isActive
                   ? 'bg-brand-light text-brand-purple'
                   : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                 }`
              }
              title={collapsed ? label : undefined}
            >
              <span className="shrink-0">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Phase pill */}
        {!collapsed && (
          <div className="mx-3 mb-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Today</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: phase.color }} />
              <span className="text-xs font-semibold text-gray-700">Day {cycleDay} · {phase.name}</span>
            </div>
          </div>
        )}

        {/* User + collapse */}
        <div className="px-2 pb-3 space-y-1 border-t border-gray-100 pt-2">
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-brand-purple text-white text-xs font-bold flex items-center justify-center shrink-0">
                {(user?.name || 'U')[0].toUpperCase()}
              </div>
              <span className="text-[13px] font-medium text-gray-700 truncate">{user?.name || 'User'}</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(v => !v)}
            className={`w-full flex items-center gap-2 py-2 rounded-lg text-gray-400
              hover:text-gray-700 hover:bg-gray-100 transition-colors text-xs
              ${collapsed ? 'justify-center' : 'px-3'}`}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span className="font-bold text-gray-900">Biome</span>
          </div>
          <div className="hidden md:block" />

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFlow('low')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                bg-brand-purple text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              😔 <span>Feeling low</span>
            </button>
            <button
              onClick={() => handleFlow('high')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                bg-brand-yellow text-gray-900 text-[13px] font-semibold hover:opacity-85 transition-opacity"
            >
              ✨ <span>Feeling good</span>
            </button>

            {/* Chat toggle */}
            <button
              onClick={() => setChatOpen(v => !v)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 text-[13px] font-semibold
                transition-all duration-200
                ${chatOpen
                  ? 'bg-brand-purple text-white border-brand-purple'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-purple hover:text-brand-purple'
                }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <span className="hidden sm:inline">{chatOpen ? 'Close chat' : 'Ask Biome'}</span>
            </button>

            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className={`relative flex items-center justify-center w-9 h-9 rounded-full border-2
                  transition-all duration-200
                  ${notifOpen
                    ? 'bg-brand-purple text-white border-brand-purple'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-brand-purple hover:text-brand-purple'
                  }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                    bg-rose-500 text-white text-[10px] font-bold rounded-full
                    flex items-center justify-center leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">Notifications</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-brand-purple font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <span className="text-2xl">🔔</span>
                        <p className="text-sm text-gray-400 mt-2">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors
                            ${!n.read ? 'bg-violet-50/60' : ''}`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0
                              ${n.read ? 'bg-gray-200' : 'bg-brand-purple'}`} />
                            <p className={`text-xs leading-relaxed
                              ${n.read ? 'text-gray-400' : 'text-gray-800 font-medium'}`}>
                              {n.message}
                            </p>
                          </div>
                          <p className="text-[10px] text-gray-300 mt-1 pl-4.5">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content + chat split */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
            <div className="px-5 py-6 max-w-6xl mx-auto">
              <Outlet />
            </div>
          </main>

          {/* Chat side panel (desktop) */}
          {chatOpen && (
            <div className="hidden md:flex w-[380px] shrink-0 border-l border-gray-200 bg-white flex-col">
              <ChatPanel onClose={() => setChatOpen(false)} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around py-1.5 px-4">
          {navItems.map(({ to, label, icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors
                 ${isActive ? 'text-brand-purple' : 'text-gray-400'}`
              }
            >
              {icon}
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
