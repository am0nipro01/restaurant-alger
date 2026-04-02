import { useLocation, Link } from 'react-router-dom'

export default function ReservationConfirmation() {
  const { state } = useLocation()

  // Si on arrive sans données (accès direct à l'URL), on redirige vers le formulaire
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Aucune réservation trouvée.</p>
          <Link to="/reservation" className="text-sm underline text-gray-500 hover:text-black transition">
            Faire une réservation
          </Link>
        </div>
      </div>
    )
  }

  const { nom, date, heure, nb_personnes } = state

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">✓</div>
        <h1 className="text-2xl font-semibold mb-3">Réservation confirmée</h1>
        <p className="text-gray-500 mb-6">
          Merci <strong>{nom}</strong>. Votre réservation pour le{' '}
          <strong>{date}</strong> à <strong>{heure}</strong> pour{' '}
          <strong>{nb_personnes} personne{nb_personnes > 1 ? 's' : ''}</strong> est bien enregistrée.
          <br /><br />
          Nous vous contacterons par email pour confirmer votre venue.
        </p>
        <Link
          to="/reservation"
          className="text-sm underline text-gray-400 hover:text-black transition"
        >
          Faire une nouvelle réservation
        </Link>
      </div>
    </div>
  )
}
