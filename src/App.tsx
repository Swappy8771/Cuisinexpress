import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { LangProvider } from './contexts/LangContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'
import RouteProgressBar from './components/RouteProgressBar'
import PageLoader from './components/PageLoader'
import AppRoutes from './routes'
import { useThemeStore } from './store/themeStore'
import { useUiStore } from './store/uiStore'

function AppInner() {
  const { pageLoading, pageLoadingMsg } = useUiStore()

  return (
    <>
      <RouteProgressBar />
      <PageLoader visible={pageLoading} message={pageLoadingMsg} />
      <ScrollToTop />
      <div className="min-h-screen bg-cx-page transition-colors duration-300">
        <Header />
        <AppRoutes />
        <Footer />
      </div>
    </>
  )
}

export default function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <LangProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AppInner />
        </ErrorBoundary>
      </BrowserRouter>
    </LangProvider>
  )
}
