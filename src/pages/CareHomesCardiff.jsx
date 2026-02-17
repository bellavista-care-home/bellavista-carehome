import React from 'react';
import '../styles/About.css';
import SEO from '../components/SEO';

const CareHomesCardiff = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Care Homes in Cardiff | Bellavista Nursing Homes",
    "description": "Information about care homes in Cardiff provided by Bellavista Nursing Homes, including nursing, dementia and respite care.",
    "about": {
      "@type": "MedicalOrganization",
      "name": "Bellavista Nursing Homes"
    }
  };

  return (
    <div className="about-page">
      <SEO
        title="Care Homes in Cardiff | Bellavista Nursing Homes"
        description="Discover person-centred care homes in Cardiff with Bellavista Nursing Homes, offering nursing, dementia, respite and residential care."
        url="/care-homes-cardiff"
        schema={schema}
      />
      <div className="page-header">
        <div className="container">
          <h1>Care Homes in Cardiff</h1>
          <p>Specialist nursing and dementia care in and around Cardiff.</p>
        </div>
      </div>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>High-Quality Care Close to Cardiff</h2>
              <p>
                Bellavista Nursing Homes provides high-quality care for older people living in and
                around Cardiff. Our homes offer a calm, welcoming environment with dedicated teams
                who focus on dignity, comfort and genuine relationships with residents and families.
              </p>
              <p>
                Whether you are looking for long-term nursing care, specialist dementia support or a
                short period of respite, our team can guide you through the options and help you
                find the right home near Cardiff.
              </p>

              <h2>Types of Care We Provide</h2>
              <p>Across our homes serving the Cardiff area, we provide:</p>
              <ul>
                <li>Nursing care for people with complex health needs.</li>
                <li>Residential care for those who need support with daily living.</li>
                <li>Specialist dementia care in a safe, reassuring environment.</li>
                <li>Respite and short stays to give families a break or support recovery.</li>
                <li>Palliative and end-of-life care delivered with compassion.</li>
              </ul>

              <h2>Life in Our Cardiff-Area Homes</h2>
              <p>
                Life in a Bellavista home is about much more than clinical care. Residents enjoy
                meaningful activities, home-cooked meals, social events and time outdoors wherever
                possible. Our activity coordinators create varied programmes that reflect residents&apos;
                interests and life stories.
              </p>
              <p>
                Families and friends are welcome to visit, take part in events and stay closely
                involved in their loved one&apos;s care. We believe in open communication and work in
                partnership with relatives to support each resident as an individual.
              </p>

              <h2>Choosing a Care Home in Cardiff</h2>
              <p>
                Choosing a care home can feel overwhelming. Our team is here to answer questions,
                arrange visits and guide you through the assessment and admission process. We can
                also discuss funding options and signpost you to independent advice where needed.
              </p>
              <p>
                To learn more about our care homes serving Cardiff, or to arrange a visit, please
                contact us using the enquiry form or call the home directly. We will be happy to
                talk through your situation and how we can help.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareHomesCardiff;

