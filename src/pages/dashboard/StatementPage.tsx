import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import DashboardLayout from '../../layouts/DashboardLayout'
import { statementService } from '../../services/statementService'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n)

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-CA', { day: '2-digit', month: 'long', year: 'numeric' })

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
      <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse mb-4" />
      <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mb-2" />
      <div className="h-7 w-32 bg-gray-100 rounded animate-pulse" />
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto] gap-4 items-center px-6 sm:px-8 py-4">
      <div className="hidden sm:block h-4 w-28 bg-gray-100 rounded animate-pulse" />
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="h-4 w-20 bg-gray-100 rounded animate-pulse ml-auto" />
    </div>
  )
}

export default function StatementPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['statement'],
    queryFn: statementService.get,
  })

  const stats = data
    ? [
        { label: 'Solde actuel',   value: fmt(data.balance),            icon: Wallet,      color: 'text-[#0A0A0A]', bg: 'bg-gray-50' },
        { label: 'Total crédités', value: fmt(data.totalCredits),       icon: TrendingUp,  color: 'text-green-600',  bg: 'bg-green-50' },
        { label: 'Total débités',  value: fmt(Math.abs(data.totalDebits)), icon: TrendingDown, color: 'text-[#C41E3A]', bg: 'bg-[#FFF0F2]' },
      ]
    : []

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        {/* Page header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />
          <div className="p-6 sm:p-8">
            <h2 className="text-[#0A0A0A] text-[22px] font-extrabold tracking-tight">Relevé de compte</h2>
            <p className="text-gray-400 text-[13px] mt-0.5">Historique de vos transactions et solde disponible</p>
          </div>
        </div>

        {isError && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3
            text-red-600 text-[13.5px]">
            Impossible de charger votre relevé. Veuillez réessayer.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : stats.map(({ label, value, icon: Icon, color, bg }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6"
                >
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon size={18} className={color} strokeWidth={1.75} />
                  </div>
                  <p className="text-gray-400 text-[12.5px] font-medium mb-1">{label}</p>
                  <p className={`text-[22px] font-extrabold tracking-tight ${color}`}>{value}</p>
                </motion.div>
              ))
          }
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

          <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto] gap-4 px-6 sm:px-8 py-3.5
            border-b border-gray-100 bg-[#FAFAFA]">
            <span className="hidden sm:block text-[11.5px] font-semibold text-gray-400 uppercase tracking-widest">Date</span>
            <span className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-widest">Description</span>
            <span className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-widest text-right">Montant</span>
          </div>

          {isLoading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-50">
                {(data?.transactions ?? []).map((t, i) => (
                  <motion.div key={t.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    className="grid grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto] gap-4 items-center
                      px-6 sm:px-8 py-4 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <span className="hidden sm:block text-[13px] text-gray-400 whitespace-nowrap">
                      {fmtDate(t.date)}
                    </span>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        ${t.type === 'credit' ? 'bg-green-50' : 'bg-[#FFF0F2]'}`}>
                        {t.type === 'credit'
                          ? <ArrowDownLeft size={14} className="text-green-600" />
                          : <ArrowUpRight size={14} className="text-[#C41E3A]" />
                        }
                      </div>
                      <span className="text-[13.5px] text-[#333] truncate">{t.label}</span>
                    </div>
                    <span className={`text-[14px] font-bold text-right whitespace-nowrap
                      ${t.type === 'credit' ? 'text-green-600' : 'text-[#C41E3A]'}`}>
                      {t.type === 'credit' ? '+' : ''}{fmt(t.amount)}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between px-6 sm:px-8 py-4
                border-t-2 border-gray-100 bg-[#FAFAFA]">
                <span className="text-[13px] font-semibold text-gray-500">Solde actuel</span>
                <span className={`text-[16px] font-extrabold ${(data?.balance ?? 0) >= 0 ? 'text-[#0A0A0A]' : 'text-[#C41E3A]'}`}>
                  {fmt(data?.balance ?? 0)}
                </span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
