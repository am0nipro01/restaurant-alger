import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useReservationContext } from '../../context/ReservationContext'

// Icônes SVG inline (remplace Material Symbols)
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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
)
const IconExternalLink = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

const navLinks = [
  { href: '/admin/reservations', label: 'Reservations', icon: <IconCalendar />, roles: ['admin', 'manager'] },
  { href: '/admin/menu',         label: 'Menu',         icon: <IconMenu />,     roles: ['admin'] },
  { href: '/admin/contenu',      label: 'Content',      icon: <IconEdit />,     roles: ['admin'] },
  { href: '/admin/plan-de-salle',label: 'Floor Plan',   icon: <IconGrid />,     roles: ['admin', 'manager'] },
  { href: '/admin/contact',      label: 'Contact',      icon: <IconPhone />,    roles: ['admin'] },
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

  return (
    <div className="flex min-h-screen overflow-hidden font-body">

      {/* ── Sidebar fixe ── */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface flex flex-col p-8 z-30 border-r border-stone-100">

        {/* Logo */}
        <div className="mb-12">
          <h1 className="font-headline text-base text-charcoal tracking-tight">ALGIERS GASTRONOMY</h1>
          <p className="font-label text-[10px] tracking-[0.2em] uppercase text-stone-400 mt-1">Editorial Dashboard</p>
        </div>

        {/* Retour site public */}
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 mb-6 text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-charcoal border border-stone-200 hover:border-stone-400 transition-all duration-200"
        >
          <IconExternalLink />
          Voir le site
        </Link>

        {/* Navigation */}
        <nav className="flex-grow space-y-1">
          {navLinks.filter(link => link.roles.includes(role)).map((link) => {
            const active = location.pathname === link.href
            const isReservations = link.href === '/admin/reservations'
            const showBadge = isReservations && enAttenteCount > 0
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-4 px-4 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
                  active
                    ? 'text-primary bg-primary/10'
                    : 'text-stone-500 hover:text-charcoal hover:bg-stone-100'
                }`}
              >
                <span className="relative flex-shrink-0">
                  {link.icon}
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-primary text-white text-[9px] font-bold flex items-center justify-center leading-none">
                      {enAttenteCount > 99 ? '99+' : enAttenteCount}
                    </span>
                  )}
                </span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Profil + Logout */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 px-4 py-6 mb-2 border-t border-stone-200/50">
            <div className="w-8 h-8 bg-stone-200 flex-shrink-0 overflow-hidden">
              <div className="w-full h-full bg-[#e9e8e4] flex items-center justify-center text-stone-400 text-xs font-bold">
                {user?.email?.[0]?.toUpperCase() ?? 'A'}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider truncate">
                {role === 'manager' ? 'Manager' : 'Admin'}
              </p>
              <p className="text-[9px] text-stone-400 uppercase tracking-widest truncate">{user?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 text-xs font-bold tracking-widest uppercase text-stone-500 hover:text-charcoal hover:bg-stone-100 transition-all duration-200"
          >
            <IconLogout />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Contenu principal ── */}
      <main className={`ml-64 flex-grow ${fullHeight ? 'h-screen overflow-hidden flex flex-col' : 'min-h-screen bg-stone-100/50 p-12 overflow-y-auto'}`}>
        {children}
      </main>

    </div>
  )
}
