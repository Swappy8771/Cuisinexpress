import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { useUiStore } from '../../store/uiStore'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ChevronRight, Home, Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { getFieldState, inputCls } from '../../lib/formHelpers'
import { FieldError, StatusIcon } from '../../lib/formUtils'
import { useLang } from '../../contexts/LangContext'
import type { AxiosError } from 'axios'

const schema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { setAuth } = useAuthStore()
  const { showLoader, hideLoader } = useUiStore()
  const { t } = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/user/profile'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: 'onTouched' })

  const onSubmit = async (data: FormData) => {
    try {
      const { user, tokens } = await authService.login(data)
      setAuth(user, tokens.accessToken)
      toast.success('Connexion réussie !')
      showLoader('Connexion réussie, redirection…')
      // Brief branded pause so the loader is visible, then navigate
      await new Promise((r) => setTimeout(r, 1200))
      navigate(from, { replace: true })
      hideLoader()
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      toast.error(error.response?.data?.message ?? 'Identifiants incorrects')
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
            <li className="text-cx-base font-medium">{t.auth.breadcrumbLogin}</li>
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

              {/* Heading */}
              <div className="mb-5 text-center">
                <Link to="/">
                  <img src="/logo.jpg" alt="CuisineXpress" className="h-12 w-auto mx-auto mb-3 rounded-sm" />
                </Link>
                <h1 className="text-cx-base text-[26px] font-extrabold tracking-tight">
                  {t.auth.loginTitle}
                </h1>
                <p className="text-cx-soft text-[13.5px] mt-0.5">
                  {t.auth.loginSubtitle}
                </p>
              </div>

              {/* Demo credentials banner */}
              {import.meta.env.VITE_USE_MOCK !== 'false' && (
                <div className="mb-4 rounded-xl bg-amber-500/10 border border-amber-500/25 px-4 py-2.5">
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-1">
                    {t.auth.demoAccount}
                  </p>
                  <div className="flex flex-col gap-0.5 text-[12px] text-amber-800 dark:text-amber-300 font-mono">
                    <span><span className="text-amber-500 font-semibold">{t.auth.demoEmailLabel}</span> demo@cuisinexpress.ca</span>
                    <span><span className="text-amber-500 font-semibold">{t.auth.demoPasswordLabel}</span> demo1234</span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-semibold text-cx-base">{t.auth.emailLabel}</label>
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

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-semibold text-cx-base">{t.auth.passwordLabel}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cx-soft pointer-events-none">
                      <Lock size={16} />
                    </span>
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('password')}
                      className={inputCls(getFieldState(touchedFields.password, !!errors.password), { pl: 'pl-10', pr: 'pr-20', py: 'py-3.5' })}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <StatusIcon state={getFieldState(touchedFields.password, !!errors.password)} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="text-cx-soft hover:text-[#C41E3A] transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <FieldError message={errors.password?.message} />
                </div>

                {/* Forgot password */}
                <div className="flex justify-end -mt-1">
                  <Link to="/forgot-password" className="text-[13px] text-cx-soft hover:text-[#C41E3A] transition-colors">
                    {t.auth.forgotPassword}
                  </Link>
                </div>

                {/* Submit */}
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
                      <span>{t.auth.signingIn}</span>
                    </span>
                  ) : (
                    <>
                      <span>{t.auth.loginButton}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-cx-line" />
                <span className="text-cx-faint text-[12px]">{t.common.or}</span>
                <div className="flex-1 h-px bg-cx-line" />
              </div>

              {/* Register */}
              <p className="text-center text-[13px] text-cx-soft">
                <span>{t.auth.noAccount}</span>{' '}
                <Link to="/register" className="text-[#C41E3A] font-semibold hover:underline underline-offset-2">
                  {t.auth.createAccount}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
