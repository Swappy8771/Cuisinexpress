import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ChevronRight, Home, Mail, Lock, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import type { AxiosError } from 'axios'

const schema = z.object({
  firstName: z.string().min(1, 'Requis'),
  lastName: z.string().min(1, 'Requis'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions d'utilisation" }),
  }),
})

type FormData = z.infer<typeof schema>

function StrengthBar({ password }: { password: string }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) =>
    r.test(password)
  ).length

  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
  const labels = ['Faible', 'Moyen', 'Bien', 'Fort']

  if (!password) return null

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score - 1] : 'bg-gray-100'
            }`}
          />
        ))}
      </div>
      <span className={`text-[11px] font-semibold ${colors[score - 1]?.replace('bg-', 'text-')}`}>
        {labels[score - 1] ?? ''}
      </span>
    </div>
  )
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' })

  const onSubmit = async (data: FormData) => {
    try {
      const { user, tokens } = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      })
      setAuth(user, tokens.accessToken)
      toast.success('Compte créé avec succès !')
      navigate('/user/profile')
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      toast.error(error.response?.data?.message ?? "Erreur lors de la création du compte")
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
            <li className="text-[#0A0A0A] font-medium">Créer votre compte</li>
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
          <div className="bg-white rounded-3xl shadow-[0_8px_48px_rgba(0,0,0,0.08)] overflow-hidden">

            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

            <div className="px-8 sm:px-10 py-10">

              {/* Heading */}
              <div className="mb-8 text-center">
                <Link to="/">
                  <img src="/logo.jpg" alt="CuisineXpress" className="h-14 w-auto mx-auto mb-5 rounded-sm" />
                </Link>
                <h1 className="text-[#0A0A0A] text-[28px] font-extrabold tracking-tight">
                  Créer votre compte
                </h1>
                <p className="text-gray-400 text-[14px] mt-1">
                  Rejoignez CuisineXpress dès aujourd'hui
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

                {/* First + Last name */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'firstName' as const, label: 'Prénom', placeholder: 'Marie' },
                    { name: 'lastName' as const, label: 'Nom', placeholder: 'Tremblay' },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-[#333]">{label}</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          <User size={14} />
                        </span>
                        <input
                          placeholder={placeholder}
                          {...register(name)}
                          className={`w-full pl-9 pr-3 py-3.5 rounded-xl border text-[14px]
                            bg-[#FAFAFA] outline-none transition-all duration-200
                            placeholder:text-gray-300
                            focus:bg-white focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.1)]
                            ${errors[name] ? 'border-red-400' : 'border-gray-200'}`}
                        />
                      </div>
                      {errors[name] && (
                        <p className="text-red-500 text-[12px]">{errors[name]?.message}</p>
                      )}
                    </div>
                  ))}
                </div>

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

                {/* Phone (optional) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#333]">
                    Téléphone <span className="text-gray-300 font-normal">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={16} />
                    </span>
                    <input
                      type="tel"
                      placeholder="581-992-9952"
                      {...register('phone')}
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 text-[14.5px]
                        bg-[#FAFAFA] outline-none transition-all duration-200 placeholder:text-gray-300
                        focus:bg-white focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.1)]"
                    />
                  </div>
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
                  <StrengthBar password={passwordValue} />
                  {errors.password && (
                    <p className="text-red-500 text-[12px]">{errors.password.message}</p>
                  )}
                </div>

                {/* Terms checkbox */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        {...register('terms')}
                        className="peer sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                        transition-all duration-200
                        peer-checked:bg-[#7B2535] peer-checked:border-[#7B2535]
                        ${errors.terms ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}
                        group-hover:border-[#C41E3A]`}>
                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 hidden peer-checked:block"
                          viewBox="0 0 12 10" fill="none">
                          <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <input type="checkbox" {...register('terms')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                    <span className="text-[13.5px] text-[#444] leading-snug pt-0.5">
                      J'accepte les{' '}
                      <Link to="/terms" className="text-[#C41E3A] hover:underline underline-offset-2 font-medium">
                        conditions d'utilisation
                      </Link>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-500 text-[12px] pl-8">{errors.terms.message}</p>
                  )}
                </div>

                {/* Privacy policy note */}
                <div className="flex items-start gap-2.5 bg-[#F7F7F7] rounded-xl px-4 py-3.5 mt-1">
                  <ShieldCheck size={15} className="text-[#C41E3A] flex-shrink-0 mt-0.5" />
                  <p className="text-[12.5px] text-gray-400 leading-relaxed">
                    Lien pour consulter{' '}
                    <Link to="/politique" className="text-[#C41E3A] hover:underline underline-offset-2 font-medium">
                      notre politique en matière de gestion des données
                    </Link>.
                  </p>
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
                      Création…
                    </span>
                  ) : (
                    <>
                      Confirmer
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

              {/* Login link */}
              <p className="text-center text-[13.5px] text-gray-400">
                Vous avez déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="text-[#C41E3A] font-semibold hover:underline underline-offset-2"
                >
                  Connexion
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
