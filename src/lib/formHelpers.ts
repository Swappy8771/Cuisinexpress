export type FieldState = 'default' | 'error' | 'valid'

export function getFieldState(touched: boolean | undefined, hasError: boolean): FieldState {
  if (!touched) return 'default'
  return hasError ? 'error' : 'valid'
}

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
