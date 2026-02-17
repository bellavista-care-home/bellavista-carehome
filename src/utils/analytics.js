// Google Analytics 4 implementation for Bellavista Care Homes
// Handles page tracking and custom events with proper error handling

const GA_MEASUREMENT_ID = 'G-QX2LK1FZEG'; // Your GA4 measurement ID

/**
 * Initialize Google Analytics
 * Loads the gtag script and configures tracking
 */
export const initGA = () => {
  if (typeof window === 'undefined') return;

  // Prevent duplicate initialization
  if (window.gtag) return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.onerror = () => {
    console.warn('Google Analytics script failed to load');
  };
  script.onload = () => {
    console.log('Google Analytics script loaded successfully');
  };
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  
  console.log('Google Analytics initialized with measurement ID:', GA_MEASUREMENT_ID);
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle page views manually
    debug_mode: process.env.NODE_ENV === 'development',
    cookie_flags: 'SameSite=None;Secure',
    cookie_domain: 'auto',
    cookie_expires: 63072000, // 2 years
    cookie_update: true,
    allow_google_signals: true,
    allow_ad_personalization_signals: false,
    restricted_data_processing: true // For GDPR compliance
  });
};

/**
 * Track page views
 * @param {string} path - The page path to track
 * @param {string} title - The page title
 */
export const pageview = (path, title) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  try {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      page_location: window.location.href,
      send_to: GA_MEASUREMENT_ID
    });
  } catch (error) {
    console.warn('Failed to send page view to Google Analytics:', error);
  }
};

/**
 * Track custom events
 * @param {string} action - The event action
 * @param {Object} parameters - Additional event parameters
 */
export const event = (action, parameters = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  try {
    window.gtag('event', action, {
      ...parameters,
      send_to: GA_MEASUREMENT_ID
    });
  } catch (error) {
    console.warn('Failed to send event to Google Analytics:', error);
  }
};

/**
 * Track form submissions
 * @param {string} formName - Name of the form
 * @param {Object} formData - Form data (without personal info)
 */
export const trackFormSubmission = (formName, formData = {}) => {
  event('form_submit', {
    form_name: formName,
    form_id: formData.formId || 'unknown',
    form_category: formData.category || 'general'
  });
};

/**
 * Track phone calls
 * @param {string} location - Which location the call is for
 */
export const trackPhoneCall = (location) => {
  event('phone_call_click', {
    location: location,
    value: 1
  });
};

/**
 * Track email clicks
 * @param {string} email - Email address clicked
 */
export const trackEmailClick = (email) => {
  event('email_click', {
    email_address: email,
    value: 1
  });
};

/**
 * Track navigation clicks
 * @param {string} section - Navigation section clicked
 */
export const trackNavigation = (section) => {
  event('navigation_click', {
    navigation_section: section,
    value: 1
  });
};

/**
 * Track service inquiries
 * @param {string} serviceType - Type of service inquired about
 */
export const trackServiceInquiry = (serviceType) => {
  event('service_inquiry', {
    service_type: serviceType,
    value: 1
  });
};

/**
 * Track page scroll depth
 * @param {number} percentage - Scroll percentage (0-100)
 */
export const trackScrollDepth = (percentage) => {
  event('scroll', {
    percent_scrolled: percentage,
    value: percentage
  });
};

export default {
  initGA,
  pageview,
  event,
  trackFormSubmission,
  trackPhoneCall,
  trackEmailClick,
  trackNavigation,
  trackServiceInquiry,
  trackScrollDepth
};