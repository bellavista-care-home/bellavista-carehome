import React from 'react';
import '../styles/Testimonials.css';
import ReviewForm from '../components/ReviewForm';

const Testimonials = () => {
  const reviews = [
    {
      text: "Bellavista Nursing Home is an established and trusted Nursing Care provider in South Wales area, reputed for its friendly, warm, caring and relaxed environment 'A Home from home'.",
      author: "Bellavista Group",
      role: "Our Philosophy"
    },
    {
      text: "At the Waverley we know that little things make all the difference to our lives – a smiling face in the morning, a trip outside when the sun is shining, staff who have time to stop and chat. In short, a home where we go the extra mile to ensure the comfort and happiness of our residents.",
      author: "Waverley Care Centre",
      role: "Care Team"
    },
    {
      text: "Home is highly recommended by residents and relatives alike, our homes provide a safe, comfortable and stimulating environment that enable our highly trained staff to provide the best possible care.",
      author: "Relative",
      role: "Testimonial"
    },
    {
      text: "The atmosphere at Baltimore House is warm and friendly so you are more than welcome to arrange to have a look around if you or your loved one is looking for care.",
      author: "Baltimore House",
      role: "Visitor"
    }
  ];

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
        <div className="testimonials-grid">
          {reviews.map((review, index) => (
            <div key={index} className="testimonial-card">
              <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
              <p className="review-text">{review.text}</p>
              <div className="review-author">
                <h4>{review.author}</h4>
                <span>{review.role}</span>
              </div>
            </div>
          ))}
        </div>
        
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
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ReviewForm 
            locationName="Bellavista Nursing Homes" 
            googleReviewUrl="https://www.google.com/maps/search/?api=1&query=Bellavista+Nursing+Homes+South+Wales"
          />
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
