import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NAV_LINKS = [
  { to: '/', key: 'nav.accueil' },
  { to: '/menu', key: 'nav.carte' },
  { to: '/notre-histoire', key: 'nav.histoire' },
  { to: '/contact', key: 'nav.contact' },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-surface border-t border-stone-200 py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">

        {/* Col 1 — Marque */}
        <div className="md:col-span-4">
          <div className="font-headline text-xl tracking-widest text-charcoal mb-8 uppercase font-medium">
            {/* TODO: remplacer par le nom définitif du restaurant */}
            ALGIERS GASTRONOMY
          </div>
          <p className="font-body text-[12px] text-stone-500 leading-relaxed uppercase tracking-widest max-w-xs font-light">
            {t('footer.description')}
          </p>
        </div>

        {/* Col 2 — Navigation */}
        <div className="md:col-span-2">
          <span className="font-label text-[9px] tracking-[0.3em] uppercase text-stone-400 mb-6 block font-bold">
            {t('footer.nav_titre')}
          </span>
          <ul className="space-y-3">
            {NAV_LINKS.map(({ to, key }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="font-label text-[11px] tracking-widest uppercase text-stone-500 hover:text-primary transition-colors duration-300"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Réservation + adresse */}
        <div className="md:col-span-3">
          <span className="font-label text-[9px] tracking-[0.3em] uppercase text-stone-400 mb-6 block font-bold">
            {t('footer.resa_titre')}
          </span>
          <p className="font-label text-[11px] tracking-widest uppercase text-stone-500 leading-relaxed mb-2">
            {/* TODO: adresse définitive non confirmée */}
            {t('footer.localisation')}
          </p>
          <Link
            to="/reservation"
            className="inline-block mt-4 bg-primary text-white px-6 py-2.5 font-label text-[9px] tracking-[0.25em] uppercase hover:bg-primary-container transition-all duration-300"
          >
            {t('footer.resa_btn')}
          </Link>
        </div>

        {/* Col 4 — Réseaux sociaux */}
        <div className="md:col-span-3">
          <span className="font-label text-[9px] tracking-[0.3em] uppercase text-stone-400 mb-6 block font-bold">
            {t('footer.social_titre')}
          </span>
          {/* TODO: liens réseaux sociaux non définis — à activer quand les comptes seront créés */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <span className="font-label text-[11px] tracking-widest uppercase text-stone-400">
              Instagram
            </span>
            <span className="font-label text-[11px] tracking-widest uppercase text-stone-400">
              Facebook
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-stone-200">
        <span className="font-label text-[9px] tracking-[0.3em] uppercase text-stone-400">
          {t('footer.droits')}
        </span>
      </div>
    </footer>
  )
}
