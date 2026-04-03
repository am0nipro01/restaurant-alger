import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import pb from '../../lib/pocketbase'
import PublicLayout from '../../components/layout/PublicLayout'

// TODO: remplacer par une vraie photo du restaurant (plat en céramique)
const IMG_INTERLUDE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwVW0Eq_sqTB9h9KpegZqn5dBA9kwnAnaZ5LldBeZQypR3SHwO3xpThiL6CnVgnLaJULvAy3VE4MifMBMVQY_mXd8CHCw_nJkWcz9Z2BNHJkprTPNeCzTvG4utqtBgP5JIKCvEDeANFNtfa19ZHTbHUZAwGIBySAuZ66FIZJZ8qU188ZgAnBJskjuwlmXcdO3n5L-0gDZXXVG7psW90seT-oCfzAeOEiJaP56Yzttye4aCNGPgF3a8046Og-Khxjd739BLCzH4KsEx'

export default function Menu() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const charger = async () => {
      try {
        const [cats, plats] = await Promise.all([
          pb.collection('menu_categories').getFullList({ sort: 'ordre' }),
          pb.collection('menu_items').getFullList({
            sort: 'ordre',
            filter: 'disponible = true',
          }),
        ])
        setCategories(cats)
        setItems(plats)
      } catch (e) {
        console.error('Erreur chargement menu:', e)
      }
      setLoading(false)
    }
    charger()
  }, [])

  const itemsParCategorie = (catId) => items.filter((item) => item.categorie === catId)

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="font-label text-[10px] tracking-[0.3em] uppercase text-stone-400">
            {t('menu.chargement')}
          </p>
        </div>
      </PublicLayout>
    )
  }

  if (categories.length === 0) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="font-label text-[10px] tracking-[0.3em] uppercase text-stone-400">
            {t('menu.indisponible')}
          </p>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>

      {/* ── Hero + Navigation catégories ── */}
      <header className="pt-40 pb-0 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end gap-8 mb-16">
          <div className="w-full md:w-2/3">
            <h1 className="font-headline text-7xl md:text-9xl text-charcoal leading-tight tracking-tighter uppercase">
              {t('menu.titre')}
            </h1>
            <p className="font-headline italic text-xl md:text-2xl text-stone-500 mt-6 max-w-xl">
              {t('menu.hero_sous_titre')}
            </p>
          </div>
        </div>

        {/* Navigation par ancres — sticky sous la navbar */}
        <div className="sticky top-[72px] z-40 bg-[#faf9f5]/95 backdrop-blur-sm py-8 border-b border-stone-200/40">
          <ul className="flex flex-wrap justify-center md:justify-start gap-10 md:gap-12 font-label text-xs tracking-[0.2em] uppercase">
            {categories.map((cat, idx) => (
              <li key={cat.id}>
                <a
                  href={`#cat-${cat.id}`}
                  className={`transition-colors duration-300 ${
                    idx === 0
                      ? 'text-primary font-bold'
                      : 'text-stone-400 hover:text-primary'
                  }`}
                >
                  {cat.nom}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ── Contenu du menu ── */}
      <main className="px-6 md:px-12 max-w-7xl mx-auto pb-32">

        {categories.map((cat, catIdx) => (
          <div key={cat.id}>

            {/* Section catégorie */}
            <section id={`cat-${cat.id}`} className="mb-32 pt-20">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                {/* Gauche — titre sticky + description */}
                <div className="md:col-span-4">
                  <h2 className="font-headline text-4xl text-charcoal md:sticky top-[140px]">
                    {cat.nom}
                  </h2>
                  {cat.description && (
                    <p className="font-body text-sm text-stone-500 mt-4 max-w-xs">
                      {cat.description}
                    </p>
                  )}
                </div>

                {/* Droite — liste des plats */}
                <div className="md:col-span-8 flex flex-col gap-12">
                  {itemsParCategorie(cat.id).length === 0 ? (
                    <p className="font-label text-[10px] tracking-[0.3em] uppercase text-stone-400">
                      {t('menu.vide')}
                    </p>
                  ) : (
                    itemsParCategorie(cat.id).map((item) => (
                      <div key={item.id} className="group border-b border-stone-200/60 pb-8">
                        <div className="flex justify-between items-baseline mb-2 gap-6">
                          <h3 className="font-headline text-2xl group-hover:text-primary transition-colors duration-300">
                            {item.nom}
                          </h3>
                          <span className="font-body font-light text-primary flex-shrink-0">
                            {item.prix.toLocaleString('fr-DZ')} DA
                          </span>
                        </div>
                        {item.description && (
                          <p className="font-body font-light text-stone-500 text-sm leading-relaxed max-w-lg">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Interlude visuel après la première catégorie */}
            {catIdx === 0 && (
              <div className="mb-32 w-full grid grid-cols-12">
                <div className="col-span-1 md:col-span-2" />
                <div className="col-span-11 md:col-span-10 relative h-[500px]">
                  {/* TODO: remplacer par une vraie photo du restaurant */}
                  <img
                    src={IMG_INTERLUDE}
                    alt="Céramique algérienne"
                    className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentNode.classList.add('bg-surface-container')
                    }}
                  />
                  <div className="absolute -bottom-10 -left-10 md:-left-20 bg-surface p-12 max-w-sm hidden md:block shadow-desert">
                    <p className="font-headline italic text-lg leading-relaxed text-stone-500">
                      "{t('menu.citation')}"
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        ))}

        {/* Note de bas de page */}
        <div className="mt-20 text-center">
          <p className="font-headline italic text-stone-400 text-sm tracking-wide">
            {t('menu.footer')}
          </p>
        </div>

      </main>
    </PublicLayout>
  )
}
