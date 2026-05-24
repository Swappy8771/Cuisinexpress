import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

// ── Field validation state ────────────────────────────────────────
export type FieldState = 'default' | 'error' | 'valid'

export function getFieldState(touched: boolean | undefined, hasError: boolean): FieldState {
  if (!touched) return 'default'
  return hasError ? 'error' : 'valid'
}

// ── Input class generator ─────────────────────────────────────────
export function inputCls(state: FieldState, { pl = 'pl-10', pr = 'pr-10', py = 'py-3' } = {}) {
  const base = `w-full ${pl} ${pr} ${py} rounded-xl border text-[14px] bg-cx-fill outline-none
    transition-all duration-200 placeholder:text-cx-faint`

  const variant: Record<FieldState, string> = {
    default:
      'border-cx-edge focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]',
    error:
      'border-red-400 bg-red-500/[0.03] focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]',
    valid:
      'border-green-400 focus:border-green-400 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.08)]',
  }

  return `${base} ${variant[state]}`
}

// ── Right-side status icon ────────────────────────────────────────
export function StatusIcon({ state }: { state: FieldState }) {
  if (state === 'default') return null
  return state === 'valid'
    ? <CheckCircle2 size={15} className="text-green-500" />
    : <XCircle     size={15} className="text-red-400"   />
}

// ── Animated inline error message ────────────────────────────────
export function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y:  0, height: 'auto' }}
          exit={{    opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.18 }}
          className="text-red-500 text-[12px] font-medium overflow-hidden"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

// ── Reusable field wrapper (icon + label + status + error) ────────
interface FieldWrapperProps {
  label: string
  state: FieldState
  error?: string
  icon: React.ElementType
  children: React.ReactNode
  hint?: string
}

export function FieldWrapper({ label, state, error, icon: Icon, children, hint }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-cx-sub">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none
          transition-colors duration-200"
          style={{ color: state === 'error' ? '#f87171' : state === 'valid' ? '#4ade80' : undefined }}
        >
          <Icon size={15} />
        </span>
        {children}
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <StatusIcon state={state} />
        </span>
      </div>
      {hint && !error && <p className="text-cx-soft text-[12px]">{hint}</p>}
      <FieldError message={error} />
    </div>
  )
}
