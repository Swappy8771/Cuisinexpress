import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Check, ChevronDown, HelpCircle, AlertTriangle } from 'lucide-react'
import {
  CSS_DISTRICTS, SCHOOLS, GRADES, ALLERGENS, CHILD_COLORS,
  getSchoolsByCss, getTeachers,
} from '../../lib/mockSchoolData'
import type { Student } from '../../types'

// ─── Smart cascading dropdown ──────────────────────────────────────────────────

interface DropdownOption {
  value: string
  label: string
  sub?: string
  badge?: { text: string; color: string }
  accent?: string
  disabled?: boolean
}

function SmartSelect({
  placeholder,
  value,
  options,
  onChange,
  disabled = false,
  searchable = true,
}: {
  placeholder: string
  value: string
  options: DropdownOption[]
  onChange: (v: string) => void
  disabled?: boolean
  searchable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30)
    else setQ('')
  }, [open])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const filtered = q
    ? options.filter((o) =>
        o.label.toLowerCase().includes(q.toLowerCase()) ||
        (o.sub ?? '').toLowerCase().includes(q.toLowerCase())
      )
    : options

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border
          text-left text-[14px] transition-all duration-150 outline-none
          ${disabled
            ? 'bg-cx-muted border-cx-edge text-cx-faint cursor-not-allowed'
            : open
            ? 'bg-cx-card border-[#C41E3A] shadow-[0_0_0_3px_rgba(196,30,58,0.08)]'
            : 'bg-cx-fill border-cx-edge hover:border-[#C41E3A]/50 cursor-pointer'
          }`}
      >
        <span className={`truncate ${selected ? 'text-cx-base font-medium' : 'text-cx-soft'}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 text-cx-soft transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.13 }}
            className="absolute top-full left-0 right-0 mt-1.5 z-[300]
              bg-cx-card border border-cx-line rounded-xl
              shadow-[0_8px_32px_rgba(0,0,0,0.16)] overflow-hidden"
          >
            {searchable && (
              <div className="flex items-center gap-2 px-3 py-2 border-b border-cx-line">
                <Search size={13} className="text-cx-faint flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher…"
                  className="flex-1 text-[13.5px] bg-transparent outline-none text-cx-base placeholder:text-cx-faint"
                />
              </div>
            )}
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-[13px] text-cx-faint">Aucun résultat</p>
              ) : filtered.map((opt) => {
                const isActive = value === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => { onChange(opt.value); setOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                      ${opt.disabled ? 'opacity-40 cursor-not-allowed' :
                        isActive ? 'bg-[#C41E3A]/8 text-[#C41E3A]' : 'hover:bg-cx-fill text-cx-sub'
                      }`}
                  >
                    {opt.accent && (
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: opt.accent }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13.5px] font-semibold truncate ${isActive ? 'text-[#C41E3A]' : 'text-cx-base'}`}>
                        {opt.label}
                      </p>
                      {opt.sub && (
                        <p className={`text-[11.5px] truncate ${isActive ? 'text-[#C41E3A]/70' : 'text-cx-soft'}`}>
                          {opt.sub}
                        </p>
                      )}
                    </div>
                    {opt.badge && (
                      <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: opt.badge.color + '20', color: opt.badge.color }}>
                        {opt.badge.text}
                      </span>
                    )}
                    {isActive && <Check size={13} className="flex-shrink-0 text-[#C41E3A]" strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  cssId: string
  schoolId: string
  gradeId: string
  classId: string          // 'unknown' = Je ne sais pas
  firstName: string
  lastName: string
  dob: string
  colorCode: string
  allergens: string[]
  noKnownAllergens: boolean
  allergenNotes: string
}

const EMPTY: FormState = {
  cssId: '', schoolId: '', gradeId: '', classId: '',
  firstName: '', lastName: '', dob: '',
  colorCode: '', allergens: [], noKnownAllergens: false, allergenNotes: '',
}

// ─── Main modal ────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void
  onSave: (student: Omit<Student, 'id'>) => void
  isPending?: boolean
}

export default function AddChildWizard({ onClose, onSave, isPending }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const patch = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }))

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // ESC to close
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  // ── Derived option lists ──

  const cssOptions: DropdownOption[] = CSS_DISTRICTS.map((c) => ({
    value: c.id,
    label: c.name,
    sub: c.cities.slice(0, 3).join(' · '),
    accent: c.accentColor,
  }))

  const schoolOptions: DropdownOption[] = useMemo(() => {
    if (!form.cssId) return []
    return getSchoolsByCss(form.cssId).map((s) => ({
      value: s.id,
      label: s.name,
      sub: s.city,
    }))
  }, [form.cssId])

  const gradeOptions: DropdownOption[] = GRADES.map((g) => ({
    value: g.id,
    label: g.label,
    sub: g.labelEn,
  }))

  const teacherOptions: DropdownOption[] = useMemo(() => {
    if (!form.schoolId || !form.gradeId) return []
    const teachers = getTeachers(form.schoolId, form.gradeId).map((t) => ({
      value: t.id,
      label: t.name,
      sub: GRADES.find((g) => g.id === form.gradeId)?.label,
    }))
    return [
      ...teachers,
      {
        value: 'unknown',
        label: 'Je ne sais pas',
        sub: 'Assignation manuelle par le traiteur',
      },
    ]
  }, [form.schoolId, form.gradeId])

  // ── Cascade resets ──

  const handleCssChange = (cssId: string) =>
    patch({ cssId, schoolId: '', gradeId: '', classId: '' })

  const handleSchoolChange = (schoolId: string) =>
    patch({ schoolId, gradeId: '', classId: '' })

  const handleGradeChange = (gradeId: string) =>
    patch({ gradeId, classId: '' })

  // ── Allergen toggle ──

  const toggleAllergen = (id: string) => {
    if (form.noKnownAllergens) {
      patch({ noKnownAllergens: false, allergens: [id] })
      return
    }
    const next = form.allergens.includes(id)
      ? form.allergens.filter((a) => a !== id)
      : [...form.allergens, id]
    patch({ allergens: next })
  }

  const setNone = () => patch({ allergens: [], noKnownAllergens: true, allergenNotes: '' })

  // ── Derived data for display ──

  const selectedCss = CSS_DISTRICTS.find((c) => c.id === form.cssId)
  const selectedSchool = SCHOOLS.find((s) => s.id === form.schoolId)
  const selectedGrade = GRADES.find((g) => g.id === form.gradeId)
  const isManual = form.classId === 'unknown'
  const selectedTeacher = isManual ? null : (
    form.classId ? getTeachers(form.schoolId, form.gradeId).find((t) => t.id === form.classId) : null
  )

  // ── Validation ──

  const canSave =
    !!form.cssId && !!form.schoolId && !!form.gradeId && !!form.classId &&
    !!form.firstName.trim() && !!form.lastName.trim() && !!form.dob &&
    !!form.colorCode && (form.noKnownAllergens || form.allergens.length > 0)

  // ── Submit ──

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSave || !selectedSchool || !selectedGrade) return
    onSave({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dob: form.dob,
      cssId: form.cssId,
      cssName: selectedCss?.name ?? '',
      schoolId: form.schoolId,
      schoolName: selectedSchool.name,
      schoolCity: selectedSchool.city,
      gradeId: form.gradeId,
      grade: selectedGrade.label,
      classId: isManual ? null : form.classId,
      className: isManual ? null : (selectedTeacher?.name ?? null),
      manualAssignmentRequired: isManual,
      classAssignmentStatus: isManual ? 'pending_manual_assignment' : 'assigned',
      colorCode: form.colorCode,
      allergens: form.noKnownAllergens ? [] : form.allergens,
      allergenNotes: form.allergenNotes || undefined,
    })
  }

  // ── Render ──

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl max-h-[92vh] bg-cx-card rounded-2xl
          overflow-hidden flex flex-col
          shadow-[0_24px_80px_rgba(0,0,0,0.35)] ring-1 ring-[#C41E3A]/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A] flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cx-line flex-shrink-0">
          <div>
            <h3 className="text-[18px] font-extrabold text-cx-base">Ajouter un enfant</h3>
            <p className="text-[13px] text-cx-soft mt-0.5">Remplissez tous les champs pour continuer</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-cx-fill border border-cx-edge flex items-center justify-center
              text-cx-soft hover:text-[#C41E3A] hover:border-[#C41E3A]/50 transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <form id="add-child-form" onSubmit={handleSubmit} noValidate>
            <div className="px-6 py-5 flex flex-col gap-6">

              {/* ── Section 1: School hierarchy ── */}
              <div className="flex flex-col gap-3">
                <p className="text-[12px] font-extrabold text-cx-soft uppercase tracking-widest">
                  Établissement scolaire
                </p>

                {/* Row 1: CSS + School */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-semibold text-cx-base">
                      District (CSS) <span className="text-[#C41E3A]">*</span>
                    </label>
                    <SmartSelect
                      placeholder="Sélectionner un CSS"
                      value={form.cssId}
                      options={cssOptions}
                      onChange={handleCssChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-semibold text-cx-base">
                      École <span className="text-[#C41E3A]">*</span>
                    </label>
                    <SmartSelect
                      placeholder={form.cssId ? 'Sélectionner une école' : 'Choisir un CSS d\'abord'}
                      value={form.schoolId}
                      options={schoolOptions}
                      onChange={handleSchoolChange}
                      disabled={!form.cssId}
                    />
                  </div>
                </div>

                {/* Row 2: Grade + Teacher */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-semibold text-cx-base">
                      Niveau <span className="text-[#C41E3A]">*</span>
                    </label>
                    <SmartSelect
                      placeholder={form.schoolId ? 'Sélectionner un niveau' : 'Choisir une école d\'abord'}
                      value={form.gradeId}
                      options={gradeOptions}
                      onChange={handleGradeChange}
                      disabled={!form.schoolId}
                      searchable={false}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-semibold text-cx-base flex items-center gap-1.5">
                      Classe / Enseignant(e) <span className="text-[#C41E3A]">*</span>
                      <HelpCircle size={12} className="text-cx-faint" />
                    </label>
                    <SmartSelect
                      placeholder={form.gradeId ? 'Sélectionner un(e) enseignant(e)' : 'Choisir un niveau d\'abord'}
                      value={form.classId}
                      options={teacherOptions}
                      onChange={(v) => patch({ classId: v })}
                      disabled={!form.gradeId}
                    />
                  </div>
                </div>

                {/* Manual assignment warning */}
                {isManual && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-400/10 border border-amber-400/25">
                    <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[12.5px] text-amber-700 dark:text-amber-400 leading-relaxed">
                      Le traiteur assignera manuellement la classe.
                      Statut : <strong>En attente d'assignation</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* ── Section 2: Child info ── */}
              <div className="flex flex-col gap-3">
                <p className="text-[12px] font-extrabold text-cx-soft uppercase tracking-widest">
                  Informations de l'enfant
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-semibold text-cx-base">
                      Prénom <span className="text-[#C41E3A]">*</span>
                    </label>
                    <input
                      value={form.firstName}
                      onChange={(e) => patch({ firstName: e.target.value })}
                      placeholder="Emma"
                      className="px-3.5 py-2.5 rounded-xl border border-cx-edge text-[14px]
                        bg-cx-fill text-cx-base outline-none transition-all placeholder:text-cx-soft
                        focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-semibold text-cx-base">
                      Nom <span className="text-[#C41E3A]">*</span>
                    </label>
                    <input
                      value={form.lastName}
                      onChange={(e) => patch({ lastName: e.target.value })}
                      placeholder="Tremblay"
                      className="px-3.5 py-2.5 rounded-xl border border-cx-edge text-[14px]
                        bg-cx-fill text-cx-base outline-none transition-all placeholder:text-cx-soft
                        focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-semibold text-cx-base">
                      Date de naissance <span className="text-[#C41E3A]">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => patch({ dob: e.target.value })}
                      max={new Date().toISOString().slice(0, 10)}
                      className="px-3.5 py-2.5 rounded-xl border border-cx-edge text-[14px]
                        bg-cx-fill text-cx-base outline-none transition-all
                        focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]"
                    />
                  </div>
                </div>
              </div>

              {/* ── Section 3: Color ── */}
              <div className="flex flex-col gap-3">
                <p className="text-[12px] font-extrabold text-cx-soft uppercase tracking-widest">
                  Couleur de l'enfant <span className="text-[#C41E3A] normal-case font-normal text-[11px]">*</span>
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  {CHILD_COLORS.map((color) => {
                    const isSelected = form.colorCode === color.id
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => patch({ colorCode: color.id })}
                        title={color.label}
                        className="flex flex-col items-center gap-1.5 group"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl transition-all duration-150 flex items-center justify-center
                            shadow-[0_2px_8px_rgba(0,0,0,0.15)] group-hover:scale-110
                            ${isSelected ? 'scale-110 ring-2 ring-offset-2' : ''}`}
                          style={{
                            backgroundColor: color.hex,
                            ...(isSelected ? { outline: `3px solid ${color.hex}`, outlineOffset: '2px' } : {}),
                          }}
                        >
                          {isSelected && <Check size={15} className="text-white drop-shadow" strokeWidth={3} />}
                        </div>
                        <span className={`text-[11px] font-semibold ${isSelected ? 'text-cx-base' : 'text-cx-faint'}`}>
                          {color.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Section 4: Allergens ── */}
              <div className="flex flex-col gap-3">
                <p className="text-[12px] font-extrabold text-cx-soft uppercase tracking-widest">
                  Allergènes <span className="text-[#C41E3A] normal-case font-normal text-[11px]">*</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALLERGENS.map((a) => {
                    const isSelected = form.allergens.includes(a.id)
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAllergen(a.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                          border text-[13px] font-semibold transition-all duration-150
                          ${isSelected
                            ? 'border-[#C41E3A] bg-[#C41E3A]/10 text-[#C41E3A]'
                            : 'border-cx-edge bg-cx-fill text-cx-sub hover:border-[#C41E3A]/40'
                          }`}
                      >
                        <span>{a.emoji}</span>
                        <span>{a.label}</span>
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </button>
                    )
                  })}

                  {/* No known */}
                  <button
                    type="button"
                    onClick={setNone}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                      border text-[13px] font-semibold transition-all duration-150
                      ${form.noKnownAllergens
                        ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'border-cx-edge bg-cx-fill text-cx-sub hover:border-green-500/50'
                      }`}
                  >
                    <span>✅</span>
                    <span>Aucun allergène</span>
                    {form.noKnownAllergens && <Check size={11} strokeWidth={3} />}
                  </button>
                </div>

                {/* Other notes */}
                {!form.noKnownAllergens && (
                  <textarea
                    rows={2}
                    value={form.allergenNotes}
                    onChange={(e) => patch({ allergenNotes: e.target.value })}
                    placeholder="Autres précisions sur les allergènes (optionnel)…"
                    className="px-3.5 py-2.5 rounded-xl border border-cx-edge text-[13.5px]
                      bg-cx-fill text-cx-base outline-none transition-all resize-none placeholder:text-cx-soft
                      focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]"
                  />
                )}
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-cx-line flex items-center justify-between gap-3">
          {/* Completion indicator */}
          <div className="flex items-center gap-2">
            {[
              !!form.cssId && !!form.schoolId && !!form.gradeId && !!form.classId,
              !!form.firstName && !!form.lastName && !!form.dob,
              !!form.colorCode,
              form.noKnownAllergens || form.allergens.length > 0,
            ].map((done, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  done ? 'bg-[#C41E3A] scale-110' : 'bg-cx-muted'
                }`}
              />
            ))}
            <span className="text-[12px] text-cx-faint ml-1">
              {[
                !!form.cssId && !!form.schoolId && !!form.gradeId && !!form.classId,
                !!form.firstName && !!form.lastName && !!form.dob,
                !!form.colorCode,
                form.noKnownAllergens || form.allergens.length > 0,
              ].filter(Boolean).length} / 4 sections
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border-2 border-cx-edge text-[13.5px] font-semibold
                text-cx-body hover:border-cx-muted transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="add-child-form"
              disabled={!canSave || isPending}
              className="px-6 py-2.5 rounded-xl bg-[#7B2535] hover:bg-[#9B3045] text-white
                font-bold text-[13.5px] transition-all duration-200
                hover:shadow-[0_4px_16px_rgba(196,30,58,0.3)]
                disabled:bg-cx-muted disabled:text-cx-soft disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Enregistrement…
                </span>
              ) : 'Confirmer et ajouter'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  )
}
