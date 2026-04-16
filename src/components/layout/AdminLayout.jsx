import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useReservationContext } from '../../context/ReservationContext'

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <rect x="3" y="4" width="18" height="18"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const IconEdit = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
)
const IconExternalLink = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

const navLinks = [
  { href: '/admin/reservations', label: 'Réserv.',  icon: <IconCalendar />, roles: ['admin', 'manager'] },
  { href: '/admin/plan-de-salle',label: 'Floor',    icon: <IconGrid />,     roles: ['admin', 'manager'] },
  { href: '/admin/menu',         label: 'Menu',     icon: <IconMenu />,     roles: ['admin'] },
  { href: '/admin/contenu',      label: 'Contenu',  icon: <IconEdit />,     roles: ['admin'] },
  { href: '/admin/contact',      label: 'Contact',  icon: <IconPhone />,    roles: ['admin'] },
]

export default function AdminLayout({ children, fullHeight = false }) {
  const { logout, user, role } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { enAttenteCount } = useReservationContext()

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  const visibleLinks = navLinks.filter(link => link.roles.includes(role))

  return (
    <div className={fullHeight ? 'h-screen flex flex-col overflow-hidden font-body' : 'min-h-screen font-body'}>

      {/* ── Blocage mobile (< 768px) ── */}
      <div className="md:hidden fixed inset-0 z-[9999] flex flex-col items-center justify-center p-10 text-center"
        style={{ backgroundColor: 'rgba(250, 249, 245, 0.92)', backdropFilter: 'blur(24px)' }}
      >
        <div className="w-10 h-px bg-[#845325] mb-8 mx-auto" />
        <h2 className="font-['Noto_Serif'] text-2xl font-bold text-[#1b1c1a] tracking-tight mb-4">
          Dashboard non disponible
        </h2>
        <p className="font-['Manrope'] text-sm text-[#51443b] leading-relaxed max-w-xs">
          L'interface de gestion est optimisée pour tablette et desktop uniquement.
        </p>
        <p className="font-['Manrope'] text-[10px] font-bold tracking-[0.2em] uppercase text-[#845325] mt-8">
          Utilisez une tablette ou un ordinateur
        </p>
        <div className="w-10 h-px bg-[#845325] mt-8 mx-auto" />
      </div>

      {/* ── Top bar fixe ── */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-8 bg-[#faf9f5]/90 backdrop-blur-xl border-b border-[#1b1c1a]/5">
        <div className="flex items-center gap-3">
          <h1 className="font-['Noto_Serif'] text-sm font-bold text-[#1b1c1a] tracking-tight">
            ALGIERS GASTRONOMY
          </h1>
          <div className="w-px h-4 bg-[#d6c3b6]/60" />
          <span className="font-['Manrope'] text-[9px] tracking-[0.2em] uppercase text-[#51443b]/50">
            Dashboard
          </span>
        </div>

        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="flex items-center gap-1.5 font-['Manrope'] text-[10px] font-bold tracking-widest uppercase text-[#51443b]/60 hover:text-[#845325] transition-colors duration-200"
          >
            <IconExternalLink />
            Site
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#e9e8e4] flex items-center justify-center text-[#845325] text-[10px] font-bold font-['Manrope']">
              {user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <span className="font-['Manrope'] text-[10px] font-bold uppercase tracking-wider text-[#1b1c1a]">
              {role === 'manager' ? 'Manager' : 'Admin'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 font-['Manrope'] text-[10px] font-bold tracking-widest uppercase text-[#51443b]/60 hover:text-[#ba1a1a] transition-colors duration-200"
          >
            <IconLogout />
            Logout
          </button>
        </div>
      </header>

      {/* Espaceur top bar */}
      <div className="flex-shrink-0 h-14" />

      {/* ── Contenu principal ── */}
      <main className={
        fullHeight
          ? 'flex-grow overflow-hidden flex flex-col min-h-0'
          : 'min-h-screen bg-[#f4f4f0] px-10 pt-10 pb-8'
      }>
        {children}
      </main>

      {/* Espaceur bottom nav */}
      <div className="flex-shrink-0 h-20" />

      {/* ── Bottom navigation fixe ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 h-20 z-50 flex justify-around items-center bg-[#faf9f5] border-t border-[#1b1c1a]/5"
        style={{ boxShadow: '0 -20px 40px rgba(27,28,26,0.04)' }}
      >
        {visibleLinks.map((link) => {
          const active      = location.pathname === link.href
          const showBadge   = link.href === '/admin/reservations' && enAttenteCount > 0

          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex flex-col items-center justify-center gap-1 px-5 transition-colors duration-300 ${
                active
                  ? 'text-[#845325] border-t-2 border-[#845325] pt-[14px] pb-5 -mt-px'
                  : 'text-[#1b1c1a]/35 hover:text-[#845325] border-t-2 border-transparent pt-[14px] pb-5 -mt-px'
              }`}
            >
              <span className="relative flex-shrink-0">
                {link.icon}
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-0.5 bg-[#845325] text-white text-[8px] font-bold flex items-center justify-center leading-none">
                    {enAttenteCount > 99 ? '99+' : enAttenteCount}
                  </span>
                )}
              </span>
              <span className="font-['Manrope'] text-[10px] font-bold tracking-widest uppercase">
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>

    </div>
  )
}
