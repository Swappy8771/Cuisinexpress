import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function RouteProgressBar() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const completeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear any running timers
    if (timerRef.current) clearTimeout(timerRef.current)
    if (completeRef.current) clearTimeout(completeRef.current)

    // Start bar
    setWidth(0)
    setVisible(true)

    // Rapid jump to 80%, then slow crawl
    timerRef.current = setTimeout(() => setWidth(80), 10)
    timerRef.current = setTimeout(() => setWidth(95), 400)

    // Complete and hide
    completeRef.current = setTimeout(() => {
      setWidth(100)
      setTimeout(() => setVisible(false), 300)
    }, 500)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (completeRef.current) clearTimeout(completeRef.current)
    }
  }, [location.pathname])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
        >
          <div
            className="h-full bg-gradient-to-r from-[#C41E3A] via-[#E8304A] to-[#C41E3A]
              shadow-[0_0_8px_rgba(196,30,58,0.7)]"
            style={{
              width: `${width}%`,
              transition: width === 0
                ? 'none'
                : width === 100
                ? 'width 0.25s ease-out'
                : 'width 0.5s cubic-bezier(0.1, 0.05, 0.0, 1.0)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
