const fs = require('fs');
const path = require('path');

// Configuration de base
const config = {
  baseUrl: process.env.SITE_URL || 'https://scim.app',
  outputPath: path.join(__dirname, '../public/sitemap.xml'),
  currentDate: new Date().toISOString().split('T')[0]
};

// Pages statiques de l'application
const staticRoutes = [
  {
    url: '/',
    lastmod: config.currentDate,
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    url: '/home',
    lastmod: config.currentDate,
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    url: '/properties',
    lastmod: config.currentDate,
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    url: '/about',
    lastmod: config.currentDate,
    changefreq: 'monthly',
    priority: '0.7'
  },
  {
    url: '/contact',
    lastmod: config.currentDate,
    changefreq: 'monthly',
    priority: '0.8'
  }
];

// Fonction pour générer le XML du sitemap
function generateSitemapXML(routes) {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  const xmlFooter = `</urlset>`;

  const xmlUrls = routes.map(route => `
  <url>
    <loc>${config.baseUrl}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('');

  return xmlHeader + xmlUrls + '\n' + xmlFooter;
}

// Fonction pour ajouter des routes dynamiques (propriétés)
function addDynamicRoutes(staticRoutes, properties = []) {
  const propertyRoutes = properties.map(property => ({
    url: `/properties/${property.id}`,
    lastmod: property.updated_at || config.currentDate,
    changefreq: 'weekly',
    priority: '0.8'
  }));

  return [...staticRoutes, ...propertyRoutes];
}

// Fonction principale
function generateSitemap() {
  try {
    // Pour l'instant, on utilise seulement les routes statiques
    // Dans un vrai projet, on récupérerait les propriétés depuis l'API
    const allRoutes = staticRoutes;
    
    // Ajouter quelques exemples de propriétés
    const exampleProperties = [
      { id: 1, updated_at: config.currentDate },
      { id: 2, updated_at: config.currentDate },
      { id: 3, updated_at: config.currentDate }
    ];
    
    const routesWithProperties = addDynamicRoutes(allRoutes, exampleProperties);
    
    // Générer le XML
    const sitemapXML = generateSitemapXML(routesWithProperties);
    
    // Écrire le fichier
    fs.writeFileSync(config.outputPath, sitemapXML, 'utf8');
    
    console.log(`Sitemap généré: ${config.outputPath}`);
    console.log(`Nombre d'URLs: ${routesWithProperties.length}`);
    
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap, addDynamicRoutes, generateSitemapXML };

