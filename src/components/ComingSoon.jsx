import React from 'react';
import { Link } from 'react-router-dom';

const ComingSoon = () => {
  return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <i className="fas fa-hard-hat" style={{ fontSize: '4rem', color: '#0066cc', marginBottom: '20px' }}></i>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#333' }}>Pontypridd Nursing Home</h1>
        <p style={{ fontSize: '1rem', color: '#0066cc', marginBottom: '20px', fontWeight: '600' }}>
          A Bellavista Group Care Home &mdash; Opening 2027
        </p>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
          Pontypridd Nursing Home is undergoing an extensive redevelopment and transformation
          under the Bellavista Group, emerging as a state-of-the-art nursing home designed to
          meet the evolving needs of modern care.
        </p>
        <p style={{ fontSize: '1.05rem', color: '#666', marginBottom: '20px', lineHeight: '1.7' }}>
          Located in the heart of the Pontypridd area, the home will reopen in 2027 with a
          refreshed identity, enhanced facilities, and significantly expanded capacity. Inspired
          by the design and advanced care model of our flagship Waverley Care Centre, the new
          Pontypridd Nursing Home will offer innovative nursing care solutions, specialist
          services, and an enriched living environment that promotes dignity, comfort, and
          independence.
        </p>
        <p style={{ fontSize: '1.05rem', color: '#666', marginBottom: '20px', lineHeight: '1.7' }}>
          The redevelopment will introduce modern accommodation, advanced care options, and
          improved therapeutic and social spaces, creating a welcoming, home-like atmosphere
          supported by the highest professional standards. Our experienced multidisciplinary
          teams will deliver personalised care plans tailored to individual needs, ensuring
          safety, wellbeing, and quality of life.
        </p>
        <p style={{ fontSize: '1.05rem', color: '#666', marginBottom: '30px', lineHeight: '1.7' }}>
          Opening in 2027, Pontypridd Nursing Home will represent the next chapter in
          Bellavista&rsquo;s vision, bringing trusted expertise, compassionate care, and
          contemporary living together in one exceptional setting.
        </p>
        <Link to="/" className="btn btn-primary" style={{ 
          display: 'inline-block', 
          background: '#0066cc', 
          color: 'white', 
          padding: '12px 30px', 
          borderRadius: '30px', 
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'transform 0.2s'
        }}>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
