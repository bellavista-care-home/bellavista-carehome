import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, pageview, trackScrollDepth } from '../utils/analytics';

/**
 * Custom hook for Google Analytics tracking
 * Initializes GA and tracks page views on route changes
 */
export const useAnalytics = () => {
  const location = useLocation();

  // Initialize Google Analytics on mount
  useEffect(() => {
    initGA();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const pageTitle = document.title || 'Bellavista Care Homes';
    pageview(currentPath, pageTitle);
  }, [location]);

  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0;
    
    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      // Track at 25%, 50%, 75%, and 90% scroll depths
      if (scrollPercentage >= 25 && maxScroll < 25) {
        trackScrollDepth(25);
        maxScroll = 25;
      } else if (scrollPercentage >= 50 && maxScroll < 50) {
        trackScrollDepth(50);
        maxScroll = 50;
      } else if (scrollPercentage >= 75 && maxScroll < 75) {
        trackScrollDepth(75);
        maxScroll = 75;
      } else if (scrollPercentage >= 90 && maxScroll < 90) {
        trackScrollDepth(90);
        maxScroll = 90;
      }
    };

    // Throttle scroll events
    let scrollTimeout;
    const throttledScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null;
      }, 500);
    };

    window.addEventListener('scroll', throttledScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);
};

export default useAnalytics;