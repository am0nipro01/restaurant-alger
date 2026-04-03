import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PublicLayout from '../../components/layout/PublicLayout'

// TODO: remplacer par une vraie photo du quartier / de la façade
const IMG_ARCHI = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpx89FkUrcEHjXcgJEh3VqYhQDEnNIYRJwXLK_-m95xPjNuc_p7ETA4s4oyJRpqlOWLjFX0_Lj65qE2KHgHNdQ1-WkhlWcIh-qXVgdVTADAYI97MHoXsONIcVUlgznHdszHPTUJlz7l6mACTE1NQSA12SaMtzz_4aQ1I1gOUrpRIlbizXvwq_Srepc1BkGRBwJXG23iHkPEGIeEanVKunkahSp8g_3SwzLvbVC64owwYDW2tyE7VJpqyW6PAjohXNASRMhu3aq4stP'
// TODO: remplacer par un vrai embed Google Maps quand l'adresse est confirmée
const IMG_MAP = 'https://lh3.googleusercontent.com/aida-public/AB6AXuABq15z6-lcMBGcfs35ps7fIxORh4alnVPfJAZjYwa1z5_kBVJT6YUXzMDAKM0joi9r9zLUQLH9bxsJcBKS9FxQMv_asoiuEStrZDSw8mOsKnub0I6ivyFCr2GJ5CbrsfTOEwwZNysbwlsKy2U_1OzEiY6QbiO5B0IsNrRt2BItogFMFVN5fTIAuPSbXPpxRfPIBxEGVQjVBYgiUskjwFQongRlvt4AHy4_4flcXN06pYZ96voibwhIawBX63CqsbSFZsFqTbBEY_oT'

export default function Contact() {
  const { t } = useTranslation()

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

          <div className="space-y-4">
            <h3 className="font-label tracking-widest uppercase text-xs text-stone-500 font-bold">
              {t('contact.adresse_label')}
            </h3>
            <p className="font-headline text-3xl leading-relaxed text-charcoal">
              {t('contact.adresse')}<br />
              {t('contact.adresse_ville')}
            </p>
            <p className="font-body text-xs text-stone-400 italic">{t('contact.adresse_info')}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-label tracking-widest uppercase text-xs text-stone-500 font-bold">
              {t('contact.horaires_label')}
            </h3>
            <p className="font-headline text-3xl leading-relaxed text-charcoal">
              {t('contact.horaires_jours')}<br />
              {t('contact.horaires_detail')}
            </p>
            <p className="font-body text-stone-400 font-light italic">{t('contact.horaires_ferme')}</p>
          </div>

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
            {/* Accent décoratif */}
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
          <img
            src={IMG_MAP}
            alt="Carte Alger"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center grayscale-0">
            <div className="bg-white px-10 py-6 border border-stone-200 flex flex-col items-center shadow-desert">
              <span className="text-primary text-xl mb-2">◉</span>
              <span className="font-label tracking-widest text-xs uppercase font-bold">
                {t('contact.map_label')}
              </span>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
