import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const liens = [
  { href: '/', label: 'Accueil' },
  { href: '/menu', label: 'Notre carte' },
  { href: '/notre-histoire', label: 'Notre histoire' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOuvert, setMenuOuvert] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo / Nom */}
        <Link to="/" className="font-semibold text-lg tracking-tight">
          Restaurant Alger
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              to={lien.href}
              className={`text-sm transition-colors ${
                location.pathname === lien.href
                  ? 'text-black font-medium'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {lien.label}
            </Link>
          ))}
        </nav>

        {/* CTA Réservation */}
        <div className="hidden md:flex">
          <Link
            to="/reservation"
            className="bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition"
          >
            Réserver
          </Link>
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOuvert(!menuOuvert)}
          aria-label="Menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className={`block w-6 h-0.5 bg-black transition-all ${menuOuvert ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-black transition-all ${menuOuvert ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-black transition-all ${menuOuvert ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Menu mobile */}
      {menuOuvert && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6 flex flex-col gap-4">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              to={lien.href}
              onClick={() => setMenuOuvert(false)}
              className={`text-sm ${
                location.pathname === lien.href ? 'text-black font-medium' : 'text-gray-500'
              }`}
            >
              {lien.label}
            </Link>
          ))}
          <Link
            to="/reservation"
            onClick={() => setMenuOuvert(false)}
            className="bg-black text-white text-sm px-5 py-2.5 rounded-full text-center mt-2"
          >
            Réserver une table
          </Link>
        </div>
      )}
    </header>
  )
}
