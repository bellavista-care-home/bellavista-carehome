import React from 'react';
import SEO from '../components/SEO';

const StaffPortal = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Staff Portal | Bellavista Nursing Homes",
    "description": "Internal staff portal for Bellavista Nursing Homes employees.",
    "about": {
      "@type": "Organization",
      "name": "Bellavista Nursing Homes"
    }
  };

  return (
    <>
      <SEO 
        title="Staff Portal | Bellavista Nursing Homes"
        description="Access the internal staff portal for Bellavista Nursing Homes (currently under maintenance)."
        url="/staff-portal"
        schema={schema}
      />
    <div className="staff-portal-page" style={{ padding: '100px 0', textAlign: 'center', minHeight: '60vh' }}>
      <div className="container">
        <h1>Staff Portal</h1>
        <div className="construction-message" style={{ marginTop: '50px' }}>
          <i className="fas fa-tools" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '20px' }}></i>
          <h2>Under Maintenance</h2>
          <p>Modification work is going on for this page…</p>
          <p>Please check back later.</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default StaffPortal;
