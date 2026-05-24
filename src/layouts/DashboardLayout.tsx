import { NavLink, useNavigate } from 'react-router-dom'
import { User, Users, FileText, Receipt, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { label: 'Profil', href: '/user/profile', icon: User },
  { label: 'Élèves / personnel', href: '/user/students', icon: Users },
  { label: 'Relevé de compte', href: '/user/statement', icon: FileText },
  { label: 'Factures', href: '/user/invoices', icon: Receipt },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-cx-page transition-colors duration-300">

      {/* Breadcrumb */}
      <div className="w-full bg-cx-card border-b border-cx-line">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-3">
          <ol className="flex items-center gap-1.5 text-[13px] text-cx-soft">
            <li><a href="/" className="hover:text-[#C41E3A] transition-colors">Accueil</a></li>
            <li><span className="mx-1">/</span></li>
            <li><span className="hover:text-[#C41E3A] cursor-default">Votre compte</span></li>
            <li><span className="mx-1">/</span></li>
            <li className="text-cx-base font-medium">Profil</li>
          </ol>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">

          {/* Sidebar */}
          <aside className="w-full md:w-56 lg:w-64 flex-shrink-0 flex flex-col gap-4">

            {/* User card */}
            <div className="bg-cx-card rounded-2xl border border-cx-line
              shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#C41E3A]/10 flex items-center
                    justify-center flex-shrink-0">
                    <User size={18} className="text-[#C41E3A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-cx-base font-semibold text-[14px] truncate">
                      {user ? `${user.firstName} ${user.lastName}` : 'Mon compte'}
                    </p>
                    <p className="text-cx-soft text-[12px] truncate">{user?.email}</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  {navItems.map(({ label, href, icon: Icon }) => (
                    <NavLink
                      key={href}
                      to={href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium
                        transition-all duration-200 group
                        ${isActive
                          ? 'bg-[#C41E3A]/10 text-[#C41E3A]'
                          : 'text-cx-body hover:bg-cx-fill hover:text-cx-base'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={15}
                            className={isActive ? 'text-[#C41E3A]' : 'text-cx-soft group-hover:text-cx-body'}
                          />
                          {label}
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>

            {/* Disconnect */}
            <div className="bg-cx-card rounded-2xl border border-cx-line
              shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                  border-2 border-cx-edge hover:border-[#C41E3A] rounded-xl
                  text-[13.5px] font-bold text-cx-body hover:text-[#C41E3A]
                  tracking-widest uppercase transition-all duration-200
                  hover:bg-[#FFF0F2] group"
              >
                <LogOut size={14} className="group-hover:text-[#C41E3A] transition-colors" />
                Déconnexion
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
