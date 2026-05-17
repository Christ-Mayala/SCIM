import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../contexts/SettingsContext';

const SEOHead = ({
  title,
  description,
  keywords = 'immobilier, luxe, propriétés, achat, vente, location, maison, appartement',
  image = '/images/og/og-default.jpg',
  url = window.location.href,
  type = 'website',
  author,
  siteName,
  locale = 'fr_FR',
  twitterHandle = '@scim',
  structuredData = null,
  canonical = null,
  noIndex = false,
  article = null
}) => {
  const { settings } = useSettings();
  
  const currentSiteName = siteName || settings.siteName || 'SCIM';
  const currentAuthor = author || settings.siteName || 'SCIM';
  const currentDescription = description || settings.siteDescription || 'SCIM - Plateforme immobilière pour la recherche, la gestion et la location de biens';
  const currentTitle = title ? (title.includes(currentSiteName) ? title : `${title} | ${currentSiteName}`) : `${currentSiteName} - Plateforme Immobilière`;

  const canonicalUrl = canonical || url;
  const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const toUrlString = (img) => {
    try {
      if (!img) return '/images/og/og-default.jpg';
      if (typeof img === 'string') return img.startsWith('http') ? img : `${window.location.origin}${img}`;
      if (Array.isArray(img)) {
        const first = img[0];
        return toUrlString(first?.url || first);
      }
      if (typeof img === 'object' && img.url) return toUrlString(img.url);
      return '/images/og/og-default.jpg';
    } catch {
      return '/images/og/og-default.jpg';
    }
  };
  const fullImageUrl = toUrlString(image);

  return (
    <Helmet>
      {/* Métadonnées de base */}
      <title>{currentTitle}</title>
      <meta name="description" content={currentDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={currentAuthor} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Métadonnées de langue */}
      <meta httpEquiv="content-language" content="fr" />
      <meta name="language" content="French" />

      {/* Open Graph optimisé */}
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={`${title || currentSiteName} - ${currentSiteName}`} />
      <meta property="og:image:secure_url" content={fullImageUrl} />
      <meta property="og:site_name" content={currentSiteName} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter Cards optimisées */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={currentTitle} />
      <meta name="twitter:description" content={currentDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={currentTitle} />
      <meta name="twitter:domain" content="scim.app" />

      {/* Métadonnées spécifiques aux articles */}
      {article && (
        <>
          <meta property="article:author" content={article.author || author} />
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:section" content={article.section || 'Immobilier'} />
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Métadonnées additionnelles */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="msapplication-TileImage" content="/images/ms-icon-144x144.png" />
      
      {/* Métadonnées pour les moteurs de recherche */}
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Métadonnées pour les réseaux sociaux */}
      <meta property="fb:app_id" content="your-facebook-app-id" />
      <meta name="pinterest-rich-pin" content="true" />

      {/* Données structurées JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Préconnexions pour améliorer les performances */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//connect.facebook.net" />

      {/* Liens alternatifs */}
      <link rel="alternate" type="application/rss+xml" title="SCIM - Nouvelles Propriétés" href="/feed.xml" />
      <link rel="alternate" hrefLang="fr" href={url} />
      <link rel="alternate" hrefLang="en" href={`${url.replace(window.location.origin, baseUrl)}/en`} />
      <link rel="alternate" hrefLang="x-default" href={url} />
    </Helmet>
  );
};

export default SEOHead;

