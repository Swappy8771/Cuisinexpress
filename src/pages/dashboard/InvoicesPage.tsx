import { motion } from 'framer-motion'
import { Receipt, Download, Eye, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import DashboardLayout from '../../layouts/DashboardLayout'
import { invoicesService } from '../../services/invoicesService'
import type { InvoiceStatus } from '../../types'

const statusConfig: Record<InvoiceStatus, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
  paid:      { label: 'Payée',      icon: CheckCircle2, bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  pending:   { label: 'En attente', icon: Clock,        bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  cancelled: { label: 'Annulée',    icon: XCircle,      bg: 'bg-cx-muted',  text: 'text-cx-soft',   dot: 'bg-gray-400' },
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n)

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-CA', { day: '2-digit', month: 'long', year: 'numeric' })

function SkeletonRow() {
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-[auto_1fr_auto_auto_auto] gap-3 sm:gap-4 px-6 sm:px-8 py-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-cx-muted animate-pulse flex-shrink-0" />
        <div className="h-4 w-28 bg-cx-muted rounded animate-pulse" />
      </div>
      <div className="h-4 w-40 bg-cx-muted rounded animate-pulse" />
      <div className="h-4 w-24 bg-cx-muted rounded animate-pulse" />
      <div className="h-4 w-16 bg-cx-muted rounded animate-pulse" />
      <div className="h-4 w-12 bg-cx-muted rounded animate-pulse" />
    </div>
  )
}

async function handleDownload(id: string) {
  try {
    const blob = await invoicesService.download(id)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${id}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    toast.error('Erreur lors du téléchargement')
  }
}

export default function InvoicesPage() {
  const { data: invoices = [], isLoading, isError } = useQuery({
    queryKey: ['invoices'],
    queryFn: invoicesService.list,
  })

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        {/* Page header */}
        <div className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />
          <div className="p-6 sm:p-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-cx-base text-[22px] font-extrabold tracking-tight">Factures</h2>
              <p className="text-cx-soft text-[13px] mt-0.5">
                Consultez et téléchargez vos factures mensuelles
              </p>
            </div>
            {!isLoading && (
              <div className="flex items-center gap-2 text-[13px] text-cx-soft bg-cx-fill
                rounded-xl px-4 py-2 border border-cx-line">
                <Receipt size={14} />
                {invoices.length} facture{invoices.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {isError && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3
            text-red-600 text-[13.5px]">
            Impossible de charger vos factures. Veuillez réessayer.
          </div>
        )}

        {/* Summary chips */}
        {!isLoading && invoices.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {(['paid', 'pending', 'cancelled'] as InvoiceStatus[]).map((s) => {
              const count = invoices.filter(i => i.status === s).length
              const cfg = statusConfig[s]
              const Icon = cfg.icon
              return (
                <div key={s} className={`flex items-center gap-2 px-4 py-2 rounded-xl
                  border border-cx-line bg-cx-card text-[13px] font-medium ${cfg.text}`}>
                  <Icon size={13} />
                  {cfg.label} · {count}
                </div>
              )
            })}
          </div>
        )}

        {/* Invoices list */}
        <div className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

          <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-8 py-3.5
            border-b border-cx-line bg-cx-fill">
            {['Numéro', 'Période', 'Date', 'Montant', 'Actions'].map(h => (
              <span key={h} className="text-[11.5px] font-semibold text-cx-soft uppercase tracking-widest">
                {h}
              </span>
            ))}
          </div>

          {isLoading ? (
            <div className="divide-y divide-cx-line">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-cx-fill flex items-center justify-center mb-4">
                <Receipt size={28} className="text-cx-faint" />
              </div>
              <p className="text-cx-base font-semibold text-[15px] mb-1">Aucune facture</p>
              <p className="text-cx-soft text-[13px]">Vos factures apparaîtront ici.</p>
            </div>
          ) : (
            <div className="divide-y divide-cx-line">
              {invoices.map((inv, i) => {
                const cfg = statusConfig[inv.status]
                return (
                  <motion.div key={inv.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.38 }}
                    className="flex flex-col sm:grid sm:grid-cols-[auto_1fr_auto_auto_auto]
                      gap-3 sm:gap-4 items-start sm:items-center px-6 sm:px-8 py-5
                      hover:bg-cx-fill transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF0F2] flex items-center justify-center flex-shrink-0">
                        <Receipt size={14} className="text-[#C41E3A]" />
                      </div>
                      <span className="text-[13px] font-mono font-semibold text-cx-sub">{inv.id}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-semibold text-cx-base">{inv.period}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                        text-[11.5px] font-semibold ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>

                    <span className="text-[13px] text-cx-soft whitespace-nowrap">
                      {fmtDate(inv.date)}
                    </span>

                    <span className="text-[14px] font-bold text-cx-base whitespace-nowrap">
                      {fmt(inv.amount)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button className="p-2 rounded-lg hover:bg-cx-muted text-cx-soft
                        hover:text-cx-base transition-colors" title="Voir">
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleDownload(inv.id)}
                        disabled={inv.status === 'cancelled'}
                        className="p-2 rounded-lg hover:bg-[#FFF0F2] text-cx-soft
                          hover:text-[#C41E3A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Télécharger">
                        <Download size={15} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
