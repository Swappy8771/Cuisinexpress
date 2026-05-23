import { motion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'

const infoLinks = [
  { label: 'Nos écoles', href: '#nos-ecoles' },
  { label: 'Nos menus', href: '#menus' },
  { label: 'Contactez-nous', href: '#contact' },
  { label: 'Gestion des données', href: '#donnees' },
  { label: 'Notre politique en matière de gestion des données', href: '#politique' },
]

const contactItems = [
  { icon: Phone, text: '581-992-9952', href: 'tel:5819929952' },
  { icon: Mail, text: 'info@cuisinexpress.ca', href: 'mailto:info@cuisinexpress.ca' },
  { icon: MapPin, text: 'Québec, Canada', href: '#' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A0A0A] text-white">

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Column 1 — Brand */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* Logo */}
            <a href="/" className="inline-block w-fit group">
              <img
                src="/logo.jpg"
                alt="CuisineXpress"
                className="h-16 w-auto rounded-sm
                  shadow-[0_0_0_2px_rgba(196,30,58,0.3)]
                  group-hover:shadow-[0_0_0_2px_#C41E3A]
                  transition-all duration-300"
              />
            </a>

            {/* Tagline */}
            <div>
              <p className="text-white/90 font-semibold text-[15px] mb-1">CuisineXpress</p>
              <p className="text-white/50 text-[14px] leading-relaxed">
                Votre traiteur école de confiance.
              </p>
            </div>

            {/* Contact */}
            <ul className="flex flex-col gap-3">
              {contactItems.map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="flex items-center gap-3 text-white/50 hover:text-white
                      text-[13.5px] transition-colors duration-200 group/contact"
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-md bg-white/5
                      group-hover/contact:bg-[#C41E3A]/20 flex items-center justify-center
                      transition-colors duration-200">
                      <Icon size={13} className="text-[#C41E3A]" />
                    </span>
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 2 — Partenaire kntera */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="h-px w-6 bg-[#C41E3A]" />
              <h4 className="text-white/40 text-[11px] font-semibold tracking-widest uppercase">
                Partenaire
              </h4>
            </div>
            <h3 className="text-white font-bold text-[18px] tracking-tight">
              Partenaire kntera
            </h3>
            <p className="text-white/50 text-[13.5px] leading-[1.75]">
              Studio créatif kntera INC. est un fournisseur de service de commandes en
              ligne et d'autres produits de technologie de l'information. Vous trouverez
              toutes les détails de notre service Boîte à lunch sur notre site web.
            </p>
          </motion.div>

          {/* Column 3 — Informations */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="h-px w-6 bg-[#C41E3A]" />
              <h4 className="text-white/40 text-[11px] font-semibold tracking-widest uppercase">
                Navigation
              </h4>
            </div>
            <h3 className="text-white font-bold text-[18px] tracking-tight">
              Informations
            </h3>
            <ul className="flex flex-col gap-2.5 mt-1">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group/nav flex items-start gap-2 text-white/50
                      hover:text-white text-[13.5px] transition-colors duration-200"
                  >
                    <span className="mt-[5px] flex-shrink-0 w-1 h-1 rounded-full bg-[#C41E3A]/50
                      group-hover/nav:bg-[#C41E3A] transition-colors duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Copyright bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-[12.5px]">
            Copyright ©2026{' '}
            <a
              href="#"
              className="text-white/55 hover:text-[#C41E3A] underline underline-offset-2
                transition-colors duration-200"
            >
              Studio créatif kntera INC.
            </a>
            {' '}— Tous droits réservés.
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] animate-pulse" />
            <span className="text-white/25 text-[11px] tracking-wide">
              Fait avec soin au Québec
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
