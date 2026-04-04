import { useState } from 'react'

const IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx399d3NoTwMRQ47ePXVE0M4UxS0pMFKLBqXKWKxevh_d22L6LfzbHakCBn-kRKbSu0K5CnlEsQ4_2Q-cAeW70lwej_foR2giWCqKh6l0CgqszgmjvW6Sh963etvu34l88byvXi03R_C5ZyuisIu5Af1VpXcJTNo5UlyiBhln6X499hEZk6xmjD5ntp2JJGUwIxb3Yxljy2ugWZghrvqBbKM5DcNAiMn3K4baEENALlpPuYbKFbjMP-kRMscfVfLIc3_-jpyJJe0mE'

function CredentialBlock({ role, email, password, perms, accent }) {
  return (
    <div className={`border-l-2 pl-5 ${accent ? 'border-primary' : 'border-stone-200'}`}>
      <p className={`font-label text-[9px] tracking-[0.25em] uppercase font-bold mb-3 ${accent ? 'text-primary' : 'text-stone-400'}`}>
        {role}
      </p>
      <div className="space-y-2 mb-3">
        <div>
          <p className="font-label text-[9px] tracking-widest uppercase text-stone-300 mb-1">Identifiant</p>
          <p className="font-body text-sm text-charcoal bg-[#f7f6f3] px-3 py-2">{email}</p>
        </div>
        <div>
          <p className="font-label text-[9px] tracking-widest uppercase text-stone-300 mb-1">Mot de passe</p>
          <p className="font-body text-sm text-charcoal bg-[#f7f6f3] px-3 py-2">{password}</p>
        </div>
      </div>
      <p className="font-body text-xs text-stone-400 leading-relaxed">{perms}</p>
    </div>
  )
}

export default function AccesGerantModal() {
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="md:grid md:grid-cols-2 max-w-3xl w-full bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image gauche */}
        <div className="relative hidden md:block min-h-[480px]">
          <img
            src={IMG}
            alt="Intérieur du restaurant"
            className="absolute inset-0 w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-primary/20 flex flex-col justify-end p-8">
            <span className="font-label text-[9px] tracking-[0.3em] uppercase text-white/60 mb-2">
              Dashboard Privé
            </span>
            <h2 className="font-headline text-4xl text-white font-light leading-tight">
              Votre espace<br /><em>de gestion</em>
            </h2>
          </div>
        </div>

        {/* Contenu droite */}
        <div className="relative p-8 md:p-10 flex flex-col gap-7">

          {/* Bouton fermer */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 bg-stone-100 hover:bg-stone-200 transition-colors p-2 rounded-full"
            aria-label="Fermer"
          >
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
              <path d="M13 2 2 13M2 2l11 11" stroke="#374151" strokeOpacity=".8" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Header */}
          <div className="border-b border-stone-100 pb-6">
            <p className="font-label text-[9px] tracking-[0.3em] uppercase text-primary font-bold mb-2">
              Accès réservé
            </p>
            <h1 className="font-headline text-3xl text-charcoal font-light leading-tight">
              Identifiants<br />du dashboard
            </h1>
            <p className="font-body text-xs text-stone-400 mt-2 leading-relaxed">
              Conservez ces informations en lieu sûr.
            </p>
          </div>

          {/* Compte Admin */}
          <CredentialBlock
            role="Compte Administrateur"
            email="amoni.pro01@gmail.com"
            password="Admin75Admin"
            perms="Accès complet — menus, contenu, réservations, plan de salle, contact."
            accent
          />

          {/* Compte Manager */}
          <CredentialBlock
            role="Compte Manager"
            email="manager@manager.com"
            password="Manager75"
            perms="Accès limité — réservations et plan de salle uniquement."
          />

          {/* CTA */}
          <div className="border-t border-stone-100 pt-5">
            <p className="font-label text-[9px] tracking-widest uppercase text-stone-300 mb-3">Accès direct</p>
            <a
              href="https://restaurant-alger.netlify.app/admin/reservations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white font-label text-[10px] tracking-[0.2em] uppercase px-8 py-3 hover:bg-primary-container transition-colors duration-300"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Ouvrir le dashboard
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
