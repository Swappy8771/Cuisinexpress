import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { LangProvider } from './contexts/LangContext'
import Header from './components/Header'
import Footer from './components/Footer'
import AppRoutes from './routes'
import { useThemeStore } from './store/themeStore'

export default function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <LangProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-cx-page transition-colors duration-300">
          <Header />
          <AppRoutes />
          <Footer />
        </div>
      </BrowserRouter>
    </LangProvider>
  )
}
