export type Lang = 'fr' | 'en'

const translations = {
  fr: {
    // ── Header / Nav ──────────────────────────────────────────────
    nav: {
      schools: 'Nos écoles',
      order: 'Pour commander',
      login: 'Se connecter',
      profile: 'Mon profil',
      logout: 'Déconnexion',
    },
    // ── Hero ──────────────────────────────────────────────────────
    hero: {
      slides: ['Repas du jour', 'Bols santé', 'Cuisine fraîche'],
      title1: 'Repas chauds et santé',
      title2: 'pour vos enfants',
      title3: "à l'école",
      subtitle: "Des repas équilibrés, préparés chaque jour avec des ingrédients frais, livrés directement dans votre école.",
      cta1: 'Explorer notre menu',
      cta2: 'Nos écoles partenaires',
    },
    // ── HowItWorks ────────────────────────────────────────────────
    how: {
      tag: 'Simple & rapide',
      title: 'Fonctionnement',
      subtitle: 'Trois étapes simples pour offrir un repas chaud et équilibré à vos enfants chaque jour.',
      steps: [
        {
          title: 'Commander',
          description: "Connectez-vous à votre compte pour commander les repas de vos enfants, payez en ligne et voyez l'historique des repas et des commandes.",
        },
        {
          title: 'Préparation et livraison',
          description: "Nous préparons tous les repas la veille avec des aliments frais, puis allons les livrer directement à l'école une heure avant le repas.",
        },
        {
          title: 'Un bon repas chaud',
          description: 'Tous nos repas sont faits maison et préparés avec soin. Nous sommes fiers de livrer des repas froids et chauds dans nos écoles.',
        },
      ],
    },
    // ── Advantages ────────────────────────────────────────────────
    advantages: {
      tag: 'Pourquoi nous choisir',
      title: 'Avantages CuisineXpress',
      subtitle: 'Des repas équilibrés livrés avec soin, chaque jour, pour le bien-être de vos enfants.',
      items: [
        {
          title: 'Repas chauds',
          description: "Nous sommes fiers de livrer des repas chauds dans nos écoles.",
        },
        {
          title: "On s'occupe de tout !",
          description: "Nous livrons les repas prêts et chauds chaque jour à l'école.",
        },
        {
          title: 'Paiement facile',
          description: 'Nous acceptons les cartes de crédits Visa / Mastercard ainsi que les virements Interac.',
        },
        {
          title: 'Qualité supérieure',
          description: "Nos repas-maison sont préparés avec une sélection de produits d'excellente qualité et toujours frais. Ici, nous n'achetons pas de légumes congelés ou en canne !",
        },
        {
          title: 'Annulation facile',
          description: "Il vous est possible d'annuler et de modifier jusqu'à 8h le matin même de la livraison. Le repas est remboursé à 100 %. Pour toute modification, veuillez nous contacter par e-mail ou par téléphone au 581-992-9952.",
        },
      ],
    },
    // ── School Closure Policy ────────────────────────────────────
    closure: {
      tag: 'À savoir',
      title1: 'Notre politique lors de',
      title2: "fermeture d'école",
      points: [
        "En cas de fermeture d'école annoncée moins de 48h à l'avance, pour toute raison dont nous ne sommes pas responsables (grève, tempête, panne d'électricité…), nous livrerons les repas si le service de garde demeure ouvert.",
        "Si ce n'est pas le cas, nous vous invitons à passer récupérer votre commande à nos bureaux.",
        "Nous ne pouvons rembourser les repas non livrés / non récupérés étant donné l'ampleur des pertes et de la gestion engendrées.",
        'La nourriture perdue est remise à un organisme de charité.',
      ],
      note: 'Pour toute modification ou question, contactez-nous par e-mail ou au',
    },
    // ── Footer ────────────────────────────────────────────────────
    footer: {
      tagline: 'Votre traiteur école de confiance.',
      partnerTag: 'Partenaire',
      partnerTitle: 'Partenaire kntera',
      partnerText: "Studio créatif kntera INC. est un fournisseur de service de commandes en ligne et d'autres produits de technologie de l'information. Vous trouverez toutes les détails de notre service Boîte à lunch sur notre site web.",
      navTag: 'Navigation',
      navTitle: 'Informations',
      links: ['Nos écoles', 'Commander', 'Contactez-nous', 'Politique de confidentialité', 'Préférences de cookies'],
      accountTag: 'Compte',
      accountTitle: 'Mon compte',
      accountLinks: ['Se connecter', 'Créer un compte', 'Mon profil', 'Mes élèves', 'Mes relevés', 'Mes factures'],
      copyright: 'Tous droits réservés.',
      madeWith: 'Fait avec soin au Québec',
    },
    // ── Auth ──────────────────────────────────────────────────────
    auth: {
      loginTitle: 'Connexion',
      loginSubtitle: 'Accédez à votre espace CuisineXpress',
      emailLabel: 'Adresse de courriel',
      emailPlaceholder: 'exemple@email.com',
      passwordLabel: 'Mot de passe',
      forgotPassword: 'Mot de passe oublié ?',
      loginButton: 'Connexion',
      noAccount: "Vous n'avez pas de compte ?",
      createAccount: 'Créer votre compte',
      registerTitle: 'Créer votre compte',
      registerSubtitle: "Rejoignez CuisineXpress dès aujourd'hui",
      firstName: 'Prénom',
      lastName: 'Nom',
      phoneLabel: 'Téléphone',
      phoneOptional: '(optionnel)',
      terms: "J'accepte les",
      termsLink: "conditions d'utilisation",
      confirmButton: 'Confirmer',
      alreadyAccount: 'Vous avez déjà un compte ?',
    },
    // ── Dashboard ─────────────────────────────────────────────────
    dashboard: {
      profile: 'Mon profil',
      students: 'Élèves / personnel',
      statement: 'Relevé de compte',
      invoices: 'Factures',
      mainMenu: 'Menu principal',
    },
    // ── Order page ────────────────────────────────────────────────
    order: {
      title: 'Commander',
      searchPlaceholder: 'Rechercher un repas…',
      sort: 'Trier',
      results: 'résultat',
      results_plural: 'résultats',
      filters: 'Filtres',
      clear: 'Effacer',
      addToCart: 'Ajouter',
      added: 'Ajouté',
      unavailable: 'Non disponible',
      perMeal: '/repas',
      all: 'Tous',
      school: 'École',
      week: 'Semaine',
      category: 'Catégorie',
      tagsLabel: 'Régimes & Température',
      searchLabel: 'Recherche',
      noResults: 'Aucun repas trouvé',
      noResultsHint: 'Essayez de modifier vos filtres ou de changer de semaine.',
      clearFilters: 'Effacer les filtres',
      errorTitle: 'Erreur de chargement',
      errorHint: 'Impossible de charger les repas. Vérifiez votre connexion.',
      retry: 'Réessayer',
      cartLabel: 'repas sélectionné',
      cartLabel_plural: 'repas sélectionnés',
      sortOptions: {
        popular: 'Populaires',
        name: 'Nom A → Z',
        price_asc: 'Prix croissant',
        price_desc: 'Prix décroissant',
      },
    },
  },

  en: {
    // ── Header / Nav ──────────────────────────────────────────────
    nav: {
      schools: 'Our Schools',
      order: 'Order Now',
      login: 'Sign In',
      profile: 'My Profile',
      logout: 'Sign Out',
    },
    // ── Hero ──────────────────────────────────────────────────────
    hero: {
      slides: ['Meal of the Day', 'Healthy Bowls', 'Fresh Cuisine'],
      title1: 'Hot & healthy meals',
      title2: 'for your children',
      title3: 'at school',
      subtitle: 'Balanced meals, prepared every day with fresh ingredients, delivered directly to your school.',
      cta1: 'Explore our menu',
      cta2: 'Our partner schools',
    },
    // ── HowItWorks ────────────────────────────────────────────────
    how: {
      tag: 'Simple & fast',
      title: 'How It Works',
      subtitle: 'Three simple steps to provide a hot and balanced meal for your children every day.',
      steps: [
        {
          title: 'Order',
          description: 'Log in to your account to order meals for your children, pay online and view meal and order history.',
        },
        {
          title: 'Preparation & delivery',
          description: 'We prepare all meals the day before with fresh food, then deliver them directly to the school one hour before mealtime.',
        },
        {
          title: 'A great hot meal',
          description: 'All our meals are homemade and carefully prepared. We are proud to deliver cold and hot meals to our schools.',
        },
      ],
    },
    // ── Advantages ────────────────────────────────────────────────
    advantages: {
      tag: 'Why choose us',
      title: 'CuisineXpress Benefits',
      subtitle: "Balanced meals delivered with care, every day, for your children's well-being.",
      items: [
        {
          title: 'Hot meals',
          description: 'We are proud to deliver hot meals to our schools.',
        },
        {
          title: 'We handle everything!',
          description: 'We deliver meals ready and hot to the school every day.',
        },
        {
          title: 'Easy payment',
          description: 'We accept Visa / Mastercard credit cards and Interac transfers.',
        },
        {
          title: 'Superior quality',
          description: "Our home-cooked meals are prepared with a selection of excellent quality, always-fresh products. We don't buy frozen or canned vegetables!",
        },
        {
          title: 'Easy cancellation',
          description: 'You can cancel and modify until 8am on the morning of delivery. The meal is 100% refunded. For any changes, please contact us by email or phone at 581-992-9952.',
        },
      ],
    },
    // ── School Closure Policy ────────────────────────────────────
    closure: {
      tag: 'Good to know',
      title1: 'Our policy during',
      title2: 'school closures',
      points: [
        'In the event of school closure announced less than 48 hours in advance, for any reason for which we are not responsible (strike, storm, power outage…), we will deliver the meals if the daycare service remains open.',
        'If this is not the case, we invite you to come pick up your order at our office.',
        'We cannot refund meals not delivered / not collected given the extent of the losses and management involved.',
        'Lost food is given to a charitable organization.',
      ],
      note: 'For any changes or questions, contact us by email or at',
    },
    // ── Footer ────────────────────────────────────────────────────
    footer: {
      tagline: 'Your trusted school caterer.',
      partnerTag: 'Partner',
      partnerTitle: 'kntera Partner',
      partnerText: 'Studio créatif kntera INC. is a provider of online ordering services and other information technology products. You will find all the details of our Lunch Box service on our website.',
      navTag: 'Navigation',
      navTitle: 'Information',
      links: ['Our Schools', 'Order', 'Contact Us', 'Privacy Policy', 'Cookie Preferences'],
      accountTag: 'Account',
      accountTitle: 'My Account',
      accountLinks: ['Sign In', 'Create Account', 'My Profile', 'My Students', 'My Statements', 'My Invoices'],
      copyright: 'All rights reserved.',
      madeWith: 'Made with care in Quebec',
    },
    // ── Auth ──────────────────────────────────────────────────────
    auth: {
      loginTitle: 'Sign In',
      loginSubtitle: 'Access your CuisineXpress account',
      emailLabel: 'Email address',
      emailPlaceholder: 'example@email.com',
      passwordLabel: 'Password',
      forgotPassword: 'Forgot your password?',
      loginButton: 'Sign In',
      noAccount: "Don't have an account?",
      createAccount: 'Create your account',
      registerTitle: 'Create your account',
      registerSubtitle: 'Join CuisineXpress today',
      firstName: 'First name',
      lastName: 'Last name',
      phoneLabel: 'Phone',
      phoneOptional: '(optional)',
      terms: 'I accept the',
      termsLink: 'terms of use',
      confirmButton: 'Confirm',
      alreadyAccount: 'Already have an account?',
    },
    // ── Dashboard ─────────────────────────────────────────────────
    dashboard: {
      profile: 'My Profile',
      students: 'Students / Staff',
      statement: 'Account Statement',
      invoices: 'Invoices',
      mainMenu: 'Main Menu',
    },
    // ── Order page ────────────────────────────────────────────────
    order: {
      title: 'Order',
      searchPlaceholder: 'Search a meal…',
      sort: 'Sort',
      results: 'result',
      results_plural: 'results',
      filters: 'Filters',
      clear: 'Clear',
      addToCart: 'Add',
      added: 'Added',
      unavailable: 'Unavailable',
      perMeal: '/meal',
      all: 'All',
      school: 'School',
      week: 'Week',
      category: 'Category',
      tagsLabel: 'Diets & Temperature',
      searchLabel: 'Search',
      noResults: 'No meals found',
      noResultsHint: 'Try changing your filters or selecting a different week.',
      clearFilters: 'Clear filters',
      errorTitle: 'Loading error',
      errorHint: 'Unable to load meals. Please check your connection.',
      retry: 'Retry',
      cartLabel: 'meal selected',
      cartLabel_plural: 'meals selected',
      sortOptions: {
        popular: 'Popular',
        name: 'Name A → Z',
        price_asc: 'Price ascending',
        price_desc: 'Price descending',
      },
    },
  },
} as const

export type Translations = typeof translations.fr
export default translations
