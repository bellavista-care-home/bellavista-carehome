import React from 'react';
import '../styles/Services.css';

const DementiaEnvironment = () => {
  const galleryImages = [
    { src: "/DementiaFriendlyEnvironment/BuyingDress.jpg", alt: "Dementia Friendly Shopping Experience" },
    { src: "/DementiaFriendlyEnvironment/Cafe.jpg", alt: "On-site Café" },
    { src: "/DementiaFriendlyEnvironment/DiningArea.jpg", alt: "Dementia Friendly Dining" },
    { src: "/DementiaFriendlyEnvironment/Library.jpg", alt: "Quiet Library Space" },
    { src: "/DementiaFriendlyEnvironment/wallart.jpg", alt: "Stimulating Wall Art" },
    { src: "/DementiaFriendlyEnvironment/wallposters.jpg", alt: "Themed Wall Posters" }
  ];

  return (
    <div className="services-page">
      <div className="page-header dementia-header">
        <div className="container">
          <h1>Living Well – Dementia Care at Bellavista</h1>
          <p>Designed for independence, comfort, and meaningful connection every day.</p>
        </div>
      </div>

      <section className="services-intro" style={{ padding: '60px 0', background: '#fff' }}>
        <div className="container">
          <div className="intro-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            <div className="quote-box" style={{ 
              textAlign: 'center', 
              marginBottom: '50px',
              position: 'relative' 
            }}>
              <i className="fas fa-quote-left" style={{ 
                fontSize: '2rem', 
                color: 'var(--color-primary)', 
                opacity: 0.2, 
                marginBottom: '20px',
                display: 'block'
              }}></i>
              <p style={{ 
                fontSize: '1.4rem', 
                lineHeight: '1.8', 
                color: '#333', 
                fontStyle: 'italic',
                fontWeight: '300'
              }}>
                "Quality of life is shaped by the environment around us, especially for those living with dementia."
              </p>
            </div>

            <div className="philosophy-card" style={{ 
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
              padding: '40px', 
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              borderLeft: '5px solid var(--color-primary)'
            }}>
              <h3 style={{ 
                color: 'var(--color-primary)', 
                marginBottom: '20px', 
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <i className="fas fa-heart"></i>
                Our Passion & Commitment
              </h3>
              <p style={{ 
                fontSize: '1.15rem', 
                lineHeight: '1.7', 
                color: '#555',
                marginBottom: 0
              }}>
                At Bellavista, we create spaces that empower residents, helping them live as independently, confidently, and comfortably as possible. Every detail of our home – from layout and lighting to colour schemes and sensory elements – is designed to reduce stress, inspire engagement, and provide a safe, welcoming environment.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="service-details">
        <div className="container">
          
          {/* Awareness & Environment */}
          <div className="service-item">
            <div className="service-content">
              <div className="service-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                <div className="service-text">
                  <div className="icon-box">
                    <i className="fas fa-hand-holding-heart"></i>
                  </div>
                  <h2>Person-Centred Dementia Care</h2>
                  <p>
                    We believe dementia care is about more than routines and support; it is about creating meaningful experiences. Personal touches, such as memory boxes, personalised rooms, and familiar objects, are integrated throughout the home to help residents feel secure, connected, and valued.
                  </p>
                  <p>
                    Our home is carefully designed to be dementia friendly, with features that support people with visual, hearing, and mobility impairments. Themed areas, calming colours, and familiar cues create a safe, homely, and easily understood environment that reduces stress and builds confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Staff & 3D Areas */}
          <div className="service-item alt-bg">
            <div className="service-content">
              <div className="service-text">
                <div className="icon-box">
                  <i className="fas fa-user-nurse"></i>
                </div>
                <h2>Expertise, Therapies & Relaxation Spaces</h2>
                <p>
                  Our team is highly trained and passionate about dementia care. We continually research and apply the latest practices, therapies, and technologies to provide innovative, evidence-based support that fosters independence and promotes wellbeing.
                </p>
                <p>
                  Dedicated therapy and relaxation spaces – including movie rooms, meditation areas, and comfort zones – provide opportunities for mindfulness, sensory engagement, and calm reflection. Throughout the home, interactive and themed areas are designed to inspire memories and encourage conversations.
                </p>
              </div>
            </div>
          </div>

          {/* Community Event */}
          <div className="service-item">
            <div className="service-content">
              <div className="icon-box">
                <i className="fas fa-users"></i>
              </div>
              <h2>Community and Connection</h2>
              <p>
                Living well with dementia is not just about care inside the home – it is about being part of a connected community. Bellavista has a proud history of community engagement initiatives, helping local residents, families, and businesses understand dementia and support those living with it.
              </p>
              <p>
                We work closely with Alzheimer’s Society, Social Services, the Local Health Board, and Cardiff Council to share knowledge and promote dementia awareness across the wider community. Our events and awareness programmes foster inclusivity and encourage communities to be welcoming, informed, and supportive.
              </p>
              <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                <p style={{ fontStyle: 'italic', margin: 0 }}>
                  At Bellavista, we are committed to enhancing the lives of people living with dementia, supporting independence, engagement, and wellbeing every day, while connecting residents and families to wider support networks.
                </p>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="gallery-section" style={{ marginTop: '60px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--color-primary)' }}>Our Dementia Friendly Spaces</h2>
            <div className="gallery-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {galleryImages.map((img, index) => (
                <div key={index} className="gallery-item" style={{ 
                  borderRadius: '10px', 
                  overflow: 'hidden', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease'
                }}>
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                  <div className="gallery-caption" style={{ padding: '15px', background: '#fff', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: '500', color: '#555' }}>{img.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default DementiaEnvironment;
