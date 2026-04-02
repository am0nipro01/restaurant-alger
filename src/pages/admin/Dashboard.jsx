import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-black transition"
          >
            Se déconnecter
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <a href="/admin/reservations" className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
            <h2 className="font-medium mb-1">Réservations</h2>
            <p className="text-sm text-gray-500">Gérer les réservations</p>
          </a>
          <a href="/admin/menu" className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
            <h2 className="font-medium mb-1">Menu</h2>
            <p className="text-sm text-gray-500">Modifier la carte</p>
          </a>
          <a href="/admin/contenu" className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
            <h2 className="font-medium mb-1">Contenu</h2>
            <p className="text-sm text-gray-500">Modifier les pages</p>
          </a>
          <a href="/admin/plan-de-salle" className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
            <h2 className="font-medium mb-1">Plan de salle</h2>
            <p className="text-sm text-gray-500">Gérer les tables</p>
          </a>
        </div>
      </div>
    </div>
  )
}
