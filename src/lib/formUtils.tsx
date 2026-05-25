import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { FieldState } from './formHelpers'

export function StatusIcon({ state }: { state: FieldState }) {
  if (state === 'default') return null
  return state === 'valid'
    ? <CheckCircle2 size={15} className="text-green-500" />
    : <XCircle     size={15} className="text-red-400"   />
}

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
