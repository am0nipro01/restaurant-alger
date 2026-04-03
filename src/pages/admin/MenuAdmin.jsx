import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import pb from '../../lib/pocketbase'

// ── Icônes SVG
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconDelete = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)

const inputClass = 'border-0 border-b border-stone-300 bg-transparent py-2 px-0 font-body text-sm text-charcoal placeholder:text-stone-300 focus:outline-none focus:border-b-primary w-full transition-colors'
const labelClass = 'font-label text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400 block mb-2'

const platVide = { nom: '', description: '', prix: '', categorie: '', disponible: true }

export default function MenuAdmin() {
  const [categories, setCategories] = useState([])
  const [items, setItems]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [catActive, setCatActive]   = useState(null)   // id catégorie sélectionnée

  // Formulaires
  const [nouvelleCategorie, setNouvelleCategorie] = useState('')
  const [showAddCat, setShowAddCat] = useState(false)
  const [platForm, setPlatForm]     = useState(platVide)
  const [platModal, setPlatModal]   = useState(null)   // null | 'add' | 'edit'
  const [editId, setEditId]         = useState(null)

  const charger = async () => {
    setLoading(true)
    try {
      const [cats, plats] = await Promise.all([
        pb.collection('menu_categories').getFullList({ sort: 'ordre' }),
        pb.collection('menu_items').getFullList({ sort: 'ordre' }),
      ])
      setCategories(cats)
      setItems(plats)
      if (cats.length > 0 && !catActive) setCatActive(cats[0].id)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { charger() }, [])

  // ── Catégories
  const ajouterCategorie = async (e) => {
    e.preventDefault()
    if (!nouvelleCategorie.trim()) return
    try {
      await pb.collection('menu_categories').create({ nom: nouvelleCategorie.trim(), ordre: categories.length + 1 })
      setNouvelleCategorie(''); setShowAddCat(false); charger()
    } catch (err) { console.error(err) }
  }

  const supprimerCategorie = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    try { await pb.collection('menu_categories').delete(id); charger() }
    catch (err) { console.error(err) }
  }

  // ── Plats
  const ouvrirAjout = () => {
    setPlatForm({ ...platVide, categorie: catActive || '' })
    setEditId(null); setPlatModal('add')
  }

  const ouvrirEdit = (plat) => {
    setPlatForm({ nom: plat.nom, description: plat.description || '', prix: plat.prix, categorie: plat.categorie, disponible: plat.disponible })
    setEditId(plat.id); setPlatModal('edit')
  }

  const soumettreFormPlat = async (e) => {
    e.preventDefault()
    try {
      const data = { ...platForm, prix: parseFloat(platForm.prix) }
      if (platModal === 'add') {
        await pb.collection('menu_items').create({ ...data, ordre: items.length + 1 })
      } else {
        await pb.collection('menu_items').update(editId, data)
      }
      setPlatModal(null); charger()
    } catch (err) { console.error(err) }
  }

  const supprimerPlat = async (id) => {
    if (!confirm('Supprimer ce plat ?')) return
    try { await pb.collection('menu_items').delete(id); charger() }
    catch (err) { console.error(err) }
  }

  const toggleDisponible = async (id, actuel) => {
    try {
      await pb.collection('menu_items').update(id, { disponible: !actuel })
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, disponible: !actuel } : i))
    } catch (err) { console.error(err) }
  }

  const getPhotoUrl = (item) =>
    item.photo ? `${pb.baseUrl}/api/files/${item.collectionId}/${item.id}/${item.photo}` : null

  // ── Données catégorie active
  const cat = categories.find((c) => c.id === catActive)
  const platsCat = items.filter((i) => i.categorie === catActive)
  const actifsCount = platsCat.filter((i) => i.disponible).length

  return (
    <AdminLayout>

      {/* ── Header ── */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-headline text-4xl text-charcoal tracking-tighter mb-2">Carte &amp; Menu</h2>
          <nav className="flex gap-3 text-[10px] font-label tracking-[0.2em] text-stone-400 uppercase">
            <span>Administration</span>
            <span>/</span>
            <span className="text-primary font-bold">Gestion du Menu</span>
          </nav>
        </div>
        <button
          onClick={ouvrirAjout}
          className="bg-primary text-white px-10 py-4 font-label text-[11px] tracking-[0.2em] uppercase hover:bg-primary-container transition-colors duration-300 flex items-center gap-3"
        >
          <IconPlus /> Ajouter un plat
        </button>
      </header>

      {loading ? (
        <div className="text-stone-400 text-sm tracking-widest uppercase text-center py-24">Chargement…</div>
      ) : (
        <div className="grid grid-cols-12 gap-0">

          {/* ── Panneau gauche : catégories ── */}
          <section className="col-span-3 bg-white p-8 border-r border-stone-100 min-h-[600px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-label text-xs font-extrabold tracking-[0.2em] text-charcoal uppercase">Catégories</h3>
              <button onClick={() => setShowAddCat(!showAddCat)} className="text-primary hover:text-primary-container transition-colors">
                <IconPlus />
              </button>
            </div>

            {/* Formulaire ajout catégorie */}
            {showAddCat && (
              <form onSubmit={ajouterCategorie} className="mb-4 flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={nouvelleCategorie}
                  onChange={(e) => setNouvelleCategorie(e.target.value)}
                  placeholder="Nouvelle catégorie"
                  className={inputClass + ' text-xs'}
                />
                <button type="submit" className="text-primary text-xs font-bold uppercase tracking-wider flex-shrink-0">OK</button>
              </form>
            )}

            <ul className="space-y-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setCatActive(c.id)}
                    className={`w-full text-left p-4 flex justify-between items-center group transition-colors ${
                      c.id === catActive
                        ? 'bg-[#f4f4f0] text-primary'
                        : 'text-stone-400 hover:bg-[#f4f4f0] hover:text-charcoal'
                    }`}
                  >
                    <span className={`font-label text-xs tracking-wider uppercase ${c.id === catActive ? 'font-bold' : ''}`}>
                      {c.nom}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); supprimerCategorie(c.id) }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-300 hover:text-red-500"
                    >
                      <IconDelete />
                    </button>
                  </button>
                </li>
              ))}
              {categories.length === 0 && (
                <p className="text-stone-300 text-xs italic p-4">Aucune catégorie</p>
              )}
            </ul>
          </section>

          {/* ── Panneau droit : plats ── */}
          <section className="col-span-9 bg-[#faf9f5] p-12 min-h-[600px]">
            {cat ? (
              <>
                {/* En-tête catégorie */}
                <div className="mb-12 flex justify-between items-end">
                  <div>
                    <h4 className="font-headline text-3xl text-charcoal mb-2">{cat.nom}</h4>
                    {cat.description && (
                      <p className="font-body text-sm text-stone-500 italic max-w-md">{cat.description}</p>
                    )}
                  </div>
                  <div className="flex gap-8">
                    <div className="text-right">
                      <p className="font-label text-[9px] tracking-[0.2em] text-stone-400 uppercase">Items actifs</p>
                      <p className="font-headline text-xl">{actifsCount}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-label text-[9px] tracking-[0.2em] text-stone-400 uppercase">Visibilité</p>
                      <p className="font-headline text-xl text-primary">Publié</p>
                    </div>
                  </div>
                </div>

                {/* Liste plats */}
                {platsCat.length === 0 ? (
                  <p className="text-stone-300 text-sm italic">Aucun plat dans cette catégorie.</p>
                ) : (
                  <div className="space-y-12">
                    {platsCat.map((plat) => {
                      const photo = getPhotoUrl(plat)
                      return (
                        <article
                          key={plat.id}
                          className={`flex gap-8 items-start group ${!plat.disponible ? 'opacity-60' : ''}`}
                        >
                          {/* Image */}
                          <div className="w-32 h-32 bg-[#e9e8e4] flex-shrink-0 overflow-hidden">
                            {photo ? (
                              <img
                                src={photo}
                                alt={plat.nom}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                onError={(e) => { e.target.style.display = 'none' }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs uppercase tracking-widest">
                                Photo
                              </div>
                            )}
                          </div>

                          {/* Infos */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-headline text-lg tracking-tight uppercase leading-tight max-w-xl">
                                {plat.nom}
                              </h5>
                              <span className="font-headline text-lg text-primary flex-shrink-0 ml-4">
                                {Number(plat.prix).toLocaleString('fr-DZ')} DZD
                              </span>
                            </div>
                            {plat.description && (
                              <p className="font-body text-sm text-stone-500 leading-relaxed mb-4 max-w-2xl">
                                {plat.description}
                              </p>
                            )}

                            {/* Toggle + actions */}
                            <div className="flex items-center gap-6">
                              {/* Toggle disponible */}
                              <label className="flex items-center gap-2 cursor-pointer" onClick={() => toggleDisponible(plat.id, plat.disponible)}>
                                <div className="relative inline-flex items-center">
                                  <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${plat.disponible ? 'bg-primary' : 'bg-stone-200'}`}>
                                    <div className={`absolute top-[2px] left-[2px] w-3 h-3 bg-white rounded-full transition-transform duration-200 ${plat.disponible ? 'translate-x-4' : ''}`} />
                                  </div>
                                </div>
                                <span className={`font-label text-[10px] tracking-widest uppercase ${plat.disponible ? 'text-stone-400' : 'text-red-500'}`}>
                                  {plat.disponible ? 'Disponible' : 'Épuisé'}
                                </span>
                              </label>

                              <div className="h-4 w-px bg-stone-100" />

                              {/* Edit + Delete (hover) */}
                              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={() => ouvrirEdit(plat)}
                                  className="text-stone-400 hover:text-charcoal transition-colors"
                                  title="Modifier"
                                >
                                  <IconEdit />
                                </button>
                                <button
                                  onClick={() => supprimerPlat(plat.id)}
                                  className="text-stone-400 hover:text-red-500 transition-colors"
                                  title="Supprimer"
                                >
                                  <IconDelete />
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-stone-300 text-sm italic">Sélectionnez une catégorie</p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── Modal ajout / modification plat ── */}
      {platModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40">
          <div className="bg-white w-full max-w-lg p-12 relative shadow-2xl">
            <button
              onClick={() => setPlatModal(null)}
              className="absolute top-6 right-6 text-stone-300 hover:text-charcoal transition-colors text-xl leading-none"
            >
              ✕
            </button>

            <h3 className="font-headline text-2xl mb-2">
              {platModal === 'add' ? 'Ajouter un plat' : 'Modifier le plat'}
            </h3>
            <div className="h-px w-12 bg-primary mb-10" />

            <form onSubmit={soumettreFormPlat} className="space-y-8">
              <div>
                <label className={labelClass}>Nom du plat *</label>
                <input type="text" required className={inputClass}
                  value={platForm.nom} onChange={(e) => setPlatForm(p => ({ ...p, nom: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Prix (DZD) *</label>
                  <input type="number" required min="0" step="1" className={inputClass}
                    value={platForm.prix} onChange={(e) => setPlatForm(p => ({ ...p, prix: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Catégorie *</label>
                  <select required className={inputClass + ' cursor-pointer'}
                    value={platForm.categorie} onChange={(e) => setPlatForm(p => ({ ...p, categorie: e.target.value }))}>
                    <option value="">— Choisir —</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea rows={3} className={inputClass + ' resize-none'}
                  value={platForm.description} onChange={(e) => setPlatForm(p => ({ ...p, description: e.target.value }))} />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer" onClick={() => setPlatForm(p => ({ ...p, disponible: !p.disponible }))}>
                  <div className="relative inline-flex items-center">
                    <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${platForm.disponible ? 'bg-primary' : 'bg-stone-200'}`}>
                      <div className={`absolute top-[2px] left-[2px] w-3 h-3 bg-white rounded-full transition-transform duration-200 ${platForm.disponible ? 'translate-x-4' : ''}`} />
                    </div>
                  </div>
                  <span className="font-label text-[10px] tracking-widest uppercase text-stone-400">
                    {platForm.disponible ? 'Disponible' : 'Épuisé'}
                  </span>
                </label>
              </div>

              <button type="submit"
                className="w-full bg-primary text-white py-4 font-label text-[11px] tracking-[0.2em] uppercase hover:bg-primary-container transition-colors duration-300">
                {platModal === 'add' ? 'Enregistrer le plat' : 'Mettre à jour'}
              </button>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}
