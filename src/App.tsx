import { BrowserRouter } from 'react-router-dom'
import { LangProvider } from './contexts/LangContext'
import Header from './components/Header'
import Footer from './components/Footer'
import AppRoutes from './routes'

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#F5F5F5]">
          <Header />
          <AppRoutes />
          <Footer />
        </div>
      </BrowserRouter>
    </LangProvider>
  )
}
