import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchHome } from '../services/homeService';
import { fetchCareServices } from '../services/careService';
import '../styles/Activities.css';
import SEO from '../components/SEO';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Care = () => {
  const { locationId } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [careServices, setCareServices] = useState([]);
  const [careSections, setCareSections] = useState([]);

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
  const pageTitle = locationName ? `Care at ${locationName}` : 'Our Care';
  const pageHeaderTitle = locationName ? `Care at ${locationName}` : 'Exceptional Care';

  // Map frontend URL slugs to backend IDs
  const backendIdMap = {
    'college-fields-nursing-home': 'college-fields',
    'waverley-care-center': 'waverley-care-centre',
    'meadow-vale-cwtch': 'meadow-vale-cwtch',
    'baltimore-care-home': 'bellavista-baltimore',
  };

  const backendId = backendIdMap[locationId] || locationId;

  // Swiper settings
  const sliderSettings = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 0,
    slidesPerView: 1,
    navigation: true,
    pagination: { clickable: true },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    loop: true
  };

  useEffect(() => {
    if (backendId) {
      // Fetch both specific home data and global care services
      Promise.all([
        fetchHome(backendId),
        fetchCareServices()
      ]).then(([homeData, globalServices]) => {
        if (homeData) {
          // Process Care Sections (Alternating Layout)
          if (homeData.careSectionsJson) {
             try {
               const sections = typeof homeData.careSectionsJson === 'string' ? JSON.parse(homeData.careSectionsJson) : homeData.careSectionsJson;
               setCareSections(sections);
             } catch (e) {
               console.error("Error parsing careSectionsJson", e);
             }
          }

          // Use Global Care Services instead of home-specific ones
          if (globalServices && Array.isArray(globalServices)) {
             setCareServices(globalServices
                .filter(s => s.showOnPage !== false)
                .map(s => ({
                title: s.title,
                description: s.description,
                images: s.images || [],
                icon: s.icon,
                // Ensure we have something to display
                image: (s.images && s.images.length > 0) ? s.images[0] : '',
                details: s.description
             })));
          }

        }
      });
    }
  }, [backendId]);

  useEffect(() => {
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
    // Only open modal if there are details/description
    if (item.details || item.description) {
        setSelectedItem(item);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  if (!locationId) return null;

  return (
    <div className="activities-page">
      <SEO 
        title={pageTitle}
        description={`Discover the exceptional care services at ${locationName || 'Bellavista Nursing Homes'}.`}
        url={`/care/${locationId}`}
      />
      <div className="page-header">
        <div className="container">
          <h1>{pageHeaderTitle}</h1>
          <p>Professional, compassionate, and person-centred care tailored to your needs.</p>
        </div>
      </div>

      {/* Care Sections (Alternating Layout) */}
      {careSections && careSections.length > 0 && (
        <section className="care-sections">
          {careSections.filter(s => s.showOnPage).map((section, index) => (
            <div key={`section-${index}`} className={`care-section ${index % 2 === 0 ? 'image-left' : 'image-right'}`}>
              <div className="care-section-image">
                {section.image ? (
                  <img src={section.image} alt={section.title} />
                ) : (
                  <div className="image-placeholder">
                    <i className="fas fa-heartbeat"></i>
                  </div>
                )}
              </div>
              <div className="care-section-content">
                <h3>{section.title}</h3>
                <div className="description" dangerouslySetInnerHTML={{ __html: section.description }} />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Care Services Section (Global Data) */}
      {careServices.length > 0 && (
      <section className="activities-gallery">
        <div className="container">
          <div className="section-title">
            <h2>Our Care Services</h2>
            <p>Specialised support designed for individual needs</p>
          </div>
          <div className="activities-grid">
            {careServices.map((item, index) => (
              <div key={`care-${index}`} className="activities-page-card" onClick={() => handleCardClick(item)}>
                <div className="card-image">
                  {item.images && item.images.length > 1 ? (
                    <div onClick={(e) => e.stopPropagation()} style={{height: '100%', width: '100%'}}>
                        <Swiper {...sliderSettings} className="h-full w-full">
                          {item.images.map((img, idx) => (
                            <SwiperSlide key={idx}>
                               <img src={img} alt={`${item.title} ${idx + 1}`} loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                    </div>
                  ) : (
                      item.image ? (
                         <img src={item.image} alt={item.title} loading="lazy" />
                      ) : (
                         <div style={{width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className={item.icon || "fas fa-heartbeat"} style={{fontSize: '3rem', color: '#ccc'}}></i>
                         </div>
                      )
                  )}
                  {/* Only show overlay if not using slider (or handle slider click differently) */}
                  {(!item.images || item.images.length <= 1) && (
                      <div className="overlay">
                        <i className="fas fa-plus"></i>
                      </div>
                  )}
                </div>
                <div className="card-content">
                  <h3>{item.title}</h3>
                  <div className="card-description" dangerouslySetInnerHTML={{ __html: item.description }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Modal for Details */}
      {selectedItem && (
        <div className="activity-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <div className="modal-image">
              {/* If item has multiple images, show slider in modal too? For now, just show first image or main image */}
              {selectedItem.images && selectedItem.images.length > 1 ? (
                 <Swiper {...sliderSettings} className="h-full w-full">
                    {selectedItem.images.map((img, idx) => (
                      <SwiperSlide key={idx}>
                         <img src={img} alt={`${selectedItem.title} ${idx + 1}`} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                      </SwiperSlide>
                    ))}
                 </Swiper>
              ) : (
                 selectedItem.image && <img src={selectedItem.image} alt={selectedItem.title} />
              )}
            </div>
            <div className="modal-text" data-lenis-prevent>
              <h3>{selectedItem.title}</h3>
              <div className="modal-description" dangerouslySetInnerHTML={{ __html: selectedItem.details || selectedItem.description }} />
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

export default Care;
