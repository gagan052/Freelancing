{/* ================================ Hero Section ================================*/}

{/* ================================ Mission Statement ================================*/}

{/* ================================ Team Section ================================*/}

{/* ================================ Values Section ================================*/}

{/* ================================ Impact Stats ================================*/}

{/* ================================ Partners Section ================================*/}

{/* ================================ Contact Section ================================*/}

function About() {
  const teamMembers = [
    // ... your team data ...
  ];

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">About EnableFreelance</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-6">
          EnableFreelance is the premier platform connecting talented individuals with disabilities 
          to inclusive employers worldwide. Our mission is to empower and showcase the unique skills 
          of our community, fostering a diverse and equitable workforce.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Current Status</h2>
        <p>
          Globally, individuals with disabilities often face significant employment challenges, 
          including limited access to opportunities and workplace accommodations. EnableFreelance 
          is making strides by creating income-generating opportunities across various sectors.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Our Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Sign Language Recognition using YOLOv5 technology</li>
          <li>Voice-Controlled Interface for enhanced accessibility</li>
          <li>Fully accessible platform design following WCAG guidelines</li>
          <li>Specialized support for different abilities</li>
          <li>Fair and transparent hiring practices</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
        <p>
          Have questions or suggestions? We'd love to hear from you. Reach out to our team at{' '}
          <a href="mailto:support@enablefreelance.com" className="text-purple-600 hover:text-purple-500">
            support@enablefreelance.com
          </a>
        </p>
      </div>

      <div className="team-section">
        <h2>Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div 
              className="team-card"
              key={index}
              style={{ backgroundImage: `url(${member.image})` }}
            >
              <div className="team-card-overlay">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <div className="social-links">
                  {/* Add social icons */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About; 