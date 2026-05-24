import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowRight, UtensilsCrossed } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-cx-page flex items-center justify-center
      px-4 py-16 transition-colors duration-300">

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center text-center max-w-md w-full"
      >

        {/* Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-24 h-24 rounded-3xl bg-[#C41E3A]/10 flex items-center
            justify-center mb-6 shadow-[0_0_0_8px_rgba(196,30,58,0.05)]"
        >
          <UtensilsCrossed size={38} className="text-[#C41E3A]" strokeWidth={1.5} />
        </motion.div>

        {/* 404 number */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#C41E3A] mb-3"
        >
          Erreur 404
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.45 }}
          className="text-[32px] sm:text-[38px] font-extrabold text-cx-base
            tracking-tight leading-tight mb-4"
        >
          Page introuvable
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-[15px] text-cx-soft leading-relaxed mb-8 max-w-sm"
        >
          La page que vous cherchez n'existe pas ou a été déplacée.
          Revenez à l'accueil pour continuer votre commande.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="w-16 h-0.5 bg-gradient-to-r from-[#C41E3A] to-[#7B2535] rounded-full mb-8"
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5
              bg-[#C41E3A] hover:bg-[#a01830] text-white font-bold text-[14px]
              tracking-wide px-7 py-3.5 rounded-2xl transition-all duration-300
              shadow-[0_4px_20px_rgba(196,30,58,0.35)]
              hover:shadow-[0_8px_32px_rgba(196,30,58,0.5)]
              hover:-translate-y-0.5 active:translate-y-0"
          >
            <Home size={16} />
            Retour à l'accueil
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            />
          </Link>

          <Link
            to="/commander"
            className="inline-flex items-center gap-2 text-[14px] font-semibold
              text-cx-soft hover:text-[#C41E3A] transition-colors duration-200"
          >
            Voir notre menu →
          </Link>
        </motion.div>

      </motion.div>
    </div>
  )
}
