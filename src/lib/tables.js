import pb from './pocketbase'

// Distribution provisoire : 30 tables, 4 tailles
export const TABLES_CONFIG = [
  // 10 tables de 2 personnes (numéros 1-10)
  ...Array.from({ length: 10 }, (_, i) => ({
    numero: i + 1,
    capacite: 2,
    statut: 'libre',
    position_x: 30 + (i % 5) * 110,
    position_y: i < 5 ? 40 : 160,
  })),
  // 12 tables de 4 personnes (numéros 11-22)
  ...Array.from({ length: 12 }, (_, i) => ({
    numero: i + 11,
    capacite: 4,
    statut: 'libre',
    position_x: 30 + (i % 6) * 140,
    position_y: i < 6 ? 300 : 440,
  })),
  // 5 tables de 6 personnes (numéros 23-27)
  ...Array.from({ length: 5 }, (_, i) => ({
    numero: i + 23,
    capacite: 6,
    statut: 'libre',
    position_x: 30 + i * 160,
    position_y: 580,
  })),
  // 3 tables de 8 personnes (numéros 28-30)
  ...Array.from({ length: 3 }, (_, i) => ({
    numero: i + 28,
    capacite: 8,
    statut: 'libre',
    position_x: 30 + i * 190,
    position_y: 710,
  })),
]

export function dimensionsTable(capacite) {
  switch (capacite) {
    case 2: return { width: 70, height: 70 }
    case 4: return { width: 90, height: 90 }
    case 6: return { width: 120, height: 80 }
    case 8: return { width: 150, height: 80 }
    default: return { width: 90, height: 90 }
  }
}

export const STATUT_STYLES = {
  libre:    { bg: '#dcfce7', border: '#16a34a', text: '#15803d' },
  reservee: { bg: '#fef9c3', border: '#ca8a04', text: '#92400e' },
  occupee:  { bg: '#fee2e2', border: '#dc2626', text: '#b91c1c' },
}

export const STATUT_LABELS = {
  libre: 'Libre',
  reservee: 'Réservée',
  occupee: 'Occupée',
}

export const STATUTS = ['libre', 'reservee', 'occupee']

// Initialiser les tables — création séquentielle pour éviter les erreurs de rate limiting
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

// Réinitialiser — supprime toutes les tables et recrée les 30
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
