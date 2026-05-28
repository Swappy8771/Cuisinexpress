import { useState } from 'react'
import { Menu, X, ShoppingCart, UserCircle2, ChevronDown, LogOut, User, Sun, Moon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useCartStore, selectCartCount } from '../store/cartStore'
import { useLang } from '../contexts/LangContext'
import { useThemeStore } from '../store/themeStore'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const cartCount = useCartStore(selectCartCount)
  const navigate = useNavigate()
  const { t } = useLang()
  const { theme, toggle } = useThemeStore()

  const navLinks = [
    { label: t.nav.schools, href: '/nos-ecoles' },
    { label: t.nav.order,   href: '/commander'  },
  ]

  const handleLogout = () => {
    logout()
    setDropOpen(false)
    navigate('/login')
  }

  return (
    <header className="w-full bg-cx-card sticky top-0 z-50 shadow-[0_2px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)] transition-colors duration-300 border-b border-cx-line">
      <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6">
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
                key={link.href}
                to={link.href}
                className="relative text-cx-base text-[15px] font-semibold tracking-wide
                  after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
                  after:bg-[#C41E3A] after:transition-all after:duration-300
                  hover:text-[#C41E3A] hover:after:w-full transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Language toggle */}
            <LanguageSwitcher className="hidden md:flex" />

            {/* Theme toggle — desktop only; mobile has its own inside the drawer */}
            <button
              onClick={toggle}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-xl
                hover:bg-cx-muted text-cx-soft hover:text-cx-base transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun size={17} className="text-amber-400" />
                : <Moon size={17} />
              }
            </button>

            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link
                  to="/panier"
                  className="relative p-2.5 rounded-xl hover:bg-cx-muted
                    text-cx-base transition-colors duration-200"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                      flex items-center justify-center rounded-full bg-[#C41E3A]
                      text-white text-[10px] font-bold leading-none">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  ) : (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C41E3A]" />
                  )}
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl
                      hover:bg-cx-muted transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#C41E3A]/10 flex items-center
                      justify-center">
                      <UserCircle2 size={18} className="text-[#C41E3A]" />
                    </div>
                    <span className="text-[13.5px] font-semibold text-cx-base max-w-[100px] truncate">
                      {user?.firstName}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-cx-soft transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-cx-card rounded-2xl
                          border border-cx-line shadow-[0_8px_32px_rgba(0,0,0,0.15)]
                          dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                          overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-cx-line">
                          <p className="text-[13px] font-semibold text-cx-base truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-[12px] text-cx-soft truncate">{user?.email}</p>
                        </div>
                        <div className="py-1.5">
                          <Link
                            to="/user/profile"
                            onClick={() => setDropOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-[13.5px]
                              text-cx-sub hover:bg-cx-fill hover:text-[#C41E3A] transition-colors"
                          >
                            <User size={14} />
                            {t.nav.profile}
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px]
                              text-cx-sub hover:bg-[#C41E3A]/10 hover:text-[#C41E3A] transition-colors"
                          >
                            <LogOut size={14} />
                            {t.nav.logout}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center bg-[#7B2535] hover:bg-[#9B3045]
                  text-white !text-white text-[15px] font-semibold px-6 py-2.5 rounded-sm
                  transition-all duration-300 hover:shadow-[0_4px_20px_rgba(196,30,58,0.35)]
                  hover:-translate-y-px active:translate-y-0"
              >
                {t.nav.login}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-cx-base p-2 rounded-md hover:bg-cx-muted transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden"
          >
            <div className="bg-cx-card border-t border-cx-line px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-cx-base hover:text-[#C41E3A] text-[15px] font-medium py-2
                    border-b border-cx-line transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile language + theme row */}
              <div className="flex items-center justify-between py-2 border-b border-cx-line">
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-cx-soft font-medium">Language / Langue :</span>
                  <LanguageSwitcher />
                </div>
                <button
                  onClick={toggle}
                  className="flex items-center gap-1.5 text-[13px] text-cx-soft font-medium
                    hover:text-cx-base transition-colors"
                >
                  {theme === 'dark'
                    ? <><Sun size={15} className="text-amber-400" /> Clair</>
                    : <><Moon size={15} /> Sombre</>
                  }
                </button>
              </div>

              {isAuthenticated ? (
                <>
                  <Link to="/user/profile" onClick={() => setMenuOpen(false)}
                    className="text-cx-base hover:text-[#C41E3A] text-[15px] font-medium py-2 border-b border-cx-line">
                    {t.nav.profile}
                  </Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false) }}
                    className="text-left text-[#C41E3A] text-[15px] font-semibold py-2">
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 inline-flex justify-center items-center bg-[#7B2535] hover:bg-[#9B3045]
                    text-white !text-white text-[15px] font-semibold px-6 py-2.5 rounded-sm transition-colors duration-200"
                >
                  {t.nav.login}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
