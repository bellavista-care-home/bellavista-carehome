import React, { useState, useEffect } from 'react';
import '../styles/Testimonials.css';
import { fetchReviews } from '../services/reviewService';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews();
        setReviews(data);
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
    <div className="testimonials-page">
      <div className="testimonials-header">
        <div className="container">
          <h1>Testimonials</h1>
          <p>Trusted by Residents. Valued by Families.</p>
        </div>
      </div>

      <div className="container">
        <div className="testimonials-intro">
          <p>
            The experiences shared by our residents and their loved ones reflect the compassion, dedication, and exceptional standards that define life at Bellavista Nursing Home. Each testimonial represents a relationship built on trust, reassurance, and genuine care, offering comfort to families and a sense of belonging to those who call Bellavista home.
          </p>
        </div>
        
        {loading && <div className="loading-spinner">Loading reviews...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {!loading && !error && (
          <div className="testimonials-grid">
            {reviews.map((review, index) => (
              <div key={index} className="testimonial-card">
                <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                <p className="review-text">{review.review || review.text}</p>
                <div className="review-author">
                  <h4>{review.name || review.author}</h4>
                  <span>{review.location || review.role || 'Resident / Family'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="carehome-review-badge">
          <h3>Top Rated Care Home</h3>
          <p>
            We are honoured to be recognised as one of South Wales’s leading care providers, a reflection of our unwavering commitment to excellence, compassion, and integrity. This recognition is built upon consistently high standards, dedicated professionals, and a genuine focus on the comfort, dignity, and wellbeing of every resident. At Bellavista, quality care is not just delivered—it is continuously upheld and proudly lived every day.
          </p>
          <div className="stars">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
          </div>
        </div>
        
        <div className="testimonials-cta">
          <h3>Have an experience to share?</h3>
          <p>We value your feedback. Please let us know about your experience with Bellavista Nursing Homes.</p>
          <a 
            href="https://www.google.com/search?q=Bellavista+Nursing+Homes+South+Wales+Reviews" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-google-review"
          >
            <i className="fab fa-google"></i> Review on Google
          </a>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
