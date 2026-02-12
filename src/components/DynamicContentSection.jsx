import React, { useState } from 'react';
import '../styles/Activities.css'; // Ensure we use the same styles

const DynamicContentSection = ({ title, subtitle, items, type = 'activity' }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  React.useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [selectedItem]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  if (!items || items.length === 0) return null;

  // Helper to clean content
  const cleanShortDescription = (text) => (text || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
  const cleanLongDescription = (html) => (html || '').replace(/&nbsp;/g, ' ');

  return (
    <section className="loc-section loc-section--white">
      <div className="container">
        <div className="section-header section-header--center">
          {subtitle && <span className="section-header__subtitle">{subtitle}</span>}
          {title && <h2 className="section-header__title">{title}</h2>}
        </div>
        
        <div className="activities-grid">
          {items.map((item, index) => (
            <div key={`${type}-${index}`} className="activities-page-card" onClick={() => handleCardClick(item)}>
              <div className="card-image">
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="overlay">
                  <i className="fas fa-plus"></i>
                </div>
              </div>
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{cleanShortDescription(item.description)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Details */}
        {selectedItem && (
          <div className="activity-modal" onClick={closeModal} style={{ zIndex: 9999 }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
              <button className="close-btn" onClick={closeModal}>&times;</button>
              <div className="modal-image">
                <img src={selectedItem.image} alt={selectedItem.title} />
              </div>
              <div className="modal-text" data-lenis-prevent>
                <h3>{selectedItem.title}</h3>
                <div className="modal-description" dangerouslySetInnerHTML={{ __html: cleanLongDescription(selectedItem.details) }} />
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={closeModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicContentSection;
