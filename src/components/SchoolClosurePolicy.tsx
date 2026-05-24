import { motion } from 'framer-motion'
import { CloudSnow, Building2, Ban, Heart } from 'lucide-react'
import { useLang } from '../contexts/LangContext'

const POINT_ICONS = [CloudSnow, Building2, Ban, Heart]

export default function SchoolClosurePolicy() {
  const { t } = useLang()
  const points = t.closure.points.map((text, i) => ({ icon: POINT_ICONS[i], text }))

  return (
    <section className="w-full bg-cx-card py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#C41E3A] text-sm font-semibold tracking-widest uppercase mb-3">
            {t.closure.tag}
          </span>
          <h2 className="text-cx-base text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t.closure.title1}
            <br className="hidden sm:block" />
            <span className="text-[#C41E3A]"> {t.closure.title2}</span>
          </h2>
        </motion.div>

        {/* Policy card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative rounded-3xl bg-cx-fill border border-cx-line
            overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
        >
          {/* Top accent strip */}
          <div className="h-1 w-full bg-gradient-to-r from-[#C41E3A] via-[#7B2535] to-[#C41E3A]" />

          {/* Watermark icon */}
          <div className="absolute -right-6 -bottom-6 opacity-[0.04] pointer-events-none select-none">
            <CloudSnow size={180} strokeWidth={1} />
          </div>

          <div className="relative z-10 p-8 sm:p-12 flex flex-col gap-0">
            {points.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`flex items-start gap-5 py-7 ${
                  i < points.length - 1 ? 'border-b border-cx-line' : ''
                }`}
              >
                {/* Icon badge */}
                <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl
                  bg-cx-card border border-cx-line shadow-sm
                  flex items-center justify-center">
                  <Icon
                    size={18}
                    strokeWidth={1.75}
                    className={
                      i === 0 ? 'text-blue-500'
                      : i === 1 ? 'text-amber-500'
                      : i === 2 ? 'text-[#C41E3A]'
                      : 'text-rose-400'
                    }
                  />
                </div>

                {/* Text */}
                <p className="text-cx-sub text-[15px] leading-[1.8]">{text}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="relative z-10 mx-8 sm:mx-12 mb-8 sm:mb-10 flex items-center gap-3
            bg-[#FFF4F5] dark:bg-[#C41E3A]/10 border border-[#C41E3A]/15 rounded-xl px-5 py-4">
            <span className="flex-shrink-0 w-1.5 h-8 rounded-full bg-[#C41E3A]" />
            <p className="text-[#7B2535] text-[13px] font-medium leading-relaxed">
              {t.closure.note}{' '}
              <a href="tel:5819929952" className="font-bold hover:underline underline-offset-2">
                581-992-9952
              </a>.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
