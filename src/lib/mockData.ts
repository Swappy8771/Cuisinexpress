import type { OrderingSchool, MealWeek, MenuCategory, Allergy, Meal } from '../types'

export const schools: OrderingSchool[] = [
  { id: 'sch-1', name: 'École Primaire Saint-Jean', city: 'Québec' },
  { id: 'sch-2', name: 'École des Sommets', city: 'Sainte-Foy' },
  { id: 'sch-3', name: 'École Marie-Clarac', city: 'Cap-Rouge' },
]

export const weeks: MealWeek[] = [
  { id: 'w-1', label: 'Sem. 1', startDate: '2026-05-25', endDate: '2026-05-29' },
  { id: 'w-2', label: 'Sem. 2', startDate: '2026-06-01', endDate: '2026-06-05' },
  { id: 'w-3', label: 'Sem. 3', startDate: '2026-06-08', endDate: '2026-06-12' },
  { id: 'w-4', label: 'Sem. 4', startDate: '2026-06-15', endDate: '2026-06-19' },
]

export const categories: MenuCategory[] = [
  { id: '', label: 'Tous', emoji: '🍽' },
  { id: 'cat-1', label: 'Plats', emoji: '🍖' },
  { id: 'cat-2', label: 'Entrées', emoji: '🥗' },
  { id: 'cat-3', label: 'Desserts', emoji: '🍰' },
  { id: 'cat-4', label: 'Boissons', emoji: '🥤' },
  { id: 'cat-5', label: 'Collations', emoji: '🍎' },
]

export const allergies: Allergy[] = [
  { id: 'a-1', label: 'Gluten',  emoji: '🌾', colorClass: 'bg-amber-100 text-amber-700 ring-amber-200' },
  { id: 'a-2', label: 'Lactose', emoji: '🥛', colorClass: 'bg-blue-100  text-blue-700  ring-blue-200'  },
  { id: 'a-3', label: 'Noix',    emoji: '🥜', colorClass: 'bg-orange-100 text-orange-700 ring-orange-200' },
  { id: 'a-4', label: 'Œufs',   emoji: '🥚', colorClass: 'bg-yellow-100 text-yellow-700 ring-yellow-200' },
  { id: 'a-5', label: 'Soja',    emoji: '🫘', colorClass: 'bg-green-100  text-green-700  ring-green-200'  },
  { id: 'a-6', label: 'Sésame', emoji: '🌰', colorClass: 'bg-stone-100  text-stone-600  ring-stone-200'  },
]

const ALL  = ['sch-1', 'sch-2', 'sch-3']
const W    = ['w-1', 'w-2', 'w-3', 'w-4']
const W1   = ['w-1']
const W2   = ['w-2']
const W3   = ['w-3']
const W4   = ['w-4']

// Day availability logic:
//   Plats      → 2 specific days (cafeteria rotation)
//   Entrées    → 2–3 days
//   Desserts / Boissons / Collations → all 5 days (always available)
const EVERY_DAY = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']

export const meals: Meal[] = [
  // ── Plats (cat-1) — 3 unique meals per day, no meal repeats across days ──────

  // Lundi
  {
    id: 'm-1',
    name: 'Spaghetti Bolognaise',
    description: 'Sauce tomate mijotée maison avec viande hachée et légumes du jardin, servie avec des pâtes al dente.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot'], allergyIds: ['a-1', 'a-2'],
    available: true, popular: true, isNew: false, calories: 520,
    availableDays: ['Lundi'],
  },
  {
    id: 'm-13',
    name: 'Lasagne Maison',
    description: 'Lasagnes gratinées à la bolognaise maison, couches de pâtes fraîches, béchamel onctueuse et fromage fondant.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot'], allergyIds: ['a-1', 'a-2', 'a-4'],
    available: true, popular: true, isNew: false, calories: 540,
    availableDays: ['Lundi'],
  },
  {
    id: 'm-16',
    name: 'Bœuf Bourguignon',
    description: 'Mijoté de bœuf fondant au vin rouge, carottes, champignons et lardons, servi avec purée maison.',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot'], allergyIds: ['a-2'],
    available: true, popular: true, isNew: false, calories: 580,
    availableDays: ['Lundi'],
  },

  // Mardi
  {
    id: 'm-4',
    name: 'Poulet Rôti & Légumes',
    description: 'Cuisse de poulet rôtie au four, accompagnée de légumes de saison grillés et de sauce aux herbes.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot'], allergyIds: [],
    available: true, popular: true, isNew: false, calories: 480,
    availableDays: ['Mardi'],
  },
  {
    id: 'm-14',
    name: 'Wrap Poulet Grillé',
    description: 'Tortilla croustillante garnie de poulet grillé, légumes frais croquants et sauce yogourt-citron maison.',
    price: 6.75,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot'], allergyIds: ['a-1', 'a-2'],
    available: true, popular: false, isNew: true, calories: 420,
    availableDays: ['Mardi'],
  },
  {
    id: 'm-17',
    name: 'Filet de Saumon Citronné',
    description: 'Pavé de saumon grillé au citron et aneth, servi avec légumes vapeur et riz basmati.',
    price: 9.25,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot', 'gluten-free'], allergyIds: [],
    available: true, popular: false, isNew: true, calories: 440,
    availableDays: ['Mardi'],
  },

  // Mercredi
  {
    id: 'm-5',
    name: 'Sandwich Thon-Mayo',
    description: 'Pain de mie moelleux garni de thon, mayonnaise légère, tomates et laitue iceberg croustillante.',
    price: 5.75,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['cold'], allergyIds: ['a-1', 'a-4'],
    available: true, popular: false, isNew: false, calories: 380,
    availableDays: ['Mercredi'],
  },
  {
    id: 'm-18',
    name: 'Pizza Margherita',
    description: 'Pizza à pâte fine, sauce tomate maison, mozzarella fraîche et feuilles de basilic parfumé.',
    price: 7.25,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot', 'vegetarian'], allergyIds: ['a-1', 'a-2'],
    available: true, popular: true, isNew: false, calories: 500,
    availableDays: ['Mercredi'],
  },
  {
    id: 'm-19',
    name: 'Couscous Royal',
    description: 'Semoule fine aux légumes confits, pois chiches dorés, merguez grillée et bouillon épicé maison.',
    price: 8.25,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot'], allergyIds: ['a-1'],
    available: true, popular: false, isNew: false, calories: 510,
    availableDays: ['Mercredi'],
  },

  // Jeudi
  {
    id: 'm-11',
    name: 'Quiche Lorraine',
    description: 'Quiche dorée à la crème, lardons fumés et fromage gruyère, servie tiède avec salade verte.',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot'], allergyIds: ['a-1', 'a-2', 'a-4'],
    available: true, popular: false, isNew: false, calories: 560,
    availableDays: ['Jeudi'],
  },
  {
    id: 'm-15',
    name: 'Pâtes Primavera',
    description: 'Pâtes fraîches sautées aux légumes de saison — courgettes, tomates cerises, poivrons et basilic.',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot', 'vegetarian'], allergyIds: ['a-1', 'a-2'],
    available: true, popular: false, isNew: false, calories: 410,
    availableDays: ['Jeudi'],
  },
  {
    id: 'm-20',
    name: 'Poisson Grillé & Légumes',
    description: 'Filet de tilapia grillé aux herbes de Provence, accompagné de légumes rôtis et sauce vierge.',
    price: 8.75,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot', 'gluten-free'], allergyIds: [],
    available: true, popular: false, isNew: true, calories: 390,
    availableDays: ['Jeudi'],
  },

  // Vendredi
  {
    id: 'm-6',
    name: 'Riz Pilaf Végétarien',
    description: 'Riz basmati parfumé aux épices douces, pois chiches, poivrons colorés et herbes fraîches.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot', 'vegetarian', 'vegan', 'gluten-free'], allergyIds: [],
    available: true, popular: false, isNew: true, calories: 390,
    availableDays: ['Vendredi'],
  },
  {
    id: 'm-21',
    name: 'Macaroni au Fromage',
    description: 'Macaronis crémeux gratinés au four, mélange de fromages cheddar et gruyère fondu, croûte dorée.',
    price: 6.25,
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot', 'vegetarian'], allergyIds: ['a-1', 'a-2'],
    available: true, popular: true, isNew: false, calories: 490,
    availableDays: ['Vendredi'],
  },
  {
    id: 'm-22',
    name: 'Chili con Carne',
    description: 'Chili texan aux haricots rouges, bœuf haché épicé, tomates concassées et crème fraîche.',
    price: 7.75,
    image: 'https://images.unsplash.com/photo-1564671165093-20688ff1fffa?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-1', schoolIds: ALL, weekIds: W1,
    tags: ['hot'], allergyIds: [],
    available: true, popular: false, isNew: false, calories: 530,
    availableDays: ['Vendredi'],
  },

  // ── Semaine 2 (cat-1) ─────────────────────────────────────────────────────

  // Lundi
  { id: 'w2-m-1', name: 'Poulet au Curry', description: 'Émincé de poulet mijoté dans une sauce curry dorée, lait de coco et épices douces, servi avec riz basmati.', price: 8.25, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot', 'halal'], allergyIds: ['a-2'], available: true, popular: true, isNew: false, calories: 510, availableDays: ['Lundi'] },
  { id: 'w2-m-2', name: 'Gratin Dauphinois', description: 'Gratin de pommes de terre fondantes à la crème fraîche et gruyère doré, parfumé à l\'ail et noix de muscade.', price: 7.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot', 'vegetarian'], allergyIds: ['a-2'], available: true, popular: false, isNew: false, calories: 540, availableDays: ['Lundi'] },
  { id: 'w2-m-3', name: 'Rôti de Veau Fermier', description: 'Rôti de veau tendre cuit à basse température, jus de cuisson réduit, carottes glacées et haricots verts.', price: 9.50, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot'], allergyIds: [], available: true, popular: false, isNew: true, calories: 560, availableDays: ['Lundi'] },

  // Mardi
  { id: 'w2-m-4', name: 'Croque-Monsieur Gratiné', description: 'Pain de mie doré au beurre, jambon blanc, béchamel crémeuse et fromage gruyère fondu au four.', price: 6.50, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot'], allergyIds: ['a-1', 'a-2', 'a-4'], available: true, popular: true, isNew: false, calories: 460, availableDays: ['Mardi'] },
  { id: 'w2-m-5', name: 'Escalope Milanaise', description: 'Escalope de poulet panée dorée à la milanaise, servie avec tagliatelles fraîches et sauce tomate maison.', price: 8.75, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot'], allergyIds: ['a-1', 'a-4'], available: true, popular: false, isNew: false, calories: 520, availableDays: ['Mardi'] },
  { id: 'w2-m-6', name: 'Tartine Jambon-Fromage', description: 'Tartine rustique sur pain campagne, jambon fumé artisanal, fromage à raclette fondu et cornichons.', price: 6.00, image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot'], allergyIds: ['a-1', 'a-2'], available: true, popular: false, isNew: true, calories: 430, availableDays: ['Mardi'] },

  // Mercredi
  { id: 'w2-m-7', name: 'Risotto aux Champignons', description: 'Risotto crémeux aux champignons sauvages, parmesan vieilli, beurre manié et persil plat ciselé.', price: 7.75, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot', 'vegetarian'], allergyIds: ['a-2'], available: true, popular: true, isNew: false, calories: 490, availableDays: ['Mercredi'] },
  { id: 'w2-m-8', name: 'Tarte Flambée Alsacienne', description: 'Tarte fine à la crème fraîche, oignons émincés et lardons fumés, cuite à haute température four à bois.', price: 7.25, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot'], allergyIds: ['a-1', 'a-2'], available: true, popular: false, isNew: false, calories: 470, availableDays: ['Mercredi'] },
  { id: 'w2-m-9', name: 'Souvlaki de Poulet', description: 'Brochettes de poulet marinées aux herbes grecques, servies avec pain pita chaud, tzatzíki et salade fraîche.', price: 8.00, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot'], allergyIds: ['a-1', 'a-2'], available: true, popular: false, isNew: true, calories: 450, availableDays: ['Mercredi'] },

  // Jeudi
  { id: 'w2-m-10', name: 'Burger Maison', description: 'Burger au bœuf haché 100 % pur bœuf, cheddar fondant, salade croquante, tomate et sauce maison sur bun brioché.', price: 8.50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot'], allergyIds: ['a-1', 'a-2', 'a-4'], available: true, popular: true, isNew: false, calories: 580, availableDays: ['Jeudi'] },
  { id: 'w2-m-11', name: 'Tacos Mexicain', description: 'Tacos maison garnis de bœuf épicé, guacamole frais, crème aigre, fromage râpé et salsa tomate-coriandre.', price: 7.50, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot'], allergyIds: ['a-1', 'a-2'], available: true, popular: false, isNew: false, calories: 520, availableDays: ['Jeudi'] },
  { id: 'w2-m-12', name: 'Brochette de Bœuf', description: 'Brochettes de bœuf marinées aux épices, grillées sur charbon de bois, accompagnées de légumes grillés et riz.', price: 9.25, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot', 'gluten-free', 'halal'], allergyIds: [], available: true, popular: false, isNew: true, calories: 500, availableDays: ['Jeudi'] },

  // Vendredi
  { id: 'w2-m-13', name: 'Fish & Chips', description: 'Filet de cabillaud en tempura légère, frites maison croustillantes, sauce tartare et quartier de citron.', price: 8.00, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot'], allergyIds: ['a-1', 'a-4'], available: true, popular: true, isNew: false, calories: 560, availableDays: ['Vendredi'] },
  { id: 'w2-m-14', name: 'Calamars Frits', description: 'Anneaux de calamars panés et frits à point, servis avec aïoli maison et quartiers de citron, salade verte.', price: 8.50, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot'], allergyIds: ['a-1', 'a-4'], available: true, popular: false, isNew: false, calories: 480, availableDays: ['Vendredi'] },
  { id: 'w2-m-15', name: 'Velouté de Potiron', description: 'Velouté onctueux de potiron rôti, crème de coco, gingembre frais et graines de courge torréfiées.', price: 6.50, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W2, tags: ['hot', 'vegetarian', 'vegan', 'gluten-free'], allergyIds: [], available: true, popular: false, isNew: true, calories: 320, availableDays: ['Vendredi'] },

  // ── Semaine 3 (cat-1) ─────────────────────────────────────────────────────

  // Lundi
  { id: 'w3-m-1', name: 'Osso Buco Milanais', description: 'Jarret de veau braisé à la milanaise, gremolata citronnée, servi avec risotto alla milanese au safran.', price: 10.00, image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot'], allergyIds: ['a-2'], available: true, popular: true, isNew: false, calories: 590, availableDays: ['Lundi'] },
  { id: 'w3-m-2', name: 'Blanquette de Veau', description: 'Veau tendre mijoté en sauce blanche crémeuse, carottes, champignons et petits oignons glacés maison.', price: 9.00, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot'], allergyIds: ['a-2', 'a-4'], available: true, popular: false, isNew: false, calories: 550, availableDays: ['Lundi'] },
  { id: 'w3-m-3', name: 'Tajine d\'Agneau', description: 'Agneau mijoté aux pruneaux et abricots secs, épices ras-el-hanout et amandes effilées grillées, couscous.', price: 9.75, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot', 'halal'], allergyIds: ['a-3'], available: true, popular: false, isNew: true, calories: 570, availableDays: ['Lundi'] },

  // Mardi
  { id: 'w3-m-4', name: 'Club Sandwich Premium', description: 'Triple étage pain de mie toasté, poulet grillé, bacon croustillant, œuf dur, tomate, laitue et mayo maison.', price: 7.75, image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['cold'], allergyIds: ['a-1', 'a-2', 'a-4'], available: true, popular: true, isNew: false, calories: 500, availableDays: ['Mardi'] },
  { id: 'w3-m-5', name: 'Pad Thaï au Poulet', description: 'Nouilles de riz sautées au poulet, œufs brouillés, germes de soja, cacahuètes concassées et sauce tamarin.', price: 8.25, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot'], allergyIds: ['a-3', 'a-4', 'a-5'], available: true, popular: false, isNew: true, calories: 490, availableDays: ['Mardi'] },
  { id: 'w3-m-6', name: 'Salade Niçoise', description: 'Salade composée niçoise classique — thon, œufs, olives, tomates, haricots verts et anchois sur mesclun.', price: 7.00, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['cold', 'gluten-free'], allergyIds: ['a-4'], available: true, popular: false, isNew: false, calories: 380, availableDays: ['Mardi'] },

  // Mercredi
  { id: 'w3-m-7', name: 'Raclette Gratinée', description: 'Pommes de terre vapeur nappées de fromage à raclette fondu, charcuterie artisanale et cornichons maison.', price: 9.00, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot', 'vegetarian'], allergyIds: ['a-2'], available: true, popular: true, isNew: false, calories: 570, availableDays: ['Mercredi'] },
  { id: 'w3-m-8', name: 'Rösti aux Légumes', description: 'Galettes de pommes de terre râpées dorées au beurre, servies avec crème fraîche et légumes de saison sautés.', price: 7.25, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot', 'vegetarian', 'gluten-free'], allergyIds: ['a-2'], available: true, popular: false, isNew: false, calories: 430, availableDays: ['Mercredi'] },
  { id: 'w3-m-9', name: 'Fondue Savoyarde', description: 'Fondue au fromage comté, beaufort et emmental de Savoie, vin blanc de Savoie, pain de campagne grillé.', price: 9.50, image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot', 'vegetarian'], allergyIds: ['a-1', 'a-2'], available: true, popular: false, isNew: true, calories: 610, availableDays: ['Mercredi'] },

  // Jeudi
  { id: 'w3-m-10', name: 'Cassoulet Toulousain', description: 'Cassoulet traditionnel aux haricots blancs confits, confit de canard, saucisse de Toulouse et lard fumé.', price: 9.75, image: 'https://images.unsplash.com/photo-1564671165093-20688ff1fffa?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot'], allergyIds: [], available: true, popular: true, isNew: false, calories: 640, availableDays: ['Jeudi'] },
  { id: 'w3-m-11', name: 'Pot-au-Feu Maison', description: 'Bouillon clair aux légumes du jardin, viande de bœuf fondante, os à moelle grillé et pain aux grains.', price: 8.50, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot', 'gluten-free'], allergyIds: [], available: true, popular: false, isNew: false, calories: 480, availableDays: ['Jeudi'] },
  { id: 'w3-m-12', name: 'Côtelettes d\'Agneau', description: 'Côtelettes d\'agneau grillées aux herbes de Provence, purée de petits pois à la menthe et jus d\'agneau réduit.', price: 10.50, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot', 'gluten-free'], allergyIds: [], available: true, popular: false, isNew: true, calories: 520, availableDays: ['Jeudi'] },

  // Vendredi
  { id: 'w3-m-13', name: 'Paella Valencia', description: 'Paella traditionnelle au safran, poulet, chorizo, crevettes royales, moules et petits pois, riz bomba.', price: 9.50, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot', 'gluten-free'], allergyIds: [], available: true, popular: true, isNew: false, calories: 560, availableDays: ['Vendredi'] },
  { id: 'w3-m-14', name: 'Moules Marinières', description: 'Moules fraîches de l\'Atlantique cuites au vin blanc, échalotes et persil, frites maison et pain beurré.', price: 8.75, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot', 'gluten-free'], allergyIds: ['a-2'], available: true, popular: false, isNew: false, calories: 440, availableDays: ['Vendredi'] },
  { id: 'w3-m-15', name: 'Crevettes Sautées', description: 'Crevettes tigrées sautées à l\'ail et beurre persillé, servies sur lit de riz pilaf aux herbes et citron vert.', price: 9.25, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W3, tags: ['hot', 'gluten-free'], allergyIds: ['a-2'], available: true, popular: false, isNew: true, calories: 410, availableDays: ['Vendredi'] },

  // ── Semaine 4 (cat-1) ─────────────────────────────────────────────────────

  // Lundi
  { id: 'w4-m-1', name: 'Steak Haché Frites', description: 'Steak haché pur bœuf cuit à point, frites maison croustillantes, salade verte et sauce poivre maison.', price: 8.50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot'], allergyIds: ['a-2'], available: true, popular: true, isNew: false, calories: 600, availableDays: ['Lundi'] },
  { id: 'w4-m-2', name: 'Entrecôte Bordelaise', description: 'Entrecôte de bœuf grillée, sauce bordelaise au vin rouge et échalotes, gratin de pommes de terre.', price: 11.00, image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot', 'gluten-free'], allergyIds: [], available: true, popular: false, isNew: false, calories: 630, availableDays: ['Lundi'] },
  { id: 'w4-m-3', name: 'Poulet Basquaise', description: 'Poulet mijoté à la basquaise — tomates, poivrons rouges et verts, piment d\'Espelette et jambon de Bayonne.', price: 8.75, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot'], allergyIds: [], available: true, popular: false, isNew: true, calories: 500, availableDays: ['Lundi'] },

  // Mardi
  { id: 'w4-m-4', name: 'Poulet Tikka Masala', description: 'Poulet mariné au yaourt et épices, sauce masala crémeuse aux tomates et crème, servi avec naan beurré.', price: 8.25, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot', 'halal'], allergyIds: ['a-1', 'a-2'], available: true, popular: true, isNew: false, calories: 530, availableDays: ['Mardi'] },
  { id: 'w4-m-5', name: 'Bœuf Stroganoff', description: 'Émincé de bœuf sauté à la crème aigre, champignons et oignons, servi sur tagliatelles fraîches al dente.', price: 9.00, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot'], allergyIds: ['a-1', 'a-2'], available: true, popular: false, isNew: false, calories: 570, availableDays: ['Mardi'] },
  { id: 'w4-m-6', name: 'Nems au Poulet', description: 'Nems croustillants au poulet et légumes sautés, servis avec salade fraîche, menthe et sauce nuoc-mâm.', price: 7.25, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot'], allergyIds: ['a-1', 'a-5'], available: true, popular: false, isNew: true, calories: 440, availableDays: ['Mardi'] },

  // Mercredi
  { id: 'w4-m-7', name: 'Penne all\'Arrabbiata', description: 'Penne rigate en sauce arrabbiata épicée, tomates san marzano, ail, piment rouge et basilic frais.', price: 7.00, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot', 'vegetarian', 'vegan'], allergyIds: ['a-1'], available: true, popular: false, isNew: false, calories: 420, availableDays: ['Mercredi'] },
  { id: 'w4-m-8', name: 'Gnocchi Sauce Gorgonzola', description: 'Gnocchi de pomme de terre maison, sauce gorgonzola crémeuse, noix torréfiées et roquette fraîche.', price: 7.75, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot', 'vegetarian'], allergyIds: ['a-2', 'a-3'], available: true, popular: true, isNew: false, calories: 510, availableDays: ['Mercredi'] },
  { id: 'w4-m-9', name: 'Fusilli Pesto Genovese', description: 'Fusilli al dente, pesto basilic-pignons maison, tomates cerises rôties et copeaux de pecorino romano.', price: 7.25, image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot', 'vegetarian'], allergyIds: ['a-1', 'a-2', 'a-3'], available: true, popular: false, isNew: true, calories: 460, availableDays: ['Mercredi'] },

  // Jeudi
  { id: 'w4-m-10', name: 'Porc à l\'Orange', description: 'Filet de porc rôti, sauce à l\'orange sanguine et miel, purée de patate douce et haricots verts fins.', price: 8.75, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot', 'gluten-free'], allergyIds: [], available: true, popular: false, isNew: false, calories: 520, availableDays: ['Jeudi'] },
  { id: 'w4-m-11', name: 'Côtes de Porc Grillées', description: 'Côtes de porc marinées au romarin et thym, grillées sur charbon, purée maison et légumes provençaux.', price: 9.25, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot', 'gluten-free'], allergyIds: [], available: true, popular: true, isNew: false, calories: 560, availableDays: ['Jeudi'] },
  { id: 'w4-m-12', name: 'Filet Mignon de Porc', description: 'Filet mignon de porc en croûte de moutarde à l\'ancienne, gratin de chou-fleur et sauce au poivre vert.', price: 10.00, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot'], allergyIds: ['a-2'], available: true, popular: false, isNew: true, calories: 540, availableDays: ['Jeudi'] },

  // Vendredi
  { id: 'w4-m-13', name: 'Riz Cantonnais', description: 'Riz sauté à la cantonaise, légumes croquants, petits pois, carottes, œufs brouillés et sauce soja légère.', price: 6.75, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot', 'vegetarian'], allergyIds: ['a-4', 'a-5'], available: true, popular: false, isNew: false, calories: 430, availableDays: ['Vendredi'] },
  { id: 'w4-m-14', name: 'Bœuf Sauté aux Légumes', description: 'Émincé de bœuf sauté à feu vif, poivrons colorés, brocoli, champignons et sauce huître sur riz vapeur.', price: 8.50, image: 'https://images.unsplash.com/photo-1564671165093-20688ff1fffa?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot'], allergyIds: ['a-5'], available: true, popular: true, isNew: false, calories: 490, availableDays: ['Vendredi'] },
  { id: 'w4-m-15', name: 'Soupe Pho', description: 'Bouillon de bœuf parfumé à la citronnelle et gingembre, nouilles de riz, bœuf tranché fin, germes de soja.', price: 7.50, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&h=280', categoryId: 'cat-1', schoolIds: ALL, weekIds: W4, tags: ['hot', 'gluten-free'], allergyIds: ['a-5'], available: true, popular: false, isNew: true, calories: 380, availableDays: ['Vendredi'] },

  // ── Entrées (cat-2) — 2–3 days each ──────────────────────────────────────────
  {
    id: 'm-2',
    name: 'Salade César Fraîche',
    description: 'Laitue romaine croquante, croûtons maison dorés, copeaux de parmesan et sauce César légère.',
    price: 6.25,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-2',
    schoolIds: ALL,
    weekIds: W,
    tags: ['cold', 'vegetarian'],
    allergyIds: ['a-1', 'a-2', 'a-4'],
    available: true,
    popular: false,
    isNew: false,
    calories: 320,
    availableDays: ['Lundi', 'Mardi', 'Mercredi'],
  },
  {
    id: 'm-3',
    name: 'Soupe à la Tomate',
    description: 'Soupe onctueuse aux tomates fraîches et basilic, servie avec une tranche de pain de campagne.',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-2',
    schoolIds: ALL,
    weekIds: W,
    tags: ['hot', 'vegetarian'],
    allergyIds: ['a-1'],
    available: true,
    popular: false,
    isNew: true,
    calories: 210,
    availableDays: ['Mardi', 'Jeudi', 'Vendredi'],
  },

  // ── Desserts (cat-3) — every day ─────────────────────────────────────────────
  {
    id: 'm-7',
    name: 'Yaourt aux Fruits Rouges',
    description: 'Yaourt nature onctueux garni de fraises, framboises et myrtilles fraîches, légèrement sucré.',
    price: 3.25,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-3',
    schoolIds: ALL,
    weekIds: W,
    tags: ['cold', 'vegetarian'],
    allergyIds: ['a-2'],
    available: true,
    popular: false,
    isNew: false,
    calories: 140,
    availableDays: EVERY_DAY,
  },
  {
    id: 'm-8',
    name: 'Mousse au Chocolat',
    description: 'Mousse légère au chocolat noir 70%, préparée avec des œufs frais et sans sucre ajouté.',
    price: 3.75,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-3',
    schoolIds: ['sch-1', 'sch-3'],
    weekIds: W,
    tags: ['cold', 'vegetarian'],
    allergyIds: ['a-2', 'a-4'],
    available: true,
    popular: true,
    isNew: false,
    calories: 190,
    availableDays: ['Lundi', 'Mercredi', 'Vendredi'], // special treat 3×/week
  },
  {
    id: 'm-10',
    name: 'Salade de Fruits Exotiques',
    description: 'Mélange de mangue, ananas, kiwi et papaye, arrosé d\'un coulis de fruits de la passion.',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-3',
    schoolIds: ALL,
    weekIds: W,
    tags: ['cold', 'vegetarian', 'vegan', 'gluten-free'],
    allergyIds: [],
    available: true,
    popular: false,
    isNew: true,
    calories: 110,
    availableDays: EVERY_DAY,
  },

  // ── Boissons (cat-4) — every day ─────────────────────────────────────────────
  {
    id: 'm-9',
    name: 'Jus d\'Orange Pressé',
    description: 'Jus d\'oranges fraîchement pressées, sans sucre ajouté, riche en vitamine C.',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-4',
    schoolIds: ALL,
    weekIds: W,
    tags: ['cold', 'vegetarian', 'vegan', 'gluten-free'],
    allergyIds: [],
    available: true,
    popular: false,
    isNew: false,
    calories: 90,
    availableDays: EVERY_DAY,
  },

  // ── Collations (cat-5) — every day ───────────────────────────────────────────
  {
    id: 'm-12',
    name: 'Compote Pomme-Cannelle',
    description: 'Pommes du Québec mijotées à la cannelle et sans sucre ajouté, servies en verrines.',
    price: 2.25,
    image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=400&h=280',
    categoryId: 'cat-5',
    schoolIds: ALL,
    weekIds: W,
    tags: ['cold', 'vegetarian', 'vegan', 'gluten-free'],
    allergyIds: [],
    available: true,
    popular: false,
    isNew: false,
    calories: 80,
    availableDays: EVERY_DAY,
  },
]
