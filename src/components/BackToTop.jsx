import React, { useState, useEffect } from 'react';
import '../styles/BackToTop.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      type="button"
      className={`back-to-top ${isVisible ? 'visible' : ''}`} 
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <i className="fas fa-chevron-up" aria-hidden="true"></i>
    </button>
  );
};

export default BackToTop;
