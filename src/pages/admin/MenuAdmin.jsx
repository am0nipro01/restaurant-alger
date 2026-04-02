import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import pb from '../../lib/pocketbase'

export default function MenuAdmin() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Formulaire nouvelle catégorie
  const [nouvelleCategorie, setNouvelleCategorie] = useState('')

  // Formulaire nouveau plat
  const [nouveauPlat, setNouveauPlat] = useState({
    nom: '', description: '', prix: '', categorie: '', disponible: true, ordre: 0,
  })

  const [modePlat, setModePlat] = useState(null) // null | 'ajout'

  const charger = async () => {
    setLoading(true)
    try {
      const [cats, plats] = await Promise.all([
        pb.collection('menu_categories').getFullList({ sort: 'ordre' }),
        pb.collection('menu_items').getFullList({ sort: 'ordre', expand: 'categorie' }),
      ])
      setCategories(cats)
      setItems(plats)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { charger() }, [])

  // Ajouter une catégorie
  const ajouterCategorie = async (e) => {
    e.preventDefault()
    if (!nouvelleCategorie.trim()) return
    try {
      await pb.collection('menu_categories').create({
        nom: nouvelleCategorie.trim(),
        ordre: categories.length + 1,
      })
      setNouvelleCategorie('')
      charger()
    } catch (err) {
      console.error(err)
    }
  }

  // Supprimer une catégorie
  const supprimerCategorie = async (id) => {
    if (!confirm('Supprimer cette catégorie ? Les plats associés resteront mais sans catégorie.')) return
    try {
      await pb.collection('menu_categories').delete(id)
      charger()
    } catch (err) {
      console.error(err)
    }
  }

  // Ajouter un plat
  const ajouterPlat = async (e) => {
    e.preventDefault()
    try {
      await pb.collection('menu_items').create({
        ...nouveauPlat,
        prix: parseFloat(nouveauPlat.prix),
        ordre: items.length + 1,
      })
      setNouveauPlat({ nom: '', description: '', prix: '', categorie: '', disponible: true, ordre: 0 })
      setModePlat(null)
      charger()
    } catch (err) {
      console.error(err)
    }
  }

  // Basculer disponibilité d'un plat
  const toggleDisponible = async (id, actuel) => {
    try {
      await pb.collection('menu_items').update(id, { disponible: !actuel })
      charger()
    } catch (err) {
      console.error(err)
    }
  }

  // Supprimer un plat
  const supprimerPlat = async (id) => {
    if (!confirm('Supprimer ce plat ?')) return
    try {
      await pb.collection('menu_items').delete(id)
      charger()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-8">Menu</h1>

      {loading ? (
        <p className="text-gray-400 text-sm">Chargement...</p>
      ) : (
        <div className="flex flex-col gap-10">

          {/* Section Catégories */}
          <section>
            <h2 className="text-base font-semibold mb-4">Catégories</h2>
            <div className="flex flex-col gap-2 mb-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-lg px-4 py-3 shadow-sm flex items-center justify-between">
                  <span className="text-sm font-medium">{cat.nom}</span>
                  <button
                    onClick={() => supprimerCategorie(cat.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={ajouterCategorie} className="flex gap-2">
              <input
                type="text"
                value={nouvelleCategorie}
                onChange={(e) => setNouvelleCategorie(e.target.value)}
                placeholder="Nouvelle catégorie (ex: Entrées)"
                className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Ajouter
              </button>
            </form>
          </section>

          {/* Section Plats */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Plats</h2>
              <button
                onClick={() => setModePlat(modePlat ? null : 'ajout')}
                className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                {modePlat ? 'Annuler' : '+ Ajouter un plat'}
              </button>
            </div>

            {/* Formulaire ajout plat */}
            {modePlat === 'ajout' && (
              <form onSubmit={ajouterPlat} className="bg-white rounded-xl p-6 shadow-sm mb-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">Nom du plat *</label>
                    <input
                      type="text"
                      required
                      value={nouveauPlat.nom}
                      onChange={(e) => setNouveauPlat(p => ({ ...p, nom: e.target.value }))}
                      className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">Prix (DZD) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={nouveauPlat.prix}
                      onChange={(e) => setNouveauPlat(p => ({ ...p, prix: e.target.value }))}
                      className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Description</label>
                  <textarea
                    rows={2}
                    value={nouveauPlat.description}
                    onChange={(e) => setNouveauPlat(p => ({ ...p, description: e.target.value }))}
                    className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Catégorie *</label>
                  <select
                    required
                    value={nouveauPlat.categorie}
                    onChange={(e) => setNouveauPlat(p => ({ ...p, categorie: e.target.value }))}
                    className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="">-- Choisir --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white text-sm py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Enregistrer le plat
                </button>
              </form>
            )}

            {/* Liste des plats par catégorie */}
            {categories.map((cat) => {
              const platsCategorie = items.filter(
                (item) => item.categorie === cat.id || item.expand?.categorie?.id === cat.id
              )
              return (
                <div key={cat.id} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">{cat.nom}</h3>
                  {platsCategorie.length === 0 ? (
                    <p className="text-sm text-gray-300 italic pl-2">Aucun plat dans cette catégorie.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {platsCategorie.map((plat) => (
                        <div key={plat.id} className="bg-white rounded-lg px-4 py-3 shadow-sm flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${!plat.disponible ? 'text-gray-300 line-through' : ''}`}>
                                {plat.nom}
                              </span>
                              {!plat.disponible && (
                                <span className="text-xs text-gray-300">(indisponible)</span>
                              )}
                            </div>
                            {plat.description && (
                              <p className="text-xs text-gray-400 mt-0.5">{plat.description}</p>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-600 flex-shrink-0">
                            {plat.prix.toLocaleString('fr-DZ')} DA
                          </span>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => toggleDisponible(plat.id, plat.disponible)}
                              className={`text-xs px-3 py-1.5 rounded-lg transition ${
                                plat.disponible
                                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  : 'bg-green-50 text-green-700 hover:bg-green-100'
                              }`}
                            >
                              {plat.disponible ? 'Désactiver' : 'Activer'}
                            </button>
                            <button
                              onClick={() => supprimerPlat(plat.id)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </section>
        </div>
      )}
    </AdminLayout>
  )
}
