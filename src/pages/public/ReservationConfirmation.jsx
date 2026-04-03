import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PublicLayout from '../../components/layout/PublicLayout'

// TODO: remplacer par une vraie photo du restaurant
const IMG_SALLE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuxcrg2nNjrM3SCe2zd1REBIUkWlyQMY1ipKdWE2MeubqUQ7AUWwR7028PvteZh0acz4SeGXeYaigVlE9HR2Fu7PxaIs4UESvK2t-LWgS_JCNMIJoSnSKM0gsFhgxgJRer487eS6EpCt61RblUiUJcI5SK52yjkkBHRnT_cKAo5FaBXR1-t4vNXCXta9yYG9G4bGrGhUvsMMCKSFSdQu5mNMHF3P3TsWGSLZVuhrPtES2autKNY_myC42klQ2fxUM67Ac69zsI18c6'

function formaterDate(dateStr, locale = 'fr-FR') {
  if (!dateStr) return dateStr
  return new Date(dateStr + 'T12:00:00').toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ReservationConfirmation() {
  const { t, i18n } = useTranslation()
  const { state } = useLocation()

  // État introuvable
  if (!state) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center space-y-6">
            <p className="font-body text-stone-500">{t('confirmation.introuvable')}</p>
            <Link
              to="/reservation"
              className="font-label text-xs tracking-[0.2em] uppercase text-primary border-b border-primary pb-1 hover:text-primary-container transition-colors"
            >
              {t('confirmation.lien')}
            </Link>
          </div>
        </div>
      </PublicLayout>
    )
  }

  const { nom, date, heure, nb_personnes } = state
  const locale = i18n.language === 'ar' ? 'ar-DZ' : i18n.language === 'en' ? 'en-GB' : 'fr-FR'
  const dateFormatee = formaterDate(date, locale)

  return (
    <PublicLayout>

      {/* ── Confirmation ── */}
      <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-2xl w-full text-center space-y-12">

          {/* Icône horloge — en attente */}
          <div className="flex justify-center">
            <div className="w-24 h-24 flex items-center justify-center border border-stone-200">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#845325" strokeWidth="1" strokeLinecap="square">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
          </div>

          {/* Titre + sous-titre */}
          <div className="space-y-4">
            <h1 className="font-headline text-4xl md:text-5xl tracking-tight text-charcoal">
              {t('confirmation.titre')}
            </h1>
            <p className="font-body text-stone-500 text-lg max-w-md mx-auto leading-relaxed">
              {t('confirmation.sous_titre')}
            </p>
          </div>

          {/* Bandeau statut en attente */}
          <div className="flex items-center justify-center gap-4 border border-amber-200 bg-amber-50 px-8 py-4 max-w-sm mx-auto">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
            <div className="text-left">
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-amber-700">{t('confirmation.statut_label')}</p>
              <p className="font-body text-sm text-amber-800 font-medium">{t('confirmation.statut_valeur')}</p>
            </div>
          </div>
          <p className="font-body text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
            {t('confirmation.statut_info')}
          </p>

          {/* Bloc récap */}
          <div className="bg-[#f4f4f0] p-12 text-left space-y-8 relative overflow-hidden">
            {/* Accent décoratif */}
            <div className="absolute top-0 right-0 w-32 h-full bg-[#e9e8e4]/40 translate-x-16 -skew-x-12 pointer-events-none" />

            <h2 className="font-label text-xs tracking-[0.3em] uppercase text-primary border-b border-stone-200 pb-4 mb-8">
              {t('confirmation.details_label')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div className="space-y-1">
                <p className="font-label text-[10px] tracking-[0.2em] uppercase text-stone-400">{t('confirmation.invite_label')}</p>
                <p className="font-headline text-xl">{nom}</p>
              </div>
              <div className="space-y-1">
                <p className="font-label text-[10px] tracking-[0.2em] uppercase text-stone-400">{t('confirmation.date_label')}</p>
                <p className="font-headline text-xl">{dateFormatee}</p>
              </div>
              <div className="space-y-1">
                <p className="font-label text-[10px] tracking-[0.2em] uppercase text-stone-400">{t('confirmation.heure_label')}</p>
                <p className="font-headline text-xl">{heure}</p>
              </div>
              <div className="space-y-1">
                <p className="font-label text-[10px] tracking-[0.2em] uppercase text-stone-400">{t('confirmation.couverts_label')}</p>
                <p className="font-headline text-xl">
                  {nb_personnes} {nb_personnes > 1 ? t('reservation.personnes') : t('reservation.personne')}
                </p>
              </div>
            </div>
          </div>

          {/* Lien nouvelle réservation */}
          <div className="pt-8 flex flex-col items-center gap-8">
            <div className="h-px w-12 bg-stone-200" />
            <Link
              to="/reservation"
              className="font-label text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-primary transition-all duration-300 border-b border-transparent hover:border-primary pb-1"
            >
              {t('confirmation.nouvelle')}
            </Link>
          </div>

        </div>
      </main>

      {/* ── Préparez votre visite ── */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-32">
        {/* Fix overlap: image à gauche, texte en absolu à droite */}
        <div className="relative">
          {/* Image — 70% de large */}
          <div className="w-full md:w-[70%]">
            <img
              src={IMG_SALLE}
              alt="Salle du restaurant"
              className="w-full aspect-[16/9] object-cover grayscale-[0.2] contrast-[1.1]"
            />
          </div>
          {/* Bloc texte — positionné à droite, centré verticalement */}
          <div className="md:absolute md:right-0 md:top-0 md:bottom-0 md:w-[38%] bg-[#e9e8e4] p-10 md:p-12 flex flex-col justify-center mt-6 md:mt-0">
            <h3 className="font-headline text-2xl mb-6">{t('confirmation.preparer_titre')}</h3>
            <p className="font-body text-sm leading-relaxed text-stone-600 mb-8">
              {t('confirmation.preparer_texte')}
            </p>
            <div className="flex items-start gap-3 text-primary">
              <span className="text-sm mt-0.5">◉</span>
              <span className="font-label text-[10px] tracking-widest uppercase">
                {t('contact.adresse')} {t('contact.adresse_ville')}
              </span>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
