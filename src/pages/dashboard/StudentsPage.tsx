import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Users, Plus, Trash2, User, X } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { studentsService } from '../../services/studentsService'
import { mealsService } from '../../services/mealsService'
import { useLang } from '../../contexts/LangContext'
import type { Student } from '../../types'
import type { AxiosError } from 'axios'

const schema = z.object({
  firstName: z.string().min(1, 'Requis'),
  lastName: z.string().min(1, 'Requis'),
  school: z.string().min(1, 'Requis'),
  grade: z.string().min(1, 'Requis'),
})
type FormData = z.infer<typeof schema>

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 sm:px-8 py-5">
      <div className="w-10 h-10 rounded-xl bg-cx-muted animate-pulse flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-40 bg-cx-muted rounded animate-pulse" />
        <div className="h-3 w-56 bg-cx-muted rounded animate-pulse" />
      </div>
    </div>
  )
}

function AddStudentModal({
  open,
  onClose,
  schools,
  grades,
  onSubmit,
  isPending,
  register,
  handleSubmit,
  errors,
  cancelLabel,
  confirmLabel,
  savingLabel,
  title,
  firstNameLabel,
  lastNameLabel,
  schoolLabel,
  schoolPlaceholder,
  gradeLabel,
  selectGradeLabel,
}: {
  open: boolean
  onClose: () => void
  schools: { id: string; name: string; city: string }[]
  grades: readonly string[]
  onSubmit: (data: FormData) => void
  isPending: boolean
  register: ReturnType<typeof useForm<FormData>>['register']
  handleSubmit: ReturnType<typeof useForm<FormData>>['handleSubmit']
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors']
  cancelLabel: string
  confirmLabel: string
  savingLabel: string
  title: string
  firstNameLabel: string
  lastNameLabel: string
  schoolLabel: string
  schoolPlaceholder: string
  gradeLabel: string
  selectGradeLabel: string
}) {
  if (!open) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

            <div className="p-6 sm:p-8">
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-[#0A0A0A] text-[18px] tracking-tight">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[#1A1A1A]/40 hover:text-[#C41E3A] hover:bg-[#C41E3A]/08
                    transition-all duration-200"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First name */}
                  {[
                    { name: 'firstName' as const, label: firstNameLabel, placeholder: 'Emma' },
                    { name: 'lastName' as const, label: lastNameLabel, placeholder: 'Tremblay' },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-[#1A1A1A]/60">{label}</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 pointer-events-none" />
                        <input
                          {...register(name)}
                          placeholder={placeholder}
                          className={`w-full pl-9 pr-4 py-3 rounded-xl border text-[14px] bg-[#F5F5F5]
                            outline-none transition-all duration-200 placeholder:text-[#1A1A1A]/25
                            focus:bg-white focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]
                            ${errors[name] ? 'border-red-400' : 'border-[#E0E0E0]'}`}
                        />
                      </div>
                      {errors[name] && <p className="text-red-500 text-[12px]">{errors[name]?.message}</p>}
                    </div>
                  ))}

                  {/* School — full width */}
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#1A1A1A]/60">{schoolLabel}</label>
                    <select
                      {...register('school')}
                      className={`w-full px-4 py-3 rounded-xl border text-[14px] bg-[#F5F5F5] outline-none
                        transition-all duration-200 focus:bg-white focus:border-[#C41E3A]
                        focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)] text-[#1A1A1A]
                        ${errors.school ? 'border-red-400' : 'border-[#E0E0E0]'}`}
                    >
                      <option value="">{schoolPlaceholder}</option>
                      {schools.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} — {s.city}
                        </option>
                      ))}
                    </select>
                    {errors.school && <p className="text-red-500 text-[12px]">{errors.school.message}</p>}
                  </div>

                  {/* Grade */}
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#1A1A1A]/60">{gradeLabel}</label>
                    <select
                      {...register('grade')}
                      className={`w-full px-4 py-3 rounded-xl border text-[14px] bg-[#F5F5F5] outline-none
                        transition-all duration-200 focus:bg-white focus:border-[#C41E3A]
                        focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)] text-[#1A1A1A]
                        ${errors.grade ? 'border-red-400' : 'border-[#E0E0E0]'}`}
                    >
                      <option value="">{selectGradeLabel}</option>
                      {grades.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    {errors.grade && <p className="text-red-500 text-[12px]">{errors.grade.message}</p>}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border-2 border-[#E0E0E0] text-[13.5px] font-semibold
                      text-[#1A1A1A] hover:border-[#BDBDBD] transition-colors duration-200"
                  >
                    {cancelLabel}
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 rounded-xl bg-[#7B2535] hover:bg-[#9B3045] text-white
                      font-bold text-[13.5px] uppercase tracking-widest transition-all duration-200
                      hover:shadow-[0_4px_16px_rgba(196,30,58,0.3)] disabled:bg-[#BDBDBD] disabled:text-white/60"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>{savingLabel}</span>
                      </span>
                    ) : confirmLabel}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default function StudentsPage() {
  const { t } = useLang()
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentsService.list,
  })

  const { data: schools = [] } = useQuery({
    queryKey: ['schools'],
    queryFn: mealsService.getSchools,
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const addMutation = useMutation({
    mutationFn: studentsService.add,
    onSuccess: (newStudent) => {
      queryClient.setQueryData<Student[]>(['students'], (prev = []) => [...prev, newStudent])
      toast.success('Élève ajouté !')
      reset()
      setShowModal(false)
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message ?? "Erreur lors de l'ajout")
    },
  })

  const removeMutation = useMutation({
    mutationFn: studentsService.remove,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['students'] })
      const prev = queryClient.getQueryData<Student[]>(['students'])
      queryClient.setQueryData<Student[]>(['students'], (old = []) =>
        old.filter((s) => s.id !== id)
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['students'], ctx.prev)
      toast.error('Erreur lors de la suppression')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })

  const onSubmit = (data: FormData) => addMutation.mutate(data)

  const closeModal = () => {
    reset()
    setShowModal(false)
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        {/* Header card */}
        <div className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />
          <div className="p-6 sm:p-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-cx-base text-[22px] font-extrabold tracking-tight">{t.studentsPage.title}</h2>
              <p className="text-cx-soft text-[13px] mt-0.5">{t.studentsPage.subtitle}</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-[#7B2535] hover:bg-[#9B3045] text-white
                font-semibold text-[13.5px] px-5 py-2.5 rounded-xl transition-all duration-200
                hover:shadow-[0_4px_16px_rgba(196,30,58,0.3)] hover:-translate-y-0.5"
            >
              <Plus size={15} /> <span>{t.studentsPage.add}</span>
            </button>
          </div>
        </div>

        {/* Students list */}
        <div className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

          {isLoading ? (
            <div className="divide-y divide-cx-line">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-cx-fill flex items-center justify-center mb-4">
                <Users size={28} className="text-cx-faint" />
              </div>
              <p className="text-cx-base font-semibold text-[15px] mb-1">{t.studentsPage.empty}</p>
              <p className="text-cx-soft text-[13px]">{t.studentsPage.emptyHint}</p>
            </div>
          ) : (
            <div className="divide-y divide-cx-line">
              {students.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 group hover:bg-cx-fill transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#C41E3A]/10 flex items-center justify-center flex-shrink-0">
                      <User size={17} className="text-[#C41E3A]" />
                    </div>
                    <div>
                      <p className="text-cx-base font-semibold text-[14.5px]">{s.firstName} {s.lastName}</p>
                      <p className="text-cx-soft text-[12.5px] mt-0.5">{s.school} · {s.grade}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMutation.mutate(s.id)}
                    disabled={removeMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10
                      text-cx-faint hover:text-red-500 transition-all duration-200 disabled:opacity-30"
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Add student modal */}
      <AddStudentModal
        open={showModal}
        onClose={closeModal}
        schools={schools}
        grades={t.studentsPage.grades}
        onSubmit={onSubmit}
        isPending={addMutation.isPending}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        title={t.studentsPage.newStudent}
        firstNameLabel={t.studentsPage.firstName}
        lastNameLabel={t.studentsPage.lastName}
        schoolLabel={t.studentsPage.school}
        schoolPlaceholder={t.studentsPage.schoolPlaceholder}
        gradeLabel={t.studentsPage.grade}
        selectGradeLabel={t.studentsPage.selectGrade}
        cancelLabel={t.common.cancel}
        confirmLabel={t.common.confirm}
        savingLabel={t.common.saving}
      />
    </DashboardLayout>
  )
}
