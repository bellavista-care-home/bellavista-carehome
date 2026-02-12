import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchHome } from '../services/homeService';
import '../styles/Facilities.css';
import SEO from '../components/SEO';

const Facilities = () => {
  const { locationId } = useParams();
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [dynamicFacilities, setDynamicFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const locationNames = {
    'bellavista-barry': 'Bellavista Barry',
    'bellavista-cardiff': 'Bellavista Cardiff',
    'waverley-care-center': 'Waverley Care Center',
    'college-fields-nursing-home': 'College Fields Nursing Home',
    'baltimore-care-home': 'Baltimore Care Home',
    'meadow-vale-cwtch': 'Meadow Vale Cwtch',
    'bellavista-pontypridd': 'Bellavista Pontypridd'
  };

  const locationName = locationId ? locationNames[locationId] : null;
  const pageTitle = locationName ? `Facilities at ${locationName}` : 'Our Facilities';
  const pageDescription = locationName 
    ? `Explore the modern facilities at ${locationName}, including comfortable lounges, private rooms, gardens, and therapy spaces.`
    : "Explore the modern facilities at Bellavista Nursing Homes, including comfortable lounges, private rooms, gardens, cinema, therapy spaces and more.";

  // Map frontend URL slugs to backend IDs
  const backendIdMap = {
    'college-fields-nursing-home': 'college-fields',
    'waverley-care-center': 'waverley-care-centre',
    'meadow-vale-cwtch': 'meadow-vale-cwtch',
    'baltimore-care-home': 'bellavista-baltimore',
  };

  const backendId = backendIdMap[locationId] || locationId;

  const defaultFacilities = [];

  useEffect(() => {
    if (backendId) {
      setLoading(true);
      fetchHome(backendId).then(data => {
        if (data && data.facilitiesGalleryImages) {
          // Filter images that have showOnPage set to true
          const visibleFacilities = data.facilitiesGalleryImages
            .filter(img => typeof img === 'object' && img.showOnPage)
            .map(img => ({
              title: img.title || 'Facility',
              image: img.url,
              // Strip HTML tags and replace &nbsp; for the card preview
              description: (img.shortDescription || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' '),
              // Keep HTML for modal but replace &nbsp; to fix wrapping issues
              details: (img.fullDescription || img.shortDescription || '').replace(/&nbsp;/g, ' '),
            }));
          setDynamicFacilities(visibleFacilities);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [locationId]);

  const facilities = dynamicFacilities;

  useEffect(() => {
    if (selectedFacility) {
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
  }, [selectedFacility]);

  const handleCardClick = (facility) => {
    setSelectedFacility(facility);
  };

  const closeModal = () => {
    setSelectedFacility(null);
  };

  return (
    <div className="facilities-page">
      <SEO 
        title={pageTitle}
        description={pageDescription}
        url={locationId ? `/facilities/${locationId}` : "/facilities"}
      />
      <div className="page-header">
        <div className="container">
          <h1>{pageTitle}</h1>
          <p>Carefully designed spaces that promote comfort, wellbeing, and engagement.</p>
        </div>
      </div>

      <section className="facilities-intro">
        <div className="container">
          <p>
            At {locationName || 'Bellavista Nursing Homes'}, every detail of our facilities is carefully designed to promote comfort, wellbeing, and engagement. From spacious, private rooms to vibrant communal areas and dedicated activity zones, our homes create a safe, welcoming, and stimulating environment for all residents.
          </p>
          <p>
            Modern dining spaces, therapeutic gardens, and purpose-built wellness areas complement our advanced care facilities, ensuring that every moment supports quality of life, connection, and independence.
          </p>
        </div>
      </section>

      <section className="facilities-gallery">
        <div className="container">
          <div className="facilities-grid">
            {facilities.map((facility, index) => (
              <div key={index} className="facilities-page-card" onClick={() => handleCardClick(facility)}>
                <div className="card-image">
                  <img src={facility.image} alt={facility.title} loading="lazy" />
                  <div className="overlay">
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{facility.title}</h3>
                  <p>{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for Facility Details */}
      {selectedFacility && (
        <div className="facility-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <div className="modal-image">
              <img src={selectedFacility.image} alt={selectedFacility.title} />
            </div>
            <div className="modal-text" data-lenis-prevent>
              <h3>{selectedFacility.title}</h3>
              <div className="modal-description" dangerouslySetInnerHTML={{ __html: selectedFacility.details }} />
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Facilities;