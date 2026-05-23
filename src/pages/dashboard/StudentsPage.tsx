import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Users, Plus, Trash2, User, GraduationCap, X } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { studentsService } from '../../services/studentsService'
import type { Student } from '../../types'
import type { AxiosError } from 'axios'

const schema = z.object({
  firstName: z.string().min(1, 'Requis'),
  lastName: z.string().min(1, 'Requis'),
  school: z.string().min(1, 'Requis'),
  grade: z.string().min(1, 'Requis'),
})
type FormData = z.infer<typeof schema>

const grades = ['1re année', '2e année', '3e année', '4e année', '5e année', '6e année', 'Secondaire 1', 'Secondaire 2', 'Secondaire 3', 'Secondaire 4', 'Secondaire 5']

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 sm:px-8 py-5">
      <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-56 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  )
}

export default function StudentsPage() {
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentsService.list,
  })

  const addMutation = useMutation({
    mutationFn: studentsService.add,
    onSuccess: (newStudent) => {
      queryClient.setQueryData<Student[]>(['students'], (prev = []) => [...prev, newStudent])
      toast.success('Élève ajouté !')
      reset()
      setShowForm(false)
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => addMutation.mutate(data)

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />
          <div className="p-6 sm:p-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[#0A0A0A] text-[22px] font-extrabold tracking-tight">Élèves / personnel</h2>
              <p className="text-gray-400 text-[13px] mt-0.5">Gérez les élèves rattachés à votre compte</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-[#7B2535] hover:bg-[#9B3045] text-white
                font-semibold text-[13.5px] px-5 py-2.5 rounded-xl transition-all duration-200
                hover:shadow-[0_4px_16px_rgba(196,30,58,0.3)] hover:-translate-y-0.5"
            >
              <Plus size={15} /> Ajouter
            </button>
          </div>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-[#C41E3A]/20 shadow-[0_4px_24px_rgba(196,30,58,0.08)] overflow-hidden"
            >
              <div className="h-1 bg-[#C41E3A]" />
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-[#0A0A0A] text-[16px]">Nouvel élève</h3>
                  <button onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-[#C41E3A] transition-colors p-1">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'firstName' as const, label: 'Prénom', icon: User, placeholder: 'Emma' },
                      { name: 'lastName' as const, label: 'Nom', icon: User, placeholder: 'Tremblay' },
                      { name: 'school' as const, label: 'École', icon: GraduationCap, placeholder: "Nom de l'école" },
                    ].map(({ name, label, icon: Icon, placeholder }) => (
                      <div key={name} className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#333]">{label}</label>
                        <div className="relative">
                          <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input {...register(name)} placeholder={placeholder}
                            className={`w-full pl-9 pr-4 py-3 rounded-xl border text-[14px] bg-[#FAFAFA]
                              outline-none transition-all duration-200 placeholder:text-gray-300
                              focus:bg-white focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]
                              ${errors[name] ? 'border-red-400' : 'border-gray-200'}`}
                          />
                        </div>
                        {errors[name] && <p className="text-red-500 text-[12px]">{errors[name]?.message}</p>}
                      </div>
                    ))}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-[#333]">Année scolaire</label>
                      <select {...register('grade')}
                        className={`w-full px-4 py-3 rounded-xl border text-[14px] bg-[#FAFAFA] outline-none
                          transition-all duration-200 focus:bg-white focus:border-[#C41E3A]
                          focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)] text-[#333]
                          ${errors.grade ? 'border-red-400' : 'border-gray-200'}`}>
                        <option value="">Sélectionner</option>
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      {errors.grade && <p className="text-red-500 text-[12px]">{errors.grade.message}</p>}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-[13.5px] font-semibold
                        text-[#555] hover:border-gray-300 transition-colors">
                      Annuler
                    </button>
                    <button type="submit" disabled={addMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-[#7B2535] hover:bg-[#9B3045] text-white
                        font-bold text-[13.5px] uppercase tracking-widest transition-all duration-200
                        disabled:bg-gray-200 disabled:text-gray-400">
                      {addMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Ajout…
                        </span>
                      ) : 'Confirmer'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Students list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

          {isLoading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <Users size={28} className="text-gray-300" />
              </div>
              <p className="text-[#0A0A0A] font-semibold text-[15px] mb-1">Aucun élève ajouté</p>
              <p className="text-gray-400 text-[13px]">Cliquez sur « Ajouter » pour enregistrer un élève.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {students.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 group hover:bg-[#FAFAFA] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#C41E3A]/10 flex items-center justify-center flex-shrink-0">
                      <User size={17} className="text-[#C41E3A]" />
                    </div>
                    <div>
                      <p className="text-[#0A0A0A] font-semibold text-[14.5px]">{s.firstName} {s.lastName}</p>
                      <p className="text-gray-400 text-[12.5px] mt-0.5">{s.school} · {s.grade}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMutation.mutate(s.id)}
                    disabled={removeMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50
                      text-gray-300 hover:text-red-500 transition-all duration-200 disabled:opacity-30"
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
