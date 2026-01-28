import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Facilities.css';
import SEO from '../components/SEO';

const Facilities = () => {
  const { locationId } = useParams();

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

  const facilities = [
    { title: 'Reception', image: '/facilities/reception-facility.jpeg' },
    { title: 'Lounge Area', image: '/facilities/lounge-area.jpg' },
    { title: 'Dining Room', image: '/facilities/dining-room.jpg' },
    { title: 'Private Room', image: '/facilities/private-room.jpg' },
    { title: 'Garden', image: '/facilities/garden-facility.jpeg' },
    { title: 'Outdoor Terrace', image: '/facilities/outdoor-terrace.jpg' },
    { title: 'Activity Room', image: '/facilities/activity-room.jpg' },
    { title: 'Cinema', image: '/facilities/cinema-facility.jpeg' },
    { title: 'Library', image: '/facilities/library-facility.jpeg' },
    { title: 'Arts & Crafts', image: '/facilities/arts-facility.jpg' },
    { title: 'Music Therapy', image: '/facilities/music-therapy.jpeg' },
    { title: 'Wellness Spa', image: '/facilities/wellness-spa.jpg' },
    { title: 'Physiotherapy', image: '/facilities/physiotherapy-room.jpg' },
    { title: 'Medical Suite', image: '/facilities/medical-suite.jpg' },
    { title: 'Kitchen', image: '/facilities/kitchen-area.jpg' },
    { title: 'Laundry Service', image: '/facilities/laundry-service.jpg' }
  ];

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
          <div className="gallery-grid">
            {facilities.map((facility, index) => (
              <div key={index} className="gallery-item">
                <div className="image-wrapper">
                  <img src={facility.image} alt={facility.title} loading="lazy" />
                </div>
                <h3>{facility.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Facilities;
