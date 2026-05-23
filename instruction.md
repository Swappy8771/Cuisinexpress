# CuisineExpress — Project Instructions / Instructions du Projet

---

## Must Follow / À Respecter Obligatoirement

### Code Style & Conventions

- Use **TypeScript** for every file — no `.js` or `.jsx` files
  _Utiliser **TypeScript** pour chaque fichier — pas de `.js` ou `.jsx`_

- One component per file; filename must match the component name (`Header.tsx` → `export default function Header`)
  _Un composant par fichier ; le nom du fichier doit correspondre au composant_

- Component files go in `src/components/`, pages in `src/pages/`
  _Les composants vont dans `src/components/`, les pages dans `src/pages/`_

- Use **named exports** for utilities/hooks, **default export** for components
  _Utiliser les **exports nommés** pour les utilitaires/hooks, **export default** pour les composants_

- No `any` type — use proper types or `unknown`
  _Pas de type `any` — utiliser des types précis ou `unknown`_

- Keep components under ~150 lines; split if larger
  _Garder les composants sous ~150 lignes ; les découper si nécessaire_

- No inline styles — use Tailwind classes only
  _Pas de styles inline — utiliser uniquement les classes Tailwind_

- No comments explaining *what* the code does — only *why* if non-obvious
  _Pas de commentaires expliquant *ce que* fait le code — seulement le *pourquoi* si non évident_

---

### Design & UI Rules / Règles de Design & Interface

- **Color palette / Palette de couleurs** — strictly from the brand / strictement issue de la marque :
  - Black / Noir : `#0A0A0A`
  - Crimson / Rouge cramoisi : `#C41E3A`
  - Wine/CTA / Bordeaux : `#7B2535`
  - White / Blanc : `#FFFFFF`
  - Light bg / Fond clair : `#F5F5F5`
  - Body text / Texte : `#1A1A1A`

- Header background is **white** with a subtle `box-shadow`
  _Le fond du header est **blanc** avec un `box-shadow` subtil_

- The "Se connecter" button always uses `bg-[#7B2535]` — do not change
  _Le bouton "Se connecter" utilise toujours `bg-[#7B2535]` — ne pas changer_

- Logo must always be visible — never place it on a same-color background
  _Le logo doit toujours être visible — ne jamais le placer sur un fond de même couleur_

- All interactive elements must have a **hover state** and `transition-all duration-300`
  _Tous les éléments interactifs doivent avoir un **état hover** et `transition-all duration-300`_

- Every page must be **fully responsive** — mobile breakpoint at `md:` (768px)
  _Chaque page doit être **entièrement responsive** — point de rupture mobile à `md:` (768px)_

- Font size for body text: `text-[15px]`, headings scale from `text-2xl` upward
  _Taille de police pour le texte courant : `text-[15px]`, titres à partir de `text-2xl`_

---

### Package & Tooling Rules / Règles Packages & Outils

- Use approved packages already installed — use these before adding new ones
  _Utiliser les packages approuvés déjà installés — les utiliser avant d'en ajouter de nouveaux_

  | Purpose / Usage | Package |
  |---|---|
  | Routing / Navigation | `react-router-dom` |
  | HTTP requests / Requêtes HTTP | `axios` |
  | Server state / État serveur | `@tanstack/react-query` |
  | Client state / État client | `zustand` |
  | Forms / Formulaires | `react-hook-form` + `zod` + `@hookform/resolvers` |
  | Icons / Icônes | `lucide-react` |
  | Toasts / Notifications | `sonner` |

- Run `npm install` — never `yarn` or `pnpm`
  _Utiliser `npm install` — jamais `yarn` ou `pnpm`_

- Static assets (images, fonts) go in `/public/` — reference with `/filename.ext`
  _Les assets statiques (images, polices) vont dans `/public/` — référencer avec `/filename.ext`_

- Source assets used inside components go in `src/assets/`
  _Les assets utilisés dans les composants vont dans `src/assets/`_

---

## Not Required / Pas Nécessaire (À Ignorer)

### Code Style

- No JSDoc or multi-line docstrings
  _Pas de JSDoc ni de docstrings multi-lignes_

- No `index.ts` barrel files unless the folder has 4+ exports
  _Pas de fichiers barrel `index.ts` sauf si le dossier contient 4+ exports_

- No `React.FC` type annotation — plain function syntax only
  _Pas d'annotation de type `React.FC` — utiliser la syntaxe de fonction simple_

- No CSS Modules or styled-components
  _Pas de CSS Modules ni de styled-components_

- No `defaultProps` — use destructuring defaults instead
  _Pas de `defaultProps` — utiliser les valeurs par défaut via déstructuration_

---

### Design & UI

- No dark mode — light mode only
  _Pas de mode sombre — mode clair uniquement_

- No custom CSS animations — use Tailwind's built-in `transition` and `animate-*`
  _Pas d'animations CSS personnalisées — utiliser `transition` et `animate-*` de Tailwind_

- No third-party UI libraries (no shadcn, MUI, Chakra, Ant Design, etc.)
  _Pas de bibliothèques UI tierces (pas de shadcn, MUI, Chakra, Ant Design, etc.)_

- No `App.css` or component-level `.css` files — `index.css` is the only stylesheet
  _Pas de `App.css` ni de fichiers `.css` par composant — `index.css` est la seule feuille de style_

---

### Packages & Tooling

- No test setup at this stage (no Jest, Vitest, Testing Library)
  _Pas de configuration de tests à ce stade (pas de Jest, Vitest, Testing Library)_

- No Storybook
  _Pas de Storybook_

- No SSR framework (no Next.js, Remix) — this is a Vite SPA
  _Pas de framework SSR (pas de Next.js, Remix) — c'est une SPA Vite_

- Do not add `lodash` — use native JS array/object methods
  _Ne pas ajouter `lodash` — utiliser les méthodes JS natives_

- Do not add `moment` or `date-fns` — use native `Intl` or `Date` APIs
  _Ne pas ajouter `moment` ou `date-fns` — utiliser les APIs natives `Intl` ou `Date`_

- Do not modify `vite.config.ts` unless adding a Vite plugin
  _Ne pas modifier `vite.config.ts` sauf pour ajouter un plugin Vite_

---

## Quick Reference / Référence Rapide

| Thing / Élément | Decision / Choix |
|---|---|
| Framework | React 19 + Vite 7 |
| Language / Langage | TypeScript strict |
| Styling / Style | Tailwind CSS v4 |
| Server state / État serveur | TanStack Query |
| Client state / État client | Zustand |
| Forms / Formulaires | React Hook Form + Zod |
| Icons / Icônes | Lucide React |
| Routing / Navigation | React Router v7 |
| Notifications | Sonner |
| Package manager | npm |
