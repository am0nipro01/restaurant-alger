import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PublicLayout from '../../components/layout/PublicLayout'
import PageSEO from '../../components/seo/PageSEO'
import RestaurantJsonLD from '../../components/seo/RestaurantJsonLD'

// TODO: remplacer par les vraies photos du restaurant
const IMG_HERO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-RvPpfo0XX9yi0ysIsNu7-m9rmRp4g0lhFXFxrQ60ED73XuuD_G547crcgOJHNZ2x7eKMZzH_CkvYkx0kKeX4nI6jyNrLcwTaQtH6G6nX5ol2B5dVEDReINyL2PO00YW0jIlifeLd5WDyCy8vOYmWlBDv-XZI8x5CUjW25bprNehGUEeF5ZZ3m0YYC33KA-izaVBnq44tep2_wG9ITbpcKryUU3D7ygRY7OVf27pN1p90RA38ndvAgjz7E7KYrpufe4zLtkrG_9LH'
const IMG_SPICES = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmPeomXrVGGwiSjBLe-yI6FZBsCo_ioV5f7E2g_0uu2iUKs8WBXRqK2uSKnp1pzuce_ITrym2Skd0nYLRfUnmJCaRwUsh1TfProX9oHsPeZt-cwtlg2SlHx07iV5U6RG8I2_kKJAXqKSri2-oLFeumFhw4HB3gCLAKETmAAnM19PBL8MRFKKx0INGOmRaTfk48Vhr76YLvYcDlsHpQQ6DGIadV85OqndW-Wq1jXgBLtccB97Nk2JUixOE715Jk2rXJ9zAPbySDvKp0'

export default function Home() {
  const { t } = useTranslation()

  return (
    <PublicLayout>
      <PageSEO titleKey="seo.home_title" descKey="seo.home_desc" path="/" />
      <RestaurantJsonLD />

      {/* ── Hero ── */}
      <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={IMG_HERO}
            alt="Intérieur du restaurant"
            className="w-full h-full object-cover brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-6xl">
          <h1 className="font-headline text-6xl md:text-[9rem] text-white mb-6 leading-[0.9] tracking-tighter uppercase font-light">
            {/* TODO: remplacer par le nom définitif du restaurant */}
            ALGIERS<br />GASTRONOMY
          </h1>
          <p className="font-body text-sm md:text-base text-white/80 mb-12 tracking-[0.2em] uppercase font-light max-w-2xl mx-auto">
            {t('home.sous_titre')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/reservation"
              className="bg-primary text-white px-12 py-4 font-label text-[10px] tracking-[0.25em] uppercase hover:bg-primary-container transition-all duration-300 w-64 text-center"
            >
              {t('home.cta_reserver')}
            </Link>
            <Link
              to="/menu"
              className="border border-white/40 text-white px-12 py-4 font-label text-[10px] tracking-[0.25em] uppercase hover:bg-white hover:text-charcoal transition-all duration-300 backdrop-blur-sm w-64 text-center"
            >
              {t('home.cta_carte')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-surface py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-0">
          <div className="text-center md:border-r border-stone-200 px-8">
            <span className="block font-headline text-5xl text-primary mb-3 font-light">30</span>
            <span className="block font-label text-[9px] tracking-[0.4em] uppercase text-stone-400 font-medium">
              {t('home.tables')}
            </span>
          </div>
          <div className="text-center md:border-r border-stone-200 px-8">
            <span className="block font-headline text-5xl text-primary mb-3 font-light">100%</span>
            <span className="block font-label text-[9px] tracking-[0.4em] uppercase text-stone-400 font-medium">
              {t('home.maison')}
            </span>
          </div>
          <div className="text-center px-8">
            <span className="block font-headline text-4xl text-primary mb-3 font-light uppercase">
              {t('home.ouverture_date')}
            </span>
            <span className="block font-label text-[9px] tracking-[0.4em] uppercase text-stone-400 font-medium">
              {t('home.ouverture')}
            </span>
          </div>
        </div>
      </section>

      {/* ── Section éditoriale — Menu ── */}
      <section className="bg-surface py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

          {/* Texte */}
          <div className="order-2 lg:order-1 max-w-lg">
            <span className="font-label text-[9px] tracking-[0.5em] uppercase text-primary mb-8 block font-semibold">
              {t('home.saveurs_label')}
            </span>
            <h2 className="font-headline text-5xl md:text-7xl text-charcoal mb-10 leading-[1.1] font-light">
              {t('home.saveurs_titre')}
            </h2>
            <p className="font-body text-stone-500 text-[15px] leading-loose mb-12 font-light">
              {t('home.saveurs_texte')}
            </p>
            <Link
              to="/menu"
              className="group inline-flex items-center font-label text-[9px] tracking-[0.4em] uppercase text-charcoal border-b border-transparent hover:border-primary transition-all pb-1"
            >
              {t('home.voir_carte')}
              <span className="ml-3 text-primary group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          </div>

          {/* Images */}
          <div className="order-1 lg:order-2 relative">
            {/* TODO: remplacer par une vraie photo du restaurant (plat signature) */}
            <div className="aspect-[4/5] bg-surface-container overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1tTL8XkGgtZGmttiiCb4r1cvfy-0-cR7QVJOaMdW2730zYSjxyITH23IyoyEJu4kqNE5BH7q6X2Mc6WwZJYj9JOPQ3HSQ_982MW9wzdgcJSWLnH62_qd_K7ufh5aXmhNwVd9YQUWi8bNdFLA5-1aycwUSefOqHirev4NukQSK6qyl26azf84Ts6Sijnf97qiP7GF4Qi745BJE0NdnPTlZuX6mmmNKn1jadx7a41Cxn5_mFmo8QOhCCvznmfOJO9W1lYtG8JR3pIH1"
                alt="Gastronomie algérienne"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Petite image épices superposée */}
            <div className="absolute -bottom-16 -left-16 hidden md:block w-56 aspect-square bg-white p-3 shadow-desert">
              <img
                src={IMG_SPICES}
                alt="Épices"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Statement — fond sombre ── */}
      <section className="bg-[#0a0a0a] py-32 md:py-48 px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-5xl md:text-8xl text-white mb-10 italic font-light">
            {t('home.statement_titre')}
          </h2>
          <p className="font-body text-stone-400 mb-16 max-w-2xl mx-auto text-sm md:text-base tracking-wide leading-relaxed font-light">
            {t('home.statement_texte')}
          </p>
          <Link
            to="/reservation"
            className="inline-block bg-primary text-white px-16 py-5 font-label text-[10px] tracking-[0.4em] uppercase hover:bg-primary-container transition-all duration-300"
          >
            {t('home.statement_cta')}
          </Link>
        </div>
      </section>

    </PublicLayout>
  )
}
