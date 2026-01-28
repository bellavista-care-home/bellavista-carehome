import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.bellavistanursinghomes.com";
const BRAND = "Bellavista Group Of Nursing Homes";

const SEO = ({
  title,
  description,
  image = `${SITE_URL}/bellalogo1.png`,
  url = "/",
  schema
}) => {
  const fullTitle = title
    ? `${title} | ${BRAND}`
    : "Award-Winning Nursing & Dementia Care in South Wales | Bellavista";

  const metaDescription =
    description ||
    "Bellavista Group Of Nursing Homes provides award-winning residential, nursing, and dementia care across South Wales including Cardiff, Barry, and Vale of Glamorgan.";

  const canonicalUrl = url.startsWith("http")
    ? url
    : `${SITE_URL}${url}`;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": BRAND,
    "url": SITE_URL,
    "logo": `${SITE_URL}/bellalogo1.png`,
    "sameAs": [
      "https://www.facebook.com/bellavistanursinghome/",
      "https://x.com/home_bellavista?lang=en",
      "https://www.youtube.com/@bellavistagroupofnursinghomes"
    ]
  };

  return (
    <Helmet>
      {/* Core */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
