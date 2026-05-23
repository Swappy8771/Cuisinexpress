import { motion } from 'framer-motion'
import { Flame, ShieldCheck, CreditCard, Award, CalendarX } from 'lucide-react'

const advantages = [
  {
    icon: Flame,
    title: 'Repas chauds',
    description: "Nous sommes fiers de livrer des repas chauds dans nos écoles.",
    accent: '#C41E3A',
    bg: '#FFF0F2',
  },
  {
    icon: ShieldCheck,
    title: "On s'occupe de tout !",
    description: "Nous livrons les repas prêts et chauds chaque jour à l'école.",
    accent: '#1A6FC4',
    bg: '#EFF6FF',
  },
  {
    icon: CreditCard,
    title: 'Paiement facile',
    description:
      'Nous acceptons les cartes de crédits Visa / Mastercard ainsi que les virements Interac.',
    accent: '#0A7C59',
    bg: '#EDFAF4',
  },
  {
    icon: Award,
    title: 'Qualité supérieure',
    description:
      "Nos repas-maison sont préparés avec une sélection de produits d'excellente qualité et toujours frais. Ici, nous n'achetons pas de légumes congelés ou en canne !",
    accent: '#B45309',
    bg: '#FFFBEB',
  },
  {
    icon: CalendarX,
    title: 'Annulation facile',
    description:
      "Il vous est possible d'annuler et de modifier jusqu'à 8h le matin même de la livraison. Le repas est remboursé à 100 %. Pour toute modification, veuillez nous contacter par e-mail ou par téléphone au 581-992-9952.",
    accent: '#7B2535',
    bg: '#FDF2F4',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function Advantages() {
  return (
    <section className="w-full bg-[#F7F7F7] py-24 px-4 sm:px-6 lg:px-8">
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
            Pourquoi nous choisir
          </span>
          <h2 className="text-[#0A0A0A] text-4xl sm:text-5xl font-extrabold tracking-tight">
            Avantages CuisineXpress
          </h2>
          <p className="mt-4 text-[#555] text-[16px] max-w-xl mx-auto leading-relaxed">
            Des repas équilibrés livrés avec soin, chaque jour, pour le bien-être de vos enfants.
          </p>
        </motion.div>

        {/* Cards grid — first row: 3, second row: 2 centered */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-6"
        >
          {/* Row 1 — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.slice(0, 3).map((item) => (
              <AdvantageCard key={item.title} {...item} />
            ))}
          </div>

          {/* Row 2 — 2 cards centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:w-2/3 lg:mx-auto">
            {advantages.slice(3).map((item) => (
              <AdvantageCard key={item.title} {...item} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function AdvantageCard({
  icon: Icon,
  title,
  description,
  accent,
  bg,
}: (typeof advantages)[number]) {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex flex-col gap-5 p-7 bg-white rounded-2xl
        border border-gray-100 hover:border-transparent
        hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)]
        transition-all duration-400 overflow-hidden"
    >
      {/* Subtle top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0
          group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: accent }}
      />

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center
          transition-transform duration-300 group-hover:scale-110"
        style={{ background: bg }}
      >
        <Icon size={26} style={{ color: accent }} strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div>
        <h3 className="text-[#0A0A0A] text-[17px] font-bold mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-[#666] text-[14px] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom tag */}
      <div
        className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: accent }}
        />
        <span className="text-[12px] font-semibold tracking-wide" style={{ color: accent }}>
          CuisineXpress
        </span>
      </div>
    </motion.div>
  )
}
