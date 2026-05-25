import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ChevronRight, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cx-page transition-colors duration-300">

      {/* ── Hero banner ── */}
      <div className="relative w-full h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1a0608] to-[#7B2535]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C41E3A 0%, transparent 60%), radial-gradient(circle at 80% 50%, #7B2535 0%, transparent 60%)' }} />
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <ol className="flex items-center gap-1.5 text-[13px] text-white/50 mb-3">
              <li>
                <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
                  <Home size={13} />
                  Accueil
                </Link>
              </li>
              <li><ChevronRight size={12} /></li>
              <li className="text-white/80 font-medium">Politique de confidentialité</li>
            </ol>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15
                flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={22} className="text-[#C41E3A]" />
              </div>
              <div>
                <p className="text-white/50 text-[12px] font-semibold tracking-widest uppercase mb-1">
                  Gestion des données
                </p>
                <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Protection de la vie privée
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Intro card */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-cx-card rounded-2xl border border-cx-line
            shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] px-8 sm:px-12 py-8 mb-8"
        >
          <p className="text-[15px] text-cx-body leading-[1.85] max-w-4xl">
            CuisineXpress places great importance on protecting the personal information it holds in the
            course of its operations. CuisineXpress is subject to <span className="font-semibold text-cx-base">Law 25</span> on
            the protection of personal information, which requires it to ensure the confidentiality of the
            personal information it holds and to take the necessary security measures to do so. Consequently,
            CuisineXpress has adopted very rigorous security and control measures to ensure the protection of
            this information.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="flex flex-col gap-6">

          {/* Section 1 */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">1</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">
                Information collected by CuisineXpress
              </h2>
            </div>
            <div className="px-8 sm:px-12 py-6 flex flex-col gap-5">
              <p className="text-[14px] text-cx-soft leading-relaxed">
                We collect your personal information in several ways and for different purposes, depending
                on its category. The table below explains what information is collected and for what purposes.
              </p>
              <div className="rounded-xl border border-cx-line overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[540px] text-[13.5px]">
                  <thead>
                    <tr className="bg-cx-fill">
                      <th className="text-left px-5 py-3.5 font-semibold text-cx-base border-b border-cx-line w-1/4">Category</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-cx-base border-b border-cx-line w-1/3">Examples</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-cx-base border-b border-cx-line">Purposes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cx-line">
                    <tr className="align-top">
                      <td className="px-5 py-4 font-semibold text-cx-base">Website visitor</td>
                      <td className="px-5 py-4 text-cx-soft">Identification data; technological data; usage and performance data.</td>
                      <td className="px-5 py-4 text-cx-soft">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Respond to information requests</li>
                          <li>Understand browsing patterns and improve performance</li>
                          <li>Statistical analysis of website visits</li>
                          <li>Advertising targeting on other platforms</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="align-top bg-cx-fill">
                      <td className="px-5 py-4 font-semibold text-cx-base">User account</td>
                      <td className="px-5 py-4 text-cx-soft">Identification data; order data; technological data; usage and performance data.</td>
                      <td className="px-5 py-4 text-cx-soft">Coordinate meal orders to the correct schools and classrooms.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[13px] text-cx-soft italic">
                We may also collect and use your personal information for any other purpose permitted or required by applicable laws.
              </p>
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">2</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">
                Circumstances under which we share your personal information
              </h2>
            </div>
            <div className="px-8 sm:px-12 py-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: 'Service Providers & Partners',
                  body: 'Third parties performing functions on our behalf — data retention, hosting, maintenance, IT services, database management, and data security. They are contractually obligated to protect your information.',
                },
                {
                  title: 'Professional Consultants',
                  body: 'Legal, financial, accounting, or other consultants to the extent necessary to operate our business and comply with applicable laws.',
                },
                {
                  title: 'Police & Government Agencies',
                  body: 'We may receive requests from authorities to access personal information. We verify the legitimacy of each request before responding.',
                },
              ].map(({ title, body }) => (
                <div key={title} className="rounded-xl bg-cx-fill border border-cx-line px-5 py-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] flex-shrink-0" />
                    <p className="text-[14px] font-bold text-cx-base">{title}</p>
                  </div>
                  <p className="text-[13px] text-cx-soft leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">3</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">
                Storage and security of your personal information
              </h2>
            </div>
            <div className="px-8 sm:px-12 py-6 flex flex-col gap-3">
              {[
                'The information we collect is stored in Canada, and in some cases, outside of Quebec. By using the Site, you consent to the transfer of information outside of Quebec. Privacy laws may differ from one jurisdiction to another.',
                'We take steps to implement physical, administrative, and technical safeguards to protect the confidentiality, integrity, and security of the personal information under our control. However, no security measure is absolute or fully guaranteed.',
                'Only authorized personnel and approved third-party suppliers have access to your personal information, and only in the context of performing their duties. Your personal information will only be used for the purposes for which it was collected.',
                'CuisineXpress adheres to the timeframes outlined in its retention schedule, in accordance with applicable laws. We will retain your personal information only for as long as necessary to fulfill the relevant purposes.',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C41E3A]/50 flex-shrink-0" />
                  <p className="text-[14px] text-cx-soft leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 4 */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">4</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">
                Links to other sites and limitations of liability
              </h2>
            </div>
            <div className="px-8 sm:px-12 py-6">
              <p className="text-[14px] text-cx-soft leading-relaxed">
                Our Site may offer relevant links to other websites operated by third parties. Please be aware that
                when you visit a site via a hyperlink we provide, you may leave our Site. Any information exchanged
                with another site will be subject to the terms of that other site — not these Terms of Use.
                CuisineXpress is not responsible for the content included on other websites linked from our Site.
              </p>
            </div>
          </motion.div>

          {/* Section 5 */}
          <motion.div custom={5} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">5</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">
                Connection cookies
              </h2>
            </div>
            <div className="px-8 sm:px-12 py-6 flex flex-col gap-5">
              <p className="text-[14px] text-cx-soft leading-relaxed">
                We collect technical data through cookies — including strictly necessary, performance,
                functionality, and targeted advertising cookies. You can manage your cookie preferences in
                your browser settings. Refusing functional cookies may limit your experience on the Site.
              </p>
              <p className="text-[14px] text-cx-soft leading-relaxed">
                Advertising cookies allow us to offer relevant content on other websites (including Meta and
                LinkedIn) based on browsing behavior. These cookies <span className="font-semibold text-cx-base">do not</span> record
                your name, address, phone number, email, or any other personally identifiable information.
              </p>
              <div className="rounded-xl bg-cx-fill border border-cx-line px-6 py-5">
                <p className="text-[13px] font-semibold text-cx-base mb-3">
                  Information that may be collected includes, but is not limited to:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                  {[
                    "Truncated IP address (modified to prevent identification)",
                    "Internet service provider",
                    "Operating system (e.g., Mac OS, Windows)",
                    "Device type and model (e.g., iPhone 11)",
                    "Screen resolution",
                    "Browser type, language, and version",
                    "Region or municipality (derived from IP)",
                    "Domain of previously visited site",
                    "Point of origin (banner, email, social network)",
                    "Pages viewed and interaction data (clicks, scrolling, duration)",
                    "Basic statistics and analytical tool data",
                    "Aggregated interest and demographic data (non-identifiable)",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="mt-[7px] w-1 h-1 rounded-full bg-[#C41E3A]/60 flex-shrink-0" />
                      <span className="text-[13px] text-cx-soft">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 6 */}
          <motion.div custom={6} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">6</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">
                Your rights regarding your personal information
              </h2>
            </div>
            <div className="px-8 sm:px-12 py-6 flex flex-col gap-5">
              <p className="text-[14px] text-cx-soft leading-relaxed">
                The person responsible for access to documents and the protection of personal information at
                CuisineXpress (the "ADR") is{' '}
                <span className="font-semibold text-cx-base">Patrick Duchesne</span>.
                He is responsible for ensuring compliance with these Terms of Use and all obligations under
                the Act to modernize legislative provisions concerning the protection of personal information.
              </p>
              <p className="text-[14px] text-cx-soft leading-relaxed">
                Upon written request and confirmation of your identity, you have the right to obtain any personal
                information CuisineXpress holds about you, and to request that inaccurate or ambiguous information
                be corrected or destroyed. You also have the right to complain directly to a data protection authority.
              </p>

              {/* Contact card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
                {[
                  { icon: MapPin, label: 'Adresse', value: '1309 Rue Arthur-Dupéré, Québec (QC) G1C 0M1', href: undefined },
                  { icon: Mail,   label: 'Courriel', value: 'info@cuisinexpressrepas.ca', href: 'mailto:info@cuisinexpressrepas.ca' },
                  { icon: Phone,  label: 'Téléphone', value: '581-992-9952', href: 'tel:5819929952' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl bg-cx-fill
                    border border-cx-line px-5 py-4">
                    <div className="w-9 h-9 rounded-lg bg-[#C41E3A]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-[#C41E3A]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-cx-soft uppercase tracking-wide mb-0.5">{label}</p>
                      {href
                        ? <a href={href} className="text-[13px] font-semibold text-[#C41E3A] hover:underline underline-offset-2">{value}</a>
                        : <p className="text-[13px] font-semibold text-cx-base leading-snug">{value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Section 7 */}
          <motion.div custom={7} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            className="bg-cx-card rounded-2xl border border-cx-line shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center gap-4 px-8 sm:px-12 pt-7 pb-5 border-b border-cx-line">
              <span className="w-8 h-8 rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] text-[13px] font-extrabold
                flex items-center justify-center flex-shrink-0">7</span>
              <h2 className="text-[17px] font-extrabold text-cx-base tracking-tight">
                Update
              </h2>
            </div>
            <div className="px-8 sm:px-12 py-6">
              <p className="text-[14px] text-cx-soft leading-relaxed">
                Please check our Site regularly to stay informed of any changes to these Terms of Use,
                as we may update them from time to time.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
