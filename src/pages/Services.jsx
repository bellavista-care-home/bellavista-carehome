import React, { useState, useEffect } from 'react';
import '../styles/Services.css';
import SEO from '../components/SEO';
import { fetchCareServices } from '../services/careService';
import { fetchHomes } from '../services/homeService';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [globalServices, homes] = await Promise.all([
          fetchCareServices(),
          fetchHomes()
        ]);

        let combinedServices = [];

        // Add Global Services first
        if (Array.isArray(globalServices)) {
           combinedServices = globalServices.map(s => ({...s, type: 'global'}));
        }

        // Add Home Specific Services (deduplicated by title)
        if (Array.isArray(homes)) {
          homes.forEach(home => {
             if (home.careSectionsJson) {
                try {
                  const sections = typeof home.careSectionsJson === 'string' ? JSON.parse(home.careSectionsJson) : home.careSectionsJson;
                  if (Array.isArray(sections)) {
                     sections.forEach(section => {
                        // Check if showOnPage is true
                        if (section.showOnPage) {
                           // Check if already exists in combinedServices (case-insensitive title match)
                           const exists = combinedServices.some(s => s.title.toLowerCase().trim() === section.title.toLowerCase().trim());
                           if (!exists) {
                              combinedServices.push({
                                 id: `home-${home.id}-${section.title.replace(/\s+/g, '-').toLowerCase()}`,
                                 title: section.title,
                                 description: section.description,
                                 images: section.image ? [section.image] : [],
                                 icon: 'fas fa-heartbeat', // Default icon
                                 slug: section.title.replace(/\s+/g, '-').toLowerCase(),
                                 showOnPage: true,
                                 type: 'home-specific'
                              });
                           }
                        }
                     });
                  }
                } catch (e) {
                   console.error(`Error parsing care sections for home ${home.id}`, e);
                }
             }
          });
        }
        
        setServices(combinedServices);
      } catch (error) {
        console.error("Error loading services", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const visibleServices = services.filter(s => s.showOnPage !== false);

  return (
    <div className="services-page">
      <SEO 
        title="Our Care Services | Bellavista Nursing Homes"
        description="Discover the range of care we provide at Bellavista Nursing Homes, including long term nursing care, dementia care, respite care and palliative care in Cardiff and Barry."
        url="/services"
      />
      <div className="page-header">
        <div className="container">
          <h1>Our Care</h1>
          <p>Professional, Compassionate, and Personalized Care</p>
        </div>
      </div>

      <section className="services-intro">
        <div className="container">
          <div className="intro-content">
            <p className="intro-text">
              Our staff are dedicated to providing specialist care for people in need of long term Nursing, Dementia, and Palliative care, Learning disability, and respite care in a warm and friendly environment. We encourage families to become involved in everything we do from the care planning process.
            </p>

            <div className="care-features">
              <div className="feature-box">
                <h3>Comprehensive Support</h3>
                <ul>
                  <li><i className="fas fa-check-circle"></i>Support for physical health needs</li>
                  <li><i className="fas fa-check-circle"></i>Comfortable accommodation</li>
                  <li><i className="fas fa-check-circle"></i>24-hour care support</li>
                  <li><i className="fas fa-check-circle"></i>Nutritious meals & day-to-day help</li>
                </ul>
              </div>

              <div className="feature-box">
                <h3>Specialist Nursing</h3>
                <p style={{ marginBottom: '15px' }}>
                  Our care homes provide additional care from registered nurses and specialist support for residents living with dementia and nursing needs.
                </p>
                <p>
                  We help people settle into their new home by working with you and your family to document important life details, creating a care package as individual as you are.
                </p>
              </div>
            </div>

            <div className="cta-box">
              <p>
                Please see the different elements of nursing care we provide in our nursing homes below, and <a href="/contact">contact us</a> for a more detailed quote based on your personal needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="service-details">
        <div className="container">
          {loading ? (
             <div style={{textAlign: 'center', padding: '40px'}}>
               <i className="fas fa-spinner fa-spin" style={{fontSize: '2rem', color: 'var(--primary-blue)'}}></i>
             </div>
          ) : (
            visibleServices.map((service, index) => (
              <div key={service.id} className={`service-item ${index % 2 !== 0 ? 'alt-bg' : ''}`} id={service.slug}>
                <div className="service-content">
                  <div className="service-grid-layout">
                    <div className="service-image">
                        <img 
                          src={(service.images && service.images.length > 0) ? service.images[0] : '/placeholder-care.jpg'} 
                          alt={service.title} 
                          loading="lazy" 
                        />
                    </div>
                    <div className="service-text">
                      <h2>{service.title}</h2>
                      <div dangerouslySetInnerHTML={{ __html: service.description }} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
