import { motion } from 'framer-motion'
import { CloudSnow, Building2, Ban, Heart } from 'lucide-react'

const points = [
  {
    icon: CloudSnow,
    text: "En cas de fermeture d'école annoncée moins de 48h à l'avance, pour toute raison dont nous ne sommes pas responsables (grève, tempête, panne d'électricité…), nous livrerons les repas si le service de garde demeure ouvert.",
  },
  {
    icon: Building2,
    text: "Si ce n'est pas le cas, nous vous invitons à passer récupérer votre commande à nos bureaux.",
  },
  {
    icon: Ban,
    text: "Nous ne pouvons rembourser les repas non livrés / non récupérés étant donné l'ampleur des pertes et de la gestion engendrées.",
  },
  {
    icon: Heart,
    text: 'La nourriture perdue est remise à un organisme de charité.',
  },
]

export default function SchoolClosurePolicy() {
  return (
    <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#C41E3A] text-sm font-semibold tracking-widest uppercase mb-3">
            À savoir
          </span>
          <h2 className="text-[#0A0A0A] text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Notre politique lors de
            <br className="hidden sm:block" />
            <span className="text-[#C41E3A]"> fermeture d'école</span>
          </h2>
        </motion.div>

        {/* Policy card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative rounded-3xl bg-[#FAFAFA] border border-gray-100
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
                  i < points.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                {/* Icon badge */}
                <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl
                  bg-white border border-gray-100 shadow-sm
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
                <p className="text-[#444] text-[15px] leading-[1.8]">{text}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="relative z-10 mx-8 sm:mx-12 mb-8 sm:mb-10 flex items-center gap-3
            bg-[#FFF4F5] border border-[#C41E3A]/15 rounded-xl px-5 py-4">
            <span className="flex-shrink-0 w-1.5 h-8 rounded-full bg-[#C41E3A]" />
            <p className="text-[#7B2535] text-[13px] font-medium leading-relaxed">
              Pour toute modification ou question, contactez-nous par e-mail ou au{' '}
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
