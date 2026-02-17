import React from 'react';
import '../styles/About.css';
import SEO from '../components/SEO';

const TermsOfService = () => {
  return (
    <div className="about-page">
      <SEO
        title="Terms of Use | Bellavista Nursing Homes"
        description="Read the terms and conditions for using the Bellavista Nursing Homes website and online services."
        url="/terms-of-service"
      />
      <div className="page-header">
        <div className="container">
          <h1>Terms of Use</h1>
          <p>Important information about using our website and online services.</p>
        </div>
      </div>

      <section className="about-content">
        <div className="container">
          <h2>1. Acceptance Of These Terms</h2>
          <p>
            By accessing or using the Bellavista Nursing Homes website, you agree to be bound by
            these Terms of Use. If you do not agree, please do not use this website.
          </p>

          <h2>2. Website Content</h2>
          <p>
            The information on this website is provided for general guidance about our homes and
            services. While we take care to keep information accurate and up to date, it does not
            constitute medical, financial, or legal advice and should not be relied upon as such.
          </p>

          <h2>3. Use Of Our Website</h2>
          <p>When using this website, you agree that you will not:</p>
          <ul>
            <li>Use the site for any unlawful or fraudulent purpose.</li>
            <li>Attempt to gain unauthorised access to our systems or data.</li>
            <li>Introduce viruses, malware, or other harmful code.</li>
            <li>Use automated systems to access or scrape content without permission.</li>
          </ul>

          <h2>4. Enquiries, Forms, And Online Submissions</h2>
          <p>
            When you submit information through our enquiry forms, tour bookings, or job
            applications, you confirm that the information you provide is accurate and that you have
            permission to share it. All personal information is handled in accordance with our
            Privacy Policy.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            Unless otherwise stated, all content on this website, including text, images, graphics,
            logos, and layout, is owned by or licensed to Bellavista Nursing Homes. You may view,
            download, and print content for personal, non-commercial use only. Any other use
            requires our prior written permission.
          </p>

          <h2>6. Links To Other Websites</h2>
          <p>
            Our website may contain links to third-party websites, such as regulators, review
            sites, and partners. These sites are not controlled by us, and we are not responsible
            for their content or privacy practices.
          </p>

          <h2>7. Limitation Of Liability</h2>
          <p>
            To the fullest extent permitted by law, Bellavista Nursing Homes will not be liable for
            any loss or damage arising from your use of this website or reliance on its content,
            including indirect or consequential loss.
          </p>

          <h2>8. Changes To These Terms</h2>
          <p>
            We may update these Terms of Use from time to time. Any changes will be published on
            this page and become effective immediately upon posting. Continued use of the website
            after changes are made indicates your acceptance of the updated terms.
          </p>

          <h2>9. Contact</h2>
          <p>
            If you have any questions about these Terms of Use, please contact us via the details
            on our Contact page.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;

