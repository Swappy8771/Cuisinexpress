import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Phone, User, Bell, Save, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuthStore } from '../../store/authStore'
import { useLang } from '../../contexts/LangContext'
import { profileService } from '../../services/profileService'
import { getFieldState, inputCls } from '../../lib/formHelpers'
import { FieldWrapper } from '../../lib/formUtils'
import type { AxiosError } from 'axios'

const schema = z.object({
  firstName: z.string().min(1, 'Requis'),
  lastName: z.string().min(1, 'Requis'),
  email: z.string().email('E-mail invalide'),
  emailConfirm: z.string().email('E-mail invalide'),
  phone: z.string().min(7, 'Numéro invalide'),
  notifications: z.boolean(),
}).refine((d) => d.email === d.emailConfirm, {
  message: 'Les e-mails ne correspondent pas',
  path: ['emailConfirm'],
})

type FormData = z.infer<typeof schema>

function SkeletonField() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-4 w-32 bg-cx-muted rounded animate-pulse" />
      <div className="h-11 bg-cx-muted rounded-xl animate-pulse" />
    </div>
  )
}

export default function ProfilePage() {
  const { t } = useLang()
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
    control,
    formState: { errors, touchedFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      emailConfirm: '',
      phone: '',
      notifications: true,
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
      notifications: data.notifications,
    })
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-cx-card rounded-2xl border border-cx-line
          shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden"
      >
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

        <div className="p-6 sm:p-8">
          {/* Heading */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-cx-base text-[26px] font-extrabold tracking-tight">
                {t.profilePage.title}
              </h2>
              <p className="text-cx-body text-[14px] mt-1">
                {t.profilePage.subtitle}
              </p>
            </div>
          </div>

          {isError && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3
              text-red-600 dark:text-red-400 text-[13.5px]">
              {t.profilePage.loadError}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonField key={i} />)}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <FieldWrapper label={t.profilePage.firstName} icon={User}
                  state={getFieldState(touchedFields.firstName, !!errors.firstName)}
                  error={errors.firstName?.message}>
                  <input {...register('firstName')} placeholder="Marie"
                    className={inputCls(getFieldState(touchedFields.firstName, !!errors.firstName))} />
                </FieldWrapper>

                <FieldWrapper label={t.profilePage.lastName} icon={User}
                  state={getFieldState(touchedFields.lastName, !!errors.lastName)}
                  error={errors.lastName?.message}>
                  <input {...register('lastName')} placeholder="Tremblay"
                    className={inputCls(getFieldState(touchedFields.lastName, !!errors.lastName))} />
                </FieldWrapper>

                <FieldWrapper label={t.profilePage.email} icon={Mail}
                  state={getFieldState(touchedFields.email, !!errors.email)}
                  error={errors.email?.message}>
                  <input type="email" {...register('email')} placeholder="exemple@email.com"
                    className={inputCls(getFieldState(touchedFields.email, !!errors.email))} />
                </FieldWrapper>

                <FieldWrapper label={t.profilePage.confirmEmail} icon={Mail}
                  state={getFieldState(touchedFields.emailConfirm, !!errors.emailConfirm)}
                  error={errors.emailConfirm?.message}>
                  <input type="email" {...register('emailConfirm')} placeholder="exemple@email.com"
                    className={inputCls(getFieldState(touchedFields.emailConfirm, !!errors.emailConfirm))} />
                </FieldWrapper>

                <FieldWrapper label={t.profilePage.phone} icon={Phone}
                  state={getFieldState(touchedFields.phone, !!errors.phone)}
                  error={errors.phone?.message}
                  hint="Format : 514-555-0100">
                  <input type="tel" {...register('phone')} placeholder="514-555-0100"
                    className={inputCls(getFieldState(touchedFields.phone, !!errors.phone))} />
                </FieldWrapper>

              </div>

              {/* Notifications */}
              <div className="mt-6">
                <Controller
                  name="notifications"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className="flex items-center gap-3 cursor-pointer group w-fit"
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                        transition-all duration-200 group-hover:border-[#C41E3A]
                        ${field.value ? 'bg-[#7B2535] border-[#7B2535]' : 'bg-cx-card border-cx-edge'}`}>
                        {field.value && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[13.5px] text-cx-sub">
                        <Bell size={14} className="text-cx-soft" />
                        {t.profilePage.notifications}
                      </div>
                    </button>
                  )}
                />
              </div>

              <div className="mt-8 h-px bg-cx-line" />

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="inline-flex items-center gap-2.5 px-8 py-3 rounded-xl
                    bg-[#7B2535] hover:bg-[#9B3045]
                    disabled:bg-cx-muted disabled:text-cx-soft disabled:cursor-not-allowed
                    text-white font-bold text-[13.5px] tracking-widest uppercase
                    transition-all duration-300
                    hover:shadow-[0_6px_20px_rgba(196,30,58,0.3)]
                    hover:-translate-y-0.5 active:translate-y-0"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>{t.common.saving}</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>{t.common.save}</span>
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
