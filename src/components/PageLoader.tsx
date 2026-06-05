import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  visible: boolean
  message?: string
}

export default function PageLoader({ visible, message = 'Connexion en cours…' }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center
            bg-[#0A0A0A]/95 backdrop-blur-md"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <img
              src="/logo.jpg"
              alt="CuisineXpress"
              className="h-20 w-auto rounded-xl shadow-[0_0_0_2px_rgba(196,30,58,0.4),0_8px_32px_rgba(0,0,0,0.5)]"
            />
          </motion.div>

          {/* Spinner ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="relative w-14 h-14 mb-6"
          >
            {/* Static ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-white/8" />
            {/* Spinning arc */}
            <div
              className="absolute inset-0 rounded-full border-[3px] border-transparent
                border-t-[#C41E3A] animate-spin"
              style={{ animationDuration: '0.75s' }}
            />
            {/* Inner glow dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#C41E3A] shadow-[0_0_8px_rgba(196,30,58,0.9)]" />
            </div>
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            className="text-white/70 text-[15px] font-medium tracking-wide"
          >
            {message}
          </motion.p>

          {/* Brand accent line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            className="mt-10 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
