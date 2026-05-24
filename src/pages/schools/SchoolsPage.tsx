import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search, MapPin, X, ChevronRight, Clock, Truck,
  GraduationCap, Map, List, Home, CheckCircle2,
} from 'lucide-react'

type Status = 'active' | 'upcoming'
interface School {
  id: number; name: string; city: string
  address: string; lat: number; lng: number; status: Status
}

const schools: School[] = [
  { id:  1, name: 'Notre-Dame Pavilion High Bell Tower',   city: 'Québec',     address: '1 rue de l\'Université, Québec',  lat: 46.8078, lng: -71.2175, status: 'active'   },
  { id:  2, name: 'St. Charles Pavilion, High Bell Tower', city: 'Québec',     address: 'St. Charles, Québec',             lat: 46.8012, lng: -71.2234, status: 'active'   },
  { id:  3, name: 'Ste-Foy Elementary School',             city: 'Sainte-Foy', address: '2555 ch. Sainte-Foy, Québec',    lat: 46.7841, lng: -71.3002, status: 'active'   },
  { id:  4, name: 'Alexander Wolff School',                city: 'Sainte-Foy', address: 'Sainte-Foy, Québec',             lat: 46.7956, lng: -71.2812, status: 'active'   },
  { id:  5, name: 'École Coeurs-Vaillants',                city: 'Sainte-Foy', address: 'Sainte-Foy, Québec',             lat: 46.7823, lng: -71.3156, status: 'upcoming'  },
  { id:  6, name: 'Rainbow School',                        city: 'Cap-Rouge',  address: 'Cap-Rouge, Québec',              lat: 46.7634, lng: -71.3523, status: 'active'   },
  { id:  7, name: 'Châtelaine School',                     city: 'Cap-Rouge',  address: 'Cap-Rouge, Québec',              lat: 46.7712, lng: -71.3234, status: 'active'   },
  { id:  8, name: 'Saint-Michel School (BEAUPORT)',        city: 'Beauport',   address: 'Beauport, Québec',               lat: 46.8523, lng: -71.1823, status: 'active'   },
  { id:  9, name: 'Dollard-Des-Ormeaux School',            city: 'Beauport',   address: 'Beauport, Québec',               lat: 46.8456, lng: -71.1934, status: 'active'   },
  { id: 10, name: 'Everest School',                        city: 'Québec',     address: 'Québec, QC',                     lat: 46.7912, lng: -71.2934, status: 'upcoming'  },
  { id: 11, name: 'Fernand-Seguin School',                 city: 'Québec',     address: 'Québec, QC',                     lat: 46.8123, lng: -71.2456, status: 'active'   },
  { id: 12, name: 'Filteau School',                        city: 'Québec',     address: 'Québec, QC',                     lat: 46.7845, lng: -71.2678, status: 'active'   },
  { id: 13, name: 'Holland School',                        city: 'Québec',     address: 'Québec, QC',                     lat: 46.8234, lng: -71.2123, status: 'active'   },
  { id: 14, name: 'The Apprentice-Sage School',            city: 'Sainte-Foy', address: 'Sainte-Foy, Québec',             lat: 46.8012, lng: -71.2890, status: 'active'   },
  { id: 15, name: "L'Arbrisseau School",                   city: 'Sainte-Foy', address: 'Sainte-Foy, Québec',             lat: 46.7923, lng: -71.3045, status: 'upcoming'  },
  { id: 16, name: 'La Chaumière School',                   city: 'Cap-Rouge',  address: 'Cap-Rouge, Québec',              lat: 46.8145, lng: -71.3123, status: 'active'   },
  { id: 17, name: 'Les Primevères School',                 city: 'Sainte-Foy', address: 'Sainte-Foy, Québec',             lat: 46.7834, lng: -71.2789, status: 'active'   },
]

const CITIES = ['Tous', 'Québec', 'Sainte-Foy', 'Cap-Rouge', 'Beauport']
const CENTER: [number, number] = [46.8050, -71.2600]

const makePin = (active: boolean, selected: boolean) =>
  L.divIcon({
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
    html: `<div style="
      width:34px;height:34px;border-radius:50%;
      background:${selected ? '#C41E3A' : active ? '#7B2535' : '#F59E0B'};
      border:3px solid white;
      box-shadow:0 2px 10px rgba(0,0,0,0.25);
      display:flex;align-items:center;justify-content:center;
      transform:${selected ? 'scale(1.25)' : 'scale(1)'};
      transition:transform 0.2s;
    ">
      <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>`,
  })

function FlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, 15, { animate: true, duration: 0.8 })
  }, [center, map])
  return null
}

export default function SchoolsPage() {
  const [search, setSearch]     = useState('')
  const [city, setCity]         = useState('Tous')
  const [selectedId, setSelected] = useState<number | null>(null)
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null)
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list')
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const filtered = schools.filter(s => {
    const q = search.toLowerCase()
    return (city === 'Tous' || s.city === city) &&
           (s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q))
  })

  const activeCnt   = schools.filter(s => s.status === 'active').length
  const upcomingCnt = schools.filter(s => s.status === 'upcoming').length

  const select = (s: School) => {
    setSelected(s.id)
    setFlyTarget([s.lat, s.lng])
    cardRefs.current[s.id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const MapPanel = (
    <div className="relative w-full h-full rounded-2xl overflow-hidden
      shadow-[0_4px_32px_rgba(0,0,0,0.12)]">
      <MapContainer center={CENTER} zoom={12}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false} scrollWheelZoom>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <FlyTo center={flyTarget} />
        {filtered.map(s => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={makePin(s.status === 'active', selectedId === s.id)}
            eventHandlers={{ click: () => select(s) }}
          >
            <Popup>
              <div className="min-w-[160px] py-1">
                <p className="font-bold text-[13px] text-[#0A0A0A] leading-snug mb-1">{s.name}</p>
                <p className="text-[11.5px] text-gray-400">{s.address}</p>
                <span className={`mt-2 inline-flex items-center gap-1 text-[11px] font-semibold
                  px-2 py-0.5 rounded-full
                  ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {s.status === 'active' ? '● Active' : '● Bientôt'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[999] bg-white/95 backdrop-blur-sm
        rounded-xl px-4 py-2.5 shadow-[0_2px_16px_rgba(0,0,0,0.1)]
        flex items-center gap-3 text-[12px] font-medium text-gray-600">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7B2535]" /> Active
        </span>
        <span className="w-px h-3 bg-gray-200" />
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Bientôt
        </span>
        <span className="w-px h-3 bg-gray-200" />
        <span>{filtered.length} école{filtered.length > 1 ? 's' : ''}</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* ── Breadcrumb ── */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-[13px] text-gray-400">
            <li>
              <Link to="/" className="flex items-center gap-1 hover:text-[#C41E3A] transition-colors">
                <Home size={13} /> Accueil
              </Link>
            </li>
            <li><ChevronRight size={12} /></li>
            <li className="text-[#0A0A0A] font-medium">Nos écoles</li>
          </ol>
        </div>
      </div>

      {/* ── Hero strip ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p className="text-[11.5px] font-semibold text-[#C41E3A] tracking-widest uppercase mb-2 flex items-center gap-1.5">
                <span className="w-4 h-px bg-[#C41E3A]" /> Réseau de livraison
              </p>
              <h1 className="text-[38px] font-extrabold text-[#0A0A0A] tracking-tight leading-tight mb-2">
                Nos écoles<br />
                <span className="text-[#C41E3A]">partenaires</span>
              </h1>
              <p className="text-gray-400 text-[14.5px]">
                {activeCnt} écoles actives · {upcomingCnt} à venir · Québec, Canada
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100
                rounded-xl px-4 py-2 text-[12.5px] font-semibold text-emerald-700">
                <CheckCircle2 size={13} /> {activeCnt} livraisons actives
              </div>
              <div className="flex items-center gap-2 bg-[#FFF0F2] border border-[#C41E3A]/15
                rounded-xl px-4 py-2 text-[12.5px] font-semibold text-[#C41E3A]">
                <Truck size={13} /> Livraison incluse
              </div>
            </div>
          </div>

          {/* Search + city filter */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-shrink-0 sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une école…"
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-[13.5px]
                  bg-[#FAFAFA] outline-none placeholder:text-gray-300 transition-all duration-200
                  focus:bg-white focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {CITIES.map(c => (
                <button key={c} onClick={() => setCity(c)}
                  className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold border-2
                    transition-all duration-200 whitespace-nowrap
                    ${city === c
                      ? 'bg-[#C41E3A] border-[#C41E3A] text-white shadow-[0_4px_12px_rgba(196,30,58,0.3)]'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-[#C41E3A]/40 hover:text-[#C41E3A]'
                    }`}>
                  {c}
                  {c !== 'Tous' && (
                    <span className={`ml-1.5 text-[11px] ${city === c ? 'opacity-75' : 'opacity-40'}`}>
                      {schools.filter(s => s.city === c).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile tab toggle */}
          <div className="mt-4 flex lg:hidden bg-gray-100 rounded-xl p-1 w-fit">
            {(['list', 'map'] as const).map(tab => (
              <button key={tab} onClick={() => setMobileTab(tab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-bold
                  transition-all duration-200
                  ${mobileTab === tab ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-gray-400'}`}>
                {tab === 'list' ? <><List size={14} /> Liste</> : <><Map size={14} /> Carte</>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Desktop split */}
        <div className="hidden lg:flex gap-6 py-8 items-start">

          {/* Scrollable list */}
          <div className="w-[44%] flex-shrink-0 flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
                  <Search size={22} className="text-gray-300" />
                </div>
                <p className="text-[15px] font-bold text-[#0A0A0A] mb-1">Aucun résultat</p>
                <p className="text-[13px] text-gray-400">Essayez un autre terme ou « Tous ».</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.map((s, i) => (
                  <motion.div
                    key={s.id}
                    ref={el => { cardRefs.current[s.id] = el }}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    onClick={() => select(s)}
                    className={`group cursor-pointer bg-white rounded-2xl p-4 border-2
                      transition-all duration-250 select-none
                      ${selectedId === s.id
                        ? 'border-[#C41E3A] shadow-[0_4px_24px_rgba(196,30,58,0.14)]'
                        : 'border-transparent shadow-[0_1px_10px_rgba(0,0,0,0.06)] hover:border-[#C41E3A]/25 hover:shadow-[0_4px_18px_rgba(0,0,0,0.09)]'
                      }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                        flex-shrink-0 transition-colors duration-200
                        ${selectedId === s.id ? 'bg-[#C41E3A]' : 'bg-[#FFF0F2] group-hover:bg-[#C41E3A]/10'}`}>
                        <GraduationCap size={18}
                          className={selectedId === s.id ? 'text-white' : 'text-[#C41E3A]'}
                          strokeWidth={1.75} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-[14px] font-bold text-[#0A0A0A] leading-snug">
                            {s.name}
                          </h3>
                          <span className={`flex-shrink-0 text-[10px] font-black tracking-wider
                            px-2 py-0.5 rounded-full
                            ${selectedId === s.id ? 'bg-[#C41E3A] text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {String(s.id).padStart(2, '0')}
                          </span>
                        </div>

                        <p className="flex items-center gap-1 text-[12px] text-gray-400 mb-2.5">
                          <MapPin size={10} /> {s.city}
                        </p>

                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1
                            rounded-full text-[11px] font-semibold
                            ${s.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full
                              ${s.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            {s.status === 'active' ? 'Livraison active' : 'Bientôt'}
                          </span>
                          {s.status === 'active' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1
                              rounded-full bg-gray-50 text-gray-400 text-[11px] border border-gray-100">
                              <Clock size={9} /> Lun – Ven
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Sticky map */}
          <div className="flex-1 sticky top-[80px]" style={{ height: 'calc(100vh - 100px)' }}>
            {MapPanel}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden py-5">
          {mobileTab === 'list' ? (
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((s, i) => (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => { select(s); setMobileTab('map') }}
                    className="cursor-pointer bg-white rounded-2xl p-4 border border-gray-100
                      shadow-[0_1px_10px_rgba(0,0,0,0.06)] active:scale-[0.99] transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF0F2] flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={18} className="text-[#C41E3A]" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-[#0A0A0A] truncate">{s.name}</p>
                        <p className="text-[12px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {s.city}
                        </p>
                      </div>
                      <span className={`flex-shrink-0 w-2 h-2 rounded-full
                        ${s.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ height: 'calc(100vh - 300px)' }}>
              {MapPanel}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[13px] text-gray-400 pb-10">
          Votre école n'est pas listée ?{' '}
          <Link to="/contact" className="text-[#C41E3A] font-semibold hover:underline underline-offset-2">
            Contactez-nous
          </Link>
        </p>
      </div>
    </div>
  )
}
