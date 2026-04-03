import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import pb from '../../lib/pocketbase'
import { useReservationContext } from '../../context/ReservationContext'

const STATUTS = ['en_attente', 'confirmee', 'annulee']

const STATUT_LABELS = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  annulee: 'Annulée',
}

const STATUT_BADGE = {
  en_attente: 'bg-amber-50 text-amber-700 border border-amber-100',
  confirmee:  'bg-green-50 text-green-700 border border-green-100',
  annulee:    'bg-red-50 text-red-700 border border-red-100',
}

const FILTRE_LABELS = {
  tous:       'Tous',
  en_attente: 'En attente',
  confirmee:  'Confirmées',
  annulee:    'Annulées',
}

// Icônes actions
const IconHistory = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
  </svg>
)
const IconClose = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconRestore = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
  </svg>
)
const IconGroup = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40 ml-1">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
)

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [tables, setTables]             = useState([])
  const [loading, setLoading]           = useState(true)
  const [filtre, setFiltre]             = useState('tous')
  const navigate = useNavigate()
  const { rafraichirCount } = useReservationContext()

  const chargerReservations = async () => {
    setLoading(true)
    try {
      const [resData, tablesData] = await Promise.all([
        pb.collection('reservations').getFullList({ sort: '-date,-heure', expand: 'table' }),
        pb.collection('tables').getFullList({ sort: 'numero' }),
      ])
      setReservations(resData)
      setTables(tablesData)
    } catch (e) {
      console.error('Erreur chargement réservations:', e)
    }
    setLoading(false)
  }

  useEffect(() => { chargerReservations() }, [])

  const changerStatut = async (id, nouveauStatut) => {
    try {
      await pb.collection('reservations').update(id, { statut: nouveauStatut })
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, statut: nouveauStatut } : r))
      )
      // Mettre à jour le badge immédiatement
      rafraichirCount()
    } catch (e) {
      console.error('Erreur mise à jour statut:', e)
    }
  }

  const assignerTable = async (reservationId, tableId) => {
    try {
      // Trouver l'ancienne table assignée pour la libérer
      const res = reservations.find((r) => r.id === reservationId)
      if (res?.table && res.table !== tableId) {
        await pb.collection('tables').update(res.table, { statut: 'libre' })
      }
      // Assigner la nouvelle table
      await pb.collection('reservations').update(reservationId, { table: tableId || null })
      // Mettre à jour le statut de la table
      if (tableId) {
        const statutTable = res?.statut === 'confirmee' ? 'occupee' : 'reservee'
        await pb.collection('tables').update(tableId, { statut: statutTable })
      }
      chargerReservations()
    } catch (e) {
      console.error('Erreur assignation table:', e)
    }
  }

  const filtrees = filtre === 'tous' ? reservations : reservations.filter((r) => r.statut === filtre)

  // Stats
  const counts = {
    tous:       reservations.length,
    en_attente: reservations.filter((r) => r.statut === 'en_attente').length,
    confirmee:  reservations.filter((r) => r.statut === 'confirmee').length,
    annulee:    reservations.filter((r) => r.statut === 'annulee').length,
  }
  const totalCouverts = reservations.reduce((sum, r) => sum + (r.nb_personnes || 0), 0)
  const CAPACITE_MAX = 120 // 30 tables × 4 pers. en moyenne
  const confirmeesCouverts = reservations
    .filter((r) => r.statut === 'confirmee')
    .reduce((sum, r) => sum + (r.nb_personnes || 0), 0)
  const occupation = Math.round((confirmeesCouverts / CAPACITE_MAX) * 100)

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  }

  return (
    <AdminLayout>

      {/* ── Header ── */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-headline text-4xl text-charcoal tracking-tight">Gestion des Réservations</h2>
          <p className="font-body text-stone-500 mt-2 text-sm max-w-lg">
            Surveillez les engagements de la table et orchestrez l'expérience culinaire du soir.
          </p>
        </div>
        <button
          onClick={() => navigate('/reservation')}
          className="bg-primary text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-primary-container transition-all duration-300"
        >
          Nouv. Réservation
        </button>
      </header>

      {/* ── Filtres tabs ── */}
      <div className="flex gap-8 border-b border-stone-200 mb-8">
        {['tous', ...STATUTS].map((s) => (
          <button
            key={s}
            onClick={() => setFiltre(s)}
            className={`pb-4 text-xs font-bold tracking-widest uppercase transition-colors ${
              filtre === s
                ? 'text-primary border-b-2 border-primary'
                : 'text-stone-400 hover:text-stone-800'
            }`}
          >
            {FILTRE_LABELS[s]} ({counts[s]})
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="bg-white p-12 text-center text-stone-400 text-sm tracking-widest uppercase">
          Chargement…
        </div>
      ) : filtrees.length === 0 ? (
        <div className="bg-white p-12 text-center text-stone-400 text-sm tracking-widest uppercase">
          Aucune réservation
        </div>
      ) : (
        <div className="bg-white overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-[10px] uppercase tracking-[0.2em]">
                <th className="px-6 py-4 font-medium">Nom de l'invité</th>
                <th className="px-6 py-4 font-medium">Date &amp; Heure</th>
                <th className="px-6 py-4 font-medium">Couverts</th>
                <th className="px-6 py-4 font-medium">Table</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtrees.map((r) => (
                <tr
                  key={r.id}
                  className={`hover:bg-stone-50/50 transition-colors group ${r.statut === 'annulee' ? 'opacity-60' : ''}`}
                >
                  {/* Nom */}
                  <td className="px-6 py-6">
                    <span className="block text-sm font-bold text-stone-800 uppercase tracking-wide">{r.nom}</span>
                    {r.message && (
                      <span className="text-[10px] text-stone-400 tracking-wider italic truncate max-w-[160px] block">
                        {r.message}
                      </span>
                    )}
                  </td>

                  {/* Date & Heure */}
                  <td className="px-6 py-6">
                    <span className="block text-xs text-stone-600 font-medium">{formatDate(r.date)}</span>
                    <span className="text-xs text-stone-400">{r.heure}</span>
                  </td>

                  {/* Couverts */}
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center text-xs font-bold text-stone-800">
                      {String(r.nb_personnes).padStart(2, '0')}
                      <IconGroup />
                    </span>
                  </td>

                  {/* Table assignée */}
                  <td className="px-6 py-6">
                    {r.statut !== 'annulee' ? (
                      <select
                        value={r.table || ''}
                        onChange={(e) => assignerTable(r.id, e.target.value)}
                        className="border-0 border-b border-stone-200 bg-transparent text-xs font-bold text-stone-700 py-1 focus:outline-none focus:border-primary transition-colors cursor-pointer w-24"
                      >
                        <option value="">— Aucune</option>
                        {tables.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.numero} ({t.capacite}p)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-stone-300">—</span>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-6">
                    <span className="block text-[11px] text-stone-500">{r.email}</span>
                    {r.telephone && <span className="text-[11px] text-stone-400">{r.telephone}</span>}
                  </td>

                  {/* Statut */}
                  <td className="px-6 py-6">
                    <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${STATUT_BADGE[r.statut]}`}>
                      {STATUT_LABELS[r.statut]}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-6 text-right">
                    {r.statut === 'en_attente' && (
                      <div className="flex justify-end items-center gap-3">
                        <button
                          onClick={() => changerStatut(r.id, 'confirmee')}
                          className="bg-primary/5 text-primary px-4 py-1 text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => changerStatut(r.id, 'annulee')}
                          className="text-stone-300 hover:text-red-500 transition-colors"
                          title="Annuler"
                        >
                          <IconClose />
                        </button>
                      </div>
                    )}
                    {r.statut === 'confirmee' && (
                      <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => changerStatut(r.id, 'en_attente')}
                          className="text-stone-400 hover:text-stone-800 transition-colors"
                          title="Remettre en attente"
                        >
                          <IconHistory />
                        </button>
                        <button
                          onClick={() => changerStatut(r.id, 'annulee')}
                          className="text-stone-400 hover:text-red-500 transition-colors"
                          title="Annuler"
                        >
                          <IconClose />
                        </button>
                      </div>
                    )}
                    {r.statut === 'annulee' && (
                      <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => changerStatut(r.id, 'en_attente')}
                          className="text-stone-400 hover:text-primary transition-colors"
                          title="Rétablir"
                        >
                          <IconRestore />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Stats ── */}
      <footer className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-0">
        <div className="bg-white p-8 border-l-2 border-primary">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Occupation</p>
          <p className="font-headline text-2xl text-stone-800">{occupation}%</p>
          <div className="w-full bg-stone-100 h-px mt-4">
            <div className="bg-primary h-full transition-all duration-700" style={{ width: `${occupation}%` }} />
          </div>
        </div>
        <div className="bg-white p-8 border-l border-stone-200">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Total Couverts</p>
          <p className="font-headline text-2xl text-stone-800">{totalCouverts}</p>
        </div>
        <div className="bg-white p-8 border-l border-stone-200">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Confirmées</p>
          <p className="font-headline text-2xl text-stone-800">{counts.confirmee}</p>
        </div>
        <div className="bg-white p-8 border-l border-stone-200">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">En attente</p>
          <p className="font-headline text-2xl text-primary">{String(counts.en_attente).padStart(2, '0')}</p>
        </div>
      </footer>

    </AdminLayout>
  )
}
