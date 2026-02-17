import React from 'react';
import '../styles/About.css';
import SEO from '../components/SEO';

const DementiaCareGuide = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Dementia Care Guide | Bellavista Nursing Homes",
    "description": "A practical guide to dementia care, including symptoms, support options and how Bellavista Nursing Homes can help families.",
    "author": {
      "@type": "Organization",
      "name": "Bellavista Nursing Homes"
    }
  };

  return (
    <div className="about-page">
      <SEO
        title="Dementia Care Guide | Bellavista Nursing Homes"
        description="Understand dementia care options, symptoms and support with this practical guide from Bellavista Nursing Homes."
        url="/dementia-care-guide"
        schema={schema}
      />
      <div className="page-header">
        <div className="container">
          <h1>Dementia Care Guide</h1>
          <p>Practical information and support for families living with dementia.</p>
        </div>
      </div>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Understanding Dementia</h2>
              <p>
                Dementia is a term used to describe a group of symptoms that affect memory,
                thinking, behaviour and the ability to perform everyday activities. It is caused by
                different diseases of the brain, including Alzheimer&apos;s disease, vascular
                dementia, Lewy body dementia and others.
              </p>
              <p>
                Symptoms can include memory loss, confusion, changes in mood or personality,
                difficulty with language and problems with planning or decision-making. These
                symptoms usually develop slowly and worsen over time.
              </p>

              <h2>When Extra Support May Be Needed</h2>
              <p>
                Many people with dementia are supported at home by family, friends and community
                services. Over time, however, it may become harder to manage safely at home. Signs
                that extra support may be needed include:
              </p>
              <ul>
                <li>Increased falls, wandering or risk of getting lost.</li>
                <li>Difficulty managing personal care, medication or meals.</li>
                <li>Changes in behaviour that are hard to manage or distressing.</li>
                <li>Carers feeling exhausted, unwell or unable to continue safely.</li>
                <li>Frequent hospital admissions or concerns from health professionals.</li>
              </ul>

              <h2>Dementia Care in a Nursing Home</h2>
              <p>
                Dementia care in a nursing home can provide a safe, structured environment with
                24-hour support from trained staff. At Bellavista Nursing Homes, we focus on
                creating a calm, familiar atmosphere where residents feel secure and valued.
              </p>
              <p>
                Our teams use person-centred approaches, getting to know each resident&apos;s life
                history, preferences and routines. This helps us to understand what matters most to
                them and to respond sensitively to changes in mood or behaviour.
              </p>

              <h2>How We Support Families</h2>
              <p>
                A dementia diagnosis affects the whole family. We aim to work in partnership with
                relatives, keeping you informed, involving you in decisions and offering practical
                and emotional support.
              </p>
              <p>
                You are welcome to visit, join activities and share information that helps us care
                for your loved one in the best possible way. Our team can also signpost you to
                specialist dementia charities and local support groups.
              </p>

              <h2>Next Steps</h2>
              <p>
                If you are considering dementia care in a nursing home, it can help to talk things
                through with a member of our team. We can explain how the assessment process works,
                what to expect from life in a dementia-friendly home and which funding options may
                be available.
              </p>
              <p>
                To find out more, please contact us to speak to a manager or arrange a visit. We
                are here to listen, answer questions and support you in making the right decision
                for your family.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DementiaCareGuide;

