const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration de base
const config = {
  baseUrl: process.env.SITE_URL || 'https://scim.netlify.app',
  apiBaseUrl: process.env.API_URL || 'http://localhost:5000/api/v1/scim',
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
  },
  {
    url: '/login',
    lastmod: config.currentDate,
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    url: '/register',
    lastmod: config.currentDate,
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    url: '/dashboard',
    lastmod: config.currentDate,
    changefreq: 'weekly',
    priority: '0.5'
  },
  {
    url: '/admin',
    lastmod: config.currentDate,
    changefreq: 'weekly',
    priority: '0.4'
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

// Fonction pour récupérer les propriétés depuis l'API
async function fetchProperties() {
  try {
    console.log('📡 Récupération des propriétés depuis l\'API...');
    const response = await axios.get(`${config.apiBaseUrl}/property?limit=1000`);
    
    let properties = [];
    if (Array.isArray(response.data)) properties = response.data;
    else if (Array.isArray(response.data?.data)) properties = response.data.data;
    else if (Array.isArray(response.data?.items)) properties = response.data.items;
    else if (Array.isArray(response.data?.data?.items)) properties = response.data.data.items;
    
    console.log(`✅ ${properties.length} propriétés récupérées`);
    return properties;
  } catch (error) {
    console.warn('⚠️  Impossible de récupérer les propriétés, utilisation des routes statiques uniquement');
    return [];
  }
}

// Fonction pour ajouter des routes dynamiques (propriétés)
function addDynamicRoutes(staticRoutes, properties = []) {
  if (!Array.isArray(properties)) properties = [];
  const propertyRoutes = properties.map(property => ({
    url: `/properties/${property._id || property.id}`,
    lastmod: property.updatedAt || property.updated_at || property.creeLe || config.currentDate,
    changefreq: 'weekly',
    priority: '0.8'
  }));

  return [...staticRoutes, ...propertyRoutes];
}

// Fonction principale
async function generateSitemap() {
  try {
    console.log('🗺️  Génération du sitemap SCIM...');
    
    // Récupérer les propriétés depuis l'API
    const properties = await fetchProperties();
    
    // Combiner routes statiques et dynamiques
    const allRoutes = addDynamicRoutes(staticRoutes, properties);
    
    // Générer le XML
    const sitemapXML = generateSitemapXML(allRoutes);
    
    // Écrire le fichier
    fs.writeFileSync(config.outputPath, sitemapXML, 'utf8');
    
    console.log(`✅ Sitemap généré: ${config.outputPath}`);
    console.log(`📊 Nombre d'URLs: ${allRoutes.length}`);
    console.log(`🌐 URL de base: ${config.baseUrl}`);
    console.log(`🏠 Propriétés incluses: ${properties.length}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  generateSitemap().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

module.exports = { generateSitemap, addDynamicRoutes, generateSitemapXML, fetchProperties };

