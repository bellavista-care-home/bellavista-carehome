// Schema Markup Utilities for Enhanced SEO
// Comprehensive JSON-LD structured data for all page types

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.bellavistanursinghomes.com/#organization",
  "name": "Bellavista Nursing Home | Award-Winning Care in South Wales",
  "url": "https://www.bellavistanursinghomes.com",
  "logo": "https://www.bellavistanursinghomes.com/bellalogo1.png",
  "description": "Bellavista Nursing Home provides exceptional 5-star dementia care, residential nursing, and elderly care services across South Wales with multiple locations.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Care Home Lane",
    "addressLocality": "Cardiff",
    "postalCode": "CF10 1AA",
    "addressCountry": "UK"
  },
  "telephone": "+44-2920-123456",
  "priceRange": "£££",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "sameAs": [
    "https://www.facebook.com/bellavistanursinghome/",
    "https://x.com/home_bellavista?lang=en",
    "https://www.youtube.com/@bellavistagroupofnursinghomes",
    "https://www.linkedin.com/company/bellavista-nursing-homes",
    "https://www.instagram.com/bellavistanursinghomes"
  ],
  "areaServed": ["GB-WLS", "GB"],
  "founder": {
    "@type": "Person",
    "name": "Bellavista Care Group"
  },
  "foundingDate": "1998",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": "250"
  }
});

export const generateLocalBusinessSchema = (location) => ({
  "@context": "https://schema.org",
  "@type": "NursingHome",
  "@id": `https://www.bellavistanursinghomes.com/${location.slug}/#nursinghome`,
  "name": `Bellavista Nursing Home ${location.name}`,
  "url": `https://www.bellavistanursinghomes.com/${location.slug}`,
  "description": `Bellavista Nursing Home in ${location.name} provides exceptional dementia care, residential nursing, and elderly care services. CQC rated, family-owned since 1998.`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": location.address.street,
    "addressLocality": location.address.city,
    "postalCode": location.address.postcode,
    "addressCountry": "UK"
  },
  "telephone": location.phone,
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": location.coordinates.lat,
    "longitude": location.coordinates.lng
  },
  "openingHours": "Mo-Su 00:00-24:00",
  "priceRange": "£££",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": location.rating,
    "reviewCount": location.reviewCount,
    "bestRating": "5",
    "worstRating": "1"
  },
  "parentOrganization": {
    "@type": "Organization",
    "name": "Bellavista Care Group"
  }
});

export const generateServiceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "NursingHome",
    "name": "Bellavista Nursing Home",
    "url": "https://www.bellavistanursinghomes.com"
  },
  "areaServed": ["Cardiff", "Barry", "Vale of Glamorgan", "South Wales"],
  "serviceType": service.type
});

export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "author": {
    "@type": "Organization",
    "name": "Bellavista Nursing Home"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Bellavista Nursing Home",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.bellavistanursinghomes.com/bellalogo1.png"
    }
  },
  "datePublished": article.publishedDate,
  "dateModified": article.modifiedDate,
  "mainEntityOfPage": article.url
});

export const generateReviewSchema = (review) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "NursingHome",
    "name": "Bellavista Nursing Home",
    "url": "https://www.bellavistanursinghomes.com"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": review.rating,
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Person",
    "name": review.author
  },
  "datePublished": review.date,
  "reviewBody": review.content
});

// Location data for schema generation
export const locations = {
  cardiff: {
    slug: "bellavista-cardiff",
    name: "Cardiff",
    address: {
      street: "123 Care Home Lane",
      city: "Cardiff",
      postcode: "CF10 1AA"
    },
    phone: "+44-2920-123456",
    coordinates: {
      lat: 51.4816,
      lng: -3.1791
    },
    rating: "4.9",
    reviewCount: "89"
  },
  barry: {
    slug: "bellavista-barry",
    name: "Barry",
    address: {
      street: "456 Seaside Road",
      city: "Barry",
      postcode: "CF62 1BB"
    },
    phone: "+44-1446-123456",
    coordinates: {
      lat: 51.3994,
      lng: -3.2700
    },
    rating: "4.8",
    reviewCount: "67"
  }
};

// Service data for schema generation
export const services = {
  dementia: {
    name: "Dementia Care",
    description: "Specialized memory care programs with 24/7 trained staff, sensory rooms, and personalized activity plans for dementia patients.",
    type: "DementiaCare"
  },
  residential: {
    name: "Residential Nursing",
    description: "Round-the-clock nursing care with registered nurses, medication management, and chronic condition support for elderly residents.",
    type: "NursingCare"
  },
  elderly: {
    name: "Elderly Care",
    description: "Comprehensive assisted living with personalized care plans, social activities, and nutritional support for senior citizens.",
    type: "ElderlyCare"
  }
};