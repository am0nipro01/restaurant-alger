import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useRTL } from './hooks/useRTL'
import { ReservationProvider } from './context/ReservationContext'

// Pages publiques
import Home from './pages/public/Home'
import Menu from './pages/public/Menu'
import Reservation from './pages/public/Reservation'
import ReservationConfirmation from './pages/public/ReservationConfirmation'
import NotreHistoire from './pages/public/NotreHistoire'
import Contact from './pages/public/Contact'

// Pages admin
import Login from './pages/admin/Login'
import Reservations from './pages/admin/Reservations'
import MenuAdmin from './pages/admin/MenuAdmin'
import Contenu from './pages/admin/Contenu'
import PlanDeSalle from './pages/admin/PlanDeSalle'
import AdminContact from './pages/admin/AdminContact'

// Protection des routes admin — branché sur PocketBase
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin" replace />
}

// Routes accessibles uniquement aux admins (pas aux managers)
function AdminOnlyRoute({ children }) {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Navigate to="/admin" replace />
  if (role === 'manager') return <Navigate to="/admin/reservations" replace />
  return children
}

function AppContent() {
  useRTL() // applique dir="rtl" et lang sur <html> automatiquement
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/reservation/confirmation" element={<ReservationConfirmation />} />
      <Route path="/notre-histoire" element={<NotreHistoire />} />
      <Route path="/contact" element={<Contact />} />

      {/* Routes admin */}
      <Route path="/admin" element={<Login />} />
      <Route path="/admin/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
      <Route path="/admin/menu" element={<AdminOnlyRoute><MenuAdmin /></AdminOnlyRoute>} />
      <Route path="/admin/contenu" element={<AdminOnlyRoute><Contenu /></AdminOnlyRoute>} />
      <Route path="/admin/plan-de-salle" element={<PrivateRoute><PlanDeSalle /></PrivateRoute>} />
      <Route path="/admin/contact" element={<AdminOnlyRoute><AdminContact /></AdminOnlyRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ReservationProvider>
        <AppContent />
      </ReservationProvider>
    </BrowserRouter>
  )
}
