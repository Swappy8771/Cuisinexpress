import { Routes, Route } from 'react-router-dom'
import PrivateRoute from '../components/PrivateRoute'

// Pages — home
import HomePage from '../pages/home/HomePage'

// Pages — auth
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'

// Pages — orders
import OrderPage from '../pages/orders/OrderPage'
import CartPage from '../pages/cart/CartPage'

// Pages — schools
import SchoolsPage from '../pages/schools/SchoolsPage'

// Pages — dashboard (authenticated)
import ProfilePage from '../pages/dashboard/ProfilePage'
import StudentsPage from '../pages/dashboard/StudentsPage'
import StatementPage from '../pages/dashboard/StatementPage'
import InvoicesPage from '../pages/dashboard/InvoicesPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/"                element={<HomePage />} />
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/nos-ecoles"      element={<SchoolsPage />} />
      <Route path="/commander"       element={<OrderPage />} />
      <Route path="/panier"          element={<CartPage />} />

      {/* ── Authenticated ── */}
      <Route path="/user/profile"   element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/user/students"  element={<PrivateRoute><StudentsPage /></PrivateRoute>} />
      <Route path="/user/statement" element={<PrivateRoute><StatementPage /></PrivateRoute>} />
      <Route path="/user/invoices"  element={<PrivateRoute><InvoicesPage /></PrivateRoute>} />
    </Routes>
  )
}
