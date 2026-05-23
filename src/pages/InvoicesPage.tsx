import { motion } from 'framer-motion'
import { Receipt, Download, Eye, CheckCircle2, Clock, XCircle } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'

type Status = 'paid' | 'pending' | 'cancelled'

const invoices: { id: string; date: string; period: string; amount: number; status: Status }[] = [
  { id: 'FAC-2026-005', date: '2026-05-01', period: 'Mai 2026',    amount: 75.00,  status: 'pending' },
  { id: 'FAC-2026-004', date: '2026-04-01', period: 'Avril 2026',  amount: 112.50, status: 'paid' },
  { id: 'FAC-2026-003', date: '2026-03-01', period: 'Mars 2026',   amount: 100.00, status: 'paid' },
  { id: 'FAC-2026-002', date: '2026-02-01', period: 'Février 2026',amount: 87.50,  status: 'paid' },
  { id: 'FAC-2026-001', date: '2026-01-01', period: 'Janvier 2026',amount: 50.00,  status: 'cancelled' },
]

const statusConfig: Record<Status, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
  paid:      { label: 'Payée',    icon: CheckCircle2, bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500' },
  pending:   { label: 'En attente', icon: Clock,      bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500' },
  cancelled: { label: 'Annulée',  icon: XCircle,      bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400' },
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n)

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-CA', { day: '2-digit', month: 'long', year: 'numeric' })

export default function InvoicesPage() {
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
          <div className="p-6 sm:p-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[#0A0A0A] text-[22px] font-extrabold tracking-tight">Factures</h2>
              <p className="text-gray-400 text-[13px] mt-0.5">
                Consultez et téléchargez vos factures mensuelles
              </p>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-gray-400 bg-gray-50
              rounded-xl px-4 py-2 border border-gray-100">
              <Receipt size={14} />
              {invoices.length} facture{invoices.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-3">
          {(['paid', 'pending', 'cancelled'] as Status[]).map((s) => {
            const count = invoices.filter(i => i.status === s).length
            const cfg = statusConfig[s]
            const Icon = cfg.icon
            return (
              <div key={s} className={`flex items-center gap-2 px-4 py-2 rounded-xl
                border border-gray-100 bg-white text-[13px] font-medium ${cfg.text}`}>
                <Icon size={13} />
                {cfg.label} · {count}
              </div>
            )
          })}
        </div>

        {/* Invoices list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

          {/* Table head */}
          <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-8 py-3.5
            border-b border-gray-100 bg-[#FAFAFA]">
            {['Numéro', 'Période', 'Date', 'Montant', 'Actions'].map(h => (
              <span key={h} className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-widest">
                {h}
              </span>
            ))}
          </div>

          <div className="divide-y divide-gray-50">
            {invoices.map((inv, i) => {
              const cfg = statusConfig[inv.status]
              const Icon = cfg.icon
              return (
                <motion.div key={inv.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.38 }}
                  className="flex flex-col sm:grid sm:grid-cols-[auto_1fr_auto_auto_auto]
                    gap-3 sm:gap-4 items-start sm:items-center px-6 sm:px-8 py-5
                    hover:bg-[#FAFAFA] transition-colors group"
                >
                  {/* ID */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF0F2] flex items-center justify-center flex-shrink-0">
                      <Receipt size={14} className="text-[#C41E3A]" />
                    </div>
                    <span className="text-[13px] font-mono font-semibold text-[#333]">{inv.id}</span>
                  </div>

                  {/* Period + status */}
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-semibold text-[#0A0A0A]">{inv.period}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      text-[11.5px] font-semibold ${cfg.bg} ${cfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Date */}
                  <span className="text-[13px] text-gray-400 whitespace-nowrap">
                    {fmtDate(inv.date)}
                  </span>

                  {/* Amount */}
                  <span className="text-[14px] font-bold text-[#0A0A0A] whitespace-nowrap">
                    {fmt(inv.amount)}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400
                      hover:text-[#0A0A0A] transition-colors" title="Voir">
                      <Eye size={15} />
                    </button>
                    <button
                      disabled={inv.status === 'cancelled'}
                      className="p-2 rounded-lg hover:bg-[#FFF0F2] text-gray-400
                        hover:text-[#C41E3A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Télécharger">
                      <Download size={15} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
