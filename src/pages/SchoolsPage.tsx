import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, X, ChevronRight, Clock, Truck,
  GraduationCap, Map, List, CheckCircle2,
} from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────────────────
type Status = 'active' | 'upcoming'
interface School {
  id: number; name: string; city: string
  address: string; lat: number; lng: number
  status: Status; days: string
}

const schools: School[] = [
  { id:  1, name: 'Notre-Dame Pavilion High Bell Tower', city: 'Québec',     address: '1 rue de l\'Université, Québec',  lat: 46.8078, lng: -71.2175, status: 'active',   days: 'Lun–Ven' },
  { id:  2, name: 'St. Charles Pavilion, High Bell Tower', city: 'Québec',   address: 'St. Charles, Québec',             lat: 46.8012, lng: -71.2234, status: 'active',   days: 'Lun–Ven' },
  { id:  3, name: 'Ste-Foy Elementary School',           city: 'Sainte-Foy', address: '2555 ch. Sainte-Foy, Québec',    lat: 46.7841, lng: -71.3002, status: 'active',   days: 'Lun–Ven' },
  { id:  4, name: 'Alexander Wolff School',              city: 'Sainte-Foy', address: 'Sainte-Foy, Québec',             lat: 46.7956, lng: -71.2812, status: 'active',   days: 'Lun–Ven' },
  { id:  5, name: 'École Coeurs-Vaillants',              city: 'Sainte-Foy', address: 'Sainte-Foy, Québec',             lat: 46.7823, lng: -71.3156, status: 'upcoming',  days: 'Bientôt' },
  { id:  6, name: 'Rainbow School',                      city: 'Cap-Rouge',  address: 'Cap-Rouge, Québec',              lat: 46.7634, lng: -71.3523, status: 'active',   days: 'Lun–Ven' },
  { id:  7, name: 'Châtelaine School',                   city: 'Cap-Rouge',  address: 'Cap-Rouge, Québec',              lat: 46.7712, lng: -71.3234, status: 'active',   days: 'Lun–Ven' },
  { id:  8, name: 'Saint-Michel School (BEAUPORT)',      city: 'Beauport',   address: 'Beauport, Québec',               lat: 46.8523, lng: -71.1823, status: 'active',   days: 'Lun–Ven' },
  { id:  9, name: 'Dollard-Des-Ormeaux School',          city: 'Beauport',   address: 'Beauport, Québec',               lat: 46.8456, lng: -71.1934, status: 'active',   days: 'Lun–Ven' },
  { id: 10, name: 'Everest School',                      city: 'Québec',     address: 'Québec, QC',                     lat: 46.7912, lng: -71.2934, status: 'upcoming',  days: 'Bientôt' },
  { id: 11, name: 'Fernand-Seguin School',               city: 'Québec',     address: 'Québec, QC',                     lat: 46.8123, lng: -71.2456, status: 'active',   days: 'Lun–Ven' },
  { id: 12, name: 'Filteau School',                      city: 'Québec',     address: 'Québec, QC',                     lat: 46.7845, lng: -71.2678, status: 'active',   days: 'Lun–Ven' },
  { id: 13, name: 'Holland School',                      city: 'Québec',     address: 'Québec, QC',                     lat: 46.8234, lng: -71.2123, status: 'active',   days: 'Lun–Ven' },
  { id: 14, name: 'The Apprentice-Sage School',          city: 'Sainte-Foy', address: 'Sainte-Foy, Québec',             lat: 46.8012, lng: -71.2890, status: 'active',   days: 'Lun–Ven' },
  { id: 15, name: "L'Arbrisseau School",                 city: 'Sainte-Foy', address: 'Sainte-Foy, Québec',             lat: 46.7923, lng: -71.3045, status: 'upcoming',  days: 'Bientôt' },
  { id: 16, name: 'La Chaumière School',                 city: 'Cap-Rouge',  address: 'Cap-Rouge, Québec',              lat: 46.8145, lng: -71.3123, status: 'active',   days: 'Lun–Ven' },
  { id: 17, name: 'Les Primevères School',               city: 'Sainte-Foy', address: 'Sainte-Foy, Québec',             lat: 46.7834, lng: -71.2789, status: 'active',   days: 'Lun–Ven' },
]

const CITIES = ['Tous', 'Québec', 'Sainte-Foy', 'Cap-Rouge', 'Beauport']
const CENTER: [number, number] = [46.8050, -71.2600]

// ── Custom pin factory ────────────────────────────────────────────────────────
const makeIcon = (selected: boolean) =>
  L.divIcon({
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
    html: `<div class="cx-pin${selected ? ' selected' : ''}">
             <div class="cx-pin-ring"></div>
             <div class="cx-pin-dot"></div>
           </div>`,
  })

// ── Map controller (fly to) ───────────────────────────────────────────────────
function FlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, 15, { animate: true, duration: 0.75 })
  }, [center, map])
  return null
}

// ── School Card ───────────────────────────────────────────────────────────────
function SchoolCard({
  school, selected, onClick,
}: { school: School; selected: boolean; onClick: () => void }) {
  const isActive = school.status === 'active'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      onClick={onClick}
      className={`group relative cursor-pointer rounded-[20px] bg-white p-5
        border-2 transition-all duration-300 select-none
        ${selected
          ? 'border-[#7B2535] shadow-[0_8px_32px_rgba(123,37,53,0.18)]'
          : 'border-transparent shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:border-[#7B2535]/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]'
        }`}
    >
      {/* Number badge */}
      <span className={`absolute top-4 right-4 text-[11px] font-black tracking-wider
        px-2 py-0.5 rounded-full
        ${selected ? 'bg-[#7B2535] text-white' : 'bg-gray-100 text-gray-400'}`}>
        {String(school.id).padStart(2, '0')}
      </span>

      {/* Icon + name */}
      <div className="flex items-start gap-3.5 mb-4">
        <div className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center
          transition-colors duration-300
          ${selected ? 'bg-[#7B2535]' : 'bg-[#F5F5F5] group-hover:bg-[#FFF0F2]'}`}>
          <GraduationCap size={20} className={selected ? 'text-white' : 'text-[#7B2535]'} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 pr-8">
          <h3 className="text-[#0A0A0A] font-bold text-[14.5px] leading-snug line-clamp-2">
            {school.name}
          </h3>
          <p className="text-gray-400 text-[12.5px] mt-0.5 flex items-center gap-1">
            <MapPin size={11} />
            {school.city}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
          text-[11.5px] font-semibold
          ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          {isActive ? 'Livraison active' : 'Bientôt disponible'}
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
          bg-gray-50 text-gray-500 text-[11.5px] font-medium">
          <Clock size={10} />
          {school.days}
        </span>
      </div>

      {/* CTA */}
      <div className={`flex items-center justify-between pt-3.5
        border-t ${selected ? 'border-[#7B2535]/15' : 'border-gray-100'}`}>
        <span className="text-[12.5px] text-gray-400 flex items-center gap-1.5">
          <Truck size={12} /> Livraison incluse
        </span>
        <button className={`flex items-center gap-1.5 text-[12.5px] font-bold
          transition-all duration-200
          ${selected ? 'text-[#7B2535]' : 'text-gray-400 group-hover:text-[#7B2535]'}`}>
          Voir le menu
          <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SchoolsPage() {
  const [search, setSearch]               = useState('')
  const [cityFilter, setCityFilter]       = useState('Tous')
  const [selectedId, setSelectedId]       = useState<number | null>(null)
  const [flyTarget, setFlyTarget]         = useState<[number, number] | null>(null)
  const [mobileTab, setMobileTab]         = useState<'schools' | 'map'>('schools')
  const cardRefs                          = useRef<Record<number, HTMLDivElement | null>>({})

  const filtered = schools.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.city.toLowerCase().includes(search.toLowerCase())
    const matchCity = cityFilter === 'Tous' || s.city === cityFilter
    return matchSearch && matchCity
  })

  const select = (s: School) => {
    setSelectedId(s.id)
    setFlyTarget([s.lat, s.lng])
    // scroll card into view on desktop
    cardRefs.current[s.id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const activeCnt  = filtered.filter(s => s.status === 'active').length
  const upcomingCnt = filtered.filter(s => s.status === 'upcoming').length

  // ── Map panel ──────────────────────────────────────────────────────────────
  const MapPanel = (
    <div className="relative w-full h-full rounded-[24px] overflow-hidden
      shadow-[0_8px_48px_rgba(0,0,0,0.12)]">
      <MapContainer
        center={CENTER}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        scrollWheelZoom
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <FlyTo center={flyTarget} />

        {filtered.map(s => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={makeIcon(selectedId === s.id)}
            eventHandlers={{ click: () => select(s) }}
          >
            <Popup className="cx-popup">
              <div className="px-1 py-0.5 min-w-[180px]">
                <p className="font-bold text-[13px] text-[#0A0A0A] leading-snug mb-1">{s.name}</p>
                <p className="text-[11.5px] text-gray-400 flex items-center gap-1">
                  <MapPin size={10} /> {s.address}
                </p>
                <span className={`mt-2 inline-flex items-center gap-1 text-[11px] font-semibold
                  px-2 py-0.5 rounded-full
                  ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  {s.status === 'active' ? 'Active' : 'Bientôt'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 z-[999] flex items-center gap-3
        bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2.5
        shadow-[0_4px_20px_rgba(0,0,0,0.10)] text-[11.5px]">
        <span className="flex items-center gap-1.5 text-gray-600 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7B2535]" /> Active
        </span>
        <span className="w-px h-3 bg-gray-200" />
        <span className="flex items-center gap-1.5 text-gray-600 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Bientôt
        </span>
        <span className="w-px h-3 bg-gray-200" />
        <span className="text-gray-500 font-medium">{filtered.length} écoles</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F7F7F7]">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[#C41E3A] text-[11.5px] font-bold tracking-widest uppercase">
                Réseau de livraison
              </span>
              <h1 className="text-[#0A0A0A] text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                Nos écoles
              </h1>
              <p className="text-gray-400 text-[14px] mt-1.5">
                {activeCnt} école{activeCnt > 1 ? 's' : ''} actives ·{' '}
                {upcomingCnt} à venir · Québec, Canada
              </p>
            </div>

            {/* Stats chips */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100
                rounded-2xl px-4 py-2 text-[12.5px] font-semibold text-emerald-700">
                <CheckCircle2 size={13} /> {activeCnt} actives
              </div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100
                rounded-2xl px-4 py-2 text-[12.5px] font-semibold text-amber-700">
                <Clock size={13} /> {upcomingCnt} à venir
              </div>
            </div>
          </div>

          {/* Search + filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {/* Search bar */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une école ou une ville…"
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200
                  bg-gray-50 text-[14px] outline-none placeholder:text-gray-300
                  focus:bg-white focus:border-[#C41E3A] focus:shadow-[0_0_0_3px_rgba(196,30,58,0.08)]
                  transition-all duration-200"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={15} />
                </button>
              )}
            </div>

            {/* City filter chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {CITIES.map(city => (
                <button key={city} onClick={() => setCityFilter(city)}
                  className={`px-4 py-2.5 rounded-2xl text-[13px] font-semibold
                    border-2 transition-all duration-200 whitespace-nowrap
                    ${cityFilter === city
                      ? 'bg-[#7B2535] border-[#7B2535] text-white shadow-[0_4px_12px_rgba(123,37,53,0.3)]'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-[#7B2535]/40 hover:text-[#7B2535]'
                    }`}>
                  {city}
                  {city !== 'Tous' && (
                    <span className={`ml-1.5 text-[11px] ${cityFilter === city ? 'opacity-70' : 'opacity-50'}`}>
                      {schools.filter(s => s.city === city).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="mt-4 flex lg:hidden bg-gray-100 rounded-2xl p-1 w-fit">
            {(['schools', 'map'] as const).map(tab => (
              <button key={tab} onClick={() => setMobileTab(tab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold
                  transition-all duration-200
                  ${mobileTab === tab ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-gray-400'}`}>
                {tab === 'schools' ? <><List size={14} /> Écoles</> : <><Map size={14} /> Carte</>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Split layout ── */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">

        {/* Desktop: side by side */}
        <div className="hidden lg:flex gap-6 items-start py-6">

          {/* Left — scrollable cards */}
          <div className="w-[42%] flex-shrink-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center
                  justify-center mb-4">
                  <Search size={24} className="text-gray-300" />
                </div>
                <p className="text-[#0A0A0A] font-semibold text-[15px] mb-1">Aucun résultat</p>
                <p className="text-gray-400 text-[13px]">
                  Essayez un autre terme ou sélectionnez « Tous ».
                </p>
              </div>
            ) : (
              <motion.div layout className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map(s => (
                    <div key={s.id} ref={el => { cardRefs.current[s.id] = el }}>
                      <SchoolCard
                        school={s}
                        selected={selectedId === s.id}
                        onClick={() => select(s)}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Right — sticky map */}
          <div className="flex-1 sticky top-[96px]" style={{ height: 'calc(100vh - 110px)' }}>
            {MapPanel}
          </div>
        </div>

        {/* Mobile: tabs */}
        <div className="lg:hidden py-4">
          {mobileTab === 'schools' ? (
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map(s => (
                  <div key={s.id}>
                    <SchoolCard school={s} selected={selectedId === s.id}
                      onClick={() => { select(s); setMobileTab('map') }} />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ height: 'calc(100vh - 280px)' }} className="rounded-[24px] overflow-hidden">
              {MapPanel}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
