import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ChevronRight, Home, Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'

const schema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/user/profile'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const { user, tokens } = await authService.login(data)
      setAuth(user, tokens.accessToken)
      toast.success('Connexion réussie !')
      navigate(from, { replace: true })
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      toast.error(error.response?.data?.message ?? 'Identifiants incorrects')
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F7F7F7] flex flex-col">

      {/* Breadcrumb */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-3">
          <ol className="flex items-center gap-1.5 text-[13px] text-gray-400">
            <li>
              <Link to="/" className="flex items-center gap-1 hover:text-[#C41E3A] transition-colors">
                <Home size={13} />
                Accueil
              </Link>
            </li>
            <li><ChevronRight size={12} /></li>
            <li>
              <Link to="/account" className="hover:text-[#C41E3A] transition-colors">
                Votre compte
              </Link>
            </li>
            <li><ChevronRight size={12} /></li>
            <li className="text-[#0A0A0A] font-medium">Connexion</li>
          </ol>
        </div>
      </div>

      {/* Page body */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-[0_8px_48px_rgba(0,0,0,0.08)] overflow-hidden">

            {/* Card top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

            <div className="px-8 sm:px-10 py-10">

              {/* Heading */}
              <div className="mb-8 text-center">
                <Link to="/">
                  <img src="/logo.jpg" alt="CuisineXpress" className="h-14 w-auto mx-auto mb-5 rounded-sm" />
                </Link>
                <h1 className="text-[#0A0A0A] text-[28px] font-extrabold tracking-tight">
                  Connexion
                </h1>
                <p className="text-gray-400 text-[14px] mt-1">
                  Accédez à votre espace CuisineXpress
                </p>
              </div>

              {/* Demo credentials banner */}
              {import.meta.env.VITE_USE_MOCK !== 'false' && (
                <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                  <p className="text-[11.5px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
                    Compte de démonstration
                  </p>
                  <div className="flex flex-col gap-1 text-[12.5px] text-amber-800 font-mono">
                    <span><span className="text-amber-500 font-semibold">Email :</span> demo@cuisinexpress.ca</span>
                    <span><span className="text-amber-500 font-semibold">Mot de passe :</span> demo1234</span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#333]">
                    Adresse de courriel
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      placeholder="exemple@email.com"
                      {...register('email')}
                      className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-[14.5px]
                        bg-[#FAFAFA] outline-none transition-all duration-200
                        placeholder:text-gray-300
                        focus:bg-white focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.1)]
                        ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[12px]">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#333]">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      className={`w-full pl-10 pr-11 py-3.5 rounded-xl border text-[14.5px]
                        bg-[#FAFAFA] outline-none transition-all duration-200
                        placeholder:text-gray-300
                        focus:bg-white focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.1)]
                        ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                        hover:text-[#C41E3A] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-[12px]">{errors.password.message}</p>
                  )}
                </div>

                {/* Forgot password */}
                <div className="flex justify-end -mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-[13px] text-gray-400 hover:text-[#C41E3A] transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full flex items-center justify-center gap-2
                    bg-[#7B2535] hover:bg-[#9B3045] disabled:bg-gray-300
                    text-white font-bold text-[14px] tracking-widest uppercase
                    py-4 rounded-xl transition-all duration-300
                    hover:shadow-[0_8px_24px_rgba(196,30,58,0.35)]
                    hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white
                        rounded-full animate-spin" />
                      Connexion…
                    </span>
                  ) : (
                    <>
                      Connexion
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-7">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-gray-300 text-[12px]">ou</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Register */}
              <p className="text-center text-[13.5px] text-gray-400">
                Vous n'avez pas de compte ?{' '}
                <Link
                  to="/register"
                  className="text-[#C41E3A] font-semibold hover:underline underline-offset-2"
                >
                  Créer votre compte
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
