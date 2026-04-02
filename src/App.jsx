import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Pages publiques
import Home from './pages/public/Home'
import Menu from './pages/public/Menu'
import Reservation from './pages/public/Reservation'
import NotreHistoire from './pages/public/NotreHistoire'
import Contact from './pages/public/Contact'

// Pages admin
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Reservations from './pages/admin/Reservations'
import MenuAdmin from './pages/admin/MenuAdmin'
import Contenu from './pages/admin/Contenu'
import PlanDeSalle from './pages/admin/PlanDeSalle'

// Protection des routes admin — branché sur PocketBase
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/notre-histoire" element={<NotreHistoire />} />
        <Route path="/contact" element={<Contact />} />

        {/* Routes admin */}
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
        <Route path="/admin/menu" element={<PrivateRoute><MenuAdmin /></PrivateRoute>} />
        <Route path="/admin/contenu" element={<PrivateRoute><Contenu /></PrivateRoute>} />
        <Route path="/admin/plan-de-salle" element={<PrivateRoute><PlanDeSalle /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
