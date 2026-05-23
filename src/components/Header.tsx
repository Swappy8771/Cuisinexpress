import { useState } from 'react'
import { Menu, X, ShoppingCart, UserCircle2, ChevronDown, LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const navLinks = [
  { label: 'Nos écoles', href: '/nos-ecoles' },
  { label: 'Pour commander', href: '#commander' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setDropOpen(false)
    navigate('/login')
  }

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <img
              src="/logo.jpg"
              alt="CuisineXpress"
              className="h-16 w-auto rounded-sm transition-all duration-300 group-hover:scale-105
                shadow-[0_0_0_2px_rgba(196,30,58,0.2)] group-hover:shadow-[0_0_0_2px_#C41E3A]"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="relative text-[#1a1a1a] text-[15px] font-medium tracking-wide
                  after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
                  after:bg-[#C41E3A] after:transition-all after:duration-300
                  hover:text-[#C41E3A] hover:after:w-full transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link
                  to="/user/orders"
                  className="relative p-2.5 rounded-xl hover:bg-gray-100
                    text-[#1a1a1a] transition-colors duration-200"
                >
                  <ShoppingCart size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C41E3A]" />
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl
                      hover:bg-gray-100 transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#C41E3A]/10 flex items-center
                      justify-center">
                      <UserCircle2 size={18} className="text-[#C41E3A]" />
                    </div>
                    <span className="text-[13.5px] font-semibold text-[#1a1a1a] max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl
                      border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                      overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-[13px] font-semibold text-[#0A0A0A] truncate">{user?.name}</p>
                        <p className="text-[12px] text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1.5">
                        <Link
                          to="/user/profile"
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-[13.5px]
                            text-[#444] hover:bg-gray-50 hover:text-[#C41E3A] transition-colors"
                        >
                          <User size={14} />
                          Mon profil
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px]
                            text-[#444] hover:bg-red-50 hover:text-[#C41E3A] transition-colors"
                        >
                          <LogOut size={14} />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center bg-[#7B2535] hover:bg-[#9B3045]
                  text-white text-[15px] font-semibold px-6 py-2.5 rounded-sm
                  transition-all duration-300 hover:shadow-[0_4px_20px_rgba(196,30,58,0.35)]
                  hover:-translate-y-px active:translate-y-0"
              >
                Se connecter
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[#1a1a1a] p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[#1a1a1a] hover:text-[#C41E3A] text-[15px] font-medium py-2
                border-b border-gray-100 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/user/profile" onClick={() => setMenuOpen(false)}
                className="text-[#1a1a1a] hover:text-[#C41E3A] text-[15px] font-medium py-2 border-b border-gray-100">
                Mon profil
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="text-left text-[#C41E3A] text-[15px] font-semibold py-2">
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-1 inline-flex justify-center items-center bg-[#7B2535] hover:bg-[#9B3045]
                text-white text-[15px] font-semibold px-6 py-2.5 rounded-sm transition-colors duration-200"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
