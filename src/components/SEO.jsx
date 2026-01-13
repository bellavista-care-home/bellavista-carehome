import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const siteTitle = "Bellavista Nursing Homes | Premier Care in South Wales";
  const defaultDescription = "Bellavista Nursing Homes provides exceptional nursing, dementia, and residential care in Cardiff and Barry. Award-winning care homes with a family atmosphere.";
  const defaultKeywords = "nursing home, care home, cardiff, barry, dementia care, residential care, elderly care, south wales, nursing care";
  const siteUrl = "https://www.bellavistanursinghomes.com";
  const defaultImage = "https://www.bellavistanursinghomes.com/bellalogo1.png";

  const fullTitle = title ? `${title} | Bellavista Nursing Homes` : siteTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || defaultImage;
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NursingHome",
    "name": "Bellavista Nursing Homes",
    "url": siteUrl,
    "logo": defaultImage,
    "image": metaImage,
    "description": metaDescription,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Barry",
      "addressRegion": "South Wales",
      "addressCountry": "UK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.405",
      "longitude": "-3.270"
    },
    "telephone": "+44 1446 743983",
    "priceRange": "£££",
    "areaServed": ["Cardiff", "Barry", "South Wales", "Vale of Glamorgan"]
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={metaUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={metaImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default SEO;
