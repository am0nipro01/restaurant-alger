import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import pb from '../../lib/pocketbase'

const STATUTS = ['en_attente', 'confirmee', 'annulee']

const STATUT_LABELS = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  annulee: 'Annulée',
}

const STATUT_COLORS = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  confirmee: 'bg-green-100 text-green-800',
  annulee: 'bg-red-100 text-red-800',
}

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState('tous')

  const chargerReservations = async () => {
    setLoading(true)
    try {
      const data = await pb.collection('reservations').getFullList({
        sort: '-created',
      })
      setReservations(data)
    } catch (e) {
      console.error('Erreur chargement réservations:', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    chargerReservations()
  }, [])

  const changerStatut = async (id, nouveauStatut) => {
    try {
      await pb.collection('reservations').update(id, { statut: nouveauStatut })
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, statut: nouveauStatut } : r))
      )
    } catch (e) {
      console.error('Erreur mise à jour statut:', e)
    }
  }

  const reservationsFiltrees =
    filtre === 'tous'
      ? reservations
      : reservations.filter((r) => r.statut === filtre)

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Réservations</h1>
        <button
          onClick={chargerReservations}
          className="text-sm text-gray-400 hover:text-black transition"
        >
          Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        {['tous', ...STATUTS].map((s) => (
          <button
            key={s}
            onClick={() => setFiltre(s)}
            className={`text-sm px-4 py-1.5 rounded-full border transition ${
              filtre === s
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-500 border-gray-200 hover:border-black'
            }`}
          >
            {s === 'tous' ? 'Toutes' : STATUT_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <p className="text-gray-400 text-sm">Chargement...</p>
      ) : reservationsFiltrees.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucune réservation.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reservationsFiltrees.map((r) => (
            <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{r.nom}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUT_COLORS[r.statut]}`}>
                    {STATUT_LABELS[r.statut]}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {r.date?.slice(0, 10)} à {r.heure} — {r.nb_personnes} personne{r.nb_personnes > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-400">{r.email} {r.telephone ? `· ${r.telephone}` : ''}</p>
                {r.message && (
                  <p className="text-sm text-gray-400 italic">"{r.message}"</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                {r.statut !== 'confirmee' && (
                  <button
                    onClick={() => changerStatut(r.id, 'confirmee')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"
                  >
                    Confirmer
                  </button>
                )}
                {r.statut !== 'annulee' && (
                  <button
                    onClick={() => changerStatut(r.id, 'annulee')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
                  >
                    Annuler
                  </button>
                )}
                {r.statut !== 'en_attente' && (
                  <button
                    onClick={() => changerStatut(r.id, 'en_attente')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition"
                  >
                    Remettre en attente
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
