import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchHome } from '../services/homeService';
import '../styles/Activities.css';
import SEO from '../components/SEO';

const Activities = () => {
  const { locationId } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [activities, setActivities] = useState([]);

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
  const pageTitle = locationName ? `Activities at ${locationName}` : 'Activities';
  const pageHeaderTitle = locationName ? `Activities at ${locationName}` : 'Life at Bellavista';

  // Map frontend URL slugs to backend IDs
  const backendIdMap = {
    'college-fields-nursing-home': 'college-fields',
    'waverley-care-center': 'waverley-care-centre',
    'meadow-vale-cwtch': 'meadow-vale-cwtch',
    'baltimore-care-home': 'bellavista-baltimore',
  };

  const backendId = backendIdMap[locationId] || locationId;

  useEffect(() => {
    if (backendId) {
      fetchHome(backendId).then(data => {
        if (data) {
          // Process Activities
          if (data.activityImages) {
            const visibleActivities = data.activityImages
              .filter(img => typeof img === 'object' && img.showOnPage)
              .map(img => ({
                title: img.title || 'Activity',
                // Strip HTML tags and replace &nbsp; for the card preview
                description: (img.shortDescription || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' '),
                image: img.url,
                // Keep HTML for modal but replace &nbsp; to fix wrapping issues
                details: (img.fullDescription || img.shortDescription || '').replace(/&nbsp;/g, ' '),
                type: 'activity'
              }));
            setActivities(visibleActivities);
          }
        }
      });
    }
  }, [backendId]);

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedItem]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  if (!locationId) return null;

  return (
    <div className="activities-page">
      <SEO 
        title={pageTitle}
        description={`Discover the engaging activities and facilities at ${locationName || 'Bellavista Nursing Homes'}.`}
        url={`/activities/${locationId}`}
      />
      <div className="page-header">
        <div className="container">
          <h1>{pageHeaderTitle}</h1>
          <p>Active, stimulating, and fulfilling lifestyles that support wellbeing every day.</p>
        </div>
      </div>

      <section className="activities-intro" style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="quote-wrapper" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontStyle: 'italic', 
              color: 'var(--color-primary)', 
              lineHeight: '1.4',
              fontWeight: '300',
              marginBottom: '20px'
            }}>
              “At {locationName || 'Bellavista'}, we believe that an active, stimulating, and fulfilling lifestyle is central to wellbeing.”
            </h2>
            <div style={{ width: '80px', height: '4px', background: 'var(--color-secondary)', margin: '0 auto', borderRadius: '2px' }}></div>
          </div>

          <div className="content-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '50px',
            marginBottom: '60px'
          }}>
            {/* Left Column */}
            <div className="text-col">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ 
                  width: '40px', height: '40px', 
                  background: '#e3f2fd', 
                  borderRadius: '10px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: '15px',
                  color: 'var(--color-primary)'
                }}>
                  <i className="fas fa-heart"></i>
                </div>
                <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#333' }}>Individualised Activity Programmes</h3>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#555' }}>
                Our individualised activity programmes are carefully designed to meet the unique needs, abilities, and preferences of each resident. Using detailed personal profiles, developed from social wellbeing assessments and one-to-one consultations with our highly trained Activities Coordinators, we tailor activities to support both cognitive and physical wellbeing.
              </p>
            </div>

            {/* Right Column */}
            <div className="text-col">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ 
                  width: '40px', height: '40px', 
                  background: '#fff3e0', 
                  borderRadius: '10px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: '15px',
                  color: 'var(--color-secondary)'
                }}>
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#333' }}>Diverse, Inclusive & Flexible</h3>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#555' }}>
                From the moment residents join us, they are invited to explore a wide variety of activities that suit different interests, abilities, and energy levels. Whether it is creative arts, music, reminiscence therapy, gardening, or gentle exercise, there is always an opportunity to participate, relax, or simply enjoy the company of others.
              </p>
            </div>
          </div>

          <div className="feature-banner" style={{ 
            background: 'linear-gradient(135deg, var(--smoky-black), var(--olive-drab))',
            borderRadius: '20px',
            padding: '40px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--bone)' }}>Community & Connection</h3>
              <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
                We maintain strong links with the local community, welcoming schools, performers, and volunteers to our homes. These intergenerational connections bring joy and a sense of belonging to our residents.
              </p>
            </div>
            <div style={{ fontSize: '3rem', opacity: '0.2' }}>
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      {activities.length > 0 && (
      <section className="activities-gallery">
        <div className="container">
          <div className="section-title">
            <h2>Our Activities</h2>
            <p>A glimpse into the vibrant life at {locationName}</p>
          </div>
          <div className="activities-grid">
            {activities.map((item, index) => (
              <div key={`act-${index}`} className="activities-page-card" onClick={() => handleCardClick(item)}>
                <div className="card-image-top">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="overlay">
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <div className="modal-image">
              <img src={selectedItem.image} alt={selectedItem.title} />
            </div>
            <div className="modal-text">
              <h3>{selectedItem.title}</h3>
              <div className="modal-description" dangerouslySetInnerHTML={{ __html: selectedItem.details }} />
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

export default Activities;
