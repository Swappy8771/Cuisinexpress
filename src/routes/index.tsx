import { Routes, Route } from 'react-router-dom'

// Pages — public
import HomePage from '../pages/HomePage'
import SchoolsPage from '../pages/SchoolsPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'

// Pages — authenticated
import ProfilePage from '../pages/ProfilePage'
import StudentsPage from '../pages/StudentsPage'
import StatementPage from '../pages/StatementPage'
import InvoicesPage from '../pages/InvoicesPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/"                element={<HomePage />} />
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/nos-ecoles"      element={<SchoolsPage />} />

      {/* ── Authenticated ── */}
      <Route path="/user/profile"    element={<ProfilePage />} />
      <Route path="/user/students"   element={<StudentsPage />} />
      <Route path="/user/statement"  element={<StatementPage />} />
      <Route path="/user/invoices"   element={<InvoicesPage />} />
    </Routes>
  )
}
