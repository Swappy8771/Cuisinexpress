import { NavLink, useNavigate } from 'react-router-dom'
import { User, Users, FileText, Receipt, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useLang } from '../contexts/LangContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuthStore()
  const { t } = useLang()
  const navigate = useNavigate()

  const navItems = [
    { label: t.dashboard.profile,   href: '/user/profile',    icon: User },
    { label: t.dashboard.students,  href: '/user/students',   icon: Users },
    { label: t.dashboard.statement, href: '/user/statement',  icon: FileText },
    { label: t.dashboard.invoices,  href: '/user/invoices',   icon: Receipt },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-cx-page transition-colors duration-300">

      {/* Breadcrumb */}
      <div className="w-full bg-cx-card border-b border-cx-line">
        <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <ol className="flex items-center gap-1.5 text-[13px] text-cx-soft overflow-hidden">
            <li className="flex-shrink-0">
              <a href="/" className="hover:text-[#C41E3A] transition-colors">{t.common.home}</a>
            </li>
            <li className="flex-shrink-0"><span className="mx-1">/</span></li>
            <li className="flex-shrink-0 hidden sm:block">
              <span className="cursor-default">{t.common.yourAccount}</span>
            </li>
            <li className="flex-shrink-0 hidden sm:block"><span className="mx-1">/</span></li>
            <li className="text-cx-base font-medium truncate">{t.common.myAccount}</li>
          </ol>
        </div>
      </div>

      {/* Mobile nav tabs */}
      <div className="md:hidden bg-cx-card border-b border-cx-line overflow-x-auto
        [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1 px-4 py-2 min-w-max">
          {navItems.map(({ label, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium
                whitespace-nowrap transition-all duration-200 flex-shrink-0
                ${isActive
                  ? 'bg-[#C41E3A]/10 text-[#C41E3A]'
                  : 'text-cx-body hover:bg-cx-fill hover:text-cx-base'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={13} className={isActive ? 'text-[#C41E3A]' : 'text-cx-soft'} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px]
              font-medium whitespace-nowrap text-cx-soft hover:text-[#C41E3A]
              hover:bg-[#C41E3A]/10 transition-all duration-200 flex-shrink-0"
          >
            <LogOut size={13} />
            <span>{t.nav.logout}</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">

          {/* Sidebar — desktop only */}
          <aside className="hidden md:flex w-56 lg:w-64 flex-shrink-0 flex-col gap-4">

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
                      {user ? `${user.firstName} ${user.lastName}` : t.common.myAccount}
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
                          <span>{label}</span>
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
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                  border-2 border-cx-edge hover:border-[#C41E3A] rounded-xl
                  text-[13.5px] font-bold text-cx-body hover:text-[#C41E3A]
                  tracking-widest uppercase transition-all duration-200
                  hover:bg-[#C41E3A]/10 group"
              >
                <LogOut size={14} className="group-hover:text-[#C41E3A] transition-colors" />
                <span>{t.nav.logout}</span>
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
