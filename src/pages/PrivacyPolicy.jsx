import React from 'react';
import '../styles/About.css';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  return (
    <div className="about-page">
      <SEO
        title="Privacy Policy | Bellavista Nursing Homes"
        description="Learn how Bellavista Nursing Homes collects, uses, and protects personal data for residents, families, and website visitors."
        url="/privacy-policy"
      />
      <div className="page-header">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>Your privacy and the security of your information are very important to us.</p>
        </div>
      </div>

      <section className="about-content">
        <div className="container">
          <h2>1. Who We Are</h2>
          <p>
            Bellavista Group Of Nursing Homes provides residential, nursing, and dementia care
            services in South Wales. This Privacy Policy explains how we collect, use, store, and
            protect personal information for residents, families, staff, job applicants, and
            visitors to our website.
          </p>

          <h2>2. What Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>Contact details such as name, email address, phone number, and postal address.</li>
            <li>
              Information submitted through enquiry forms, care enquiries, tour bookings, and job
              applications.
            </li>
            <li>
              Health and care-related information where necessary to assess suitability for care
              services, always handled with additional care and confidentiality.
            </li>
            <li>
              Technical information such as IP address, browser type, and pages visited, collected
              via analytics tools and server logs.
            </li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use personal information to:</p>
          <ul>
            <li>Respond to care enquiries and schedule visits or tours.</li>
            <li>Provide and manage care services for residents.</li>
            <li>Process job applications and manage recruitment.</li>
            <li>Improve our services, website experience, and communications.</li>
            <li>Meet legal, regulatory, and safeguarding obligations.</li>
          </ul>

          <h2>4. Legal Bases For Processing</h2>
          <p>We process personal data under the following legal bases:</p>
          <ul>
            <li>Consent, where you have given it to us directly.</li>
            <li>Performance of a contract, for example a care agreement or employment contract.</li>
            <li>Legal obligation, such as complying with health and social care regulations.</li>
            <li>
              Legitimate interests, for example improving our services and ensuring the safety and
              security of residents and staff.
            </li>
          </ul>

          <h2>5. Cookies And Similar Technologies</h2>
          <p>
            Our website uses cookies and similar technologies to provide core functionality,
            enhance security, remember preferences, and understand how the site is used. Essential
            cookies are required for the site to function correctly. Non-essential cookies are used
            only where lawful and, where required, with your consent.
          </p>

          <h2>6. How We Share Your Information</h2>
          <p>
            We do not sell your personal data. We may share information with carefully selected
            third parties where necessary to:
          </p>
          <ul>
            <li>Deliver our care services and manage our business operations.</li>
            <li>Store data securely using reputable hosting and cloud providers.</li>
            <li>Meet our legal and regulatory obligations.</li>
          </ul>
          <p>
            Any third parties are required to keep your information secure and to use it only for
            the purposes we specify.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We keep personal information only for as long as necessary to fulfil the purposes for
            which it was collected, including satisfying legal, accounting, or regulatory
            requirements. Retention periods vary depending on the type of information and relevant
            regulations for health and social care.
          </p>

          <h2>8. Your Rights</h2>
          <p>Under UK data protection law, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate or incomplete information.</li>
            <li>Request deletion of your information in certain circumstances.</li>
            <li>Object to or restrict certain types of processing.</li>
            <li>Withdraw consent where processing is based on consent.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the details below. We may need
            to verify your identity before fulfilling your request.
          </p>

          <h2>9. Data Security</h2>
          <p>
            We implement technical and organisational measures to protect personal data against
            loss, misuse, unauthorised access, alteration, and disclosure. While no system can be
            completely secure, we regularly review our security controls and keep our systems
            updated.
          </p>

          <h2>10. Contact Details</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your data, please
            contact:
          </p>
          <p>
            Bellavista Group Of Nursing Homes
            <br />
            106-108 Tynewydd Road, Barry, CF62 8BB
            <br />
            Email: admin@bellavistacarehomes.com
          </p>

          <h2>11. Changes To This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our
            practices, legal requirements, or for other operational reasons. Any updates will be
            published on this page with an updated revision date.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

