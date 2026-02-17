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
      street: "2 Harrowby Pl",
      city: "Cardiff",
      postcode: "CF10 5GB"
    },
    phone: "+44 29 2070 5282",
    coordinates: {
      lat: 51.464,
      lng: -3.165
    },
    rating: "4.8",
    reviewCount: "92"
  },
  barry: {
    slug: "bellavista-barry",
    name: "Barry",
    address: {
      street: "106-108 Tynewydd Road",
      city: "Barry",
      postcode: "CF62 8BB"
    },
    phone: "+44 1446 743893",
    coordinates: {
      lat: 51.405,
      lng: -3.268
    },
    rating: "4.9",
    reviewCount: "85"
  },
  waverley: {
    slug: "waverley-care-center",
    name: "Waverley Care Centre",
    address: {
      street: "122-124 Plymouth Road",
      city: "Penarth",
      postcode: "CF64 5DN"
    },
    phone: "+44 29 2070 5282",
    coordinates: {
      lat: 51.432,
      lng: -3.175
    },
    rating: "4.8",
    reviewCount: "45"
  },
  collegeFields: {
    slug: "college-fields-nursing-home",
    name: "College Fields Nursing Home",
    address: {
      street: "College Fields, College Road",
      city: "Barry",
      postcode: "CF62 8LE"
    },
    phone: "+44 1446 743893",
    coordinates: {
      lat: 51.408,
      lng: -3.282
    },
    rating: "4.8",
    reviewCount: "24"
  },
  baltimore: {
    slug: "baltimore-care-home",
    name: "Baltimore House Care Home",
    address: {
      street: "1 & 2 Park Road",
      city: "Barry",
      postcode: "CF62 6NU"
    },
    phone: "+44 1446 743893",
    coordinates: {
      lat: 51.398,
      lng: -3.285
    },
    rating: "5.0",
    reviewCount: "6"
  },
  meadowVale: {
    slug: "meadow-vale-cwtch",
    name: "Meadow Vale Cwtch",
    address: {
      street: "27-29 Cog Road",
      city: "Sully, Penarth",
      postcode: "CF64 5TD"
    },
    phone: "+44 29 2053 1081",
    coordinates: {
      lat: 51.390,
      lng: -3.345
    },
    rating: "4.9",
    reviewCount: "12"
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