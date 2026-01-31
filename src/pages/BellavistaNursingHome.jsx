import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { generateLocalBusinessSchema, locations } from '../utils/schemaUtils';
import { fetchReviews } from '../services/reviewService';
import { Link } from 'react-router-dom';
import '../styles/BellavistaNursingHome.css';

const BellavistaNursingHome = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews();
        setReviews(data.slice(0, 3)); // Show top 3 reviews
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  return (
    <>
      <SEO 
        title="Bellavista Nursing Home - 5-Star Dementia & Elderly Care in South Wales"
        description="Bellavista Nursing Home provides exceptional 5-star dementia care, residential nursing, and elderly care services across South Wales. CQC rated, family-owned since 1998."
        keywords="bellavista nursing home, dementia care cardiff, nursing home barry, elderly care south wales, residential care home, CQC rated care home"
        canonical="https://www.bellavistanursinghomes.com/bellavista-nursing-home"
        schema={generateLocalBusinessSchema(locations.cardiff)}
      />
      <Header />
      
      <main className="bellavista-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1>Bellavista Nursing Home</h1>
            <p className="hero-subtitle">Exceptional 5-Star Dementia & Elderly Care Across South Wales</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">25+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Average Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">6</span>
                <span className="stat-label">Locations</span>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="intro-section">
          <div className="container">
            <h2>Why Choose Bellavista Nursing Home?</h2>
            <p>
              For over 25 years, Bellavista Nursing Home has been the trusted choice for families across South Wales 
              seeking exceptional dementia care, residential nursing, and elderly care services. Our family-owned 
              approach combines clinical excellence with genuine compassion, creating a home-like environment where 
              residents thrive.
            </p>
          </div>
        </section>

        {/* Services Overview */}
        <section className="services-section">
          <div className="container">
            <h2>Our Comprehensive Care Services</h2>
            <div className="services-grid">
              <div className="service-card">
                <h3>Dementia Care</h3>
                <p>Specialized memory care programs with 24/7 trained staff, sensory rooms, and personalized activity plans.</p>
              </div>
              <div className="service-card">
                <h3>Residential Nursing</h3>
                <p>Round-the-clock nursing care with registered nurses, medication management, and chronic condition support.</p>
              </div>
              <div className="service-card">
                <h3>Elderly Care</h3>
                <p>Comprehensive assisted living with personalized care plans, social activities, and nutritional support.</p>
              </div>
              <div className="service-card">
                <h3>Respite Care</h3>
                <p>Short-term stays for recovery, family caregiver breaks, or trial periods before long-term commitment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="locations-section">
          <div className="container">
            <h2>Our South Wales Locations</h2>
            <div className="locations-grid">
              <Link to="/bellavista-cardiff" className="location-card">
                <h3>Bellavista Cardiff</h3>
                <p>Central Cardiff location with premium dementia care facilities and excellent transport links.</p>
                <span className="location-link">View Location →</span>
              </Link>
              <Link to="/bellavista-barry" className="location-card">
                <h3>Bellavista Barry</h3>
                <p>Seaside location specializing in residential nursing and elderly care with coastal views.</p>
                <span className="location-link">View Location →</span>
              </Link>
              <Link to="/meadow-vale-cwtch" className="location-card">
                <h3>Meadow Vale Cwtch</h3>
                <p>Boutique care home focusing on personalized dementia care in a intimate setting.</p>
                <span className="location-link">View Location →</span>
              </Link>
              <Link to="/college-fields-nursing-home" className="location-card">
                <h3>College Fields Nursing Home</h3>
                <p>Modern facility offering comprehensive nursing care and rehabilitation services.</p>
                <span className="location-link">View Location →</span>
              </Link>
              <Link to="/waverley-care-centre" className="location-card">
                <h3>Waverley Care Centre</h3>
                <p>Specialist dementia care center with innovative therapeutic programs.</p>
                <span className="location-link">View Location →</span>
              </Link>
              <Link to="/bellavista-baltimore" className="location-card">
                <h3>Bellavista Baltimore</h3>
                <p>Expansion location bringing Bellavista quality care to new communities.</p>
                <span className="location-link">View Location →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CQC Ratings & Accreditations */}
        <section className="accreditations-section">
          <div className="container">
            <h2>Quality & Accreditations</h2>
            <div className="accreditations-grid">
              <div className="accreditation">
                <h3>CQC Rated</h3>
                <p>All our homes maintain Good or Outstanding ratings from the Care Quality Commission.</p>
              </div>
              <div className="accreditation">
                <h3>Dementia Certified</h3>
                <p>Specialized dementia care certification with trained dementia practitioners.</p>
              </div>
              <div className="accreditation">
                <h3>NHS Partnership</h3>
                <p>Approved provider for NHS-funded nursing care and continuing healthcare.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="container">
            <h2>What Families Say About Bellavista</h2>
            {loading && <div className="loading-reviews">Loading reviews from Google...</div>}
            {error && <div className="error-message">{error}</div>}
            {!loading && !error && reviews.length > 0 && (
              <div className="testimonials-grid">
                {reviews.map((review, index) => (
                  <div key={index} className="testimonial">
                    <div className="stars">
                      {'★'.repeat(review.rating || 5)}
                    </div>
                    <p>"{review.review || review.text}"</p>
                    <span>- {review.name || review.author}, Google Review</span>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && reviews.length === 0 && (
              <div className="testimonials-grid">
                <div className="testimonial">
                  <div className="stars">★★★★★</div>
                  <p>"The care my mother received at Bellavista Cardiff was exceptional. The staff treated her like family."</p>
                  <span>- Sarah J., Daughter</span>
                </div>
                <div className="testimonial">
                  <div className="stars">★★★★★</div>
                  <p>"After visiting multiple homes, Bellavista stood out for their dementia expertise and compassionate approach."</p>
                  <span>- Michael T., Son</span>
                </div>
              </div>
            )}
            <div className="google-reviews-link">
              <a 
                href="https://www.google.com/search?q=Bellavista+Nursing+Homes+South+Wales+Reviews" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-google-review"
              >
                Read More Reviews on Google →
              </a>
            </div>
          </div>
        </section>

        {/* Cost & Funding */}
        <section className="funding-section">
          <div className="container">
            <h2>Transparent Pricing & Funding Options</h2>
            <p>
              We believe in transparent pricing with no hidden costs. Our team can help you navigate:
            </p>
            <ul>
              <li>NHS Continuing Healthcare Funding</li>
              <li>Local Authority Funding Assessments</li>
              <li>Private Pay Options with Flexible Terms</li>
              <li>Respite Care Packages</li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="container">
            <h2>Experience the Bellavista Difference</h2>
            <p>Schedule a personal tour or speak with our care advisors today.</p>
            <div className="cta-buttons">
              <Link to="/schedule-tour" className="btn-primary">Book a Tour</Link>
              <a href="mailto:info@bellavistanursinghomes.com?subject=Request%20Brochure%20-%20Bellavista%20Nursing%20Home&body=Please%20send%20me%20more%20information%20about%20Bellavista%20Nursing%20Home%20services%20and%20facilities." className="btn-secondary">Request Brochure</a>
              <Link to="/" className="btn-secondary">Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default BellavistaNursingHome;