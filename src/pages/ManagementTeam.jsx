import React, { useState, useEffect } from 'react';
import '../styles/ManagementTeam.css';
import { fetchManagementTeam } from '../services/managementService';
import SEO from '../components/SEO';

const ManagementTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Management Team | Bellavista Nursing Homes",
    "description": "Meet the management team at Bellavista Nursing Homes who lead our care, quality and resident experience.",
    "about": {
      "@type": "Organization",
      "name": "Bellavista Nursing Homes"
    }
  };

  const legacyTeam = [
    {
      name: "Helen Randall",
      role: "Home Manager",
      description: "Dedicated to ensuring the highest standards of care and operational excellence across our homes."
    },
    {
      name: "Emma Pinnell",
      role: "Deputy Manager",
      description: "Supporting the management team and staff to deliver person-centred care to all residents."
    },
    {
      name: "Bellavista Directors",
      role: "Directors",
      description: "As a family-owned business, the directors are fully involved in the daily management and strategic direction of the homes."
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchManagementTeam();
        setTeam(data);
      } catch (err) {
        console.error("Failed to load management team", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const displayTeam = (team && team.length > 0) ? team : legacyTeam;

  return (
    <>
      <SEO 
        title="Management Team | Bellavista Nursing Homes"
        description="Meet the management team at Bellavista Nursing Homes, leading our homes with experience, compassion and a commitment to quality care."
        url="/management-team"
        schema={schema}
      />
    <div className="team-page">
      <div className="team-header">
        <div className="container">
          <h1>Management Team</h1>
          <p>Meet the dedicated leaders behind Bellavista Nursing Home</p>
        </div>
      </div>

      <div className="container">
        <div className="team-intro">
          <p>
            Our management team are constantly working front of house and behind the scenes on ways to expand and improve our services. The Management team's roles continue to evolve on a daily basis, and we are a very busy team at Bellavista Nursing Home, however, we are very much one team – all working together to deliver the best care for our residents, and strong support for our staff 24 hours a day.
          </p>
        </div>

        {loading ? (
          <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>
        ) : (
          <div className="team-grid">
            {displayTeam.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-avatar">
                  {member.image ? (
                    <img src={member.image} alt={member.name} style={{width:'120px', height:'120px', borderRadius:'50%', objectFit:'cover'}} />
                  ) : (
                    <i className="fas fa-user-circle"></i>
                  )}
                </div>
                <h3>{member.name}</h3>
                <span className="member-role">{member.role}</span>
                <div dangerouslySetInnerHTML={{ __html: member.description }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ManagementTeam;
