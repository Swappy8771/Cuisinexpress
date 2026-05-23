import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'

const transactions = [
  { id: 1, date: '2026-05-20', label: 'Commande #1042 — Emma Charles', type: 'debit',  amount: -12.50 },
  { id: 2, date: '2026-05-20', label: 'Commande #1043 — Lucas Charles', type: 'debit',  amount: -12.50 },
  { id: 3, date: '2026-05-15', label: 'Rechargement du compte',          type: 'credit', amount: +100.00 },
  { id: 4, date: '2026-05-13', label: 'Commande #1038 — Emma Charles',  type: 'debit',  amount: -12.50 },
  { id: 5, date: '2026-05-13', label: 'Commande #1039 — Lucas Charles', type: 'debit',  amount: -12.50 },
  { id: 6, date: '2026-05-06', label: 'Commande #1031 — Emma Charles',  type: 'debit',  amount: -12.50 },
  { id: 7, date: '2026-05-01', label: 'Rechargement du compte',          type: 'credit', amount: +50.00 },
]

const balance = transactions.reduce((sum, t) => sum + t.amount, 0)
const totalCredits = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
const totalDebits = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n)

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-CA', { day: '2-digit', month: 'long', year: 'numeric' })

const stats = [
  { label: 'Solde actuel',   value: fmt(balance),       icon: Wallet,      color: 'text-[#0A0A0A]', bg: 'bg-gray-50' },
  { label: 'Total crédités', value: fmt(totalCredits),  icon: TrendingUp,  color: 'text-green-600',  bg: 'bg-green-50' },
  { label: 'Total débités',  value: fmt(Math.abs(totalDebits)), icon: TrendingDown, color: 'text-[#C41E3A]', bg: 'bg-[#FFF0F2]' },
]

export default function StatementPage() {
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

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
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
          ))}
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto] gap-4 px-6 sm:px-8 py-3.5
            border-b border-gray-100 bg-[#FAFAFA]">
            <span className="hidden sm:block text-[11.5px] font-semibold text-gray-400 uppercase tracking-widest">Date</span>
            <span className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-widest">Description</span>
            <span className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-widest text-right">Montant</span>
          </div>

          <div className="divide-y divide-gray-50">
            {transactions.map((t, i) => (
              <motion.div key={t.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto] gap-4 items-center
                  px-6 sm:px-8 py-4 hover:bg-[#FAFAFA] transition-colors group"
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

          {/* Footer balance */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4
            border-t-2 border-gray-100 bg-[#FAFAFA]">
            <span className="text-[13px] font-semibold text-gray-500">Solde actuel</span>
            <span className={`text-[16px] font-extrabold ${balance >= 0 ? 'text-[#0A0A0A]' : 'text-[#C41E3A]'}`}>
              {fmt(balance)}
            </span>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
