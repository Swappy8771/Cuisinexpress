import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1600&q=80',
    label: 'Repas du jour',
  },
  {
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&q=80',
    label: 'Bols santé',
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80',
    label: 'Cuisine fraîche',
  },
  {
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=1600&q=80',
    label: 'Plats chauds',
  },
  {
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=80',
    label: 'Légumes frais',
  },
]

const INTERVAL = 4500

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent((prev) => (prev + 1) % slides.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.04,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-8%' : '8%',
      opacity: 0,
      scale: 0.97,
      transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  }

  return (
    <section className="relative w-full h-[88vh] min-h-[540px] overflow-hidden bg-[#0A0A0A]">

      {/* Slides */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].label}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16
        flex flex-col justify-center">

        {/* Slide label pill */}
        <motion.div
          key={`label-${current}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-5 w-fit"
        >
          <span className="h-px w-8 bg-[#C41E3A]" />
          <span className="text-[#C41E3A] text-sm font-semibold tracking-widest uppercase">
            {slides[current].label}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          key={`heading-${current}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-white font-extrabold leading-[1.1] tracking-tight
            text-4xl sm:text-5xl lg:text-6xl max-w-2xl"
        >
          Repas chauds et santé
          <br />
          <span className="text-white/90">pour vos enfants</span>
          <br />
          <span className="text-[#C41E3A]">à l'école</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          key={`sub-${current}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-5 text-white/70 text-[16px] max-w-md leading-relaxed"
        >
          Des repas équilibrés, préparés chaque jour avec des ingrédients frais,
          livrés directement dans votre école.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 flex items-center gap-4"
        >
          <a
            href="#commander"
            className="group inline-flex items-center gap-3 bg-[#C41E3A] hover:bg-[#a01830]
              text-white font-semibold text-[15px] px-7 py-3.5 rounded-full
              transition-all duration-300 hover:shadow-[0_8px_30px_rgba(196,30,58,0.5)]
              hover:-translate-y-0.5"
          >
            Explorer notre menu
            <span className="bg-white/20 group-hover:bg-white/30 rounded-full p-1
              transition-all duration-300 group-hover:translate-x-1">
              <ArrowRight size={14} />
            </span>
          </a>

          <a
            href="#nos-ecoles"
            className="text-white/70 hover:text-white text-[15px] font-medium
              transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Nos écoles partenaires
          </a>
        </motion.div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300
              focus:outline-none"
            style={{ width: i === current ? 36 : 10, background: 'rgba(255,255,255,0.3)' }}
          >
            {i === current && (
              <motion.span
                key={current}
                className="absolute inset-y-0 left-0 bg-[#C41E3A] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 z-20 text-white/40 text-xs font-mono tracking-widest">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}
