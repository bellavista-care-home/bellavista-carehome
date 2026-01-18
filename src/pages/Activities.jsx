import React, { useState } from 'react';
import '../styles/Activities.css';

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);

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
      <div className="page-header">
        <div className="container">
          <h1>Life at Bellavista – Engaging Activities for Every Interest</h1>
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
              “At Bellavista, we believe that an active, stimulating, and fulfilling lifestyle is central to wellbeing.”
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
            background: 'linear-gradient(to right, #f8f9fa, #e9ecef)', 
            padding: '40px', 
            borderRadius: '15px',
            borderLeft: '5px solid var(--color-primary)',
            marginBottom: '40px'
          }}>
            <h3 style={{ fontSize: '1.4rem', margin: '0 0 20px', color: '#333', textAlign: 'center' }}>
              Why Our Activities Stand Out
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '20px'
            }}>
              <div style={{ fontSize: '0.98rem', lineHeight: '1.6', color: '#444' }}>
                <strong>Personalised programmes</strong> based on individual interests, skills, and wellbeing assessments.
              </div>
              <div style={{ fontSize: '0.98rem', lineHeight: '1.6', color: '#444' }}>
                <strong>Wide variety of activities</strong>, including arts, music, reminiscence therapy, gardening, and gentle exercise.
              </div>
              <div style={{ fontSize: '0.98rem', lineHeight: '1.6', color: '#444' }}>
                <strong>Seasonal and community events</strong> that foster social interaction and engagement within and beyond the home.
              </div>
              <div style={{ fontSize: '0.98rem', lineHeight: '1.6', color: '#444' }}>
                <strong>Skilled, compassionate coordinators</strong> who encourage participation, confidence, and a sense of purpose.
              </div>
              <div style={{ fontSize: '0.98rem', lineHeight: '1.6', color: '#444' }}>
                <strong>Flexible options</strong> for quiet reflection, group interaction, or hands-on projects.
              </div>
              <div style={{ fontSize: '0.98rem', lineHeight: '1.6', color: '#444' }}>
                <strong>Therapeutic, meaningful experiences</strong> that enhance emotional, mental, and social wellbeing.
              </div>
            </div>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#444', margin: 0, textAlign: 'center' }}>
              At Bellavista, every activity is designed with the resident in mind – to stimulate the mind, nurture the body, and enrich the spirit, creating a vibrant, supportive, and inspiring environment for all.
            </p>
          </div>

        </div>
      </section>

      <section className="activities-list">
        <div className="container">
          <div className="activities-grid">
            {activities.map((activity, index) => (
              <div key={index} className="activity-card" onClick={() => handleCardClick(activity)}>
                <div className="activity-image">
                  <img src={activity.image} alt={activity.title} loading="lazy" />
                </div>
                <div className="activity-content">
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedActivity && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>&times;</button>
            <img src={selectedActivity.image} alt={selectedActivity.title} />
            <h2>{selectedActivity.title}</h2>
            <p>{selectedActivity.details}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 600px;
          width: 90%;
          position: relative;
        }
        .modal-content img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .close-modal {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 30px;
          border: none;
          background: none;
          cursor: pointer;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Activities;
