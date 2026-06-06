import { motion } from 'framer-motion'
import { Receipt, Download, Eye, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import DashboardLayout from '../../layouts/DashboardLayout'
import { invoicesService } from '../../services/invoicesService'
import { useLang } from '../../contexts/LangContext'
import type { InvoiceStatus } from '../../types'

const STATUS_STYLE: Record<InvoiceStatus, { icon: React.ElementType; bg: string; text: string; dot: string }> = {
  paid:      { icon: CheckCircle2, bg: 'bg-green-500/10', text: 'text-green-700', dot: 'bg-green-500' },
  pending:   { icon: Clock,        bg: 'bg-amber-500/10', text: 'text-amber-700', dot: 'bg-amber-500' },
  cancelled: { icon: XCircle,      bg: 'bg-cx-muted',     text: 'text-cx-soft',  dot: 'bg-gray-400' },
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n)

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-CA', { day: '2-digit', month: 'long', year: 'numeric' })

function SkeletonRow() {
  return (
    <div className="px-5 sm:px-8 py-4">
      {/* Mobile skeleton */}
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cx-muted animate-pulse flex-shrink-0" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-20 bg-cx-muted rounded animate-pulse" />
            <div className="h-4 w-28 bg-cx-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="h-5 w-16 bg-cx-muted rounded animate-pulse" />
          <div className="h-4 w-14 bg-cx-muted rounded-full animate-pulse" />
        </div>
      </div>
      {/* Desktop skeleton */}
      <div className="hidden sm:grid sm:grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cx-muted animate-pulse flex-shrink-0" />
          <div className="h-4 w-28 bg-cx-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-40 bg-cx-muted rounded animate-pulse" />
        <div className="h-4 w-24 bg-cx-muted rounded animate-pulse" />
        <div className="h-4 w-16 bg-cx-muted rounded animate-pulse" />
        <div className="h-4 w-12 bg-cx-muted rounded animate-pulse" />
      </div>
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
  const { t } = useLang()
  const statusConfig: Record<InvoiceStatus, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
    paid:      { label: t.invoicesPage.paid,      ...STATUS_STYLE.paid },
    pending:   { label: t.invoicesPage.pending,   ...STATUS_STYLE.pending },
    cancelled: { label: t.invoicesPage.cancelled, ...STATUS_STYLE.cancelled },
  }
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
              <h2 className="text-cx-base text-[26px] font-extrabold tracking-tight">{t.invoicesPage.title}</h2>
              <p className="text-cx-body text-[14px] mt-1">
                {t.invoicesPage.subtitle}
              </p>
            </div>
            {!isLoading && (
              <div className="flex items-center gap-2 text-[13px] text-cx-soft bg-cx-fill
                rounded-xl px-4 py-2 border border-cx-line">
                <Receipt size={14} />
                {invoices.length} {invoices.length > 1 ? t.invoicesPage.invoicePlural : t.invoicesPage.invoice}
              </div>
            )}
          </div>
        </div>

        {isError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3
            text-red-600 text-[13.5px]">
            {t.invoicesPage.loadError}
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
            {[t.invoicesPage.colNumber, t.invoicesPage.colPeriod, t.invoicesPage.colDate, t.invoicesPage.colAmount, t.invoicesPage.colActions].map(h => (
              <span key={h} className="text-[12px] font-semibold text-cx-sub uppercase tracking-widest">
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
              <p className="text-cx-base font-bold text-[17px] mb-1.5">{t.invoicesPage.noInvoices}</p>
              <p className="text-cx-body text-[14px]">{t.invoicesPage.noInvoicesHint}</p>
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
                    className="px-5 sm:px-8 py-4 hover:bg-cx-fill transition-colors group"
                  >
                    {/* Mobile layout */}
                    <div className="flex items-start justify-between gap-3 sm:hidden">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#C41E3A]/10 flex items-center justify-center flex-shrink-0">
                          <Receipt size={15} className="text-[#C41E3A]" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[13px] font-mono font-semibold text-cx-sub truncate">
                            {inv.id}
                          </span>
                          <span className="block text-[15px] font-semibold text-cx-base">{inv.period}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-[15px] font-bold text-cx-base">{fmt(inv.amount)}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
                          text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2.5 sm:hidden">
                      <span className="text-[12px] text-cx-soft">{fmtDate(inv.date)}</span>
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-cx-muted text-cx-soft
                          hover:text-cx-base transition-colors" title="Voir">
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDownload(inv.id)}
                          disabled={inv.status === 'cancelled'}
                          className="p-2 rounded-lg hover:bg-[#C41E3A]/10 text-cx-soft
                            hover:text-[#C41E3A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Télécharger">
                          <Download size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden sm:grid sm:grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#C41E3A]/10 flex items-center justify-center flex-shrink-0">
                          <Receipt size={14} className="text-[#C41E3A]" />
                        </div>
                        <span className="text-[13px] font-mono font-semibold text-cx-sub">{inv.id}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-semibold text-cx-base">{inv.period}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                          text-[11.5px] font-semibold ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>
                      <span className="text-[14px] text-cx-soft whitespace-nowrap">{fmtDate(inv.date)}</span>
                      <span className="text-[15px] font-bold text-cx-base whitespace-nowrap">{fmt(inv.amount)}</span>
                      <div className="flex items-center gap-1.5">
                        <button className="p-2 rounded-lg hover:bg-cx-muted text-cx-soft
                          hover:text-cx-base transition-colors" title="Voir">
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleDownload(inv.id)}
                          disabled={inv.status === 'cancelled'}
                          className="p-2 rounded-lg hover:bg-[#C41E3A]/10 text-cx-soft
                            hover:text-[#C41E3A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Télécharger">
                          <Download size={15} />
                        </button>
                      </div>
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
