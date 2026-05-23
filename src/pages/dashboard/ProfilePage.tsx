import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, User, Bell, Save, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuthStore } from '../../store/authStore'
import { profileService } from '../../services/profileService'
import type { AxiosError } from 'axios'

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

function SkeletonField() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
      <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
    </div>
  )
}

export default function ProfilePage() {
  const { updateUser } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.get,
  })

  const mutation = useMutation({
    mutationFn: profileService.update,
    onSuccess: (updated) => {
      queryClient.setQueryData(['profile'], updated)
      updateUser(updated)
      toast.success('Profil sauvegardé !')
      reset({
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        emailConfirm: updated.email,
        phone: updated.phone,
        address: updated.address,
        notifications: updated.notifications,
      })
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message ?? 'Erreur lors de la sauvegarde')
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      emailConfirm: '',
      phone: '',
      address: '',
      notifications: false,
    },
  })

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        emailConfirm: profile.email,
        phone: profile.phone,
        address: profile.address,
        notifications: profile.notifications,
      })
    }
  }, [profile, reset])

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address ?? '',
      notifications: data.notifications,
    })
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
          </div>

          {isError && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3
              text-red-600 text-[13.5px]">
              Impossible de charger votre profil. Veuillez réessayer.
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonField key={i} />)}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <Field label="Prénom" error={errors.firstName?.message} icon={User}>
                  <input
                    {...register('firstName')}
                    placeholder="Marie"
                    className={inputCls(!!errors.firstName)}
                  />
                </Field>

                <Field label="Nom de famille" error={errors.lastName?.message} icon={User}>
                  <input
                    {...register('lastName')}
                    placeholder="Tremblay"
                    className={inputCls(!!errors.lastName)}
                  />
                </Field>

                <Field label="Adresse de courriel" error={errors.email?.message} icon={Mail}>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="exemple@email.com"
                    className={inputCls(!!errors.email)}
                  />
                </Field>

                <Field label="Confirmer l'adresse de courriel" error={errors.emailConfirm?.message} icon={Mail}>
                  <input
                    type="email"
                    {...register('emailConfirm')}
                    placeholder="exemple@email.com"
                    className={inputCls(!!errors.emailConfirm)}
                  />
                </Field>

                <Field label="Téléphone" error={errors.phone?.message} icon={Phone}>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="581-992-9952"
                    className={inputCls(!!errors.phone)}
                  />
                </Field>

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

              <div className="mt-8 h-px bg-gray-100" />

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={mutation.isPending || !isDirty}
                  className="inline-flex items-center gap-2.5 px-8 py-3 rounded-xl
                    bg-[#7B2535] hover:bg-[#9B3045]
                    disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                    text-white font-bold text-[13.5px] tracking-widest uppercase
                    transition-all duration-300
                    hover:shadow-[0_6px_20px_rgba(196,30,58,0.3)]
                    hover:-translate-y-0.5 active:translate-y-0"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
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
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
