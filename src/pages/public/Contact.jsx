import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import PublicLayout from '../../components/layout/PublicLayout'
import pb from '../../lib/pocketbase'

// ─────────────────────────────────────────────────────
// 🔴 DEBUG MODE — mettre à false une fois validé
const DEBUG_MODE = false
// ─────────────────────────────────────────────────────

// TODO: remplacer par une vraie photo du quartier / de la façade
const IMG_ARCHI = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpx89FkUrcEHjXcgJEh3VqYhQDEnNIYRJwXLK_-m95xPjNuc_p7ETA4s4oyJRpqlOWLjFX0_Lj65qE2KHgHNdQ1-WkhlWcIh-qXVgdVTADAYI97MHoXsONIcVUlgznHdszHPTUJlz7l6mACTE1NQSA12SaMtzz_4aQ1I1gOUrpRIlbizXvwq_Srepc1BkGRBwJXG23iHkPEGIeEanVKunkahSp8g_3SwzLvbVC64owwYDW2tyE7VJpqyW6PAjohXNASRMhu3aq4stP'
// TODO: remplacer par un vrai embed Google Maps quand l'adresse est confirmée
const IMG_MAP = 'https://lh3.googleusercontent.com/aida-public/AB6AXuABq15z6-lcMBGcfs35ps7fIxORh4alnVPfJAZjYwa1z5_kBVJT6YUXzMDAKM0joi9r9zLUQLH9bxsJcBKS9FxQMv_asoiuEStrZDSw8mOsKnub0I6ivyFCr2GJ5CbrsfTOEwwZNysbwlsKy2U_1OzEiY6QbiO5B0IsNrRt2BItogFMFVN5fTIAuPSbXPpxRfPIBxEGVQjVBYgiUskjwFQongRlvt4AHy4_4flcXN06pYZ96voibwhIawBX63CqsbSFZsFqTbBEY_oT'

const JOURS_LABELS = {
  lundi: 'Lun', mardi: 'Mar', mercredi: 'Mer',
  jeudi: 'Jeu', vendredi: 'Ven', samedi: 'Sam', dimanche: 'Dim',
}

// Composant helper — rouge si DEBUG_MODE et valeur vient de PocketBase
function Dyn({ value, fallback, className = '', block = false }) {
  const content = value || fallback
  const isLive  = DEBUG_MODE && !!value

  if (block) {
    return (
      <span
        className={`${className} ${isLive ? 'text-red-500 ring-1 ring-red-300 ring-offset-2' : ''}`}
        title={isLive ? '🔴 Valeur live depuis admin/contact' : undefined}
      >
        {content}
      </span>
    )
  }

  return (
    <span
      className={`${className} ${isLive ? 'text-red-500 ring-1 ring-red-300 ring-offset-2' : ''}`}
      title={isLive ? '🔴 Valeur live depuis admin/contact' : undefined}
    >
      {content}
    </span>
  )
}

// Formate les horaires depuis l'objet PocketBase en lignes lisibles
function formaterHoraires(horaires) {
  if (!horaires) return null
  const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
  return JOURS.map((jour) => {
    const h = horaires[jour]
    if (!h) return null
    const label = JOURS_LABELS[jour]
    if (!h.ouvert) return { jour: label, detail: 'Fermé', ferme: true }
    const parts = [h.midi, h.soir].filter(Boolean).join(' / ')
    return { jour: label, detail: parts || '—', ferme: false }
  }).filter(Boolean)
}

export default function Contact() {
  const { t } = useTranslation()
  const [info, setInfo] = useState(null) // données depuis PocketBase

  useEffect(() => {
    const charger = async () => {
      try {
        const records = await pb.collection('site_config').getFullList({
          filter: 'cle = "contact"',
        })
        if (records.length > 0) {
          const data = typeof records[0].valeur === 'string'
            ? JSON.parse(records[0].valeur)
            : records[0].valeur
          setInfo(data)
        }
      } catch (_) {
        // PocketBase indisponible — fallback i18n silencieux
      }
    }
    charger()
  }, [])

  const horairesLignes = info?.horaires ? formaterHoraires(info.horaires) : null

  return (
    <PublicLayout>

      {/* ── Hero ── */}
      <section className="px-6 md:px-24 pt-48 pb-20 max-w-screen-2xl mx-auto">
        <div className="flex flex-col space-y-6">
          <span className="font-label tracking-[0.4em] uppercase text-xs text-primary font-semibold">
            {t('contact.label')}
          </span>
          <h1 className="font-headline text-7xl md:text-9xl text-charcoal tracking-tighter leading-tight">
            {t('contact.titre_normal')}<br />
            <span className="italic font-normal">{t('contact.titre_italique')}</span>
          </h1>
          <p className="font-headline text-2xl text-stone-500 max-w-xl">
            {t('contact.accroche')}
          </p>
        </div>
      </section>

      {/* ── Layout asymétrique 2 colonnes ── */}
      <section className="px-6 md:px-24 py-24 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-0 bg-[#f4f4f0]">

        {/* Colonne gauche — infos pratiques */}
        <div className="md:col-span-4 flex flex-col space-y-16 border-l border-stone-200 pl-8">

          {/* Adresse */}
          <div className="space-y-4">
            <h3 className="font-label tracking-widest uppercase text-xs text-stone-500 font-bold">
              {t('contact.adresse_label')}
            </h3>
            <p className="font-headline text-3xl leading-relaxed text-charcoal">
              <Dyn value={info?.adresse}   fallback={t('contact.adresse')} /><br />
              <Dyn value={info?.ville}     fallback={t('contact.adresse_ville')} />
            </p>
            <p className="font-body text-xs text-stone-400 italic">{t('contact.adresse_info')}</p>
          </div>

          {/* Contacts (téléphone / email) */}
          {info && (info.telephone || info.whatsapp || info.email_contact) && (
            <div className="space-y-4">
              <h3 className="font-label tracking-widest uppercase text-xs text-stone-500 font-bold">
                Contact
              </h3>
              <div className="space-y-2">
                {info.telephone && (
                  <p className="font-body text-lg text-charcoal">
                    <Dyn value={info.telephone} fallback="" />
                  </p>
                )}
                {info.whatsapp && info.whatsapp !== info.telephone && (
                  <p className="font-body text-sm text-stone-500">
                    WhatsApp : <Dyn value={info.whatsapp} fallback="" />
                  </p>
                )}
                {info.email_contact && (
                  <p className="font-body text-sm text-stone-500">
                    <Dyn value={info.email_contact} fallback="" />
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Horaires */}
          <div className="space-y-4">
            <h3 className="font-label tracking-widest uppercase text-xs text-stone-500 font-bold">
              {t('contact.horaires_label')}
            </h3>

            {horairesLignes ? (
              // Horaires dynamiques depuis PocketBase
              <div className={`space-y-1 ${DEBUG_MODE ? 'ring-1 ring-red-300 ring-offset-4 p-3' : ''}`}>
                {horairesLignes.map(({ jour, detail, ferme }) => (
                  <div key={jour} className="flex justify-between text-sm">
                    <span className={`font-label uppercase tracking-wider text-xs ${ferme ? 'text-stone-300' : 'text-stone-500'}`}>
                      {jour}
                    </span>
                    <span className={`font-body ${ferme ? 'text-stone-300 italic' : 'text-red-500'}`}>
                      {detail}
                    </span>
                  </div>
                ))}
                {info?.note_fermeture && (
                  <p className="font-body text-xs text-red-400 italic mt-3">
                    {info.note_fermeture}
                  </p>
                )}
              </div>
            ) : (
              // Fallback i18n
              <>
                <p className="font-headline text-3xl leading-relaxed text-charcoal">
                  {t('contact.horaires_jours')}<br />
                  {t('contact.horaires_detail')}
                </p>
                <p className="font-body text-stone-400 font-light italic">{t('contact.horaires_ferme')}</p>
              </>
            )}
          </div>

          {/* Infos pratiques */}
          {info && (info.dress_code || info.parking || info.moyens_paiement) && (
            <div className="space-y-4">
              <h3 className="font-label tracking-widest uppercase text-xs text-stone-500 font-bold">
                Pratique
              </h3>
              <div className="space-y-2 text-sm">
                {info.dress_code && (
                  <p>
                    <span className="font-label text-[9px] uppercase tracking-widest text-stone-400 block">Dress code</span>
                    <Dyn value={info.dress_code} fallback="" className="font-body text-charcoal" />
                  </p>
                )}
                {info.parking && (
                  <p>
                    <span className="font-label text-[9px] uppercase tracking-widest text-stone-400 block">Parking</span>
                    <Dyn value={info.parking} fallback="" className="font-body text-charcoal" />
                  </p>
                )}
                {info.moyens_paiement && (
                  <p>
                    <span className="font-label text-[9px] uppercase tracking-widest text-stone-400 block">Paiement</span>
                    <Dyn value={info.moyens_paiement} fallback="" className="font-body text-charcoal" />
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Réseaux sociaux */}
          {info && (info.instagram || info.facebook) && (
            <div className="space-y-3">
              <h3 className="font-label tracking-widest uppercase text-xs text-stone-500 font-bold">
                Réseaux
              </h3>
              <div className="flex gap-4">
                {info.instagram && (
                  <a
                    href={info.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-label text-xs uppercase tracking-widest hover:text-primary transition-colors ${DEBUG_MODE ? 'text-red-500' : 'text-charcoal'}`}
                  >
                    Instagram
                  </a>
                )}
                {info.facebook && (
                  <a
                    href={info.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-label text-xs uppercase tracking-widest hover:text-primary transition-colors ${DEBUG_MODE ? 'text-red-500' : 'text-charcoal'}`}
                  >
                    Facebook
                  </a>
                )}
              </div>
            </div>
          )}

          <div>
            <Link
              to="/reservation"
              className="inline-block bg-primary text-white px-14 py-5 font-label tracking-widest uppercase text-sm hover:bg-primary-container transition-all duration-300"
            >
              {t('contact.resa_btn')}
            </Link>
          </div>

        </div>

        {/* Colonne droite — visuel éditorial */}
        <div className="md:col-start-7 md:col-span-5 flex flex-col justify-center">

          <div className="relative mb-12">
            <img
              src={IMG_ARCHI}
              alt="Architecture algérienne"
              className="w-full h-[600px] object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary-container p-8 hidden md:flex items-center justify-center">
              <span className="text-white text-3xl">✦</span>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="font-headline text-4xl text-charcoal leading-snug">
              {t('contact.lieu_titre')}
            </h2>
            <div className="h-px w-20 bg-primary" />
            <p className="font-body text-lg text-stone-600 leading-relaxed max-w-md font-light">
              {t('contact.lieu_p1')}
            </p>
            <p className="font-body text-stone-400 italic">
              {t('contact.lieu_p2')}
            </p>
          </div>

        </div>

      </section>

      {/* ── Section carte ── */}
      <section className="w-full h-[500px] mt-24">
        <div className="w-full h-full relative overflow-hidden grayscale contrast-125 opacity-80">
          {info?.google_maps_url ? (
            // Lien Google Maps dynamique
            <a
              href={info.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <img src={IMG_MAP} alt="Carte Alger" className="w-full h-full object-cover" />
            </a>
          ) : (
            <img src={IMG_MAP} alt="Carte Alger" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 flex items-center justify-center grayscale-0">
            <div className="bg-white px-10 py-6 border border-stone-200 flex flex-col items-center shadow-desert">
              <span className={`text-xl mb-2 ${info?.google_maps_url && DEBUG_MODE ? 'text-red-500' : 'text-primary'}`}>◉</span>
              <span className={`font-label tracking-widest text-xs uppercase font-bold ${info?.google_maps_url && DEBUG_MODE ? 'text-red-500' : ''}`}>
                {t('contact.map_label')}
                {info?.google_maps_url && DEBUG_MODE && ' ↗'}
              </span>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
