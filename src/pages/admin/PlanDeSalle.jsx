import { useEffect, useState, useRef, createRef } from 'react'
import Draggable from 'react-draggable'
import AdminLayout from '../../components/layout/AdminLayout'
import pb from '../../lib/pocketbase'
import {
  dimensionsTable,
  STATUT_STYLES,
  STATUT_LABELS,
  STATUTS,
  initialiserTables,
  reinitialiserTables,
  sauvegarderPosition,
  changerStatutTable,
} from '../../lib/tables'

const CANVAS_WIDTH = 820
const CANVAS_HEIGHT = 840

export default function PlanDeSalle() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [tableSelectionnee, setTableSelectionnee] = useState(null)
  const [enCours, setEnCours] = useState(false)
  const [message, setMessage] = useState(null)

  const nodeRefs = useRef({})
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
    try {
      const data = await pb.collection('tables').getFullList({ sort: 'numero' })
      setTables(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { charger() }, [])

  const handleInitialiser = async () => {
    setEnCours(true)
    const result = await initialiserTables()
    if (result.success) {
      await charger()
      afficherMessage('ok', '30 tables créées avec succès.')
    } else {
      afficherMessage('info', result.message)
    }
    setEnCours(false)
  }

  const handleReinitialiser = async () => {
    if (!confirm('Réinitialiser toutes les tables ? Les positions personnalisées seront perdues.')) return
    setEnCours(true)
    const result = await reinitialiserTables()
    if (result.success) {
      setTableSelectionnee(null)
      await charger()
      afficherMessage('ok', 'Tables réinitialisées.')
    } else {
      afficherMessage('erreur', result.message)
    }
    setEnCours(false)
  }

  const handleDragStop = async (table, _e, data) => {
    if (draggedRef.current) {
      const { width, height } = dimensionsTable(table.capacite)
      const newX = Math.max(0, Math.min(data.x, CANVAS_WIDTH - width))
      const newY = Math.max(0, Math.min(data.y, CANVAS_HEIGHT - height))
      await sauvegarderPosition(table.id, newX, newY)
      setTables((prev) =>
        prev.map((t) => t.id === table.id ? { ...t, position_x: newX, position_y: newY } : t)
      )
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
      setTables((prev) =>
        prev.map((t) => t.id === tableSelectionnee.id ? { ...t, statut } : t)
      )
      setTableSelectionnee((prev) => ({ ...prev, statut }))
    }
  }

  const compteurs = STATUTS.reduce((acc, s) => {
    acc[s] = tables.filter((t) => t.statut === s).length
    return acc
  }, {})

  return (
    <AdminLayout>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Plan de salle</h1>
        <div className="flex gap-3 items-center flex-wrap">
          {message && (
            <span className={`text-sm ${message.type === 'ok' ? 'text-green-600' : message.type === 'erreur' ? 'text-red-500' : 'text-gray-500'}`}>
              {message.text}
            </span>
          )}
          <button onClick={charger} className="text-sm text-gray-400 hover:text-black transition">
            Actualiser
          </button>
          {tables.length > 0 && (
            <button
              onClick={handleReinitialiser}
              disabled={enCours}
              className="text-sm text-gray-400 hover:text-red-600 transition disabled:opacity-50"
            >
              Réinitialiser
            </button>
          )}
          {tables.length === 0 && !loading && (
            <button
              onClick={handleInitialiser}
              disabled={enCours}
              className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {enCours ? 'Création en cours...' : 'Initialiser les 30 tables'}
            </button>
          )}
        </div>
      </div>

      {/* Compteurs */}
      <div className="flex gap-6 mb-5 items-center">
        {STATUTS.map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 flex-shrink-0"
              style={{ backgroundColor: STATUT_STYLES[s].bg, borderColor: STATUT_STYLES[s].border }} />
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {STATUT_LABELS[s]} <strong className="text-black">{compteurs[s] || 0}</strong>
            </span>
          </div>
        ))}
        <span className="text-sm text-gray-400 ml-auto whitespace-nowrap">
          {tables.length} table{tables.length > 1 ? 's' : ''} au total
        </span>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Chargement...</p>
      ) : tables.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <p className="text-gray-400 text-sm">
            Aucune table. Cliquez sur "Initialiser les 30 tables" pour commencer.
          </p>
        </div>
      ) : (
        <div className="flex gap-5">
          {/* Canvas */}
          <div
            className="relative bg-white rounded-xl shadow-sm border border-gray-100 flex-shrink-0 overflow-hidden"
            style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
          >
            <svg className="absolute inset-0 pointer-events-none" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {tables.map((table) => {
              const { width, height } = dimensionsTable(table.capacite)
              const style = STATUT_STYLES[table.statut]
              const isSelected = tableSelectionnee?.id === table.id
              const nodeRef = getNodeRef(table.id)

              return (
                <Draggable
                  key={table.id}
                  nodeRef={nodeRef}
                  defaultPosition={{ x: table.position_x || 0, y: table.position_y || 0 }}
                  bounds="parent"
                  onStart={() => { draggedRef.current = false }}
                  onDrag={() => { draggedRef.current = true }}
                  onStop={(e, data) => handleDragStop(table, e, data)}
                >
                  <div
                    ref={nodeRef}
                    className="absolute cursor-grab active:cursor-grabbing select-none"
                    style={{ width, height }}
                    onClick={() => handleClickTable(table)}
                  >
                    <div
                      className="w-full h-full rounded-lg flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: style.bg,
                        border: `2px solid ${isSelected ? '#000' : style.border}`,
                        boxShadow: isSelected ? '0 0 0 3px rgba(0,0,0,0.12)' : 'none',
                      }}
                    >
                      <span className="text-xs font-bold leading-none" style={{ color: style.text }}>
                        {table.numero}
                      </span>
                      <span className="text-xs leading-none mt-1" style={{ color: style.text }}>
                        {table.capacite}p
                      </span>
                    </div>
                  </div>
                </Draggable>
              )
            })}
          </div>

          {/* Panneau latéral — largeur fixe */}
          <div style={{ width: 200 }} className="flex-shrink-0">
            {tableSelectionnee ? (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h2 className="font-semibold mb-1">Table {tableSelectionnee.numero}</h2>
                <p className="text-sm text-gray-400 mb-5">{tableSelectionnee.capacite} personnes</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Statut</p>
                <div className="flex flex-col gap-2">
                  {STATUTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleChangerStatut(s)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg border transition text-left w-full"
                      style={{
                        backgroundColor: tableSelectionnee.statut === s ? STATUT_STYLES[s].bg : '#fff',
                        borderColor: tableSelectionnee.statut === s ? STATUT_STYLES[s].border : '#e5e7eb',
                      }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: STATUT_STYLES[s].border }} />
                      <span className="text-sm font-medium">{STATUT_LABELS[s]}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setTableSelectionnee(null)}
                  className="mt-5 text-xs text-gray-400 hover:text-black transition w-full text-center"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-sm text-gray-400 text-center leading-relaxed">
                  Cliquez sur une table pour voir ses options.
                </p>
                <p className="text-xs text-gray-300 mt-3 text-center leading-relaxed">
                  Glissez pour repositionner.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
