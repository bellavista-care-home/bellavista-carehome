import React from 'react';
import '../styles/About.css';
import SEO from '../components/SEO';

const About = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "MedicalOrganization",
      "name": "Bellavista Group Of Nursing Homes",
      "slogan": "A Home From Home - Rated Best in UK",
      "description": "Bellavista Group provides award-winning, top-rated nursing and dementia care across South Wales."
    }
  };

  return (
    <div className="about-page">
      <SEO 
        title="About Bellavista Group | Award-Winning Care Homes in UK"
        description="Bellavista Group is a leading provider of luxury nursing and dementia care in the UK. Learn about our top-rated care homes in Barry and Cardiff."
        url="/about"
        schema={aboutSchema}
      />
      <div className="page-header">
        <div className="container">
          <h1>About Us</h1>
          <p>A Home from Home</p>
        </div>
      </div>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Our Vision</h2>
              <p>
                "To set the benchmark for exceptional care in South Wales, where every resident experiences unmatched dignity, comfort, and personalised attention—creating a home that feels truly theirs."
              </p>
              <h2>Our Values</h2>
              <p>
                "We are guided by compassion, integrity, and excellence, ensuring that every decision, every interaction, and every moment is infused with respect, empathy, and a commitment to the highest standard of care."
              </p>
              <h2>Our Care</h2>
              <p>
                "Our care is holistic, tailored, and attentive, blending expert nursing with emotional and social support, so every resident thrives in an environment that nurtures mind, body, and spirit."
              </p>
              <h2>Our Team</h2>
              <p>
                "Led by dedicated professionals, our team combines expertise, empathy, and innovation, delivering personalised care with warmth, reliability, and a passion for enhancing quality of life."
              </p>
            </div>
            <div className="about-image">
              <img src="/images/hero-care-staff.jpg" alt="Bellavista Staff" />
            </div>
          </div>
        </div>
      </section>

      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <i className="fas fa-heart"></i>
              <h3>Our Mission</h3>
              <p>Bellavista Group Of Nursing Homes aims to provide its service users with a secure, relaxed and homely environment in which their care, well-being and comfort are of prime importance. Good reputation for its friendly warm, caring and relaxed environment – “A home from Home”.</p>
            </div>
            <div className="mv-card">
              <i className="fas fa-eye"></i>
              <h3>Our Vision</h3>
              <p>Carers will strive to preserve and maintain the dignity, individuality and privacy of all service users within a warm and caring atmosphere and in so doing will be sensitive to the service user’s changing needs. Service users are encouraged to participate in the development of their individual care plans.</p>
            </div>
            <div className="mv-card">
              <i className="fas fa-star"></i>
              <h3>Our Values</h3>
              <ul>
                <li>Compassion & Dignity</li>
                <li>Individuality & Privacy</li>
                <li>Excellence in Care</li>
                <li>Respect & Sensitivity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
