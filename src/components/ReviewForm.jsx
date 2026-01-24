import React, { useState } from 'react';
import '../styles/ReviewForm.css';
import { submitReview } from '../services/reviewService';

const ReviewForm = ({ locationName, googleReviewUrl }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmittedReview, setLastSubmittedReview] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await submitReview({
        name: formData.name,
        email: formData.email,
        review: formData.review,
        rating,
        location: locationName || 'Bellavista Nursing Homes',
        source: 'website'
      });

      setLastSubmittedReview(formData.review);
      setSubmitted(true);
      setFormData({ name: '', email: '', review: '' });
      setRating(0);
    } catch {
      setError('Something went wrong while submitting your review. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyAndRedirect = async () => {
    try {
      await navigator.clipboard.writeText(lastSubmittedReview);
      setCopySuccess(true);
      
      setTimeout(() => {
        // Open a centered popup window
        const width = 800;
        const height = 800;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        window.open(
          googleReviewUrl, 
          'GoogleReview', 
          `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
        );
      }, 800);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback: just open the URL in a new tab
      window.open(googleReviewUrl, '_blank');
    }
  };

  return (
    <div className="review-form-container">
      <h3>Write a Review for {locationName || 'Bellavista'}</h3>
      {submitted ? (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <p>Thank you for your review! It has been submitted for approval.</p>
          {googleReviewUrl && (
            <div className="google-review-promo" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
              <p style={{ marginBottom: '15px', fontSize: '0.95rem', color: '#555' }}>
                We'd love for you to share this on Google too!
              </p>
              <button 
                type="button" 
                onClick={handleCopyAndRedirect}
                style={{ 
                  backgroundColor: '#fff', 
                  color: '#4285F4', 
                  border: '1px solid #4285F4', 
                  padding: '10px 20px', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {copySuccess ? (
                  <>
                    <i className="fas fa-check"></i> Copied! Opening Google...
                  </>
                ) : (
                  <>
                    <i className="fab fa-google"></i> Copy Text & Post on Google
                  </>
                )}
              </button>
              <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>
                This will copy your review to your clipboard and open our Google page so you can easily paste it.
              </p>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="review-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="rating-input">
            <label>Your Rating:</label>
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={ratingValue <= (hover || rating) ? "on" : "off"}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <span className="star">&#9733;</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Your Email"
            />
          </div>

          <div className="form-group">
            <label>Review</label>
            <textarea
              required
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              placeholder="Share your experience..."
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className="submit-review-btn" disabled={submitting || rating === 0}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
          
          {googleReviewUrl && (
            <div className="google-review-option" style={{ marginTop: '15px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <span style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#666' }}>Or review us directly on Google</span>
              <button 
                type="button" 
                onClick={() => window.open(googleReviewUrl, '_blank')}
                style={{ 
                  backgroundColor: '#fff', 
                  color: '#4285F4', 
                  border: '1px solid #4285F4', 
                  padding: '8px 16px', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500'
                }}
              >
                <i className="fab fa-google"></i> Write a Google Review
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
