import { motion } from 'framer-motion'
import { ShoppingCart, Truck, UtensilsCrossed } from 'lucide-react'

const steps = [
  {
    icon: ShoppingCart,
    step: '01',
    title: 'Commander',
    description:
      "Connectez-vous à votre compte pour commander les repas de vos enfants, payez en ligne et voyez l'historique des repas et des commandes.",
  },
  {
    icon: Truck,
    step: '02',
    title: 'Préparation et livraison',
    description:
      "Nous préparons tous les repas la veille avec des aliments frais, puis allons les livrer directement à l'école une heure avant le repas.",
  },
  {
    icon: UtensilsCrossed,
    step: '03',
    title: 'Un bon repas chaud',
    description:
      'Tous nos repas sont faits maison et préparés avec soin. Nous sommes fiers de livrer des repas froids et chauds dans nos écoles.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function HowItWorks() {
  return (
    <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#C41E3A] text-sm font-semibold tracking-widest uppercase mb-3">
            Simple &amp; rapide
          </span>
          <h2 className="text-[#0A0A0A] text-4xl sm:text-5xl font-extrabold tracking-tight">
            Fonctionnement
          </h2>
          <p className="mt-4 text-[#555] text-[16px] max-w-xl mx-auto leading-relaxed">
            Trois étapes simples pour offrir un repas chaud et équilibré à vos enfants chaque jour.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px">
            <div className="w-full h-full border-t-2 border-dashed border-[#C41E3A]/25" />
          </div>

          {steps.map(({ icon: Icon, step, title, description }) => (
            <motion.div
              key={step}
              variants={cardVariants}
              className="group relative flex flex-col items-start p-8 rounded-2xl bg-[#FAFAFA]
                border border-gray-100 hover:border-[#C41E3A]/20
                hover:shadow-[0_12px_40px_rgba(196,30,58,0.08)]
                transition-all duration-400"
            >
              {/* Step number */}
              <span className="absolute top-6 right-7 text-[42px] font-black text-gray-100
                group-hover:text-[#C41E3A]/10 transition-colors duration-300 leading-none select-none">
                {step}
              </span>

              {/* Icon */}
              <div className="relative z-10 mb-6 p-4 rounded-xl bg-[#FFF4E5]
                group-hover:bg-[#C41E3A] transition-colors duration-300">
                <Icon
                  size={28}
                  className="text-[#C41E3A] group-hover:text-white transition-colors duration-300"
                  strokeWidth={1.75}
                />
              </div>

              {/* Text */}
              <h3 className="text-[#0A0A0A] text-[18px] font-bold mb-3 tracking-tight">
                {title}
              </h3>
              <p className="text-[#666] text-[14.5px] leading-relaxed">
                {description}
              </p>

              {/* Bottom accent */}
              <div className="mt-6 h-0.5 w-0 group-hover:w-12 bg-[#C41E3A] rounded-full
                transition-all duration-400" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
