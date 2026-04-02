import pb from './pocketbase'

// Capacité max par créneau (provisoire : 30 tables × 4 personnes)
const CAPACITE_MAX = 120

// Génère les créneaux de 12h00 à 23h00 par tranches de 30 min
export function genererCreneaux() {
  const creneaux = []
  for (let h = 12; h < 23; h++) {
    creneaux.push(`${String(h).padStart(2, '0')}:00`)
    creneaux.push(`${String(h).padStart(2, '0')}:30`)
  }
  creneaux.push('23:00')
  return creneaux
}

// Vérifie si un créneau a encore de la capacité pour une date donnée
export async function verifierCapacite(date, heure, nbPersonnes) {
  try {
    // PocketBase stocke les dates avec l'heure — on filtre sur la journée complète
    const reservations = await pb.collection('reservations').getFullList({
      filter: `date >= "${date} 00:00:00" && date <= "${date} 23:59:59" && heure = "${heure}" && statut != "annulee"`,
    })

    const totalPersonnes = reservations.reduce((acc, r) => acc + r.nb_personnes, 0)
    return totalPersonnes + nbPersonnes <= CAPACITE_MAX
  } catch (error) {
    console.error('Erreur vérification capacité:', error)
    // En cas d'erreur inattendue, on laisse passer plutôt que de bloquer
    return true
  }
}

// Crée une réservation dans PocketBase
export async function creerReservation(data) {
  try {
    const reservation = await pb.collection('reservations').create({
      nom: data.nom,
      email: data.email,
      telephone: data.telephone,
      date: data.date,
      heure: data.heure,
      nb_personnes: data.nb_personnes,
      message: data.message || '',
      statut: 'en_attente',
    })

    // Email — à brancher sur Resend quand le domaine .dz sera prêt
    console.log('[EMAIL] Confirmation à envoyer à :', data.email, '| Réservation :', reservation.id)

    return { success: true, reservation }
  } catch (error) {
    console.error('Erreur création réservation:', error)
    return { success: false, message: 'Une erreur est survenue. Veuillez réessayer.' }
  }
}
