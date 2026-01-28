import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Activities.css';
import SEO from '../components/SEO';

const Activities = () => {
  const { locationId } = useParams();
  const [selectedActivity, setSelectedActivity] = useState(null);

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
  const pageTitle = locationName ? `Activities at ${locationName}` : 'Life at Bellavista – Engaging Activities for Every Interest';
  const pageHeaderTitle = locationName ? `Activities at ${locationName}` : 'Life at Bellavista';

  const activities = [
    { title: 'Community Events', description: 'We regularly host community events like our famous Bollywood Night and Family Fun Days.', image: '/activities/community-events.jpg', details: 'Our community events bring together residents, families, and the local community for days of fun, food, and entertainment.' },
    { title: 'Holiday Celebrations', description: 'Every holiday is special at Bellavista, from Christmas to Remembrance Day, we celebrate together.', image: '/activities/holiday-celebrations.jpg', details: 'We celebrate all major holidays with special meals, decorations, and themed activities to ensure everyone feels the festive spirit.' },
    { title: 'Trips & Outings', description: 'Residents enjoy trips to local attractions like St Fagans and the seaside.', image: '/activities/trips-and-outings.jpg', details: 'Regular outings are organized to local places of interest, museums, parks, and the seaside, providing stimulation and enjoyment.' },
    { title: 'Arts & Music', description: 'Creative sessions and music therapy are a core part of our wellness program.', image: '/activities/arts-and-musical-gatherings.jpg', details: 'Music and arts therapy sessions are held weekly, encouraging self-expression and providing therapeutic benefits.' },
    { title: 'Social Gatherings', description: 'Regular coffee mornings, tea parties, and social gatherings to keep spirits high.', image: '/communal-longues.jpg', details: 'Social interaction is key. We host coffee mornings, tea parties, and other social events to foster friendships.' },
    { title: 'Themed Days', description: 'We love dressing up and enjoying themed days with food, music, and decorations.', image: '/activities/themed-days.jpg', details: 'From Hawaiian days to 1950s parties, our themed days are a hit with residents and staff alike.' }
  ];

  const handleCardClick = (activity) => {
    setSelectedActivity(activity);
  };

  const closeModal = () => {
    setSelectedActivity(null);
  };

  return (
    <div className="activities-page">
      <SEO 
        title={pageTitle}
        description={`Discover the engaging activities and social events at ${locationName || 'Bellavista Nursing Homes'}, designed to support wellbeing and happiness.`}
        url={locationId ? `/activities/${locationId}` : "/activities"}
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
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#555', marginTop: '20px' }}>
                Our friendly and highly skilled activity team works closely with residents to identify hobbies and interests that are meaningful to them. Residents can choose quiet one-to-one support, small group sessions, or hands-on experiences such as potting plants in our gardens or cooking projects in our communal areas.
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

      <section className="activities-gallery">
        <div className="container">
          <div className="section-title">
            <h2>Our Activities & Events</h2>
            <p>A glimpse into the vibrant life at {locationName || 'our homes'}</p>
          </div>
          <div className="activities-grid">
            {activities.map((activity, index) => (
              <div key={index} className="activity-card" onClick={() => handleCardClick(activity)}>
                <div className="card-image">
                  <img src={activity.image} alt={activity.title} loading="lazy" />
                  <div className="overlay">
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for Activity Details */}
      {selectedActivity && (
        <div className="activity-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <div className="modal-image">
              <img src={selectedActivity.image} alt={selectedActivity.title} />
            </div>
            <div className="modal-text">
              <h3>{selectedActivity.title}</h3>
              <p className="modal-description">{selectedActivity.details}</p>
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
