import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ChevronRight, Home, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '../../services/authService'
import { getFieldState, inputCls } from '../../lib/formHelpers'
import { FieldError, StatusIcon } from '../../lib/formUtils'
import { useLang } from '../../contexts/LangContext'
import type { AxiosError } from 'axios'

const schema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const { t } = useLang()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: 'onTouched' })

  const onSubmit = async ({ email }: FormData) => {
    try {
      await authService.forgotPassword(email)
      setSubmittedEmail(email)
      setSent(true)
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      toast.error(error.response?.data?.message ?? "Erreur lors de l'envoi")
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-cx-page flex flex-col transition-colors duration-300">

      {/* Breadcrumb */}
      <div className="w-full bg-cx-card border-b border-cx-line">
        <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <ol className="flex items-center gap-1.5 text-[13px] text-cx-soft">
            <li>
              <Link to="/" className="flex items-center gap-1 hover:text-[#C41E3A] transition-colors">
                <Home size={13} />
                <span>{t.common.home}</span>
              </Link>
            </li>
            <li><ChevronRight size={12} /></li>
            <li>
              <Link to="/account" className="hover:text-[#C41E3A] transition-colors">
                <span>{t.common.yourAccount}</span>
              </Link>
            </li>
            <li><ChevronRight size={12} /></li>
            <li className="text-cx-base font-medium">{t.auth.forgotTitle}</li>
          </ol>
        </div>
      </div>

      {/* Page body */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md"
        >
          <div className="bg-cx-card rounded-3xl shadow-[0_8px_48px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_48px_rgba(0,0,0,0.5)] overflow-hidden">

            <div className="h-1.5 w-full bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

            <div className="px-8 sm:px-10 py-7">

              <AnimatePresence mode="wait">

                {/* ── FORM STATE ── */}
                {!sent && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-5 text-center">
                      <Link to="/">
                        <img src="/logo.jpg" alt="CuisineXpress" className="h-12 w-auto mx-auto mb-3 rounded-sm" />
                      </Link>
                      <div className="w-12 h-12 rounded-2xl bg-[#C41E3A]/10 flex items-center justify-center mx-auto mb-3">
                        <Mail size={22} className="text-[#C41E3A]" strokeWidth={1.75} />
                      </div>
                      <h1 className="text-cx-base text-[24px] font-extrabold tracking-tight">
                        {t.auth.forgotTitle}
                      </h1>
                      <p className="text-cx-soft text-[13.5px] mt-1.5 leading-relaxed">
                        {t.auth.forgotSubtitle}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-cx-sub">{t.auth.emailLabel}</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cx-soft pointer-events-none">
                            <Mail size={16} />
                          </span>
                          <input type="email" placeholder={t.auth.emailPlaceholder} {...register('email')}
                            className={inputCls(getFieldState(touchedFields.email, !!errors.email), { pl: 'pl-10', pr: 'pr-10', py: 'py-3.5' })}
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <StatusIcon state={getFieldState(touchedFields.email, !!errors.email)} />
                          </span>
                        </div>
                        <FieldError message={errors.email?.message} />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-1 w-full flex items-center justify-center gap-2
                          bg-[#7B2535] hover:bg-[#9B3045] disabled:bg-cx-muted
                          text-white font-bold text-[14px] tracking-widest uppercase
                          py-3.5 rounded-xl transition-all duration-300
                          hover:shadow-[0_8px_24px_rgba(196,30,58,0.35)]
                          hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            <span>{t.auth.sending}</span>
                          </span>
                        ) : (
                          <>
                            <span>{t.auth.sendRequest}</span>
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-cx-line" />
                      <span className="text-cx-faint text-[12px]">{t.common.or}</span>
                      <div className="flex-1 h-px bg-cx-line" />
                    </div>
                    <p className="text-center text-[13px] text-cx-soft">
                      <span>{t.auth.loginRetry}</span>{' '}
                      <Link to="/login" className="text-[#C41E3A] font-semibold hover:underline underline-offset-2">
                        {t.auth.signIn}
                      </Link>
                    </p>
                  </motion.div>
                )}

                {/* ── SUCCESS STATE ── */}
                {sent && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="py-2 flex flex-col items-center text-center gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
                      className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center"
                    >
                      <CheckCircle2 size={34} className="text-green-500" strokeWidth={1.5} />
                    </motion.div>

                    <div>
                      <h2 className="text-cx-base text-[20px] font-extrabold tracking-tight mb-1.5">
                        {t.auth.emailSent}
                      </h2>
                      <p className="text-cx-soft text-[13.5px] leading-relaxed max-w-xs mx-auto">
                        <span>{t.auth.resetSentTo}</span>{' '}
                        <span className="text-cx-base font-semibold">{submittedEmail}</span>.{' '}
                        <span>{t.auth.checkInbox}</span>
                      </p>
                    </div>

                    <div className="w-full bg-[#C41E3A]/10 border border-[#C41E3A]/15 rounded-xl
                      px-4 py-3 text-[13px] text-[#7B2535] leading-relaxed text-left">
                      <span>{t.auth.noEmailReceived}</span>{' '}
                      <button
                        type="button"
                        onClick={() => setSent(false)}
                        className="font-semibold underline underline-offset-2 hover:text-[#C41E3A]"
                      >
                        {t.auth.retryLink}
                      </button>.
                    </div>

                    <Link
                      to="/login"
                      className="mt-1 w-full flex items-center justify-center gap-2
                        bg-[#7B2535] hover:bg-[#9B3045] text-white font-bold
                        text-[14px] tracking-widest uppercase py-3.5 rounded-xl
                        transition-all duration-300
                        hover:shadow-[0_8px_24px_rgba(196,30,58,0.35)]"
                    >
                      <ArrowLeft size={15} />
                      <span>{t.auth.backToLogin}</span>
                    </Link>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
