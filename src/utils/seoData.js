// Configuration SEO pour chaque page de l'application
export const seoConfig = {
  home: {
    title: 'Accueil - SCIM',
    description: 'Découvrez les plus belles propriétés de luxe avec SCIM. Achat, vente et location de biens immobiliers exceptionnels.',
    keywords: 'immobilier luxe, propriétés haut de gamme, achat maison, vente appartement, location villa',
    image: '/images/og/og-home.jpg'
  },
  properties: {
    title: 'Propriétés - SCIM',
    description: 'Parcourez notre sélection exclusive de propriétés de luxe. Maisons, appartements et villas d\'exception à vendre et à louer.',
    keywords: 'propriétés luxe, maisons vente, appartements location, villas haut de gamme, immobilier prestige',
    image: '/images/og/og-properties.jpg'
  },
  propertyDetail: (property) => ({
    title: `${property?.titre || 'Propriété'} - SCIM`,
    description: property?.description || 'Découvrez cette propriété exceptionnelle avec SCIM.',
    keywords: `${property?.categorie || 'propriété'}, ${property?.ville || 'immobilier'}, ${property?.prix ? 'prix ' + property.prix : 'luxe'}`,
    image: (property?.images?.[0]?.url) || '/images/og/og-property.jpg',
    type: 'article'
  }),
  about: {
    title: 'À Propos - SCIM',
    description: 'Découvrez l\'histoire et l\'expertise d\'SCIM, votre partenaire de confiance pour l\'immobilier de luxe.',
    keywords: 'scim, plateforme immobilière, annonces, gestion, équipe',
    image: '/images/og/og-about.jpg'
  },
  contact: {
    title: 'Contact - SCIM',
    description: 'Contactez nos experts en immobilier de luxe. Nous sommes là pour vous accompagner dans tous vos projets immobiliers.',
    keywords: 'contact scim, support, conseil immobilier, accompagnement',
    image: '/images/og/og-contact.jpg'
  },
  login: {
    title: 'Connexion - SCIM',
    description: 'Connectez-vous à votre espace personnel SCIM pour gérer vos propriétés et favoris.',
    keywords: 'connexion, espace client, compte scim',
    image: '/images/og/og-login.jpg'
  },
  register: {
    title: 'Inscription - SCIM',
    description: 'Créez votre compte SCIM et accédez à nos services exclusifs d\'immobilier de luxe.',
    keywords: 'inscription, créer compte, services exclusifs',
    image: '/images/og/og-login.jpg'
  },
  dashboard: {
    title: 'Tableau de Bord - SCIM',
    description: 'Gérez vos propriétés, consultez vos statistiques et accédez à tous vos outils immobiliers.',
    keywords: 'tableau de bord, gestion propriétés, statistiques',
    image: '/images/og/og-default.jpg'
  },
  profile: {
    title: 'Mon Profil - SCIM',
    description: 'Gérez vos informations personnelles et préférences sur votre profil SCIM.',
    keywords: 'profil utilisateur, informations personnelles, préférences',
    image: '/images/og/og-default.jpg'
  },
  favorites: {
    title: 'Mes Favoris - SCIM',
    description: 'Retrouvez toutes vos propriétés favorites sauvegardées sur SCIM.',
    keywords: 'favoris, propriétés sauvegardées, sélection personnelle',
    image: '/images/og/og-properties.jpg'
  },
  addProperty: {
    title: 'Ajouter une Propriété - SCIM',
    description: 'Ajoutez votre propriété sur SCIM et bénéficiez de notre expertise pour la vendre ou la louer.',
    keywords: 'ajouter propriété, vendre maison, louer appartement, publier annonce',
    image: '/images/og/og-default.jpg'
  },
  messages: {
    title: 'Messages - SCIM',
    description: 'Consultez et gérez vos messages avec les autres utilisateurs et agents SCIM.',
    keywords: 'messages, communication, contact agents',
    image: '/images/og/og-contact.jpg'
  }
};

// Données structurées par défaut pour l'organisation
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "SCIM",
  "description": "Agence immobilière spécialisée dans les propriétés de luxe",
  "url": "https://scim.app",
  "logo": "https://scim.app/images/scim-logo.jpg",
  "image": "https://scim.app/images/og/og-default.jpg",
  "telephone": "+33 1 23 45 67 89",
  "email": "contact@scim.app",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Avenue des Champs-Élysées",
    "addressLocality": "Paris",
    "postalCode": "75008",
    "addressCountry": "FR"
  },
  "openingHours": "Mo-Fr 09:00-18:00",
  "sameAs": [
    "#",
    "#",
    "#"
  ]
};

// Fonction pour générer les données structurées d'une propriété
export const generatePropertyStructuredData = (property) => {
  if (!property) return null;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstate",
    "name": property.titre,
    "description": property.description,
    "image": (property.images || []).map(img => img?.url).filter(Boolean),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.ville,
      "addressCountry": "CG"
    },
    "offers": {
      "@type": "Offer",
      "price": property.prix,
      "priceCurrency": "XAF",
      "availability": "https://schema.org/InStock"
    },
    "floorSize": property.superficie ? {
      "@type": "QuantitativeValue",
      "value": property.superficie,
      "unitCode": "MTK"
    } : undefined,
    "numberOfBedrooms": property.nombre_chambres,
    "numberOfBathroomsTotal": property.nombre_salles_bain
  };
};

