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
        ) : team.length === 0 ? (
          <div style={{textAlign:'center', padding:'50px', color:'#6b7280'}}>
            <i className="fas fa-users" style={{fontSize:'2.5rem', marginBottom:'12px', display:'block', opacity:0.4}}></i>
            <p>No team members found.</p>
          </div>
        ) : (
          <div className="team-grid">
            {team.map((member, index) => (
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
                <div className="member-description">{
                  member.description
                    ? member.description.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim()
                    : ''
                }</div>
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
