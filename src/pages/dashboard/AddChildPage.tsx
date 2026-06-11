import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  ChevronLeft, ChevronRight, Search, Check,
  User, HelpCircle, AlertTriangle,
} from 'lucide-react'
import {
  CSS_DISTRICTS, SCHOOLS, GRADES, ALLERGENS, CHILD_COLORS,
  getSchoolsByCss, getTeachers,
} from '../../lib/mockSchoolData'
import { studentsService } from '../../services/studentsService'
import { useLang } from '../../contexts/LangContext'
import type { Student } from '../../types'
import type { Translations } from '../../i18n/translations'

type T = Translations['addChild']
type Lang = 'fr' | 'en'

// ─── Wizard state ──────────────────────────────────────────────────────────────

interface WizardData {
  cssId: string; cssName: string; cssAccentColor: string
  schoolId: string; schoolName: string; schoolCity: string
  gradeId: string; gradeLabel: string
  classId: string | null; className: string | null; manualAssignment: boolean
  firstName: string; lastName: string; dob: string
  colorCode: string
  allergens: string[]; noKnownAllergens: boolean; allergenOther: boolean; allergenNotes: string
}

const EMPTY: WizardData = {
  cssId: '', cssName: '', cssAccentColor: '',
  schoolId: '', schoolName: '', schoolCity: '',
  gradeId: '', gradeLabel: '',
  classId: null, className: null, manualAssignment: false,
  firstName: '', lastName: '', dob: '',
  colorCode: '',
  allergens: [], noKnownAllergens: false, allergenOther: false, allergenNotes: '',
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

// ─── Step 1 — CSS District ────────────────────────────────────────────────────

function StepCss({ data, patch, search, setSearch, onSelectSchoolDirect, t }: {
  data: WizardData; patch: (p: Partial<WizardData>) => void
  search: string; setSearch: (s: string) => void
  onSelectSchoolDirect: (school: typeof SCHOOLS[0]) => void
  t: T
}) {
  const q = search.toLowerCase()

  const schoolMatches = useMemo(() =>
    !q ? [] : SCHOOLS.filter((s) =>
      s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    ), [q])

  const cssFiltered = useMemo(() =>
    !q ? CSS_DISTRICTS : CSS_DISTRICTS.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.cities.some((ci) => ci.toLowerCase().includes(q))
    ), [q])

  const showSchoolResults = q.length > 0 && schoolMatches.length > 0
  const showCssTiles = !showSchoolResults || cssFiltered.length > 0

  const schoolWord = (n: number) =>
    n === 1 ? `1 ${t.css.schools}` : `${n} ${t.css.schoolsPlural}`

  return (
    <div className="flex flex-col gap-5">
      <div className="relative max-w-lg">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cx-soft pointer-events-none" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} autoFocus
          placeholder={t.css.searchPlaceholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-cx-edge text-[15px]
            bg-cx-fill text-cx-base outline-none placeholder:text-cx-soft transition-all
            focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]" />
      </div>

      {/* School results when searching by school name / city */}
      {showSchoolResults && (
        <div className="flex flex-col gap-3">
          <p className="text-[12px] font-extrabold text-cx-soft uppercase tracking-widest">
            {t.css.matchingSchools} ({schoolMatches.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {schoolMatches.map((school) => {
              const css = CSS_DISTRICTS.find((c) => c.id === school.cssId)!
              return (
                <motion.button key={school.id} whileHover={{ y: -3 }} transition={{ duration: 0.15 }}
                  onClick={() => { onSelectSchoolDirect(school); setSearch('') }}
                  className="text-left p-4 rounded-2xl border-2 border-cx-line bg-cx-card
                    hover:border-[#C41E3A]/50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)]
                    transition-all duration-200"
                >
                  <p className="text-[15px] font-bold text-cx-base leading-snug">{school.name}</p>
                  <p className="text-[13px] text-cx-soft mt-1">{school.city}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11.5px] font-bold"
                    style={{ backgroundColor: css.bgLight, color: css.accentColor,
                      border: `1px solid ${css.accentColor}44` }}>
                    {css.shortName}
                  </span>
                </motion.button>
              )
            })}
          </div>
          {cssFiltered.length > 0 && <div className="h-px bg-cx-line my-1" />}
        </div>
      )}

      {/* CSS district tiles */}
      {showCssTiles && (
        <div className="flex flex-col gap-3">
          {q && cssFiltered.length > 0 && (
            <p className="text-[12px] font-extrabold text-cx-soft uppercase tracking-widest">
              {t.css.matchingDistricts}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cssFiltered.map((css) => {
              const isSel = data.cssId === css.id
              const cnt = SCHOOLS.filter((s) => s.cssId === css.id).length
              return (
                <motion.button key={css.id} whileHover={{ y: -3 }} transition={{ duration: 0.15 }}
                  onClick={() => {
                    patch({ cssId: css.id, cssName: css.name, cssAccentColor: css.accentColor,
                      schoolId: '', schoolName: '', schoolCity: '',
                      gradeId: '', gradeLabel: '', classId: null, className: null, manualAssignment: false })
                    setSearch('')
                  }}
                  className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                    isSel ? '' : 'bg-cx-card border-cx-line hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]'
                  }`}
                  style={isSel ? {
                    borderColor: css.accentColor,
                    backgroundColor: `${css.accentColor}18`,
                    boxShadow: `0 0 0 4px ${css.accentColor}14`,
                  } : undefined}
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl"
                    style={{ backgroundColor: css.accentColor }} />
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[17px] font-extrabold text-cx-base leading-tight">{css.name}</p>
                      <p className="text-[13px] text-cx-soft mt-1.5">{css.cities.slice(0, 3).join(' · ')}</p>
                      <p className="text-[13px] font-bold mt-2" style={{ color: css.accentColor }}>
                        {schoolWord(cnt)}
                      </p>
                    </div>
                    {isSel && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: css.accentColor }}>
                        <Check size={15} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}

      {!showSchoolResults && cssFiltered.length === 0 && (
        <p className="text-center text-cx-soft text-[15px] py-12">
          {t.css.noResults} « {search} »
        </p>
      )}
    </div>
  )
}

// ─── Step 2 — School ──────────────────────────────────────────────────────────

function StepSchool({ data, patch, search, setSearch, t }: {
  data: WizardData; patch: (p: Partial<WizardData>) => void
  search: string; setSearch: (s: string) => void
  t: T
}) {
  const css = CSS_DISTRICTS.find((c) => c.id === data.cssId)
  const q = search.toLowerCase()
  const schools = getSchoolsByCss(data.cssId)
  const filtered = q
    ? schools.filter((s) => s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q))
    : schools

  return (
    <div className="flex flex-col gap-5">
      {css && (
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl w-fit border"
          style={{ backgroundColor: css.bgLight, borderColor: css.accentColor + '44' }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: css.accentColor }} />
          <span className="text-[13px] font-bold" style={{ color: css.accentColor }}>{css.name}</span>
        </div>
      )}

      <div className="relative max-w-lg">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cx-soft pointer-events-none" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={t.school.searchPlaceholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-cx-edge text-[15px]
            bg-cx-fill text-cx-base outline-none placeholder:text-cx-soft transition-all
            focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((school) => {
          const isSel = data.schoolId === school.id
          return (
            <motion.button key={school.id} whileHover={{ y: -3 }} transition={{ duration: 0.15 }}
              onClick={() => {
                patch({ schoolId: school.id, schoolName: school.name, schoolCity: school.city,
                  gradeId: '', gradeLabel: '', classId: null, className: null, manualAssignment: false })
                setSearch('')
              }}
              className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 bg-cx-card ${
                isSel
                  ? 'border-[#C41E3A] shadow-[0_0_0_3px_rgba(196,30,58,0.10)]'
                  : 'border-cx-line hover:border-[#C41E3A]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={`text-[15px] font-bold leading-snug truncate ${isSel ? 'text-[#C41E3A]' : 'text-cx-base'}`}>
                    {school.name}
                  </p>
                  <p className="text-[13px] text-cx-soft mt-1">{school.city}</p>
                  {css && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ backgroundColor: css.bgLight, color: css.accentColor,
                        border: `1px solid ${css.accentColor}44` }}>
                      {css.shortName}
                    </span>
                  )}
                </div>
                {isSel && (
                  <div className="w-6 h-6 rounded-full bg-[#C41E3A] flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-cx-soft text-[15px] py-12">{t.school.noResults}</p>
      )}
    </div>
  )
}

// ─── Step 3 — Grade ───────────────────────────────────────────────────────────

function StepGrade({ data, patch, lang }: {
  data: WizardData; patch: (p: Partial<WizardData>) => void; lang: Lang
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {GRADES.map((g) => {
        const isSel = data.gradeId === g.id
        const label = lang === 'en' ? g.labelEn : g.label
        const sub = lang === 'en' ? g.label : g.labelEn
        return (
          <motion.button key={g.id} whileHover={{ y: -4 }} transition={{ duration: 0.15 }}
            onClick={() => patch({ gradeId: g.id, gradeLabel: label,
              classId: null, className: null, manualAssignment: false })}
            className={`relative flex flex-col items-center justify-center gap-2
              p-6 rounded-2xl border-2 transition-all duration-200 min-h-[120px] ${
              isSel
                ? 'border-[#C41E3A] bg-[#C41E3A]/8 shadow-[0_0_0_4px_rgba(196,30,58,0.12)]'
                : 'border-cx-line bg-cx-card hover:border-[#C41E3A]/40 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]'
            }`}
          >
            {isSel && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#C41E3A] flex items-center justify-center">
                <Check size={11} className="text-white" strokeWidth={3} />
              </div>
            )}
            <span className={`text-[18px] font-extrabold text-center ${isSel ? 'text-[#C41E3A]' : 'text-cx-base'}`}>
              {label}
            </span>
            <span className={`text-[13px] text-center ${isSel ? 'text-[#C41E3A]/70' : 'text-cx-soft'}`}>
              {sub}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

// ─── Step 4 — Teacher ─────────────────────────────────────────────────────────

function StepTeacher({ data, patch, search, setSearch, t, lang }: {
  data: WizardData; patch: (p: Partial<WizardData>) => void
  search: string; setSearch: (s: string) => void
  t: T; lang: Lang
}) {
  const q = search.toLowerCase()
  const teachers = getTeachers(data.schoolId, data.gradeId)
  const filtered = q ? teachers.filter((t) => t.name.toLowerCase().includes(q)) : teachers
  const gradeLabel = lang === 'en'
    ? (GRADES.find((g) => g.id === data.gradeId)?.labelEn ?? data.gradeLabel)
    : data.gradeLabel

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <span className="px-3.5 py-1.5 rounded-xl bg-cx-fill border border-cx-line text-[13px] font-semibold text-cx-base">
          {data.schoolName}
        </span>
        <span className="px-3.5 py-1.5 rounded-xl bg-[#C41E3A]/10 border border-[#C41E3A]/20 text-[13px] font-bold text-[#C41E3A]">
          {gradeLabel}
        </span>
      </div>

      <div className="relative max-w-lg">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cx-soft pointer-events-none" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={t.teacher.searchPlaceholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-cx-edge text-[15px]
            bg-cx-fill text-cx-base outline-none placeholder:text-cx-soft transition-all
            focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((teacher) => {
          const isSel = !data.manualAssignment && data.classId === teacher.id
          return (
            <motion.button key={teacher.id} whileHover={{ y: -3 }} transition={{ duration: 0.15 }}
              onClick={() => { patch({ classId: teacher.id, className: teacher.name, manualAssignment: false }); setSearch('') }}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                isSel
                  ? 'border-[#C41E3A] bg-[#C41E3A]/8 shadow-[0_0_0_3px_rgba(196,30,58,0.10)]'
                  : 'border-cx-line bg-cx-card hover:border-[#C41E3A]/40 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isSel ? 'bg-[#C41E3A]' : 'bg-cx-fill'}`}>
                <User size={18} className={isSel ? 'text-white' : 'text-cx-soft'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[14px] font-bold truncate ${isSel ? 'text-[#C41E3A]' : 'text-cx-base'}`}>{teacher.name}</p>
                <p className="text-[12px] text-cx-soft mt-0.5">{gradeLabel}</p>
              </div>
              {isSel && (
                <div className="w-5 h-5 rounded-full bg-[#C41E3A] flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </div>
              )}
            </motion.button>
          )
        })}

        {/* Je ne sais pas / I don't know */}
        <motion.button whileHover={{ y: -3 }} transition={{ duration: 0.15 }}
          onClick={() => patch({ classId: null, className: null, manualAssignment: true })}
          className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
            data.manualAssignment
              ? 'border-amber-400 bg-amber-400/8 shadow-[0_0_0_3px_rgba(251,191,36,0.15)]'
              : 'border-dashed border-cx-edge bg-cx-card hover:border-amber-400/60 hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)]'
          }`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            data.manualAssignment ? 'bg-amber-400' : 'bg-amber-400/10'
          }`}>
            <HelpCircle size={18} className={data.manualAssignment ? 'text-white' : 'text-amber-500'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[14px] font-bold ${data.manualAssignment ? 'text-amber-600 dark:text-amber-400' : 'text-cx-sub'}`}>
              {t.teacher.unknown}
            </p>
            <p className="text-[12px] text-cx-soft mt-0.5">{t.teacher.unknownSub}</p>
          </div>
          {data.manualAssignment && (
            <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
              <Check size={10} className="text-white" strokeWidth={3} />
            </div>
          )}
        </motion.button>
      </div>

      {teachers.length === 0 && !q && (
        <div className="text-center py-8 text-cx-soft text-[14px]">{t.teacher.noTeachers}</div>
      )}

      {data.manualAssignment && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-400/10 border border-amber-400/30">
          <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[13.5px] text-amber-700 dark:text-amber-400 leading-relaxed">{t.teacher.unknownNotice}</p>
        </div>
      )}
    </div>
  )
}

// ─── Step 5 — Child Info ──────────────────────────────────────────────────────

function StepChildInfo({ data, patch, t, lang }: {
  data: WizardData; patch: (p: Partial<WizardData>) => void; t: T; lang: Lang
}) {
  const css = CSS_DISTRICTS.find((c) => c.id === data.cssId)
  const gradeLabel = lang === 'en'
    ? (GRADES.find((g) => g.id === data.gradeId)?.labelEn ?? data.gradeLabel)
    : data.gradeLabel
  const iCls = `px-4 py-3 rounded-xl border border-cx-edge text-[15px]
    bg-cx-fill text-cx-base outline-none transition-all placeholder:text-cx-soft
    focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]`
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="p-4 rounded-2xl bg-cx-fill border border-cx-line">
        <p className="text-[12px] font-extrabold text-cx-soft uppercase tracking-wide mb-3">
          {t.childInfo.lockedLabel}
        </p>
        <div className="flex flex-wrap gap-2">
          {css && (
            <span className="px-3 py-1 rounded-xl text-[13px] font-bold"
              style={{ backgroundColor: css.bgLight, color: css.accentColor, border: `1px solid ${css.accentColor}44` }}>
              {css.shortName}
            </span>
          )}
          <span className="px-3 py-1 rounded-xl bg-cx-card border border-cx-line text-[13px] font-semibold text-cx-base">
            {data.schoolName}
          </span>
          <span className="px-3 py-1 rounded-xl bg-cx-card border border-cx-line text-[13px] font-semibold text-cx-base">
            {data.schoolCity}
          </span>
          <span className="px-3 py-1 rounded-xl bg-[#C41E3A]/10 border border-[#C41E3A]/20 text-[13px] font-bold text-[#C41E3A]">
            {gradeLabel}
          </span>
          <span className="px-3 py-1 rounded-xl bg-cx-card border border-cx-line text-[13px] font-semibold text-cx-soft">
            {data.manualAssignment ? t.childInfo.pendingAssignment : data.className}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-semibold text-cx-base">
            {t.childInfo.firstName} <span className="text-[#C41E3A]">*</span>
          </label>
          <input value={data.firstName} onChange={(e) => patch({ firstName: e.target.value })}
            placeholder={t.childInfo.firstNamePlaceholder} autoFocus className={iCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-semibold text-cx-base">
            {t.childInfo.lastName} <span className="text-[#C41E3A]">*</span>
          </label>
          <input value={data.lastName} onChange={(e) => patch({ lastName: e.target.value })}
            placeholder={t.childInfo.lastNamePlaceholder} className={iCls} />
        </div>
      </div>

      <div className="flex flex-col gap-2 max-w-xs">
        <label className="text-[14px] font-semibold text-cx-base">
          {t.childInfo.dob} <span className="text-[#C41E3A]">*</span>
        </label>
        <input type="date" value={data.dob} onChange={(e) => patch({ dob: e.target.value })}
          max={new Date().toISOString().slice(0, 10)} className={iCls} />
      </div>
    </div>
  )
}

// ─── Step 6 — Color ───────────────────────────────────────────────────────────

function StepColor({ data, patch, t, lang }: {
  data: WizardData; patch: (p: Partial<WizardData>) => void; t: T; lang: Lang
}) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-[15px] text-cx-body leading-relaxed max-w-lg">{t.color.description}</p>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-5">
        {CHILD_COLORS.map((color) => {
          const isSel = data.colorCode === color.id
          const label = lang === 'en' ? color.labelEn : color.label
          return (
            <motion.button key={color.id} type="button"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}
              onClick={() => patch({ colorCode: color.id })}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center
                  shadow-[0_4px_12px_rgba(0,0,0,0.18)] transition-all duration-150"
                style={{
                  backgroundColor: color.hex,
                  ...(isSel ? { outline: `4px solid ${color.hex}`, outlineOffset: '3px' } : {}),
                }}
              >
                {isSel && <Check size={22} className="text-white drop-shadow" strokeWidth={3} />}
              </div>
              <span className={`text-[13px] font-bold ${isSel ? 'text-cx-base' : 'text-cx-soft'}`}>
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 7 — Allergens ───────────────────────────────────────────────────────

function StepAllergens({ data, patch, t, lang }: {
  data: WizardData; patch: (p: Partial<WizardData>) => void; t: T; lang: Lang
}) {
  const toggle = (id: string) => {
    if (data.noKnownAllergens) { patch({ noKnownAllergens: false, allergens: [id] }); return }
    const next = data.allergens.includes(id)
      ? data.allergens.filter((a) => a !== id)
      : [...data.allergens, id]
    patch({ allergens: next })
  }

  const toggleOther = () => {
    if (data.allergenOther) patch({ allergenOther: false, allergenNotes: '' })
    else patch({ allergenOther: true, noKnownAllergens: false })
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <p className="text-[15px] text-cx-body leading-relaxed">{t.allergens.description}</p>

      <div className="flex flex-wrap gap-3">
        {ALLERGENS.map((a) => {
          const isSel = data.allergens.includes(a.id)
          const label = lang === 'en' ? a.labelEn : a.label
          return (
            <motion.button key={a.id} type="button" whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
              onClick={() => toggle(a.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2
                text-[14px] font-semibold transition-all duration-150 ${
                isSel
                  ? 'border-[#C41E3A] bg-[#C41E3A]/10 text-[#C41E3A]'
                  : 'border-cx-line bg-cx-card text-cx-sub hover:border-[#C41E3A]/40'
              }`}
            >
              <span className="text-lg leading-none">{a.emoji}</span>
              <span>{label}</span>
              {isSel && <Check size={13} strokeWidth={3} />}
            </motion.button>
          )
        })}

        {/* No known allergens */}
        <motion.button type="button" whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
          onClick={() => patch({ allergens: [], noKnownAllergens: true, allergenOther: false, allergenNotes: '' })}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2
            text-[14px] font-semibold transition-all duration-150 ${
            data.noKnownAllergens
              ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400'
              : 'border-cx-line bg-cx-card text-cx-sub hover:border-green-500/40'
          }`}
        >
          <span className="text-lg leading-none">✅</span>
          <span>{t.allergens.noKnown}</span>
          {data.noKnownAllergens && <Check size={13} strokeWidth={3} />}
        </motion.button>

        {/* Other */}
        <motion.button type="button" whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
          onClick={toggleOther}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2
            text-[14px] font-semibold transition-all duration-150 ${
            data.allergenOther
              ? 'border-[#7B2535] bg-[#7B2535]/10 text-[#7B2535]'
              : 'border-cx-line bg-cx-card text-cx-sub hover:border-[#7B2535]/40'
          }`}
        >
          <span className="text-lg leading-none">✏️</span>
          <span>{t.allergens.other}</span>
          {data.allergenOther && <Check size={13} strokeWidth={3} />}
        </motion.button>
      </div>

      {/* Textarea — only when "Other" is selected */}
      {data.allergenOther && (
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-semibold text-cx-base">
            {t.allergens.otherLabel} <span className="text-[#C41E3A]">*</span>
          </label>
          <textarea rows={3} value={data.allergenNotes}
            onChange={(e) => patch({ allergenNotes: e.target.value })}
            placeholder={t.allergens.notesPlaceholder}
            className="px-4 py-3 rounded-xl border border-cx-edge text-[15px]
              bg-cx-fill text-cx-base outline-none transition-all resize-none placeholder:text-cx-soft
              focus:bg-cx-card focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]" />
        </div>
      )}
    </div>
  )
}

// ─── Step 8 — Confirmation ────────────────────────────────────────────────────

function StepConfirm({ data, t, lang }: { data: WizardData; t: T; lang: Lang }) {
  const css = CSS_DISTRICTS.find((c) => c.id === data.cssId)
  const color = CHILD_COLORS.find((c) => c.id === data.colorCode)
  const allergenLabels = ALLERGENS.filter((a) => data.allergens.includes(a.id))
  const gradeLabel = lang === 'en'
    ? (GRADES.find((g) => g.id === data.gradeId)?.labelEn ?? data.gradeLabel)
    : data.gradeLabel

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-start gap-4 py-3.5 border-b border-cx-line last:border-b-0">
      <span className="text-[13.5px] text-cx-soft w-40 flex-shrink-0 pt-0.5">{label}</span>
      <div className="text-[15px] font-semibold text-cx-base flex-1">{children}</div>
    </div>
  )

  const colorLabel = color ? (lang === 'en' ? color.labelEn : color.label) : '—'

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <p className="text-[15px] text-cx-body">{t.confirm.description}</p>

      <div className="bg-cx-fill rounded-2xl border border-cx-line overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />
        <div className="px-6">
          <Row label={t.confirm.firstName}>{data.firstName}</Row>
          <Row label={t.confirm.lastName}>{data.lastName}</Row>
          <Row label={t.confirm.dob}>
            {data.dob
              ? new Date(data.dob + 'T12:00:00').toLocaleDateString(lang === 'en' ? 'en-CA' : 'fr-CA',
                  { day: 'numeric', month: 'long', year: 'numeric' })
              : '—'}
          </Row>
        </div>
      </div>

      <div className="bg-cx-fill rounded-2xl border border-cx-line overflow-hidden">
        <div className="px-6">
          <Row label={t.confirm.css}>
            <span className="inline-flex items-center gap-2">
              {css && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: css.accentColor }} />}
              {data.cssName}
            </span>
          </Row>
          <Row label={t.confirm.school}>{data.schoolName}</Row>
          <Row label={t.confirm.city}>{data.schoolCity}</Row>
          <Row label={t.confirm.grade}>{gradeLabel}</Row>
          <Row label={t.confirm.teacher}>
            {data.manualAssignment
              ? <span className="text-amber-500 font-bold">⏳ {t.confirm.pending}</span>
              : data.className ?? '—'}
          </Row>
        </div>
      </div>

      <div className="bg-cx-fill rounded-2xl border border-cx-line overflow-hidden">
        <div className="px-6">
          <Row label={t.confirm.color}>
            {color ? (
              <span className="inline-flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-lg shadow-sm" style={{ backgroundColor: color.hex }} />
                {colorLabel}
              </span>
            ) : '—'}
          </Row>
          <Row label={t.confirm.allergens}>
            {data.noKnownAllergens
              ? <span className="text-green-600 dark:text-green-400">✅ {t.confirm.noKnown}</span>
              : allergenLabels.length > 0
              ? (
                <div className="flex flex-wrap gap-1.5">
                  {allergenLabels.map((a) => (
                    <span key={a.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                      bg-[#C41E3A]/10 border border-[#C41E3A]/20 text-[13px] font-semibold text-[#C41E3A]">
                      {a.emoji} {lang === 'en' ? a.labelEn : a.label}
                    </span>
                  ))}
                </div>
              )
              : data.allergenOther
              ? <span className="text-[#7B2535] font-bold">{t.confirm.other}</span>
              : <span className="text-cx-soft italic">{t.confirm.notSet}</span>}
          </Row>
          {data.allergenOther && data.allergenNotes && (
            <Row label={t.confirm.allergenNotes}>{data.allergenNotes}</Row>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AddChildPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t, lang } = useLang()
  const tAC = t.addChild
  const [step, setStep] = useState<Step>(1)
  const [data, setData] = useState<WizardData>(EMPTY)
  const [search, setSearch] = useState('')
  const [direction, setDirection] = useState(1)

  const patch = (p: Partial<WizardData>) => setData((d) => ({ ...d, ...p }))

  const addMutation = useMutation({
    mutationFn: studentsService.add,
    onSuccess: (newStudent) => {
      queryClient.setQueryData<Student[]>(['students'], (prev = []) => [...prev, newStudent])
      toast.success(`${newStudent.firstName} ${lang === 'en' ? 'has been added!' : 'a été ajouté(e) !'}`)
      navigate('/user/students')
    },
    onError: () => toast.error(lang === 'en' ? 'Error adding child' : "Erreur lors de l'ajout"),
  })

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return !!data.cssId
      case 2: return !!data.schoolId
      case 3: return !!data.gradeId
      case 4: return !!data.classId || data.manualAssignment
      case 5: return !!data.firstName.trim() && !!data.lastName.trim() && !!data.dob
      case 6: return !!data.colorCode
      case 7: return data.noKnownAllergens || data.allergens.length > 0 || (data.allergenOther && !!data.allergenNotes.trim())
      case 8: return true
      default: return false
    }
  }

  const goNext = () => {
    if (step === 8) {
      const school = SCHOOLS.find((s) => s.id === data.schoolId)!
      const grade = GRADES.find((g) => g.id === data.gradeId)!
      const css = CSS_DISTRICTS.find((c) => c.id === data.cssId)!
      addMutation.mutate({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        dob: data.dob,
        cssId: data.cssId,
        cssName: css.name,
        schoolId: data.schoolId,
        schoolName: school.name,
        schoolCity: school.city,
        gradeId: data.gradeId,
        grade: grade.label,          // always store French label in DB
        classId: data.manualAssignment ? null : data.classId,
        className: data.manualAssignment ? null : data.className,
        manualAssignmentRequired: data.manualAssignment,
        classAssignmentStatus: data.manualAssignment ? 'pending_manual_assignment' : 'assigned',
        colorCode: data.colorCode,
        allergens: data.noKnownAllergens ? [] : data.allergens,
        allergenNotes: data.allergenOther ? data.allergenNotes : undefined,
      })
      return
    }
    setDirection(1); setSearch(''); setStep((s) => (s + 1) as Step)
  }

  const goBack = () => {
    if (step === 1) { navigate('/user/students'); return }
    setDirection(-1); setSearch(''); setStep((s) => (s - 1) as Step)
  }

  // School selected directly from Step 1 search → jump to Step 3
  const handleSchoolDirect = (school: typeof SCHOOLS[0]) => {
    const css = CSS_DISTRICTS.find((c) => c.id === school.cssId)!
    patch({
      cssId: css.id, cssName: css.name, cssAccentColor: css.accentColor,
      schoolId: school.id, schoolName: school.name, schoolCity: school.city,
      gradeId: '', gradeLabel: '', classId: null, className: null, manualAssignment: false,
    })
    setSearch('')
    setStep(3)
  }

  const progress = ((step - 1) / 7) * 100
  const stepMeta = tAC.steps[step]

  const renderStep = () => {
    switch (step) {
      case 1: return <StepCss data={data} patch={patch} search={search} setSearch={setSearch} onSelectSchoolDirect={handleSchoolDirect} t={tAC} />
      case 2: return <StepSchool data={data} patch={patch} search={search} setSearch={setSearch} t={tAC} />
      case 3: return <StepGrade data={data} patch={patch} lang={lang} />
      case 4: return <StepTeacher data={data} patch={patch} search={search} setSearch={setSearch} t={tAC} lang={lang} />
      case 5: return <StepChildInfo data={data} patch={patch} t={tAC} lang={lang} />
      case 6: return <StepColor data={data} patch={patch} t={tAC} lang={lang} />
      case 7: return <StepAllergens data={data} patch={patch} t={tAC} lang={lang} />
      case 8: return <StepConfirm data={data} t={tAC} lang={lang} />
    }
  }

  return (
    <div className="min-h-screen bg-cx-page">

      {/* ── Sticky step header ── */}
      <div className="sticky top-[80px] z-30 bg-cx-card border-b border-cx-line
        shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            <button onClick={goBack}
              className="flex items-center gap-1.5 text-[14px] font-semibold text-cx-soft
                hover:text-[#C41E3A] transition-colors">
              <ChevronLeft size={18} />
              {step === 1 ? tAC.nav.backToList : tAC.nav.back}
            </button>

            <div className="text-center min-w-0">
              <p className="text-[15px] font-extrabold text-cx-base truncate">{stepMeta.title}</p>
              <p className="text-[12px] text-cx-soft">{stepMeta.sub}</p>
            </div>

            <div className="text-[13px] font-bold text-cx-soft whitespace-nowrap">
              {step} <span className="text-cx-faint">{tAC.stepOf} 8</span>
            </div>
          </div>

          <div className="pb-3">
            <div className="h-1.5 bg-cx-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C41E3A] to-[#E8304A] rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 < step ? 'bg-[#C41E3A]' :
                  i + 1 === step ? 'bg-[#C41E3A] scale-150' :
                  'bg-cx-muted'
                }`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-4 sm:pb-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -48 }}
            transition={{ duration: 0.22 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom navigation ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-cx-line">
          <button onClick={goBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-cx-edge
              text-[14px] font-bold text-cx-sub hover:border-[#C41E3A]/40 hover:text-[#C41E3A]
              transition-all duration-200">
            <ChevronLeft size={16} />
            {step === 1 ? tAC.nav.cancel : tAC.nav.back}
          </button>

          <button onClick={goNext} disabled={!canAdvance() || addMutation.isPending}
            className="flex items-center gap-2.5 px-8 py-3 rounded-xl
              bg-[#C41E3A] hover:bg-[#a01830] text-white font-extrabold text-[15px]
              transition-all duration-200
              hover:shadow-[0_6px_24px_rgba(196,30,58,0.4)] hover:-translate-y-0.5
              disabled:bg-cx-muted disabled:text-cx-soft disabled:cursor-not-allowed disabled:translate-y-0">
            {addMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {tAC.nav.saving}
              </>
            ) : step === 8 ? (
              <>
                <Check size={16} strokeWidth={3} />
                {tAC.nav.confirm}
              </>
            ) : (
              <>
                {tAC.nav.continue}
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
