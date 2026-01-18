import React from 'react';
import '../styles/About.css';
import SEO from '../components/SEO';

const OurVision = () => {
  return (
    <div className="about-page">
      <SEO 
        title="Our Vision | Bellavista Nursing Homes"
        description="Read the vision of Bellavista Nursing Homes and how we work to preserve dignity, individuality and privacy for every resident."
        url="/our-vision"
      />
      <div className="page-header">
        <div className="container">
          <h1>Our Vision</h1>
          <p>Setting the benchmark for exceptional care in South Wales.</p>
        </div>
      </div>

      <section className="about-content">
        <div className="container">
          <div className="vision-content">
            <div className="mv-card full-width">
              <i className="fas fa-eye"></i>
              <h2>Our Vision Statement</h2>
              <p>
                "To set the benchmark for exceptional care in South Wales, where every resident experiences unmatched dignity, comfort, and personalised attention—creating a home that feels truly theirs."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurVision;
