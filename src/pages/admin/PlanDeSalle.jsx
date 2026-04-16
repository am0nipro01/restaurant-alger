import { useEffect, useState, useRef, createRef } from 'react'
import Draggable from 'react-draggable'
import AdminLayout from '../../components/layout/AdminLayout'
import pb from '../../lib/pocketbase'
import {
  dimensionsTable,
  STATUTS,
  initialiserTables,
  reinitialiserTables,
  sauvegarderPosition,
  changerStatutTable,
} from '../../lib/tables'

// Largeur : 700px + 2×p-4 = 732px < 768px (tablette)
// Hauteur : 800px (suffisant pour les 6 rangées, défilement vertical si besoin)
const CANVAS_WIDTH  = 700
const CANVAS_HEIGHT = 800

// Design system — primary / tertiary / error
const STYLE = {
  libre:    { bg: 'rgba(132, 83, 37, 0.05)',  border: '#845325', text: '#845325' },
  reservee: { bg: 'rgba(31, 103, 118, 0.05)', border: '#1f6776', text: '#1f6776' },
  occupee:  { bg: 'rgba(186, 26, 26, 0.05)',  border: '#ba1a1a', text: '#ba1a1a' },
}

const STATUT_LABELS = { libre: 'Libre', reservee: 'Réservée', occupee: 'Occupée' }

export default function PlanDeSalle() {
  const [tables, setTables]                       = useState([])
  const [reservations, setReservations]           = useState([])
  const [loading, setLoading]                     = useState(true)
  const [tableSelectionnee, setTableSelectionnee] = useState(null)
  const [enCours, setEnCours]                     = useState(false)
  const [message, setMessage]                     = useState(null)

  const nodeRefs      = useRef({})
  const draggedRef    = useRef(false)
  const dragTotalMove = useRef(0)
  const DRAG_THRESHOLD = 6 // px — évite que les micro-mouvements tactiles bloquent le clic

  const getNodeRef = (id) => {
    if (!nodeRefs.current[id]) nodeRefs.current[id] = createRef()
    return nodeRefs.current[id]
  }

  const afficherMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const charger = async () => {
    setLoading(true)
    try {
      const tablesData = await pb.collection('tables').getFullList({ sort: 'numero' })
      setTables(tablesData)
    } catch (e) {
      console.error('[PlanDeSalle] Erreur fetch tables:', e)
    }
    try {
      const resData = await pb.collection('reservations').getFullList({
        filter: 'statut = "confirmee" || statut = "en_attente"',
        sort: 'date,heure',
      })
      setReservations(resData)
    } catch (e) {
      console.error('[PlanDeSalle] Erreur fetch réservations:', e)
    }
    setLoading(false)
  }

  useEffect(() => { charger() }, [])

  const handleInitialiser = async () => {
    setEnCours(true)
    const result = await initialiserTables()
    if (result.success) { await charger(); afficherMessage('ok', '30 tables créées.') }
    else afficherMessage('info', result.message)
    setEnCours(false)
  }

  const handleReinitialiser = async () => {
    if (!confirm('Réinitialiser toutes les tables ? Les positions personnalisées seront perdues.')) return
    setEnCours(true)
    const result = await reinitialiserTables()
    if (result.success) { setTableSelectionnee(null); await charger(); afficherMessage('ok', 'Tables réinitialisées.') }
    else afficherMessage('erreur', result.message)
    setEnCours(false)
  }

  const handleDragStop = async (table, _e, data) => {
    const wasDragged = draggedRef.current
    draggedRef.current = false
    if (wasDragged) {
      const { width, height } = dimensionsTable(table.capacite)
      const newX = Math.max(0, Math.min(data.x, CANVAS_WIDTH  - width))
      const newY = Math.max(0, Math.min(data.y, CANVAS_HEIGHT - height))
      await sauvegarderPosition(table.id, newX, newY)
      setTables((prev) => prev.map((t) => t.id === table.id ? { ...t, position_x: newX, position_y: newY } : t))
    } else {
      // Tap simple détecté — onClick n'est pas fiable sur tablette Android avec react-draggable
      setTableSelectionnee((prev) => prev?.id === table.id ? null : table)
    }
  }

  const handleChangerStatut = async (statut) => {
    if (!tableSelectionnee) return
    const ok = await changerStatutTable(tableSelectionnee.id, statut)
    if (ok) {
      setTables((prev) => prev.map((t) => t.id === tableSelectionnee.id ? { ...t, statut } : t))
      setTableSelectionnee((prev) => ({ ...prev, statut }))
      if (statut === 'libre') {
        const res = reservations.find((r) => r.table === tableSelectionnee.id)
        if (res) {
          await pb.collection('reservations').update(res.id, { table: null })
          setReservations((prev) => prev.map((r) => r.id === res.id ? { ...r, table: '' } : r))
        }
      }
    }
  }

  const compteurs = STATUTS.reduce((acc, s) => {
    acc[s] = tables.filter((t) => t.statut === s).length
    return acc
  }, {})

  const resServation = tableSelectionnee
    ? reservations.find((r) => r.table === tableSelectionnee.id) || null
    : null

  const selectedStyle = tableSelectionnee ? STYLE[tableSelectionnee.statut] || STYLE.libre : null

  const formatHeure = (h) => h ? h.slice(0, 5) : '—'
  const formatDate  = (d) => {
    if (!d) return '—'
    return new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
  }

  return (
    <AdminLayout fullHeight>

      {/* ── Header ── */}
      <header className="flex-shrink-0 h-14 flex items-center justify-between px-8 border-b border-[#1b1c1a]/5 bg-[#faf9f5]">

        {/* Titre + compteurs */}
        <div className="flex items-center gap-6">
          <h2 className="font-['Noto_Serif'] text-xl font-bold text-[#1b1c1a] tracking-tight">
            Plan de Salle
          </h2>
          <div className="w-px h-5 bg-[#d6c3b6]/60" />
          <div className="flex items-center gap-5">
            {STATUTS.map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: STYLE[s].border }} />
                <span className="font-['Manrope'] text-[10px] font-bold tracking-[0.15em] uppercase text-[#51443b]">
                  {compteurs[s] || 0} {STATUT_LABELS[s]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {message && (
            <span
              className="font-['Manrope'] text-[10px] tracking-widest uppercase"
              style={{ color: message.type === 'ok' ? '#845325' : message.type === 'erreur' ? '#ba1a1a' : '#51443b' }}
            >
              {message.text}
            </span>
          )}
          {tables.length === 0 && !loading && (
            <button
              onClick={handleInitialiser}
              disabled={enCours}
              className="font-['Manrope'] text-[10px] tracking-widest uppercase bg-[#845325] text-white px-6 py-2.5 hover:bg-[#c58b58] transition-all duration-300 disabled:opacity-50"
            >
              {enCours ? 'Création…' : 'Initialiser'}
            </button>
          )}
          {tables.length > 0 && (
            <button
              onClick={handleReinitialiser}
              disabled={enCours}
              className="font-['Manrope'] text-[10px] tracking-widest uppercase border border-[#d6c3b6]/60 px-5 py-2.5 hover:bg-[#efeeea] transition-colors duration-300 disabled:opacity-50 text-[#51443b]"
            >
              Réinitialiser
            </button>
          )}
        </div>

      </header>

      {/* ── Zone principale (relative pour bottom sheet) ── */}
      <div className="flex-grow relative overflow-hidden">

        {/* ── Canvas blueprint ── */}
        <div
          className="h-full overflow-auto flex items-start justify-center p-4"
          style={{
            backgroundImage:
              'linear-gradient(#1b1c1a08 1px, transparent 1px), linear-gradient(90deg, #1b1c1a08 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundColor: '#faf9f5',
          }}
        >
          {loading ? (
            <p className="font-['Manrope'] text-[10px] tracking-widest uppercase text-[#51443b] mt-20">
              Chargement…
            </p>
          ) : tables.length === 0 ? (
            <p className="font-['Manrope'] text-xs text-[#51443b] tracking-wider mt-20">
              Aucune table. Cliquez sur "Initialiser".
            </p>
          ) : (
            <div
              className="relative flex-shrink-0"
              style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
            >
              {/* Marques angulaires */}
              <div className="absolute top-0 left-0 w-px h-10 bg-[#d6c3b6]/50 pointer-events-none" />
              <div className="absolute top-0 left-0 h-px w-10 bg-[#d6c3b6]/50 pointer-events-none" />
              <div className="absolute top-0 right-0 w-px h-10 bg-[#d6c3b6]/50 pointer-events-none" />
              <div className="absolute top-0 right-0 h-px w-10 bg-[#d6c3b6]/50 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-px h-10 bg-[#d6c3b6]/50 pointer-events-none" />
              <div className="absolute bottom-0 left-0 h-px w-10 bg-[#d6c3b6]/50 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-px h-10 bg-[#d6c3b6]/50 pointer-events-none" />
              <div className="absolute bottom-0 right-0 h-px w-10 bg-[#d6c3b6]/50 pointer-events-none" />

              {/* Zone Lounge */}
              <div
                className="absolute bottom-8 left-6 w-36 h-36 pointer-events-none flex flex-col justify-end p-3"
                style={{ backgroundColor: 'rgba(239, 238, 234, 0.5)' }}
              >
                <span className="font-['Noto_Serif'] text-[9px] uppercase tracking-tighter text-[#1b1c1a]/20">
                  Zone Lounge
                </span>
              </div>

              {/* Terrasse Casbah */}
              <div
                className="absolute bottom-4 right-4 w-52 h-36 pointer-events-none flex flex-col items-center justify-center"
                style={{
                  backgroundColor: 'rgba(132, 83, 37, 0.02)',
                  borderTop: '1px solid rgba(132, 83, 37, 0.12)',
                  borderLeft: '1px solid rgba(132, 83, 37, 0.12)',
                }}
              >
                <span className="font-['Manrope'] text-[9px] tracking-widest uppercase text-[#1b1c1a]/18">
                  Terrasse Casbah
                </span>
              </div>

              {/* Tables draggables */}
              {tables.map((table) => {
                const { width, height } = dimensionsTable(table.capacite)
                const s          = STYLE[table.statut] || STYLE.libre
                const isSelected = tableSelectionnee?.id === table.id
                const nodeRef    = getNodeRef(table.id)

                return (
                  <Draggable
                    key={table.id}
                    nodeRef={nodeRef}
                    defaultPosition={{
                      x: Math.max(0, Math.min(table.position_x || 0, CANVAS_WIDTH  - width)),
                      y: Math.max(0, Math.min(table.position_y || 0, CANVAS_HEIGHT - height)),
                    }}
                    bounds="parent"
                    onStart={() => { draggedRef.current = false; dragTotalMove.current = 0 }}
                    onDrag={(_, data) => {
                      dragTotalMove.current += Math.abs(data.deltaX) + Math.abs(data.deltaY)
                      if (dragTotalMove.current > DRAG_THRESHOLD) draggedRef.current = true
                    }}
                    onStop={(e, data) => handleDragStop(table, e, data)}
                  >
                    <div
                      ref={nodeRef}
                      className="absolute cursor-grab active:cursor-grabbing select-none"
                      style={{ width, height }}
                    >
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-0.5"
                        style={{
                          backgroundColor: s.bg,
                          border:          `2px solid ${s.border}`,
                          outline:         isSelected ? `2px solid ${s.border}` : 'none',
                          outlineOffset:   '3px',
                          transition:      'outline 150ms ease-out',
                        }}
                      >
                        <span
                          className="font-['Manrope'] text-[10px] font-bold leading-none"
                          style={{ color: s.text }}
                        >
                          T{table.numero}
                        </span>
                        <span
                          className="font-['Manrope'] text-[8px] font-bold uppercase tracking-tight leading-none"
                          style={{ color: s.text, opacity: 0.6 }}
                        >
                          {table.capacite} Pax
                        </span>
                      </div>
                    </div>
                  </Draggable>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Bottom detail sheet ── */}
        <div
          className={`absolute bottom-0 left-0 w-full z-30 backdrop-blur-md transition-transform duration-500 ease-out ${
            tableSelectionnee ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{
            backgroundColor: 'rgba(250, 249, 245, 0.97)',
            boxShadow: '0 -20px 40px rgba(27, 28, 26, 0.08)',
          }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3">
            <div className="w-8 h-1 rounded-full bg-[#d6c3b6]/50" />
          </div>

          {tableSelectionnee && selectedStyle && (
            <div className="px-8 py-5 grid grid-cols-12 gap-6 items-start">

              {/* Identité table */}
              <div className="col-span-3">
                <p className="font-['Manrope'] text-[10px] font-bold uppercase tracking-[0.2em] text-[#845325] mb-1">
                  Table sélectionnée
                </p>
                <div className="font-['Noto_Serif'] text-4xl font-bold text-[#1b1c1a] leading-none mb-3">
                  T{tableSelectionnee.numero}
                </div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1"
                  style={{ backgroundColor: selectedStyle.bg }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedStyle.border }} />
                  <span
                    className="font-['Manrope'] text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: selectedStyle.text }}
                  >
                    {STATUT_LABELS[tableSelectionnee.statut]}
                  </span>
                </div>
                <p className="mt-2 font-['Manrope'] text-[10px] text-[#51443b]">
                  {tableSelectionnee.capacite} personnes
                </p>
              </div>

              {/* Réservation liée */}
              <div className="col-span-5 flex flex-col gap-4">
                {resServation ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="font-['Manrope'] text-[10px] font-bold uppercase tracking-widest text-[#d6c3b6] mb-1">Client</p>
                        <p className="font-['Manrope'] text-sm font-bold text-[#1b1c1a]">{resServation.nom}</p>
                      </div>
                      <div>
                        <p className="font-['Manrope'] text-[10px] font-bold uppercase tracking-widest text-[#d6c3b6] mb-1">Personnes</p>
                        <p className="font-['Manrope'] text-sm font-bold text-[#1b1c1a]">{resServation.nb_personnes} pers.</p>
                      </div>
                    </div>
                    <div className="pt-3" style={{ borderTop: '1px solid rgba(214,195,182,0.25)' }}>
                      <p className="font-['Manrope'] text-[10px] font-bold uppercase tracking-widest text-[#d6c3b6] mb-1.5">Arrivée prévue</p>
                      <p className="font-['Manrope'] text-[10px] font-bold uppercase tracking-wider text-[#845325]">
                        {formatHeure(resServation.heure)} — {formatDate(resServation.date)}
                      </p>
                    </div>
                    {resServation.message && (
                      <p className="font-['Manrope'] text-[11px] text-[#51443b] italic leading-relaxed">
                        « {resServation.message} »
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center h-full">
                    <span className="font-['Manrope'] text-[10px] text-[#d6c3b6] italic">
                      Aucune réservation assignée
                    </span>
                  </div>
                )}
              </div>

              {/* Actions statut */}
              <div className="col-span-4 flex flex-col gap-2">
                {STATUTS.map((s) => {
                  const isActive = tableSelectionnee.statut === s
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleChangerStatut(s)}
                      className="w-full flex items-center gap-2.5 py-3 px-4 font-['Manrope'] text-[10px] font-bold tracking-[0.18em] uppercase transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? STYLE[s].bg : 'transparent',
                        border:          `1px solid ${isActive ? STYLE[s].border : 'rgba(214,195,182,0.4)'}`,
                        color:           isActive ? STYLE[s].text : '#51443b',
                        opacity:         isActive ? 1 : 0.55,
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: STYLE[s].border }} />
                      {STATUT_LABELS[s]}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setTableSelectionnee(null)}
                  className="mt-1 w-full font-['Manrope'] text-[10px] tracking-[0.18em] uppercase py-3 px-4 text-[#51443b] hover:bg-[#efeeea] transition-colors duration-300"
                  style={{ border: '1px solid rgba(214,195,182,0.4)' }}
                >
                  Fermer
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}
