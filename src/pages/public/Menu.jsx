import { useEffect, useState } from 'react'
import pb from '../../lib/pocketbase'

export default function Menu() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [categorieActive, setCategorieActive] = useState(null)

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
        if (cats.length > 0) setCategorieActive(cats[0].id)
      } catch (e) {
        console.error('Erreur chargement menu:', e)
      }
      setLoading(false)
    }
    charger()
  }, [])

  const platsFiltres = categorieActive
    ? items.filter((item) => item.categorie === categorieActive)
    : items

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Chargement du menu...</p>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Le menu n'est pas encore disponible.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="py-20 text-center border-b border-gray-100">
        <h1 className="text-4xl font-semibold tracking-tight mb-3">Notre Carte</h1>
        <p className="text-gray-400 text-sm">Cuisine algérienne traditionnelle et gastronomique</p>
      </div>

      {/* Onglets catégories */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 flex gap-0 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategorieActive(cat.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                categorieActive === cat.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              {cat.nom}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des plats */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {platsFiltres.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">
            Aucun plat disponible dans cette catégorie.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100">
            {platsFiltres.map((plat) => (
              <div key={plat.id} className="py-6 flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="font-medium text-base mb-1">{plat.nom}</h3>
                  {plat.description && (
                    <p className="text-sm text-gray-400 leading-relaxed">{plat.description}</p>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 flex-shrink-0 pt-0.5">
                  {plat.prix.toLocaleString('fr-DZ')} DA
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer menu */}
      <div className="border-t border-gray-100 py-10 text-center">
        <p className="text-xs text-gray-300">
          La carte peut évoluer selon les saisons et les arrivages.
        </p>
      </div>
    </div>
  )
}
