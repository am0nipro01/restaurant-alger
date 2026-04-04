import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PublicLayout from '../../components/layout/PublicLayout'
import PageSEO from '../../components/seo/PageSEO'

// TODO: remplacer par les vraies photos du restaurant
const IMG_HERO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ-0g7K7beNtSDfAJ6uVAeJewfySOHdLsb2pkJrdHi9KctI2UGY9YksQXiCF4fFE5YP8VV6d1La68MlA25hQwRiCM0BancOyK0YaKdL4dXUE98cXWJLkPrrrlaCl59l6q2kZYe_IelLdp6A_q-eVh1WFWMKzMVEvF_MqXWmdFGKRQLPI0zaN_bivwuXNqjRTsTmGRU9-6sn30wrDTQapBLSF0ckXqgeAxjPdobqKnX_elZcUxa8PJ0ooDtONfGtxLw40_Nt4B56KVQ'
const IMG_INTERIOR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx399d3NoTwMRQ47ePXVE0M4UxS0pMFKLBqXKWKxevh_d22L6LfzbHakCBn-kRKbSu0K5CnlEsQ4_2Q-cAeW70lwej_foR2giWCqKh6l0CgqszgmjvW6Sh963etvu34l88byvXi03R_C5ZyuisIu5Af1VpXcJTNo5UlyiBhln6X499hEZk6xmjD5ntp2JJGUwIxb3Yxljy2ugWZghrvqBbKM5DcNAiMn3K4baEENALlpPuYbKFbjMP-kRMscfVfLIc3_-jpyJJe0mE'
const IMG_CHEF_HANDS = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuUIwRX61fURzwRYAeejy0kgnlD0DjlHKlH8jYZLSgT4fbSMsygmyRkNJE7urLxL2H1g0cGBHSUfbTxwv8zMZnj35uqGj8Mz9DZL83nTFrEVz2sU65zJUQv5Ey0jQb8krqhKi_qCYY1cXlXwJXmhAI4mURmas662Cgtacjnbxhd1R3df14-hnHCSkAfmhEXnuJsjIXvxAS6zvk4B_Sa9l7Mst9hLngc5c_5H6EkbmfydEnzT0V5MiGcfgjdj2BQvd8LtpTKVVF3pLW'

// TODO: remplacer par les vraies photos de l'équipe
const TEAM = [
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuyyD6sHgEK4wMkp3VSAVtdsrpWrXcs_A_XSFE6GAEMCrHWhb-fC6Ub793q9gwWhxBm5K8CeFLrinpOOxbd4vDWsabMaV-uWHaVYl2whwwNILTYMnUIXqwAwn-vJfuN1mFyYrbf_m6BTU8yv8NwYI0_WcL3hBjL2Gj8RIS64C_cCvXUFBNwk-1WAuzDo_mhQOViw7tsUnqZGMlG3o0LgQRnuldTJmh2y-qjchpP7U-7I0bXMJysyMKJxDkKjOgGehEpMc0bBFB6id-',
    nom: 'Yasmine Amara',
    role: 'Chef de Cuisine',
    bio: 'Inspirée par les recettes de sa grand-mère kabyle, Yasmine réinterprète les classiques avec une rigueur géométrique.',
    offset: '',
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4ItzasIfqu1J3hdAZK1aZimPuUwJu4g6eK9CvS56iJqvU_5qXUcosyCxRdXdijaEf70iqhC7vSRHV-8g6tWlUyH-D8gfoQI17Cr9pwcPzgqNpQApKT-jo1EfTkLVs1egx1nTDfe-7s-vDVH4j_EZ8NXwazqlvKnXBa90OEZLVmm7xWXHlHjIabn6kB09vr-Yqw5zgvOjJZk7ICwse3rXxJvjkksH1wZyypChiF8p8dmZOb-7BAsxyRkgvVNXTbnTUBHb6U_xSRFpH',
    nom: 'Malik Benali',
    role: "Maître d'Hôtel",
    bio: "L'art de l'accueil est sa seconde nature. Malik orchestre le service comme une chorégraphie silencieuse.",
    offset: 'md:mt-16',
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA3fIbzIgvYXF_7WooZXangSV548TrWI3MO8DGfTQhki76aGPl-RwKWvLzXE45Pyz4hDJvK8_vHn-UwKyl5mfSOIXSyonIWD5GzvHkUwH3dE0OBdceqoY7xzqMhtJPqB4LLyMQx0Ai7DyheZe5RuP4A82x_xodXH0HkQlojG9wPizdNz7XNu3fh5hH0sAEhp7AAA26UQIRvLndwDdjZG76fRPcc_k19VOqW1yUcv7wOa7ltBkOVwt-IuuxwnpvxAHqSJUQYgyyR6-N',
    nom: 'Samy Khelil',
    role: 'Chef Pâtissier',
    bio: 'Architecte du sucré, Samy transforme les dattes et le miel en de véritables sculptures éphémères.',
    offset: 'md:mt-32',
  },
]

export default function NotreHistoire() {
  const { t } = useTranslation()

  return (
    <PublicLayout>
      <PageSEO titleKey="seo.histoire_title" descKey="seo.histoire_desc" path="/notre-histoire" />

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-gradient-to-b from-primary to-transparent" />
        <div className="z-10 text-center space-y-6 max-w-4xl px-6">
          <span className="block font-label text-primary tracking-[0.4em] uppercase text-xs opacity-80 mb-4">
            {t('histoire.heritage_label')}
          </span>
          <h1 className="font-headline text-7xl md:text-9xl text-charcoal -tracking-[0.03em] leading-none">
            {t('histoire.titre')}
          </h1>
          <div className="w-px h-24 bg-primary/30 mx-auto mt-12" />
        </div>
        {/* Image tagine — coin inférieur droit */}
        <div className="absolute bottom-0 right-0 w-1/3 aspect-[4/5] bg-surface-container-low hidden lg:block overflow-hidden">
          <img
            src={IMG_HERO}
            alt="Céramique algérienne"
            className="w-full h-full object-cover grayscale contrast-125 opacity-40"
          />
        </div>
      </section>

      {/* ── Section éditoriale ── */}
      <section className="py-32 md:py-52 px-6 md:px-12 bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-16">

          {/* Citation asymétrique gauche */}
          <div className="md:col-start-2 md:col-span-5">
            <p className="font-headline text-3xl md:text-5xl leading-tight text-stone-600">
              {t('histoire.intro_citation')}
            </p>
          </div>

          {/* Texte corps droite */}
          <div className="md:col-start-8 md:col-span-4 space-y-8 font-body text-lg leading-relaxed text-stone-500 font-light">
            <p>{t('histoire.intro_p1')}</p>
            <p>{t('histoire.intro_p2')}</p>
          </div>

          {/* Grille 2 images pleine largeur */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
            <div className="relative aspect-[3/4] overflow-hidden group">
              <img
                src={IMG_INTERIOR}
                alt="Intérieur du restaurant"
                className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/5" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden group md:mt-24">
              <img
                src={IMG_CHEF_HANDS}
                alt="Chef en cuisine"
                className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/5" />
            </div>
          </div>

          {/* L'Essence de la Modernité */}
          <div className="md:col-start-4 md:col-span-6 mt-32 space-y-12">
            <h3 className="font-headline text-4xl text-charcoal">
              {t('histoire.modernite_titre')}
            </h3>
            <div className="space-y-6 text-stone-500 leading-relaxed text-lg font-body font-light">
              <p>{t('histoire.modernite_p1')}</p>
              <p>{t('histoire.modernite_p2')}</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Équipe ── */}
      <section className="py-32 px-6 md:px-12 bg-[#efeeea]">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 gap-6">
            <div className="space-y-4">
              <span className="block font-label text-primary tracking-[0.3em] uppercase text-[10px]">
                {t('histoire.collectif_label')}
              </span>
              <h2 className="font-headline text-5xl md:text-7xl text-charcoal">
                {t('histoire.collectif_titre')}
              </h2>
            </div>
            <div className="max-w-md">
              <p className="font-body text-stone-500 leading-relaxed">
                {t('histoire.collectif_desc')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24">
            {TEAM.map((membre) => (
              <div key={membre.nom} className={`space-y-8 ${membre.offset}`}>
                <div className="aspect-square bg-[#e3e2df] overflow-hidden">
                  <img
                    src={membre.img}
                    alt={membre.nom}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-headline text-2xl">{membre.nom}</h4>
                  <p className="font-label text-xs tracking-widest text-primary uppercase">{membre.role}</p>
                  <p className="text-sm text-stone-500 leading-relaxed pt-4">{membre.bio}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-52 px-6 text-center bg-surface relative overflow-hidden">
        {/* Watermark typographique */}
        <div className="absolute inset-0 z-0 opacity-5 flex items-center justify-center pointer-events-none">
          <span className="font-headline text-[30vw] whitespace-nowrap -tracking-widest select-none">
            GASTRONOMY
          </span>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-12">
          <h2 className="font-headline text-5xl md:text-7xl leading-tight">
            {t('histoire.cta_titre')}
          </h2>
          <p className="font-body text-lg text-stone-400 font-light">
            {t('histoire.cta_desc')}
          </p>
          <div className="pt-8">
            <Link
              to="/reservation"
              className="inline-block bg-primary text-white px-16 py-6 font-label tracking-widest uppercase text-sm hover:bg-primary-container transition-all duration-500"
            >
              {t('histoire.cta_btn')}
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
