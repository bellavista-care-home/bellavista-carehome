import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, schema }) => {
  const siteTitle = "Bellavista Group Of Nursing Homes | Award-Winning Care in UK";
  const defaultDescription = "Bellavista Group Of Nursing Homes is recognized as one of the best care homes in the UK, providing exceptional residential, nursing, and dementia care in South Wales.";
  const defaultKeywords = "Best care home UK, top nursing home South Wales, award winning care home, Bellavista Nursing Homes, dementia care Cardiff, luxury care home Barry";
  const siteUrl = "https://www.bellavistanursinghomes.com";
  const defaultImage = "https://www.bellavistanursinghomes.com/bellalogo1.png";

  // If the provided title contains "Bellavista", use it as is, otherwise append the brand
  const fullTitle = title && title.includes('Bellavista') ? title : (title ? `${title} | Bellavista Group Of Nursing Homes` : siteTitle);
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || defaultImage;
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

  const schemaData = schema || {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NursingHome",
        "@id": "https://www.bellavistanursinghomes.com/#organization",
        "name": "Bellavista Group Of Nursing Homes",
        "url": siteUrl,
        "logo": defaultImage,
        "image": metaImage,
        "description": metaDescription,
        "slogan": "A Home From Home - Rated One of the Best in UK",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "106-108 Tynewydd Road",
          "addressLocality": "Barry",
          "postalCode": "CF62 8BB",
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
        "areaServed": ["UK", "South Wales", "Cardiff", "Barry", "Vale of Glamorgan"],
        "sameAs": [
          "https://www.facebook.com/bellavistanursinghome/",
          "https://x.com/home_bellavista?lang=en",
          "https://www.youtube.com/@bellavistagroupofnursinghomes"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.bellavistanursinghomes.com/#website",
        "url": siteUrl,
        "name": "Bellavista Nursing Homes",
        "publisher": {
          "@id": "https://www.bellavistanursinghomes.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.bellavistanursinghomes.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
       <meta name="robots" content="index,follow" />
      <link rel="canonical" href={metaUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Bellavista Nursing Homes" />
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
