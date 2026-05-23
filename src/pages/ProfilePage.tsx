import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, User, Bell, Save, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  firstName: z.string().min(1, 'Requis'),
  lastName: z.string().min(1, 'Requis'),
  email: z.string().email('E-mail invalide'),
  emailConfirm: z.string().email('E-mail invalide'),
  phone: z.string().min(7, 'Numéro invalide'),
  address: z.string().optional(),
  notifications: z.boolean(),
}).refine((d) => d.email === d.emailConfirm, {
  message: 'Les e-mails ne correspondent pas',
  path: ['emailConfirm'],
})

type FormData = z.infer<typeof schema>

function Field({
  label,
  error,
  icon: Icon,
  children,
}: {
  label: string
  error?: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#333]">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Icon size={15} />
        </span>
        {children}
      </div>
      {error && <p className="text-red-500 text-[12px]">{error}</p>}
    </div>
  )
}

const inputCls = (hasError?: boolean) =>
  `w-full pl-10 pr-4 py-3 rounded-xl border text-[14px] bg-[#FAFAFA] outline-none
   transition-all duration-200 placeholder:text-gray-300
   focus:bg-white focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]
   ${hasError ? 'border-red-400' : 'border-gray-200'}`

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: 'David',
      lastName: 'Charles',
      email: user?.email ?? '',
      emailConfirm: user?.email ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
      notifications: user?.notifications ?? false,
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        firstName: 'David',
        lastName: 'Charles',
        email: user.email,
        emailConfirm: user.email,
        phone: user.phone,
        address: user.address,
        notifications: user.notifications,
      })
    }
  }, [user, reset])

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 800))
    updateUser({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      address: data.address ?? '',
      notifications: data.notifications,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-gray-100
          shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

        <div className="p-6 sm:p-8">
          {/* Heading */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[#0A0A0A] text-[22px] font-extrabold tracking-tight">
                Votre profil
              </h2>
              <p className="text-gray-400 text-[13px] mt-0.5">
                Gérez vos informations personnelles
              </p>
            </div>
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-green-600 bg-green-50
                  border border-green-200 rounded-xl px-4 py-2 text-[13px] font-medium"
              >
                <CheckCircle2 size={15} />
                Sauvegardé !
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* First name */}
              <Field label="Prénom" error={errors.firstName?.message} icon={User}>
                <input
                  {...register('firstName')}
                  placeholder="David"
                  className={inputCls(!!errors.firstName)}
                />
              </Field>

              {/* Last name */}
              <Field label="Nom de famille" error={errors.lastName?.message} icon={User}>
                <input
                  {...register('lastName')}
                  placeholder="Charles"
                  className={inputCls(!!errors.lastName)}
                />
              </Field>

              {/* Email */}
              <Field label="Adresse de courriel" error={errors.email?.message} icon={Mail}>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="exemple@email.com"
                  className={inputCls(!!errors.email)}
                />
              </Field>

              {/* Confirm email */}
              <Field label="Confirmer l'adresse de courriel" error={errors.emailConfirm?.message} icon={Mail}>
                <input
                  type="email"
                  {...register('emailConfirm')}
                  placeholder="exemple@email.com"
                  className={inputCls(!!errors.emailConfirm)}
                />
              </Field>

              {/* Phone */}
              <Field label="Téléphone" error={errors.phone?.message} icon={Phone}>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="581-992-9952"
                  className={inputCls(!!errors.phone)}
                />
              </Field>

              {/* Address */}
              <Field label="Adresse postale" icon={MapPin}>
                <input
                  {...register('address')}
                  placeholder="123 rue Exemple, Québec"
                  className={inputCls()}
                />
              </Field>
            </div>

            {/* Notifications */}
            <div className="mt-6">
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="relative">
                  <input type="checkbox" {...register('notifications')} className="peer sr-only" />
                  <div className="w-5 h-5 rounded-md border-2 border-gray-300 bg-white
                    peer-checked:bg-[#7B2535] peer-checked:border-[#7B2535]
                    group-hover:border-[#C41E3A] transition-all duration-200
                    flex items-center justify-center">
                    <svg className="w-3 h-3 text-white hidden peer-checked:block" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <input type="checkbox" {...register('notifications')}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
                <div className="flex items-center gap-2 text-[13.5px] text-[#444]">
                  <Bell size={14} className="text-gray-400" />
                  J'accepte de recevoir des e-mails de notification
                </div>
              </label>
            </div>

            {/* Divider */}
            <div className="mt-8 h-px bg-gray-100" />

            {/* Submit */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="inline-flex items-center gap-2.5 px-8 py-3 rounded-xl
                  bg-[#7B2535] hover:bg-[#9B3045]
                  disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                  text-white font-bold text-[13.5px] tracking-widest uppercase
                  transition-all duration-300
                  hover:shadow-[0_6px_20px_rgba(196,30,58,0.3)]
                  hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Enregistrement…
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Sauvegarder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
