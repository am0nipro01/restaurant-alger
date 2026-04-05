import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import pb from '../../lib/pocketbase'
import { useReservationContext } from '../../context/ReservationContext'

const STATUTS = ['en_attente', 'confirmee', 'annulee']

const STATUT_LABELS = {
  en_attente: 'En attente',
  confirmee:  'Confirmée',
  annulee:    'Annulée',
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

const MOIS_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
]
const JOURS_COURT = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

// Icônes
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
const IconList = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)
const IconCalGrid = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <rect x="3" y="4" width="18" height="18"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="3" y1="15" x2="21" y2="15"/><line x1="8" y1="10" x2="8" y2="22"/><line x1="16" y1="10" x2="16" y2="22"/>
  </svg>
)
const IconChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

// ── Helpers date ──────────────────────────────────────
function toYMD(dateStr) {
  // dateStr peut être "2026-05-14" ou "2026-05-14 00:00:00.000Z"
  return dateStr ? dateStr.slice(0, 10) : null
}

function premierJourDuMois(annee, mois) {
  return new Date(annee, mois, 1)
}

// Retourne les cases du calendrier (lundi = 0)
function getCases(annee, mois) {
  const premier = premierJourDuMois(annee, mois)
  // Lundi=0 ... Dimanche=6
  let debutDecalage = premier.getDay() - 1
  if (debutDecalage < 0) debutDecalage = 6

  const nbJours = new Date(annee, mois + 1, 0).getDate()
  const cases = []

  for (let i = 0; i < debutDecalage; i++) cases.push(null)
  for (let j = 1; j <= nbJours; j++) cases.push(j)

  // Compléter à un multiple de 7
  while (cases.length % 7 !== 0) cases.push(null)
  return cases
}

function formatDateLong(ymd) {
  if (!ymd) return ''
  const d = new Date(ymd + 'T12:00:00')
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// ── Vue Calendrier ────────────────────────────────────
function VueCalendrier({ reservations, onChangerStatut, tables, onAssignerTable }) {
  const today = new Date()
  const [annee, setAnnee]             = useState(today.getFullYear())
  const [mois,  setMois]              = useState(today.getMonth())
  const [jourSel, setJourSel]         = useState(null) // "YYYY-MM-DD"

  const todayYMD = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  // Index des réservations par date
  const parDate = {}
  reservations.forEach((r) => {
    const k = toYMD(r.date)
    if (!k) return
    if (!parDate[k]) parDate[k] = []
    parDate[k].push(r)
  })

  const cases = getCases(annee, mois)

  const allerMoisPrec = () => {
    if (mois === 0) { setMois(11); setAnnee(a => a - 1) }
    else setMois(m => m - 1)
    setJourSel(null)
  }
  const allerMoisSuiv = () => {
    if (mois === 11) { setMois(0); setAnnee(a => a + 1) }
    else setMois(m => m + 1)
    setJourSel(null)
  }
  const allerAujourdhui = () => {
    setAnnee(today.getFullYear())
    setMois(today.getMonth())
    setJourSel(todayYMD)
  }

  const resJourSel = jourSel ? (parDate[jourSel] || []) : []

  return (
    <div className="flex gap-0">

      {/* ── Grille calendrier ── */}
      <div className="flex-grow bg-white">

        {/* Header navigation mois */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100">
          <div className="flex items-center gap-6">
            <button onClick={allerMoisPrec} className="p-2 hover:bg-stone-100 transition-colors cursor-pointer">
              <IconChevronLeft />
            </button>
            <h3 className="font-headline text-2xl text-charcoal tracking-tight min-w-[200px] text-center">
              {MOIS_FR[mois]} {annee}
            </h3>
            <button onClick={allerMoisSuiv} className="p-2 hover:bg-stone-100 transition-colors cursor-pointer">
              <IconChevronRight />
            </button>
          </div>
          <button
            onClick={allerAujourdhui}
            className="font-label text-[10px] tracking-[0.2em] uppercase px-5 py-2 border border-stone-200 text-stone-500 hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            Aujourd'hui
          </button>
        </div>

        {/* En-têtes jours */}
        <div className="grid grid-cols-7 border-b border-stone-100">
          {JOURS_COURT.map((j) => (
            <div key={j} className="px-4 py-3 text-center font-label text-[10px] tracking-[0.2em] uppercase text-stone-400">
              {j}
            </div>
          ))}
        </div>

        {/* Cases */}
        <div className="grid grid-cols-7">
          {cases.map((jour, idx) => {
            if (!jour) {
              return <div key={`vide-${idx}`} className="min-h-[100px] border-r border-b border-stone-50 bg-stone-50/30" />
            }

            const ymd = `${annee}-${String(mois+1).padStart(2,'0')}-${String(jour).padStart(2,'0')}`
            const resJour = parDate[ymd] || []
            const isToday   = ymd === todayYMD
            const isSelected = ymd === jourSel

            const nbAttente   = resJour.filter(r => r.statut === 'en_attente').length
            const nbConfirmee = resJour.filter(r => r.statut === 'confirmee').length
            const nbAnnulee   = resJour.filter(r => r.statut === 'annulee').length

            return (
              <div
                key={ymd}
                onClick={() => setJourSel(isSelected ? null : ymd)}
                className={`min-h-[100px] border-r border-b border-stone-100 p-3 flex flex-col cursor-pointer transition-colors
                  ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-stone-50'}
                `}
              >
                {/* Numéro du jour */}
                <span className={`self-start font-label text-xs font-bold mb-2 w-6 h-6 flex items-center justify-center
                  ${isToday ? 'bg-primary text-white' : isSelected ? 'text-primary' : 'text-stone-400'}
                `}>
                  {jour}
                </span>

                {/* Pastilles réservations */}
                {resJour.length > 0 && (
                  <div className="flex flex-col gap-1 mt-auto">
                    {nbConfirmee > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        <span className="text-[10px] text-green-700 font-bold leading-none">{nbConfirmee} conf.</span>
                      </div>
                    )}
                    {nbAttente > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        <span className="text-[10px] text-amber-700 font-bold leading-none">{nbAttente} att.</span>
                      </div>
                    )}
                    {nbAnnulee > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-300 flex-shrink-0" />
                        <span className="text-[10px] text-red-400 font-bold leading-none">{nbAnnulee} ann.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Panneau latéral jour sélectionné ── */}
      <div className={`flex-shrink-0 border-l border-stone-200 bg-white transition-all duration-300 overflow-y-auto
        ${jourSel ? 'w-80' : 'w-0 overflow-hidden border-0'}
      `}>
        {jourSel && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="font-label text-[9px] tracking-[0.2em] uppercase text-stone-400 mb-1">
                  {resJourSel.length} réservation{resJourSel.length !== 1 ? 's' : ''}
                </p>
                <h4 className="font-headline text-lg text-charcoal leading-tight capitalize">
                  {formatDateLong(jourSel)}
                </h4>
              </div>
              <button
                onClick={() => setJourSel(null)}
                className="text-stone-300 hover:text-stone-600 transition-colors mt-1 cursor-pointer"
              >
                <IconClose />
              </button>
            </div>

            {resJourSel.length === 0 ? (
              <p className="text-xs text-stone-300 uppercase tracking-widest text-center py-8">
                Aucune réservation
              </p>
            ) : (
              <div className="space-y-3">
                {resJourSel
                  .slice()
                  .sort((a, b) => (a.heure || '').localeCompare(b.heure || ''))
                  .map((r) => (
                    <div
                      key={r.id}
                      className={`p-4 border-l-2 ${
                        r.statut === 'confirmee'  ? 'border-green-400 bg-green-50/50' :
                        r.statut === 'en_attente' ? 'border-amber-400 bg-amber-50/50' :
                        'border-red-200 bg-red-50/30 opacity-60'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-label text-xs font-bold uppercase tracking-wide text-stone-800">
                          {r.nom}
                        </span>
                        <span className="font-label text-[9px] text-stone-400">{r.heure}</span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${STATUT_BADGE[r.statut]}`}>
                          {STATUT_LABELS[r.statut]}
                        </span>
                        <span className="text-xs text-stone-400 flex items-center gap-0.5">
                          {r.nb_personnes} <IconGroup />
                        </span>
                      </div>

                      {r.email && <p className="text-[10px] text-stone-400 truncate">{r.email}</p>}
                      {r.telephone && <p className="text-[10px] text-stone-400">{r.telephone}</p>}
                      {r.message && (
                        <p className="text-[10px] text-stone-400 italic mt-1 line-clamp-2">{r.message}</p>
                      )}

                      {/* Assignation de table */}
                      {r.statut !== 'annulee' && (
                        <div className="mt-3">
                          <select
                            value={r.table || ''}
                            onChange={(e) => onAssignerTable(r.id, e.target.value || null)}
                            className="w-full text-[10px] font-label tracking-wide uppercase border border-stone-200 bg-white text-stone-600 py-1.5 px-2 cursor-pointer hover:border-stone-400 transition-colors focus:outline-none focus:border-primary"
                          >
                            <option value="">— Table non assignée —</option>
                            {(tables || []).map((t) => (
                              <option key={t.id} value={t.id}>
                                Table {t.numero}{t.capacite ? ` (${t.capacite} pers.)` : ''}
                                {t.statut === 'occupee' && r.table !== t.id ? ' ✗' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Actions rapides */}
                      {r.statut === 'en_attente' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => onChangerStatut(r.id, 'confirmee')}
                            className="flex-1 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest py-1.5 hover:bg-primary hover:text-white transition-all cursor-pointer"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => onChangerStatut(r.id, 'annulee')}
                            className="px-3 text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <IconClose />
                          </button>
                        </div>
                      )}
                      {r.statut === 'confirmee' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => onChangerStatut(r.id, 'en_attente')}
                            className="text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                            title="Remettre en attente"
                          >
                            <IconHistory />
                          </button>
                          <button
                            onClick={() => onChangerStatut(r.id, 'annulee')}
                            className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Annuler"
                          >
                            <IconClose />
                          </button>
                        </div>
                      )}
                      {r.statut === 'annulee' && (
                        <button
                          onClick={() => onChangerStatut(r.id, 'en_attente')}
                          className="mt-3 text-stone-400 hover:text-primary transition-colors cursor-pointer"
                          title="Rétablir"
                        >
                          <IconRestore />
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}

// ── Page principale ───────────────────────────────────
export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [tables, setTables]             = useState([])
  const [loading, setLoading]           = useState(true)
  const [erreur, setErreur]             = useState(false)
  const [filtre, setFiltre]             = useState('tous')
  const [vue, setVue]                   = useState('calendrier') // 'liste' | 'calendrier'
  const navigate = useNavigate()
  const { rafraichirCount } = useReservationContext()

  // afficherErreur=false pour le chargement auto (Strict Mode double-invocation)
  // afficherErreur=true uniquement pour le rafraîchissement manuel
  const chargerReservations = async ({ afficherErreur = true } = {}) => {
    setLoading(true)
    setErreur(false)
    let ok = true
    try {
      const resData = await pb.collection('reservations').getFullList({ sort: '-date,-heure', expand: 'table' })
      setReservations(resData)
    } catch (e) {
      console.error('[Reservations] Erreur fetch réservations:', e)
      ok = false
    }
    try {
      const tablesData = await pb.collection('tables').getFullList({ sort: 'numero' })
      setTables(tablesData)
    } catch (e) {
      console.error('[Reservations] Erreur fetch tables:', e)
    }
    if (afficherErreur && !ok) setErreur(true)
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    let unsubFn   = null

    const init = async () => {
      await chargerReservations({ afficherErreur: false })
      if (cancelled) return

      try {
        unsubFn = await pb.collection('reservations').subscribe('*', (e) => {
          if (e.action === 'create') {
            setReservations(prev =>
              [e.record, ...prev].sort((a, b) => {
                const d = (b.date || '').localeCompare(a.date || '')
                return d !== 0 ? d : (b.heure || '').localeCompare(a.heure || '')
              })
            )
          } else if (e.action === 'update') {
            setReservations(prev => prev.map(r => r.id === e.record.id ? e.record : r))
          } else if (e.action === 'delete') {
            setReservations(prev => prev.filter(r => r.id !== e.record.id))
          }
          rafraichirCount()
        })
      } catch (err) {
        console.error('[Reservations] Subscription temps réel:', err)
      }
    }

    init()

    return () => {
      cancelled = true
      if (unsubFn) unsubFn()
      else pb.collection('reservations').unsubscribe('*').catch(() => {})
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const changerStatut = async (id, nouveauStatut) => {
    try {
      await pb.collection('reservations').update(id, { statut: nouveauStatut })
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, statut: nouveauStatut } : r))
      )
      rafraichirCount()
    } catch (e) {
      console.error('Erreur mise à jour statut:', e)
    }
  }

  const assignerTable = async (reservationId, tableId) => {
    try {
      const res = reservations.find((r) => r.id === reservationId)
      if (res?.table && res.table !== tableId) {
        await pb.collection('tables').update(res.table, { statut: 'libre' })
      }
      await pb.collection('reservations').update(reservationId, { table: tableId || null })
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

  const counts = {
    tous:       reservations.length,
    en_attente: reservations.filter((r) => r.statut === 'en_attente').length,
    confirmee:  reservations.filter((r) => r.statut === 'confirmee').length,
    annulee:    reservations.filter((r) => r.statut === 'annulee').length,
  }
  const totalCouverts      = reservations.reduce((sum, r) => sum + (r.nb_personnes || 0), 0)
  const CAPACITE_MAX       = 120
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
        <div className="flex items-center gap-4">
          {/* Toggle vue */}
          <div className="flex border border-stone-200">
            <button
              onClick={() => setVue('liste')}
              className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer
                ${vue === 'liste' ? 'bg-charcoal text-white' : 'text-stone-400 hover:text-charcoal'}`}
            >
              <IconList /> Liste
            </button>
            <button
              onClick={() => setVue('calendrier')}
              className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer
                ${vue === 'calendrier' ? 'bg-charcoal text-white' : 'text-stone-400 hover:text-charcoal'}`}
            >
              <IconCalGrid /> Calendrier
            </button>
          </div>
          <button
            onClick={() => chargerReservations({ afficherErreur: true })}
            disabled={loading}
            title="Actualiser"
            className="p-2.5 border border-stone-200 text-stone-400 hover:text-charcoal hover:border-stone-400 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IconHistory />
          </button>
          <button
            onClick={() => navigate('/reservation')}
            className="bg-primary text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-primary-container transition-all duration-300 cursor-pointer"
          >
            Nouv. Réservation
          </button>
        </div>
      </header>

      {loading ? (
        <div className="bg-white p-12 text-center text-stone-400 text-sm tracking-widest uppercase">
          Chargement…
        </div>
      ) : erreur ? (
        <div className="bg-white p-12 text-center">
          <p className="text-stone-400 text-sm tracking-widest uppercase mb-4">Erreur de chargement</p>
          <button
            onClick={() => chargerReservations({ afficherErreur: true })}
            className="text-xs font-bold tracking-widest uppercase text-primary border border-primary px-6 py-2 hover:bg-primary hover:text-white transition-all cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      ) : vue === 'calendrier' ? (

        /* ── Vue Calendrier ── */
        <VueCalendrier reservations={reservations} onChangerStatut={changerStatut} tables={tables} onAssignerTable={assignerTable} />

      ) : (

        /* ── Vue Liste ── */
        <>
          {/* Filtres tabs */}
          <div className="flex gap-8 border-b border-stone-200 mb-8">
            {['tous', ...STATUTS].map((s) => (
              <button
                key={s}
                onClick={() => setFiltre(s)}
                className={`pb-4 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer ${
                  filtre === s
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-stone-400 hover:text-stone-800'
                }`}
              >
                {FILTRE_LABELS[s]} ({counts[s]})
              </button>
            ))}
          </div>

          {filtrees.length === 0 ? (
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
                      <td className="px-6 py-6">
                        <span className="block text-sm font-bold text-stone-800 uppercase tracking-wide">{r.nom}</span>
                        {r.message && (
                          <span className="text-[10px] text-stone-400 tracking-wider italic truncate max-w-[160px] block">
                            {r.message}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <span className="block text-xs text-stone-600 font-medium">{formatDate(r.date)}</span>
                        <span className="text-xs text-stone-400">{r.heure}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="inline-flex items-center text-xs font-bold text-stone-800">
                          {String(r.nb_personnes).padStart(2, '0')}
                          <IconGroup />
                        </span>
                      </td>
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
                      <td className="px-6 py-6">
                        <span className="block text-[11px] text-stone-500">{r.email}</span>
                        {r.telephone && <span className="text-[11px] text-stone-400">{r.telephone}</span>}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${STATUT_BADGE[r.statut]}`}>
                          {STATUT_LABELS[r.statut]}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        {r.statut === 'en_attente' && (
                          <div className="flex justify-end items-center gap-3">
                            <button
                              onClick={() => changerStatut(r.id, 'confirmee')}
                              className="bg-primary/5 text-primary px-4 py-1 text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => changerStatut(r.id, 'annulee')}
                              className="text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
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
                              className="text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                              title="Remettre en attente"
                            >
                              <IconHistory />
                            </button>
                            <button
                              onClick={() => changerStatut(r.id, 'annulee')}
                              className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
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
                              className="text-stone-400 hover:text-primary transition-colors cursor-pointer"
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
        </>
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
