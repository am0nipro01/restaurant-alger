import pb from './pocketbase'

// Canvas cible : 700px de large — toutes les positions respectent cette contrainte
export const TABLES_CONFIG = [
  // 10 tables 2 pax (T1-T10) — 5 par rangée, espacement 82px
  ...Array.from({ length: 10 }, (_, i) => ({
    numero: i + 1,
    capacite: 2,
    statut: 'libre',
    position_x: 16 + (i % 5) * 82,
    position_y: i < 5 ? 28 : 112,
  })),
  // 12 tables 4 pax (T11-T22) — 6 par rangée, espacement 98px
  ...Array.from({ length: 12 }, (_, i) => ({
    numero: i + 11,
    capacite: 4,
    statut: 'libre',
    position_x: 16 + (i % 6) * 98,
    position_y: i < 6 ? 212 : 314,
  })),
  // 5 tables 6 pax (T23-T27) — 1 rangée, espacement 122px
  ...Array.from({ length: 5 }, (_, i) => ({
    numero: i + 23,
    capacite: 6,
    statut: 'libre',
    position_x: 16 + i * 122,
    position_y: 490,
  })),
  // 3 tables 8 pax (T28-T30) — 1 rangée, espacement 192px
  ...Array.from({ length: 3 }, (_, i) => ({
    numero: i + 28,
    capacite: 8,
    statut: 'libre',
    position_x: 16 + i * 192,
    position_y: 620,
  })),
]

export function dimensionsTable(capacite) {
  switch (capacite) {
    case 2: return { width: 65,  height: 65  }
    case 4: return { width: 80,  height: 80  }
    case 6: return { width: 108, height: 70  }
    case 8: return { width: 130, height: 70  }
    default: return { width: 80, height: 80 }
  }
}

export const STATUT_STYLES = {
  libre:    { bg: 'rgba(132, 83, 37, 0.05)',  border: '#845325', text: '#845325' },
  reservee: { bg: 'rgba(31, 103, 118, 0.05)', border: '#1f6776', text: '#1f6776' },
  occupee:  { bg: 'rgba(186, 26, 26, 0.05)',  border: '#ba1a1a', text: '#ba1a1a' },
}

export const STATUT_LABELS = {
  libre: 'Libre',
  reservee: 'Réservée',
  occupee: 'Occupée',
}

export const STATUTS = ['libre', 'reservee', 'occupee']

export async function initialiserTables() {
  try {
    const existantes = await pb.collection('tables').getFullList()
    if (existantes.length > 0) return { success: false, message: 'Tables déjà initialisées.' }
    for (const t of TABLES_CONFIG) {
      await pb.collection('tables').create(t)
    }
    return { success: true }
  } catch (e) {
    console.error('Erreur initialisation tables:', e)
    return { success: false, message: e.message }
  }
}

export async function reinitialiserTables() {
  try {
    const existantes = await pb.collection('tables').getFullList()
    for (const t of existantes) {
      await pb.collection('tables').delete(t.id)
    }
    for (const t of TABLES_CONFIG) {
      await pb.collection('tables').create(t)
    }
    return { success: true }
  } catch (e) {
    console.error('Erreur réinitialisation tables:', e)
    return { success: false, message: e.message }
  }
}

export async function sauvegarderPosition(id, position_x, position_y) {
  try {
    await pb.collection('tables').update(id, { position_x, position_y })
  } catch (e) {
    console.error('Erreur sauvegarde position:', e)
  }
}

export async function changerStatutTable(id, statut) {
  try {
    await pb.collection('tables').update(id, { statut })
    return true
  } catch (e) {
    console.error('Erreur changement statut:', e)
    return false
  }
}
