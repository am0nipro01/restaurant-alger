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

const CANVAS_WIDTH  = 820
const CANVAS_HEIGHT = 840

// Stitch color scheme per statut
const STYLE = {
  libre:    { bg: '#dcfce7', border: '#16a34a', text: '#166534' },
  reservee: { bg: '#fef9c3', border: '#ca8a04', text: '#854d0e' },
  occupee:  { bg: '#fee2e2', border: '#dc2626', text: '#991b1b' },
}

const STATUT_LABELS = { libre: 'Libre', reservee: 'Réservée', occupee: 'Occupée' }

const STATUT_ACTION = {
  libre:    { bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-200',  dot: 'bg-green-600',  label: 'Marquer comme Libre'    },
  reservee: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', dot: 'bg-yellow-600', label: 'Marquer comme Réservée'  },
  occupee:  { bg: 'bg-red-50',    text: 'text-red-800',    border: 'border-red-200',    dot: 'bg-red-600',    label: 'Marquer comme Occupée'   },
}

const BADGE = {
  libre:    'bg-green-100 text-green-800',
  reservee: 'bg-yellow-100 text-yellow-800',
  occupee:  'bg-red-100 text-red-800',
}

export default function PlanDeSalle() {
  const [tables, setTables]                       = useState([])
  const [reservations, setReservations]           = useState([]) // pour la liaison
  const [loading, setLoading]                     = useState(true)
  const [tableSelectionnee, setTableSelectionnee] = useState(null)
  const [enCours, setEnCours]                     = useState(false)
  const [message, setMessage]                     = useState(null)

  const nodeRefs   = useRef({})
  const draggedRef = useRef(false)

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

    // Fetch tables — critique, toujours en premier
    try {
      const tablesData = await pb.collection('tables').getFullList({ sort: 'numero' })
      setTables(tablesData)
    } catch (e) {
      console.error('[PlanDeSalle] Erreur fetch tables:', e)
    }

    // Fetch réservations — indépendant, une erreur ici ne bloque pas les tables
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
    draggedRef.current = false // toujours remettre à false après chaque interaction

    if (wasDragged) {
      const { width, height } = dimensionsTable(table.capacite)
      const newX = Math.max(0, Math.min(data.x, CANVAS_WIDTH  - width))
      const newY = Math.max(0, Math.min(data.y, CANVAS_HEIGHT - height))
      await sauvegarderPosition(table.id, newX, newY)
      setTables((prev) => prev.map((t) => t.id === table.id ? { ...t, position_x: newX, position_y: newY } : t))
    }
  }

  const handleClickTable = (table) => {
    if (draggedRef.current) return
    setTableSelectionnee((prev) => prev?.id === table.id ? null : table)
  }

  const handleChangerStatut = async (statut) => {
    if (!tableSelectionnee) return
    const ok = await changerStatutTable(tableSelectionnee.id, statut)
    if (ok) {
      setTables((prev) => prev.map((t) => t.id === tableSelectionnee.id ? { ...t, statut } : t))
      setTableSelectionnee((prev) => ({ ...prev, statut }))
      // Si on libère la table, désassigner la réservation liée
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

  // Trouver la réservation liée à la table sélectionnée
  const resServation = tableSelectionnee
    ? reservations.find((r) => r.table === tableSelectionnee.id) || null
    : null

  const formatHeure = (h) => h ? h.slice(0, 5) : '—'
  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
  }

  return (
    <AdminLayout fullHeight>

      {/* ── Header ── */}
      <header className="h-20 flex items-center justify-between px-10 bg-surface border-b border-stone-100 flex-shrink-0">
        <div>
          <h2 className="font-headline text-2xl uppercase tracking-widest text-charcoal">Plan de Salle</h2>
          <p className="text-[10px] font-label tracking-[0.2em] uppercase text-stone-400">
            Configuration Interactive de l'Espace
          </p>
        </div>
        <div className="flex gap-4 items-center">
          {message && (
            <span className={`text-xs tracking-wider uppercase ${message.type === 'ok' ? 'text-green-600' : message.type === 'erreur' ? 'text-red-500' : 'text-stone-400'}`}>
              {message.text}
            </span>
          )}
          {tables.length > 0 && (
            <button
              onClick={handleReinitialiser}
              disabled={enCours}
              className="font-label text-xs tracking-widest uppercase border border-stone-200 px-6 py-2.5 hover:bg-[#e9e8e4] transition-colors disabled:opacity-50"
            >
              Réinitialiser
            </button>
          )}
          {tables.length === 0 && !loading && (
            <button
              onClick={handleInitialiser}
              disabled={enCours}
              className="font-label text-xs tracking-widest uppercase bg-primary text-white px-8 py-2.5 hover:bg-primary-container transition-all disabled:opacity-50"
            >
              {enCours ? 'Création…' : 'Initialiser les tables'}
            </button>
          )}
        </div>
      </header>

      {/* ── Corps ── */}
      <div className="flex flex-grow overflow-hidden">

        {/* ── Canvas ── */}
        <section className="flex-grow flex items-center justify-center p-12 overflow-auto bg-[#f4f4f0]">
          {loading ? (
            <p className="text-stone-400 text-sm tracking-widest uppercase">Chargement…</p>
          ) : tables.length === 0 ? (
            <div className="bg-white p-16 text-center shadow-sm">
              <p className="text-stone-400 text-sm">Aucune table. Cliquez sur "Initialiser les tables".</p>
            </div>
          ) : (
            <div
              className="relative bg-white shadow-2xl border border-stone-200 flex-shrink-0"
              style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                backgroundImage: 'radial-gradient(#d6c3b6 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            >
              {/* Murs décoratifs */}
              <div className="absolute top-0 left-0 w-full h-4 bg-stone-800" />
              <div className="absolute top-0 left-0 h-full w-4 bg-stone-800" />
              <div className="absolute bottom-0 right-0 w-1/2 h-4 bg-stone-800" />
              <div className="absolute top-0 right-0 h-1/3 w-4 bg-stone-800" />

              {/* Badge entrée */}
              <div className="absolute -top-6 left-12 bg-white px-4 border border-stone-800 font-label text-[10px] tracking-widest uppercase py-1 z-10">
                Entrée Principale
              </div>

              {/* Zone Lounge */}
              <div className="absolute bottom-12 left-8 w-48 h-52 bg-[#e3e2df] border-l-4 border-primary p-4 pointer-events-none">
                <span className="font-headline text-sm uppercase tracking-tighter opacity-30">Zone Lounge</span>
              </div>

              {/* Terrasse */}
              <div className="absolute bottom-4 right-4 w-72 h-48 bg-primary/5 flex flex-col items-center justify-center border-t-2 border-l-2 border-primary/20 pointer-events-none">
                <span className="font-label text-[10px] tracking-widest uppercase opacity-50">Terrasse Casbah</span>
              </div>

              {/* Tables draggables */}
              {tables.map((table) => {
                const { width, height } = dimensionsTable(table.capacite)
                const s = STYLE[table.statut] || STYLE.libre
                const isSelected = tableSelectionnee?.id === table.id
                const nodeRef = getNodeRef(table.id)

                return (
                  <Draggable
                    key={table.id}
                    nodeRef={nodeRef}
                    defaultPosition={{ x: table.position_x || 0, y: table.position_y || 0 }}
                    bounds="parent"
                    onStart={() => { draggedRef.current = false }}
                    onDrag={()  => { draggedRef.current = true  }}
                    onStop={(e, data) => handleDragStop(table, e, data)}
                  >
                    <div
                      ref={nodeRef}
                      className="absolute cursor-grab active:cursor-grabbing select-none"
                      style={{ width, height }}
                      onClick={() => handleClickTable(table)}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor: s.bg,
                          border: `1px solid ${s.border}`,
                          outline: isSelected ? `3px solid ${s.border}` : 'none',
                          outlineOffset: '2px',
                        }}
                      >
                        <span className="font-label text-[10px] font-bold" style={{ color: s.text }}>
                          {table.numero}
                        </span>
                      </div>
                    </div>
                  </Draggable>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Panneau détail ── */}
        <aside className="w-96 bg-surface border-l border-stone-100 flex flex-col p-8 overflow-y-auto flex-shrink-0">
          {tableSelectionnee ? (
            <>
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-label text-[10px] tracking-widest uppercase text-stone-400">Détails de la Table</span>
                    <h3 className="font-headline text-3xl text-charcoal">{tableSelectionnee.numero}</h3>
                  </div>
                  <span className={`font-label text-[10px] px-3 py-1 uppercase tracking-wider font-bold ${BADGE[tableSelectionnee.statut] || 'bg-stone-100 text-stone-600'}`}>
                    {STATUT_LABELS[tableSelectionnee.statut]}
                  </span>
                </div>

                {/* Placeholder image */}
                <div className="aspect-[4/3] bg-[#e9e8e4] w-full mb-6 flex items-center justify-center">
                  <span className="font-label text-[10px] tracking-widest uppercase text-stone-400">Photo de la table</span>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-label text-[10px] tracking-[0.15em] uppercase text-stone-500">Capacité</span>
                    <span className="font-headline text-lg italic text-stone-600">{tableSelectionnee.capacite} Personnes</span>
                  </div>

                  {/* ── Réservation liée ── */}
                  {resServation ? (
                    <>
                      <div className="h-px bg-stone-100" />
                      <div className="flex flex-col gap-1">
                        <span className="font-label text-[10px] tracking-[0.15em] uppercase text-stone-500">Client actuel</span>
                        <span className="font-headline text-base text-charcoal">
                          {resServation.nom} ({resServation.nb_personnes} pers.)
                        </span>
                        <span className="font-body text-xs text-stone-400">
                          Arrivée : {formatHeure(resServation.heure)} — {formatDate(resServation.date)}
                        </span>
                      </div>
                      {resServation.message && (
                        <div className="flex flex-col gap-1">
                          <span className="font-label text-[10px] tracking-[0.15em] uppercase text-stone-500">Notes</span>
                          <p className="font-body text-xs text-stone-500 italic leading-relaxed">
                            {resServation.message}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <span className="font-label text-[10px] tracking-[0.15em] uppercase text-stone-500">Contact</span>
                        <span className="font-body text-xs text-stone-500">{resServation.email}</span>
                        {resServation.telephone && (
                          <span className="font-body text-xs text-stone-400">{resServation.telephone}</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span className="font-label text-[10px] tracking-[0.15em] uppercase text-stone-500">Réservation</span>
                      <span className="font-body text-xs text-stone-300 italic">Aucune réservation assignée</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-stone-100">
                <h4 className="font-label text-[10px] tracking-widest uppercase text-stone-400 mb-4">Actions de Statut</h4>
                <div className="flex flex-col gap-3">
                  {STATUTS.map((s) => {
                    const a = STATUT_ACTION[s]
                    if (!a) return null
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleChangerStatut(s)}
                        className={`flex items-center gap-3 px-4 py-3 font-label text-[10px] tracking-widest uppercase border transition-colors ${a.bg} ${a.text} ${a.border} hover:opacity-80`}
                      >
                        <div className={`w-2 h-2 rounded-full ${a.dot}`} />
                        {a.label}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setTableSelectionnee(null)}
                  className="mt-8 w-full font-label text-xs tracking-widest uppercase text-stone-500 flex items-center justify-center gap-2 py-3 border border-stone-200 hover:bg-[#e9e8e4] transition-colors"
                >
                  Fermer
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <p className="font-label text-[10px] tracking-widest uppercase text-stone-400 leading-relaxed">
                Cliquez sur une table pour voir ses options
              </p>
              <p className="text-[10px] text-stone-300 leading-relaxed">
                Glissez pour repositionner
              </p>
            </div>
          )}
        </aside>

      </div>

      {/* ── Footer légende ── */}
      <footer className="h-14 bg-surface border-t border-stone-100 px-10 flex items-center gap-12 flex-shrink-0">
        {STATUTS.map((s) => {
          const a = STATUT_ACTION[s]
          if (!a) return null
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-3 h-3 ${a.dot}`} />
              <span className="font-label text-[10px] tracking-widest uppercase text-stone-500">
                {STATUT_LABELS[s]} ({compteurs[s] || 0})
              </span>
            </div>
          )
        })}
        <div className="ml-auto flex items-center gap-4">
          <span className="font-label text-[10px] tracking-widest uppercase text-stone-300">
            {tables.length} tables
          </span>
        </div>
      </footer>

    </AdminLayout>
  )
}
