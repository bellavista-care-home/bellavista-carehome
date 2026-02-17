import React from "react";
import { Helmet } from "react-helmet-async";
import { generateOrganizationSchema } from "../utils/schemaUtils";

const SITE_URL = "https://www.bellavistanursinghomes.com";
const BRAND = "Bellavista Nursing Home | Award-Winning Care in South Wales";

const SEO = ({
  title,
  description,
  image = `${SITE_URL}/bellalogo1.png`,
  url = "/",
  schema,
  keywords = "",
  canonical
}) => {
  const fullTitle = title
    ? `${title} | Bellavista Nursing Home`
    : "Bellavista Nursing Home | Award-Winning Care Homes in South Wales & Cardiff";

  const metaDescription =
    description ||
    "Bellavista Nursing Home provides exceptional residential, nursing, and dementia care across South Wales. Rated best care homes in Cardiff, Barry, and Vale of Glamorgan.";

  const metaKeywords =
    keywords ||
    "Bellavista Nursing Home, care homes South Wales, nursing home Cardiff, dementia care Barry, residential care Vale of Glamorgan, best nursing homes UK, elderly care, award-winning care homes";

  const resolvedCanonical = canonical || url;

  const canonicalUrl = resolvedCanonical.startsWith("http")
    ? resolvedCanonical
    : `${SITE_URL}${resolvedCanonical}`;

  const defaultSchema = generateOrganizationSchema();

  const schemaToRender = schema || defaultSchema;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="author" content="Bellavista Nursing Home" />
      <meta name="publisher" content="Bellavista Group" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2c5282" />
      <meta name="geo.region" content="GB-WLS" />
      <meta name="geo.placename" content="South Wales" />
      <meta name="geo.position" content="51.5074;-0.1278" />
      <meta name="ICBM" content="51.5074, -0.1278" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">
        {JSON.stringify(schemaToRender)}
      </script>
    </Helmet>
  );
};

export default SEO;
