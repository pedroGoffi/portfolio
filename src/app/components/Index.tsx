"use client";
import React from 'react';

// Interface for a Project
interface Project {
  id: number;
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
}

const SimplePage: React.FC = () => {
  // Styles as React.CSSProperties
  const heroContainer: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 20px',
    gap: '20px',
    flexWrap: 'wrap',
    background: 'rgba(255, 255, 255, 0.4)', // Transparent background for blur effect
    backdropFilter: 'blur(10px)', // Apply the blur effect
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Optional: Add a soft shadow for a smoother effect
  };

  const heroImage: React.CSSProperties = {
    width: '300px',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
    backdropFilter: 'blur(120px)', // Apply the blur effect
    boxShadow: '0 10px 10px rgba(0, 0, 0, 1)', // Optional: Add a soft shadow for a smoother effect
  };

  const heroText: React.CSSProperties = {
    maxWidth: '600px',
    textAlign: 'left',
  };

  const heroHeading: React.CSSProperties = {
    fontSize: '2.5rem',
    marginBottom: '20px',
  };

  const heroParagraph: React.CSSProperties = {
    fontSize: '1.2rem',
    color: '#555',
    lineHeight: '1.8',
  };

  const projectsContainer: React.CSSProperties = {
    padding: '40px 20px',
  };

  const projectsHeading: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '30px',
  };

  const projectCard: React.CSSProperties = {
    width: '30%',
    textAlign: 'center',
  };

  const projectImage: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
  };

  const projectTitle: React.CSSProperties = {
    marginTop: '15px',
    fontSize: '1.3rem',
  };

  const projectDescription: React.CSSProperties = {
    color: '#555',
    fontSize: '1rem',
  };

  // Sample projects data
  const projects: Project[] = [
    {
      id: 1,
      imageUrl: "/path-to-image1.jpg",
      imageAlt: "Project 1",
      title: "Project 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      id: 2,
      imageUrl: "/path-to-image2.jpg",
      imageAlt: "Project 2",
      title: "Project 2",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      id: 3,
      imageUrl: "/path-to-image3.jpg",
      imageAlt: "Project 3",
      title: "Project 3",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={heroContainer}>
        {/* Your Photo */}
        <picture>
          <source srcSet="/GoffiPicture.webp" type="image/webp" />
          <img 
            src="/GoffiPicture.webp" 
            alt="Your Name"
            style={heroImage} 
            loading="lazy"
          />
        </picture>

        {/* Text Content */}
        <div style={heroText}>
          <h1 style={heroHeading}>Welcome to My Portfolio</h1>
          <p style={heroParagraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>

      {/* Projects Section */}
      <div style={projectsContainer}>
        <h2 style={projectsHeading}>My Projects</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
          {projects.map((project) => (
            <div key={project.id} style={projectCard}>
              <picture>
                <source srcSet={`${project.imageUrl.replace('.jpg', '.webp')}`} type="image/webp" />
                <img 
                  src={project.imageUrl} 
                  alt={project.imageAlt}
                  style={projectImage} 
                  loading="lazy"
                />
              </picture>
              <h3 style={projectTitle}>{project.title}</h3>
              <p style={projectDescription}>{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimplePage;
