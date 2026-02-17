// Dynamic Sitemap Generator for Bellavista Nursing Homes
// This utility helps generate dynamic sitemaps for better SEO

import { locations } from './schemaUtils';

const SITE_URL = "https://www.bellavistanursinghomes.com";

// Static pages configuration
const staticPages = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.9, changefreq: 'monthly' },
  { path: '/contact', priority: 0.9, changefreq: 'monthly' },
  { path: '/services', priority: 0.9, changefreq: 'monthly' },
  { path: '/our-homes', priority: 0.9, changefreq: 'weekly' },
  { path: '/news', priority: 0.8, changefreq: 'daily' },
  { path: '/gallery', priority: 0.7, changefreq: 'weekly' },
  { path: '/testimonials', priority: 0.7, changefreq: 'monthly' },
  { path: '/faq', priority: 0.7, changefreq: 'monthly' },
  { path: '/careers', priority: 0.6, changefreq: 'weekly' },
  { path: '/care', priority: 0.8, changefreq: 'monthly' },
  { path: '/activities', priority: 0.7, changefreq: 'monthly' },
  { path: '/facilities', priority: 0.7, changefreq: 'monthly' },
  { path: '/dining-nutrition', priority: 0.6, changefreq: 'monthly' },
  { path: '/dementia-care-guide', priority: 0.8, changefreq: 'monthly' },
  { path: '/dementia-environment', priority: 0.7, changefreq: 'monthly' },
  { path: '/our-vision', priority: 0.5, changefreq: 'yearly' },
  { path: '/our-values', priority: 0.5, changefreq: 'yearly' },
  { path: '/management-team', priority: 0.6, changefreq: 'monthly' },
  { path: '/visitor-policy', priority: 0.5, changefreq: 'monthly' },
  { path: '/training-development', priority: 0.5, changefreq: 'monthly' },
  { path: '/schedule-tour', priority: 0.8, changefreq: 'monthly' },
  { path: '/enquiry', priority: 0.8, changefreq: 'monthly' },
  { path: '/care-homes-cardiff', priority: 0.8, changefreq: 'monthly' },
  { path: '/bellavista-nursing-home', priority: 0.8, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changefreq: 'yearly' },
];

// Location pages
const locationPages = Object.keys(locations).map(key => ({
  path: `/${locations[key].slug}`,
  priority: 0.9,
  changefreq: 'weekly'
}));

// Generate XML for a single URL
const generateUrlXML = (url, lastmod = new Date().toISOString().split('T')[0]) => {
  return `  <url>
    <loc>${SITE_URL}${url.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
};

// Generate XML for news articles
const generateNewsUrlXML = (newsItem) => {
  return `  <url>
    <loc>${SITE_URL}/news/${newsItem.slug || newsItem.id}</loc>
    <lastmod>${newsItem.date || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
};

// Main sitemap generation function
export const generateSitemapXML = (newsItems = []) => {
  const allPages = [...staticPages, ...locationPages];
  
  const urls = allPages.map(page => generateUrlXML(page)).join('\n');
  const newsUrls = newsItems.map(news => generateNewsUrlXML(news)).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
${newsUrls}
</urlset>`;
};

// Generate news sitemap specifically for Google News
export const generateNewsSitemapXML = (newsItems = []) => {
  if (newsItems.length === 0) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
</urlset>`;
  }

  const newsUrls = newsItems.map(news => {
    const pubDate = new Date(news.date).toISOString();
    return `  <url>
    <loc>${SITE_URL}/news/${news.slug || news.id}</loc>
    <news:news>
      <news:publication>
        <news:name>Bellavista Nursing Homes</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${news.title}</news:title>
      <news:keywords>${news.category || 'care home news'}</news:keywords>
    </news:news>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${newsUrls}
</urlset>`;
};

// Generate robots.txt content
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin-console
Disallow: /login
Disallow: /api
Disallow: /private
Disallow: /kiosk

# Crawl delay to be respectful to server
Crawl-delay: 1

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/sitemap-news.xml

# Allow Googlebot to index all images
User-agent: Googlebot-Image
Allow: /*

# Allow social media crawlers
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit/1.1
Allow: /
`;
};

// Helper function to get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Helper function to format date for sitemaps
export const formatSitemapDate = (date) => {
  if (!date) return getCurrentDate();
  return new Date(date).toISOString().split('T')[0];
};

export default {
  generateSitemapXML,
  generateNewsSitemapXML,
  generateRobotsTxt,
  getCurrentDate,
  formatSitemapDate
};