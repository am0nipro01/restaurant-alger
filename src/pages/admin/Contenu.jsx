import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import pb from '../../lib/pocketbase'

const PAGES = [
  { key: 'histoire', label: 'Notre Histoire' },
  { key: 'equipe', label: 'L\'Équipe' },
  { key: 'contact', label: 'Contact' },
]

export default function Contenu() {
  const [pageActive, setPageActive] = useState('histoire')
  const [enregistrements, setEnregistrements] = useState({}) // { page_langue: record }
  const [loading, setLoading] = useState(true)
  const [sauvegarde, setSauvegarde] = useState(null) // null | 'ok' | 'erreur'

  const langues = ['fr', 'ar', 'en']
  const [langueActive, setLangueActive] = useState('fr')

  const charger = async () => {
    setLoading(true)
    try {
      const data = await pb.collection('pages_contenu').getFullList()
      const map = {}
      data.forEach((r) => {
        map[`${r.page}_${r.langue}`] = r
      })
      setEnregistrements(map)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { charger() }, [])

  const cle = `${pageActive}_${langueActive}`
  const enregistrement = enregistrements[cle]

  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')

  // Charger les valeurs quand on change de page ou de langue
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
        await pb.collection('pages_contenu').create({
          page: pageActive,
          langue: langueActive,
          titre,
          contenu,
        })
      }
      await charger()
      setSauvegarde('ok')
      setTimeout(() => setSauvegarde(null), 3000)
    } catch (e) {
      console.error(e)
      setSauvegarde('erreur')
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-8">Contenu des pages</h1>

      {/* Sélection de la page */}
      <div className="flex gap-2 mb-6">
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPageActive(p.key)}
            className={`text-sm px-4 py-1.5 rounded-full border transition ${
              pageActive === p.key
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-500 border-gray-200 hover:border-black'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Sélection de la langue */}
      <div className="flex gap-2 mb-6">
        {langues.map((l) => (
          <button
            key={l}
            onClick={() => setLangueActive(l)}
            className={`text-xs px-3 py-1 rounded-full border transition uppercase tracking-wide ${
              langueActive === l
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-400 border-gray-200 hover:border-black'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Chargement...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Titre de la page</label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder={`Titre en ${langueActive.toUpperCase()}`}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Contenu</label>
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              rows={12}
              placeholder={`Contenu de la page en ${langueActive.toUpperCase()}...`}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black resize-y font-mono"
              dir={langueActive === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="flex items-center justify-between">
            {sauvegarde === 'ok' && (
              <span className="text-sm text-green-600">✓ Sauvegardé</span>
            )}
            {sauvegarde === 'erreur' && (
              <span className="text-sm text-red-500">Erreur lors de la sauvegarde</span>
            )}
            {!sauvegarde && <span />}

            <button
              onClick={sauvegarder}
              className="bg-black text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
