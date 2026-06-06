// ─── CSS Districts ─────────────────────────────────────────────────────────────

export interface CssDistrict {
  id: string
  name: string
  shortName: string
  accentColor: string   // hex for inline styles
  bgLight: string       // light-mode tile bg
  bgDark: string        // dark-mode tile bg
  cities: string[]
}

export const CSS_DISTRICTS: CssDistrict[] = [
  {
    id: 'css-navigateurs',
    name: 'CSS des Navigateurs',
    shortName: 'Navigateurs',
    accentColor: '#1D4ED8',
    bgLight: '#EFF6FF',
    bgDark: '#1e3a5f',
    cities: ['Lévis', 'Saint-Romuald', 'Charny', 'Saint-Nicolas'],
  },
  {
    id: 'css-capitale',
    name: 'CSS de la Capitale',
    shortName: 'La Capitale',
    accentColor: '#15803D',
    bgLight: '#F0FDF4',
    bgDark: '#14532d',
    cities: ['Québec', 'Beauport', 'Charlesbourg', 'Limoilou'],
  },
  {
    id: 'css-decouvreurs',
    name: 'CSS des Découvreurs',
    shortName: 'Découvreurs',
    accentColor: '#C2410C',
    bgLight: '#FFF7ED',
    bgDark: '#431407',
    cities: ['Sainte-Foy', 'Sillery', 'Cap-Rouge', 'L\'Ancienne-Lorette'],
  },
  {
    id: 'css-portneuf',
    name: 'CSS Portneuf',
    shortName: 'Portneuf',
    accentColor: '#7E22CE',
    bgLight: '#FAF5FF',
    bgDark: '#3b0764',
    cities: ['Pont-Rouge', 'Donnacona', 'Saint-Raymond', 'Portneuf'],
  },
]

// ─── Schools ───────────────────────────────────────────────────────────────────

export interface SchoolEntry {
  id: string
  cssId: string
  cssName: string
  name: string
  city: string
}

export const SCHOOLS: SchoolEntry[] = [
  // ── CSS des Navigateurs ──
  { id: 'school-nav-1', cssId: 'css-navigateurs', cssName: 'CSS des Navigateurs', name: 'École Saint-Pierre',        city: 'Lévis' },
  { id: 'school-nav-2', cssId: 'css-navigateurs', cssName: 'CSS des Navigateurs', name: 'École des Berges',          city: 'Lévis' },
  { id: 'school-nav-3', cssId: 'css-navigateurs', cssName: 'CSS des Navigateurs', name: 'École Saint-Romuald',       city: 'Saint-Romuald' },
  { id: 'school-nav-4', cssId: 'css-navigateurs', cssName: 'CSS des Navigateurs', name: 'École Primaire Saint-Jean', city: 'Lévis' },  // matches meals mock
  { id: 'school-nav-5', cssId: 'css-navigateurs', cssName: 'CSS des Navigateurs', name: 'École des Sommets',         city: 'Charny' },  // matches meals mock

  // ── CSS de la Capitale ──
  { id: 'school-cap-1', cssId: 'css-capitale', cssName: 'CSS de la Capitale', name: 'École Sainte-Famille',      city: 'Québec' },
  { id: 'school-cap-2', cssId: 'css-capitale', cssName: 'CSS de la Capitale', name: 'École Saint-Jean-Baptiste', city: 'Québec' },
  { id: 'school-cap-3', cssId: 'css-capitale', cssName: 'CSS de la Capitale', name: 'École des Explorateurs',    city: 'Beauport' },
  { id: 'school-cap-4', cssId: 'css-capitale', cssName: 'CSS de la Capitale', name: 'École Limoilou',            city: 'Limoilou' },

  // ── CSS des Découvreurs ──
  { id: 'school-dec-1', cssId: 'css-decouvreurs', cssName: 'CSS des Découvreurs', name: 'École Arc-en-Ciel',    city: 'Sainte-Foy' },
  { id: 'school-dec-2', cssId: 'css-decouvreurs', cssName: 'CSS des Découvreurs', name: 'École Les Pins',       city: 'Sillery' },
  { id: 'school-dec-3', cssId: 'css-decouvreurs', cssName: 'CSS des Découvreurs', name: 'École Cap-Rouge',      city: 'Cap-Rouge' },

  // ── CSS Portneuf ──
  { id: 'school-por-1', cssId: 'css-portneuf', cssName: 'CSS Portneuf', name: 'École du Boisé',         city: 'Pont-Rouge' },
  { id: 'school-por-2', cssId: 'css-portneuf', cssName: 'CSS Portneuf', name: 'École des Découvertes',  city: 'Donnacona' },
  { id: 'school-por-3', cssId: 'css-portneuf', cssName: 'CSS Portneuf', name: 'École Saint-Raymond',    city: 'Saint-Raymond' },
]

// ─── Grades ────────────────────────────────────────────────────────────────────

export interface GradeEntry {
  id: string
  label: string
  labelEn: string
}

export const GRADES: GradeEntry[] = [
  { id: 'maternelle', label: 'Maternelle',  labelEn: 'Kindergarten' },
  { id: '1re',        label: '1re année',   labelEn: 'Grade 1' },
  { id: '2e',         label: '2e année',    labelEn: 'Grade 2' },
  { id: '3e',         label: '3e année',    labelEn: 'Grade 3' },
  { id: '4e',         label: '4e année',    labelEn: 'Grade 4' },
  { id: '5e',         label: '5e année',    labelEn: 'Grade 5' },
  { id: '6e',         label: '6e année',    labelEn: 'Grade 6' },
]

// ─── Teachers / Classes ────────────────────────────────────────────────────────

export interface TeacherEntry {
  id: string
  schoolId: string
  gradeId: string
  name: string
}

export const TEACHERS: TeacherEntry[] = [
  // ── École Saint-Pierre (school-nav-1) ──
  { id: 't-nav1-mat-1', schoolId: 'school-nav-1', gradeId: 'maternelle', name: 'Mme Sophie Tremblay' },
  { id: 't-nav1-mat-2', schoolId: 'school-nav-1', gradeId: 'maternelle', name: 'Mme Julie Côté' },
  { id: 't-nav1-1re-1', schoolId: 'school-nav-1', gradeId: '1re', name: 'Mme Marie Bouchard' },
  { id: 't-nav1-1re-2', schoolId: 'school-nav-1', gradeId: '1re', name: 'M. Pascal Gagnon' },
  { id: 't-nav1-2e-1',  schoolId: 'school-nav-1', gradeId: '2e',  name: 'Mme Claire Leblanc' },
  { id: 't-nav1-2e-2',  schoolId: 'school-nav-1', gradeId: '2e',  name: 'M. François Roy' },
  { id: 't-nav1-3e-1',  schoolId: 'school-nav-1', gradeId: '3e',  name: 'Mme Isabelle Morin' },
  { id: 't-nav1-3e-2',  schoolId: 'school-nav-1', gradeId: '3e',  name: 'M. Luc Bergeron' },
  { id: 't-nav1-4e-1',  schoolId: 'school-nav-1', gradeId: '4e',  name: 'Mme Nathalie Fortin' },
  { id: 't-nav1-5e-1',  schoolId: 'school-nav-1', gradeId: '5e',  name: 'M. Alain Carrier' },
  { id: 't-nav1-6e-1',  schoolId: 'school-nav-1', gradeId: '6e',  name: 'Mme Rachel Ouellet' },

  // ── École des Berges (school-nav-2) ──
  { id: 't-nav2-mat-1', schoolId: 'school-nav-2', gradeId: 'maternelle', name: 'Mme Anne-Marie Lavoie' },
  { id: 't-nav2-1re-1', schoolId: 'school-nav-2', gradeId: '1re', name: 'M. Pierre Girard' },
  { id: 't-nav2-2e-1',  schoolId: 'school-nav-2', gradeId: '2e',  name: 'Mme Louise Pelletier' },
  { id: 't-nav2-3e-1',  schoolId: 'school-nav-2', gradeId: '3e',  name: 'M. Denis Poulin' },
  { id: 't-nav2-4e-1',  schoolId: 'school-nav-2', gradeId: '4e',  name: 'Mme Sylvie Dion' },
  { id: 't-nav2-5e-1',  schoolId: 'school-nav-2', gradeId: '5e',  name: 'M. Yves Marchand' },
  { id: 't-nav2-6e-1',  schoolId: 'school-nav-2', gradeId: '6e',  name: 'Mme Josée Lemay' },

  // ── École Primaire Saint-Jean (school-nav-4) ──
  { id: 't-nav4-mat-1', schoolId: 'school-nav-4', gradeId: 'maternelle', name: 'Mme Cécile Beaulieu' },
  { id: 't-nav4-1re-1', schoolId: 'school-nav-4', gradeId: '1re', name: 'M. Robert Vaillancourt' },
  { id: 't-nav4-2e-1',  schoolId: 'school-nav-4', gradeId: '2e',  name: 'Mme Hélène Dussault' },
  { id: 't-nav4-3e-1',  schoolId: 'school-nav-4', gradeId: '3e',  name: 'Mme Geneviève Paré' },
  { id: 't-nav4-4e-1',  schoolId: 'school-nav-4', gradeId: '4e',  name: 'M. Martin Blais' },
  { id: 't-nav4-5e-1',  schoolId: 'school-nav-4', gradeId: '5e',  name: 'Mme Stéphanie Audet' },
  { id: 't-nav4-6e-1',  schoolId: 'school-nav-4', gradeId: '6e',  name: 'M. Claude Turgeon' },

  // ── École des Sommets (school-nav-5) ──
  { id: 't-nav5-mat-1', schoolId: 'school-nav-5', gradeId: 'maternelle', name: 'Mme Sandra Bélanger' },
  { id: 't-nav5-3e-1',  schoolId: 'school-nav-5', gradeId: '3e',  name: 'M. Jean-François Huot' },
  { id: 't-nav5-5e-1',  schoolId: 'school-nav-5', gradeId: '5e',  name: 'Mme Andrée Champagne' },
  { id: 't-nav5-6e-1',  schoolId: 'school-nav-5', gradeId: '6e',  name: 'M. Daniel Simard' },

  // ── École Sainte-Famille (school-cap-1) ──
  { id: 't-cap1-mat-1', schoolId: 'school-cap-1', gradeId: 'maternelle', name: 'Mme Lucie Thibodeau' },
  { id: 't-cap1-1re-1', schoolId: 'school-cap-1', gradeId: '1re', name: 'M. Eric Nadeau' },
  { id: 't-cap1-2e-1',  schoolId: 'school-cap-1', gradeId: '2e',  name: 'Mme Dominique Gagné' },
  { id: 't-cap1-3e-1',  schoolId: 'school-cap-1', gradeId: '3e',  name: 'M. Sébastien Cloutier' },
  { id: 't-cap1-4e-1',  schoolId: 'school-cap-1', gradeId: '4e',  name: 'Mme Véronique Laroche' },
  { id: 't-cap1-5e-1',  schoolId: 'school-cap-1', gradeId: '5e',  name: 'M. Patrick Guay' },
  { id: 't-cap1-6e-1',  schoolId: 'school-cap-1', gradeId: '6e',  name: 'Mme Johanne Mercier' },

  // ── École Arc-en-Ciel (school-dec-1) ──
  { id: 't-dec1-mat-1', schoolId: 'school-dec-1', gradeId: 'maternelle', name: 'Mme Chantal Savard' },
  { id: 't-dec1-1re-1', schoolId: 'school-dec-1', gradeId: '1re', name: 'M. Antoine Lefebvre' },
  { id: 't-dec1-2e-1',  schoolId: 'school-dec-1', gradeId: '2e',  name: 'Mme Mélanie Côté' },
  { id: 't-dec1-3e-1',  schoolId: 'school-dec-1', gradeId: '3e',  name: 'M. Hugo Paquette' },
  { id: 't-dec1-4e-1',  schoolId: 'school-dec-1', gradeId: '4e',  name: 'Mme Élise Perron' },

  // ── École du Boisé (school-por-1) ──
  { id: 't-por1-mat-1', schoolId: 'school-por-1', gradeId: 'maternelle', name: 'Mme Pauline Gosselin' },
  { id: 't-por1-1re-1', schoolId: 'school-por-1', gradeId: '1re', name: 'M. Michel Giguère' },
  { id: 't-por1-2e-1',  schoolId: 'school-por-1', gradeId: '2e',  name: 'Mme Caroline Houle' },
  { id: 't-por1-3e-1',  schoolId: 'school-por-1', gradeId: '3e',  name: 'M. Stéphane Bédard' },
  { id: 't-por1-4e-1',  schoolId: 'school-por-1', gradeId: '4e',  name: 'Mme France Gervais' },
  { id: 't-por1-5e-1',  schoolId: 'school-por-1', gradeId: '5e',  name: 'M. Mario Caron' },
  { id: 't-por1-6e-1',  schoolId: 'school-por-1', gradeId: '6e',  name: 'Mme Pierrette Hamelin' },
]

// ─── Child Colors ──────────────────────────────────────────────────────────────

export interface ChildColor {
  id: string
  label: string
  labelEn: string
  hex: string
}

export const CHILD_COLORS: ChildColor[] = [
  { id: 'blue',   label: 'Bleu',   labelEn: 'Blue',   hex: '#3B82F6' },
  { id: 'green',  label: 'Vert',   labelEn: 'Green',  hex: '#22C55E' },
  { id: 'yellow', label: 'Jaune',  labelEn: 'Yellow', hex: '#EAB308' },
  { id: 'orange', label: 'Orange', labelEn: 'Orange', hex: '#F97316' },
  { id: 'red',    label: 'Rouge',  labelEn: 'Red',    hex: '#EF4444' },
  { id: 'purple', label: 'Mauve',  labelEn: 'Purple', hex: '#A855F7' },
  { id: 'pink',   label: 'Rose',   labelEn: 'Pink',   hex: '#EC4899' },
  { id: 'gray',   label: 'Gris',   labelEn: 'Gray',   hex: '#6B7280' },
]

// ─── Allergens ─────────────────────────────────────────────────────────────────

export interface AllergenEntry {
  id: string
  label: string
  labelEn: string
  emoji: string
}

export const ALLERGENS: AllergenEntry[] = [
  { id: 'peanuts',   label: 'Arachides',  labelEn: 'Peanuts',    emoji: '🥜' },
  { id: 'tree-nuts', label: 'Noix',       labelEn: 'Tree Nuts',  emoji: '🌰' },
  { id: 'milk',      label: 'Lait',       labelEn: 'Milk',       emoji: '🥛' },
  { id: 'eggs',      label: 'Œufs',       labelEn: 'Eggs',       emoji: '🥚' },
  { id: 'gluten',    label: 'Gluten',     labelEn: 'Gluten',     emoji: '🌾' },
  { id: 'fish',      label: 'Poisson',    labelEn: 'Fish',       emoji: '🐟' },
  { id: 'shellfish', label: 'Crustacés',  labelEn: 'Shellfish',  emoji: '🦐' },
  { id: 'soy',       label: 'Soja',       labelEn: 'Soy',        emoji: '🫘' },
  { id: 'sesame',    label: 'Sésame',     labelEn: 'Sesame',     emoji: '🌿' },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

export const getSchoolsByCss = (cssId: string) =>
  SCHOOLS.filter((s) => s.cssId === cssId)

export const getTeachers = (schoolId: string, gradeId: string) =>
  TEACHERS.filter((t) => t.schoolId === schoolId && t.gradeId === gradeId)

export const getCssById = (id: string) =>
  CSS_DISTRICTS.find((c) => c.id === id)

export const getSchoolById = (id: string) =>
  SCHOOLS.find((s) => s.id === id)

export const getColorById = (id: string) =>
  CHILD_COLORS.find((c) => c.id === id)
