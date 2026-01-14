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

      setSubmitted(true);
      setFormData({ name: '', email: '', review: '' });
      setRating(0);
    } catch {
      setError('Something went wrong while submitting your review. Please try again later.');
    } finally {
      setSubmitting(false);
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
            <p>
              You can also share your feedback on Google by{' '}
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noreferrer"
              >
                leaving a Google review
              </a>
              .
            </p>
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
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
