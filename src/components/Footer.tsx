import { motion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LangContext'

const INFO_HREFS = ['/nos-ecoles', '/commander', '/contact', '/politique', '/confidentialite']


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
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

function NavColumn({
  custom,
  tag,
  title,
  links,
}: {
  custom: number
  tag: string
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <motion.div
      custom={custom}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="h-px w-6 bg-[#C41E3A]" />
        <h4 className="text-white/50 text-[12px] font-semibold tracking-widest uppercase">{tag}</h4>
      </div>
      <h3 className="text-white font-bold text-[18px] tracking-tight">{title}</h3>
      <ul className="flex flex-col gap-2.5 mt-1">
        {links.map((link, idx) => (
          <li key={idx}>
            <Link
              to={link.href}
              className="group/nav flex items-start gap-2 text-white/60
                hover:text-white text-[15px] transition-colors duration-200"
            >
              <span className="mt-[5px] flex-shrink-0 w-1 h-1 rounded-full bg-[#C41E3A]/50
                group-hover/nav:bg-[#C41E3A] transition-colors duration-200" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function Footer() {
  const { t } = useLang()
  const infoLinks = t.footer.links.map((label, i) => ({ label, href: INFO_HREFS[i] ?? '#', i }))

  return (
    <footer className="w-full bg-[#0A0A0A] text-white">

      {/* Main footer body */}
      <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6 pt-12 sm:pt-16 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-16">

          {/* Column 1 — Brand */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1"
          >
            {/* Logo */}
            <Link to="/" className="inline-block w-fit group">
              <img
                src="/logo.jpg"
                alt="CuisineXpress"
                className="h-16 w-auto rounded-sm
                  shadow-[0_0_0_2px_rgba(196,30,58,0.3)]
                  group-hover:shadow-[0_0_0_2px_#C41E3A]
                  transition-all duration-300"
              />
            </Link>

            {/* Tagline */}
            <div>
              <p className="text-white/90 font-semibold text-[16px] mb-1">CuisineXpress</p>
              <p className="text-white/65 text-[15px] leading-relaxed">
                {t.footer.tagline}
              </p>
            </div>

            {/* Contact */}
            <ul className="flex flex-col gap-3">
              {contactItems.map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="flex items-center gap-3 text-white/60 hover:text-white
                      text-[15px] transition-colors duration-200 group/contact"
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

          {/* Column 2 — Partner */}
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
              <h4 className="text-white/50 text-[12px] font-semibold tracking-widest uppercase">
                {t.footer.partnerTag}
              </h4>
            </div>
            <h3 className="text-white font-bold text-[18px] tracking-tight">
              {t.footer.partnerTitle}
            </h3>
            <p className="text-white/65 text-[15px] leading-[1.75]">
              {t.footer.partnerText}
            </p>
          </motion.div>

          {/* Column 3 — Navigation */}
          <NavColumn
            custom={2}
            tag={t.footer.navTag}
            title={t.footer.navTitle}
            links={infoLinks}
          />

        </div>
      </div>

      {/* Divider */}
      <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Copyright bar */}
      <div className="max-w-[1380px] mx-auto px-3 sm:px-4 lg:px-6 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-white/50 text-[14px]">
            Copyright ©2026{' '}
            <a
              href="#"
              className="text-white/70 hover:text-[#C41E3A] underline underline-offset-2
                transition-colors duration-200"
            >
              Studio créatif kntera INC.
            </a>
            {' '}— {t.footer.copyright}
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] animate-pulse" />
            <span className="text-white/40 text-[13px] tracking-wide">
              {t.footer.madeWith}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
