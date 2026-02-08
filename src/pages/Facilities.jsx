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

  const defaultFacilities = [
    { title: 'Reception', image: '/facilities/reception-facility.jpeg', description: 'Our welcoming reception area where our friendly staff are always ready to assist you.', details: 'The reception is the heart of our home, providing a warm welcome to all visitors and residents. Our staff are available to help with enquiries and ensure security.' },
    { title: 'Lounge Area', image: '/facilities/lounge-area.jpg', description: 'Comfortable and spacious lounges for residents to relax and socialize.', details: 'Our lounges are designed for comfort, featuring cozy seating, large windows for natural light, and entertainment options. It is a perfect place for residents to catch up with friends or enjoy a quiet moment.' },
    { title: 'Dining Room', image: '/facilities/dining-room.jpg', description: 'Elegant dining spaces serving nutritious and delicious home-cooked meals.', details: 'We believe dining is a social occasion. Our dining rooms offer a restaurant-style experience with a varied menu catering to all dietary requirements.' },
    { title: 'Private Room', image: '/facilities/private-room.jpg', description: ' tastefully decorated private rooms with en-suite facilities.', details: 'Each private room is a personal sanctuary, fully furnished and equipped with modern amenities. Residents are encouraged to personalize their space with their own belongings.' },
    { title: 'Garden', image: '/facilities/garden-facility.jpeg', description: 'Beautifully landscaped gardens for fresh air and outdoor activities.', details: 'Our accessible gardens provide a safe outdoor space for residents to enjoy nature, participate in gardening clubs, or simply sit and enjoy the sunshine.' },
    { title: 'Outdoor Terrace', image: '/facilities/outdoor-terrace.jpg', description: 'A lovely terrace area for enjoying the outdoors in comfort.', details: 'The outdoor terrace is perfect for afternoon tea or social gatherings in the warmer months, offering fresh air and views of the surroundings.' },
    { title: 'Activity Room', image: '/facilities/activity-room.jpg', description: 'Dedicated spaces for arts, crafts, and group activities.', details: 'Our activity room is stocked with supplies for arts and crafts, games, and other hobbies. It is a vibrant space where creativity flourishes.' },
    { title: 'Cinema', image: '/facilities/cinema-facility.jpeg', description: 'Our in-house cinema for movie nights and entertainment.', details: 'Residents can enjoy their favorite films and classic movies in our comfortable cinema room, complete with popcorn and refreshments.' },
    { title: 'Library', image: '/facilities/library-facility.jpeg', description: 'A quiet reading nook with a wide selection of books.', details: 'For those who love to read, our library offers a peaceful retreat with a variety of books, large print options, and daily newspapers.' },
    { title: 'Arts & Crafts', image: '/facilities/arts-facility.jpg', description: 'Creative spaces to explore artistic talents.', details: 'We provide regular art sessions where residents can paint, draw, and create, supported by our activity coordinators.' },
    { title: 'Music Therapy', image: '/facilities/music-therapy.jpeg', description: 'Therapeutic music sessions to uplift spirits.', details: 'Music therapy is a key part of our wellbeing program, offering sensory stimulation and emotional support through music and rhythm.' },
    { title: 'Wellness Spa', image: '/facilities/wellness-spa.jpg', description: 'Relaxing spa facilities for pampering and self-care.', details: 'Our wellness spa offers hair dressing, manicures, and relaxing treatments to ensure residents look and feel their best.' },
    { title: 'Physiotherapy', image: '/facilities/physiotherapy-room.jpg', description: 'On-site physiotherapy to support mobility and rehabilitation.', details: 'We have dedicated space and equipment for physiotherapy sessions, helping residents maintain or improve their mobility and independence.' },
    { title: 'Medical Suite', image: '/facilities/medical-suite.jpg', description: 'Equipped medical facilities for health consultations.', details: 'Our medical suite provides a private space for GP visits, health check-ups, and consultations with visiting healthcare professionals.' },
    { title: 'Kitchen', image: '/facilities/kitchen-area.jpg', description: 'Modern kitchens preparing fresh, seasonal food.', details: 'Our kitchens adhere to the highest hygiene standards, where our chefs prepare nutritious, balanced meals using fresh, locally sourced ingredients.' },
    { title: 'Laundry Service', image: '/facilities/laundry-service.jpg', description: 'Full laundry and housekeeping services.', details: 'We provide a comprehensive laundry service for personal clothing and bed linen, ensuring residents always have clean, fresh clothes.' }
  ];

  useEffect(() => {
    if (locationId) {
      setLoading(true);
      fetchHome(locationId).then(data => {
        if (data && data.facilitiesGalleryImages) {
          // Filter images that have showOnPage set to true
          const visibleFacilities = data.facilitiesGalleryImages
            .filter(img => typeof img === 'object' && img.showOnPage)
            .map(img => ({
              title: img.title || 'Facility',
              image: img.url,
              description: img.shortDescription || '',
              details: img.fullDescription || img.shortDescription || ''
            }));
          setDynamicFacilities(visibleFacilities);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [locationId]);

  const facilities = (locationId && dynamicFacilities.length > 0) ? dynamicFacilities : defaultFacilities;

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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <div className="modal-image">
              <img src={selectedFacility.image} alt={selectedFacility.title} />
            </div>
            <div className="modal-text">
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