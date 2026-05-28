import { motion } from 'framer-motion'
import type { Meal, MealWeek } from '../../types'
import { DAYS } from '../../lib/menuConfig'
import type { DayName } from '../../lib/menuConfig'
import { useLang } from '../../contexts/LangContext'

interface Props {
  allMeals: Meal[]
  weeks: MealWeek[]
  onDayClick: (day: DayName, weekId: string) => void
}

export default function MenuCalendar({ allMeals, weeks, onDayClick }: Props) {
  const { t, lang } = useLang()
  const locale = lang === 'en' ? 'en-CA' : 'fr-CA'

  return (
    <div className="mb-2">

      {/* Day column headers */}
      <div className="grid grid-cols-5 gap-3 mb-3">
        {DAYS.map((day) => (
          <div key={day} className="text-center py-1">
            <span className="text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.15em] text-cx-soft">
              {t.menu.dayLabels[day]}
            </span>
          </div>
        ))}
      </div>

      {/* Week rows */}
      <div className="flex flex-col gap-3">
        {weeks.map((week) => (
          <div key={week.id} className="grid grid-cols-5 gap-3">
            {DAYS.map((day, di) => {
              const dayMeals = allMeals.filter(
                (m) =>
                  m.categoryId === 'cat-1' &&
                  m.available &&
                  m.weekIds.includes(week.id) &&
                  m.availableDays?.includes(day)
              )
              const featured = dayMeals[0]

              const cellDate = new Date(week.startDate + 'T12:00:00')
              cellDate.setDate(cellDate.getDate() + di)
              const dateNum = cellDate.getDate()
              const monthShort = cellDate
                .toLocaleDateString(locale, { month: 'short' })
                .replace('.', '')
                .toUpperCase()

              return (
                <motion.button
                  key={day}
                  whileHover={featured ? { scale: 1.03, zIndex: 2 } : {}}
                  whileTap={featured ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  onClick={() => featured && onDayClick(day, week.id)}
                  disabled={!featured}
                  className={`relative overflow-hidden rounded-3xl aspect-[3/4]
                    transition-shadow duration-300
                    ${featured
                      ? 'cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.22)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)]'
                      : 'cursor-default opacity-30'
                    }`}
                >
                  {featured ? (
                    <>
                      {/* Background food photo */}
                      <img
                        src={featured.image}
                        alt={featured.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />

                      {/* Layered gradient — cinematic look */}
                      <div className="absolute inset-0 bg-gradient-to-t
                        from-black/95 via-black/30 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br
                        from-black/20 via-transparent to-transparent" />

                      {/* Top pill: day + date */}
                      <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-3 pt-3">
                        {/* Day pill */}
                        <span className="bg-white/20 backdrop-blur-sm text-white
                          text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest
                          px-2 py-1 rounded-full leading-none">
                          {t.menu.dayLabels[day].slice(0, 3)}
                        </span>

                        {/* Date badge */}
                        <span className="flex flex-col items-end leading-none">
                          <span className="text-[20px] sm:text-[24px] font-black text-white leading-none drop-shadow-md">
                            {dateNum}
                          </span>
                          <span className="text-[8px] sm:text-[9.5px] font-bold text-white/60 uppercase tracking-widest mt-0.5">
                            {monthShort}
                          </span>
                        </span>
                      </div>

                      {/* Bottom content */}
                      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                        {/* Extras badge */}
                        {dayMeals.length > 1 && (
                          <span className="inline-flex items-center mb-1.5
                            bg-[#C41E3A] text-white text-[9px] font-extrabold
                            px-2 py-0.5 rounded-full tracking-wide shadow-md">
                            +{dayMeals.length - 1} {lang === 'en' ? 'more' : 'autre' + (dayMeals.length - 1 > 1 ? 's' : '')}
                          </span>
                        )}
                        <p className="text-[11px] sm:text-[12.5px] font-bold text-white
                          leading-snug line-clamp-2 drop-shadow-sm">
                          {featured.name}
                        </p>
                        {/* Price */}
                        <p className="text-[10px] sm:text-[11px] font-semibold text-white/60 mt-0.5">
                          {new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(featured.price)}
                        </p>
                      </div>

                      {/* Hover overlay cue */}
                      <div className="absolute inset-0 bg-[#C41E3A]/0 hover:bg-[#C41E3A]/8 transition-colors duration-300" />
                    </>
                  ) : (
                    /* Empty cell */
                    <div className="w-full h-full bg-cx-fill rounded-3xl border border-cx-edge
                      flex flex-col items-center justify-center gap-1.5">
                      <span className="text-[20px] font-extrabold text-cx-faint">{dateNum}</span>
                      <span className="text-[9px] text-cx-faint uppercase tracking-widest">{monthShort}</span>
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
