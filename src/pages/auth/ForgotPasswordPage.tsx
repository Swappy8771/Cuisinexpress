import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ChevronRight, Home, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '../../services/authService'
import type { AxiosError } from 'axios'

const schema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

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
            <li className="text-[#0A0A0A] font-medium">Mot de passe oublié ?</li>
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
                    {/* Logo + heading */}
                    <div className="mb-8 text-center">
                      <Link to="/">
                        <img
                          src="/logo.jpg"
                          alt="CuisineXpress"
                          className="h-14 w-auto mx-auto mb-5 rounded-sm"
                        />
                      </Link>
                      <div className="w-14 h-14 rounded-2xl bg-[#FFF0F2] flex items-center
                        justify-center mx-auto mb-5">
                        <Mail size={24} className="text-[#C41E3A]" strokeWidth={1.75} />
                      </div>
                      <h1 className="text-[#0A0A0A] text-[26px] font-extrabold tracking-tight">
                        Mot de passe oublié ?
                      </h1>
                      <p className="text-gray-400 text-[14px] mt-2 leading-relaxed">
                        Entrez votre adresse e-mail et nous vous enverrons
                        un lien pour réinitialiser votre mot de passe.
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

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
                              focus:bg-white focus:border-[#C41E3A]
                              focus:shadow-[0_0_0_3px_rgba(196,30,58,0.1)]
                              ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-[12px]">{errors.email.message}</p>
                        )}
                      </div>

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
                            Envoi…
                          </span>
                        ) : (
                          <>
                            Envoyer la demande
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Back to login */}
                    <div className="flex items-center gap-3 my-7">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-gray-300 text-[12px]">ou</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <p className="text-center text-[13.5px] text-gray-400">
                      Vous souhaitez réessayer la connexion ?{' '}
                      <Link
                        to="/login"
                        className="text-[#C41E3A] font-semibold hover:underline underline-offset-2"
                      >
                        Se connecter
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
                    className="py-4 flex flex-col items-center text-center gap-5"
                  >
                    {/* Animated checkmark */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
                      className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center"
                    >
                      <CheckCircle2 size={40} className="text-green-500" strokeWidth={1.5} />
                    </motion.div>

                    <div>
                      <h2 className="text-[#0A0A0A] text-[22px] font-extrabold tracking-tight mb-2">
                        E-mail envoyé !
                      </h2>
                      <p className="text-gray-400 text-[14px] leading-relaxed max-w-xs mx-auto">
                        Un lien de réinitialisation a été envoyé à{' '}
                        <span className="text-[#0A0A0A] font-semibold">{submittedEmail}</span>.
                        Vérifiez votre boîte de réception.
                      </p>
                    </div>

                    <div className="w-full bg-[#FFF4F5] border border-[#C41E3A]/15 rounded-xl
                      px-5 py-4 text-[13px] text-[#7B2535] leading-relaxed text-left">
                      Vous n'avez pas reçu l'e-mail ? Vérifiez votre dossier spam ou{' '}
                      <button
                        onClick={() => setSent(false)}
                        className="font-semibold underline underline-offset-2 hover:text-[#C41E3A]"
                      >
                        réessayez
                      </button>.
                    </div>

                    <Link
                      to="/login"
                      className="mt-2 w-full flex items-center justify-center gap-2
                        bg-[#7B2535] hover:bg-[#9B3045] text-white font-bold
                        text-[14px] tracking-widest uppercase py-4 rounded-xl
                        transition-all duration-300
                        hover:shadow-[0_8px_24px_rgba(196,30,58,0.35)]"
                    >
                      <ArrowLeft size={15} />
                      Retour à la connexion
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
