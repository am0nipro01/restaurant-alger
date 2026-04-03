import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import pb from '../../lib/pocketbase'

const PAGES = [
  { key: 'histoire', label: 'Notre Histoire' },
  { key: 'equipe',   label: "L'Équipe" },
  { key: 'contact',  label: 'Contact' },
]

const LANGUES = ['fr', 'en', 'ar']

const IconTranslate = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <path d="M3 5h12M9 3v2M5 11l5-5 5 5M12 19l5-5M17 21l5-5M12 14h10"/>
  </svg>
)

const IconImage = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" className="text-stone-400">
    <rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
)

const inputClass = 'w-full bg-transparent border-0 border-b border-stone-200 py-4 font-headline text-3xl focus:outline-none focus:border-primary transition-colors placeholder:text-stone-200 text-charcoal'
const bodyClass  = 'w-full bg-transparent border-0 border-l border-stone-200 px-8 py-2 font-body text-base leading-relaxed focus:outline-none focus:border-primary transition-colors text-stone-700 resize-none'

export default function Contenu() {
  const [pageActive, setPageActive]     = useState('histoire')
  const [langueActive, setLangueActive] = useState('fr')
  const [enregistrements, setEnregistrements] = useState({})
  const [loading, setLoading]   = useState(true)
  const [sauvegarde, setSauvegarde] = useState(null) // null | 'ok' | 'erreur'
  const [titre, setTitre]   = useState('')
  const [contenu, setContenu] = useState('')

  const charger = async () => {
    setLoading(true)
    try {
      const data = await pb.collection('pages_contenu').getFullList()
      const map = {}
      data.forEach((r) => { map[`${r.page}_${r.langue}`] = r })
      setEnregistrements(map)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { charger() }, [])

  const cle = `${pageActive}_${langueActive}`
  const enregistrement = enregistrements[cle]

  useEffect(() => {
    if (enregistrement) {
      setTitre(enregistrement.titre || '')
      setContenu(enregistrement.contenu || '')
    } else {
      setTitre('')
      setContenu('')
    }
  }, [cle, enregistrement?.id])

  const sauvegarder = async () => {
    setSauvegarde(null)
    try {
      if (enregistrement) {
        await pb.collection('pages_contenu').update(enregistrement.id, { titre, contenu })
      } else {
        await pb.collection('pages_contenu').create({ page: pageActive, langue: langueActive, titre, contenu })
      }
      await charger()
      setSauvegarde('ok')
      setTimeout(() => setSauvegarde(null), 3000)
    } catch (e) {
      console.error(e)
      setSauvegarde('erreur')
    }
  }

  const reinitialiser = () => {
    if (enregistrement) {
      setTitre(enregistrement.titre || '')
      setContenu(enregistrement.contenu || '')
    } else {
      setTitre(''); setContenu('')
    }
  }

  return (
    <AdminLayout>

      {/* ── Header ── */}
      <header className="mb-16 max-w-5xl">
        <div className="flex justify-between items-end border-b border-stone-100 pb-8">
          <div>
            <h2 className="font-headline text-4xl text-charcoal tracking-tight">Gestion du Contenu</h2>
            <p className="text-stone-400 mt-2 font-body text-sm italic">Curate the editorial narrative of Algiers Gastronomy</p>
          </div>
          <button
            onClick={sauvegarder}
            className="bg-primary px-14 py-4 text-white font-body text-xs tracking-[0.2em] uppercase hover:bg-primary-container transition-colors duration-300"
          >
            Enregistrer
          </button>
        </div>
      </header>

      {loading ? (
        <div className="text-stone-400 text-sm tracking-widest uppercase text-center py-24">Chargement…</div>
      ) : (
        <div className="max-w-5xl grid grid-cols-12 gap-12">

          {/* ── Sidebar gauche ── */}
          <div className="col-span-3 space-y-12">

            {/* Pages */}
            <section>
              <label className="block font-label text-[10px] tracking-[0.2em] uppercase text-primary font-bold mb-6">
                Page
              </label>
              <div className="space-y-4">
                {PAGES.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPageActive(p.key)}
                    className={`w-full text-left font-body text-sm tracking-wide pb-2 border-b transition-colors ${
                      pageActive === p.key
                        ? 'border-primary text-charcoal'
                        : 'border-transparent text-stone-400 hover:text-charcoal'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Langue */}
            <section>
              <label className="block font-label text-[10px] tracking-[0.2em] uppercase text-primary font-bold mb-6">
                Langue
              </label>
              <div className="flex gap-2">
                {LANGUES.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLangueActive(l)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide border transition-all ${
                      langueActive === l
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-stone-200 text-stone-400 hover:border-stone-400 hover:text-charcoal'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </section>

            {/* Note éditoriale */}
            <section className="pt-8">
              <div className="bg-[#f4f4f0] p-6 space-y-4">
                <h4 className="font-headline text-sm italic text-stone-500">Note de Rédaction</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Le texte doit refléter l'héritage culinaire algérien avec élégance et précision. Évitez les superlatifs excessifs.
                </p>
              </div>
            </section>
          </div>

          {/* ── Éditeur principal ── */}
          <div className="col-span-9">
            <div className="bg-white p-10 space-y-12">

              {/* Titre */}
              <div className="space-y-4">
                <label className="block font-label text-[10px] tracking-[0.2em] uppercase text-stone-400">
                  Titre de la Section
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Titre…"
                />
              </div>

              {/* Image placeholder */}
              <div className="relative group cursor-pointer aspect-video bg-[#e9e8e4] overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-900/5 group-hover:bg-stone-900/10 transition-colors">
                  <IconImage />
                  <span className="text-[10px] tracking-widest uppercase text-stone-500">
                    Remplacer l'image de couverture
                  </span>
                </div>
              </div>

              {/* Corps du texte */}
              <div className="space-y-4">
                <label className="block font-label text-[10px] tracking-[0.2em] uppercase text-stone-400">
                  Corps du Texte ({langueActive.toUpperCase()})
                </label>
                <textarea
                  rows={10}
                  className={bodyClass}
                  value={contenu}
                  onChange={(e) => setContenu(e.target.value)}
                  dir={langueActive === 'ar' ? 'rtl' : 'ltr'}
                  placeholder="Rédigez le contenu ici…"
                />
              </div>

              {/* Aperçu arabe (si langue = ar) */}
              {langueActive === 'ar' && contenu && (
                <div className="border-t border-stone-100 pt-12">
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-label text-[10px] tracking-[0.2em] uppercase text-stone-400">
                      Aperçu Arabe (RTL Mode)
                    </label>
                    <IconTranslate />
                  </div>
                  <div
                    className="font-body text-xl leading-loose text-stone-600 bg-[#f4f4f0]/30 p-8 text-right"
                    dir="rtl"
                  >
                    {contenu}
                  </div>
                </div>
              )}
            </div>

            {/* Actions secondaires */}
            <div className="mt-12 flex justify-end gap-8 items-center">
              {sauvegarde === 'ok' && (
                <span className="text-xs text-green-600 tracking-wider uppercase">✓ Enregistré</span>
              )}
              {sauvegarde === 'erreur' && (
                <span className="text-xs text-red-500 tracking-wider uppercase">Erreur lors de la sauvegarde</span>
              )}
              <button
                type="button"
                onClick={reinitialiser}
                className="text-xs tracking-[0.2em] uppercase text-stone-400 hover:text-red-500 transition-colors"
              >
                Réinitialiser les modifications
              </button>
              <button
                type="button"
                onClick={sauvegarder}
                className="bg-charcoal px-14 py-4 text-white font-body text-xs tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors duration-300"
              >
                Publier en ligne
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Accent décoratif */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-screen bg-[#efeeea]/50 pointer-events-none" />

    </AdminLayout>
  )
}
