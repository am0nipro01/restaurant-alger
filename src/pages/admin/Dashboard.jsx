import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'

const sections = [
  {
    href: '/admin/reservations',
    label: 'Réservations',
    description: 'Voir et gérer les demandes de réservation',
    emoji: '📅',
  },
  {
    href: '/admin/menu',
    label: 'Menu',
    description: 'Ajouter, modifier ou supprimer des plats',
    emoji: '🍽️',
  },
  {
    href: '/admin/contenu',
    label: 'Contenu',
    description: 'Modifier les textes des pages du site',
    emoji: '✏️',
  },
  {
    href: '/admin/plan-de-salle',
    label: 'Plan de salle',
    description: 'Gérer les tables et leur disposition',
    emoji: '🪑',
  },
]

export default function Dashboard() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-8">Tableau de bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            to={s.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex gap-4 items-start"
          >
            <span className="text-2xl">{s.emoji}</span>
            <div>
              <h2 className="font-medium mb-1">{s.label}</h2>
              <p className="text-sm text-gray-500">{s.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  )
}
