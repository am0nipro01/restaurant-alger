import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navLinks = [
  { href: '/admin/dashboard', label: 'Accueil' },
  { href: '/admin/reservations', label: 'Réservations' },
  { href: '/admin/menu', label: 'Menu' },
  { href: '/admin/contenu', label: 'Contenu' },
  { href: '/admin/plan-de-salle', label: 'Plan de salle' },
]

export default function AdminLayout({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barre de navigation admin */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-sm tracking-wide">Admin</span>
          <nav className="flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm transition ${
                  location.pathname === link.href
                    ? 'text-black font-medium'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-black transition"
        >
          Se déconnecter
        </button>
      </header>

      {/* Contenu de la page */}
      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
