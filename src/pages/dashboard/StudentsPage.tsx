import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Users, Plus, Trash2, AlertTriangle } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { studentsService } from '../../services/studentsService'
import { getColorById, ALLERGENS } from '../../lib/mockSchoolData'
import type { Student } from '../../types'

function SkeletonCard() {
  return (
    <div className="bg-cx-card rounded-2xl border border-cx-line p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cx-muted animate-pulse flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-32 bg-cx-muted rounded animate-pulse" />
          <div className="h-3 w-24 bg-cx-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="h-3 w-48 bg-cx-muted rounded animate-pulse" />
      <div className="h-3 w-36 bg-cx-muted rounded animate-pulse" />
    </div>
  )
}

function StudentCard({
  student,
  onRemove,
  isPending,
}: {
  student: Student
  onRemove: () => void
  isPending: boolean
}) {
  const color = getColorById(student.colorCode)
  const allergenLabels = ALLERGENS.filter((a) => student.allergens.includes(a.id))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group bg-cx-card rounded-2xl border border-cx-line
        shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden
        hover:border-[#C41E3A]/20 hover:shadow-[0_4px_20px_rgba(196,30,58,0.07)]
        transition-all duration-200"
    >
      {/* Color accent strip */}
      {color && (
        <div className="h-1.5" style={{ backgroundColor: color.hex }} />
      )}

      <div className="p-5">
        {/* Header: avatar + name + remove */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Color avatar */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                text-white font-extrabold text-[15px] shadow-sm"
              style={{ backgroundColor: color?.hex ?? '#9CA3AF' }}
            >
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div>
              <p className="text-[16px] font-extrabold text-cx-base leading-tight">
                {student.firstName} {student.lastName}
              </p>
              {student.dob && (
                <p className="text-[12.5px] text-cx-soft mt-0.5">
                  Né(e) le {new Date(student.dob + 'T12:00:00').toLocaleDateString('fr-CA', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onRemove}
            disabled={isPending}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10
              text-cx-faint hover:text-red-500 transition-all duration-200 disabled:opacity-30 flex-shrink-0"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* School info */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-[13px] min-w-0">
            <span className="text-cx-soft flex-shrink-0">École :</span>
            <span className="font-semibold text-cx-base truncate">{student.schoolName}</span>
            <span className="text-cx-faint flex-shrink-0">·</span>
            <span className="text-cx-soft flex-shrink-0">{student.schoolCity}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-cx-soft">CSS :</span>
            <span className="font-semibold text-cx-base">{student.cssName}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-cx-soft">Niveau :</span>
            <span className="font-semibold text-cx-base">{student.grade}</span>
          </div>
        </div>

        {/* Class / Teacher */}
        {student.manualAssignmentRequired ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400/10
            border border-amber-400/30 mb-3">
            <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
            <span className="text-[12.5px] font-semibold text-amber-600 dark:text-amber-400">
              Assignation de classe en attente
            </span>
          </div>
        ) : student.className ? (
          <div className="flex items-center gap-2 text-[13px] mb-3">
            <span className="text-cx-soft">Classe :</span>
            <span className="font-semibold text-cx-base">{student.className}</span>
          </div>
        ) : null}

        {/* Allergens */}
        {allergenLabels.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-cx-line">
            {allergenLabels.map((a) => (
              <span key={a.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                  bg-[#C41E3A]/10 border border-[#C41E3A]/20 text-[11.5px] font-semibold text-[#C41E3A]">
                {a.emoji} {a.label}
              </span>
            ))}
          </div>
        ) : student.allergens.length === 0 && (
          <p className="text-[12px] text-cx-faint pt-3 border-t border-cx-line">
            ✅ Aucun allergène connu
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default function StudentsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentsService.list,
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

  const goAdd = () => navigate('/user/students/new')

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        {/* Header card */}
        <div className="bg-cx-card rounded-2xl border border-cx-line
          shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />
          <div className="p-6 sm:p-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-cx-base text-[26px] font-extrabold tracking-tight">Mes enfants</h2>
              <p className="text-cx-soft text-[14px] mt-0.5">
                {students.length > 0
                  ? `${students.length} enfant${students.length > 1 ? 's' : ''} inscrit${students.length > 1 ? 's' : ''}`
                  : 'Ajoutez vos enfants pour commencer à commander'}
              </p>
            </div>
            <button
              onClick={goAdd}
              className="inline-flex items-center gap-2 bg-[#7B2535] hover:bg-[#9B3045] text-white
                font-semibold text-[14px] px-5 py-2.5 rounded-xl transition-all duration-200
                hover:shadow-[0_4px_16px_rgba(196,30,58,0.3)] hover:-translate-y-0.5"
            >
              <Plus size={15} />
              <span>Ajouter un enfant</span>
            </button>
          </div>
        </div>

        {/* Student grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : students.length === 0 ? (
          <div className="bg-cx-card rounded-2xl border border-cx-line
            shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-cx-fill flex items-center justify-center mb-4">
                <Users size={28} className="text-cx-faint" />
              </div>
              <p className="text-cx-base font-semibold text-[16px] mb-1">Aucun enfant inscrit</p>
              <p className="text-cx-soft text-[14px] mb-6 max-w-xs">
                Ajoutez votre premier enfant pour commencer à commander des repas.
              </p>
              <button
                onClick={goAdd}
                className="inline-flex items-center gap-2 bg-[#C41E3A] hover:bg-[#a01830] text-white
                  font-semibold text-[14px] px-6 py-3 rounded-xl transition-all duration-200
                  hover:shadow-[0_4px_20px_rgba(196,30,58,0.35)]"
              >
                <Plus size={15} />
                Ajouter un enfant
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((s) => (
              <StudentCard
                key={s.id}
                student={s}
                onRemove={() => removeMutation.mutate(s.id)}
                isPending={removeMutation.isPending}
              />
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}
