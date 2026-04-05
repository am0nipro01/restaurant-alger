import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const links = [
    { to: '/', label: t('nav.accueil') },
    { to: '/menu', label: t('nav.carte') },
    { to: '/notre-histoire', label: t('nav.histoire') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#faf9f5]/90 backdrop-blur-sm flex justify-between items-center px-6 md:px-12 py-5 border-b border-black/5">
      {/* Logo / Nom du restaurant */}
      <Link
        to="/"
        className="font-headline text-base tracking-widest text-charcoal uppercase font-medium"
      >
        {/* TODO: remplacer par le nom définitif du restaurant */}
        ALGIERS GASTRONOMY
      </Link>

      {/* Liens — desktop uniquement (lg+) */}
      <div className="hidden lg:flex items-center gap-10">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`font-label tracking-[0.2em] uppercase text-[11px] transition-colors duration-300 ${
              isActive(to)
                ? 'text-primary border-b border-primary pb-0.5'
                : 'text-charcoal hover:text-primary'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Droite */}
      <div className="flex items-center gap-4 lg:gap-8">
        {/* Sélecteur de langue — desktop uniquement */}
        <div className="hidden lg:flex items-center gap-2">
          {LANGS.map((lang, idx) => (
            <span key={lang.code} className="flex items-center gap-2">
              <button
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`font-label tracking-[0.15em] uppercase text-[9px] transition-colors duration-300 ${
                  i18n.language.startsWith(lang.code)
                    ? 'text-primary'
                    : 'text-stone-400 hover:text-primary'
                }`}
              >
                {lang.label}
              </button>
              {idx < LANGS.length - 1 && (
                <span className="text-stone-300 text-[8px]">/</span>
              )}
            </span>
          ))}
        </div>

        {/* Bouton réserver — toujours visible */}
        <Link
          to="/reservation"
          className="bg-primary text-white px-7 py-2.5 font-label text-[10px] tracking-[0.25em] uppercase hover:bg-primary-container transition-all duration-300"
        >
          {t('nav.reserver')}
        </Link>

        {/* Burger — mobile + tablette (< lg) */}
        <button
          className="lg:hidden flex flex-col gap-[5px]"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span
            className={`block w-5 h-px bg-charcoal transition-all duration-300 origin-center ${
              open ? 'rotate-45 translate-y-[6px]' : ''
            }`}
          />
          <span
            className={`block w-5 h-px bg-charcoal transition-all duration-300 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-px bg-charcoal transition-all duration-300 origin-center ${
              open ? '-rotate-45 -translate-y-[6px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Menu burger — mobile + tablette (< lg) */}
      {open && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-surface border-b border-black/5 py-8 px-6 flex flex-col gap-6 animate-fade-in shadow-desert">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`font-label tracking-[0.2em] uppercase text-[11px] ${
                isActive(to) ? 'text-primary' : 'text-charcoal'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Lien Dashboard */}
          <Link
            to="/admin/reservations"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 font-label tracking-[0.2em] uppercase text-[11px] text-stone-400 hover:text-primary transition-colors pt-1"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </Link>

          {/* Langue — mobile/tablette */}
          <div className="flex items-center gap-4 pt-4 border-t border-black/5">
            {LANGS.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code)
                  setOpen(false)
                }}
                className={`font-label tracking-[0.15em] uppercase text-[10px] ${
                  i18n.language.startsWith(lang.code)
                    ? 'text-primary'
                    : 'text-stone-400'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
