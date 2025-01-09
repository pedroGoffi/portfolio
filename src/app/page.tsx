"use client";
import React from 'react';
import Link from 'next/link'; // Import Link from Next.js for routing

// Interface for a Project
interface Project {
  id: number;
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  link: string; // Added link for each project
}

const Index: React.FC = () => {
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
    width: '500px',
    height: '400px',
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
    cursor: 'pointer', // Add pointer to indicate it's clickable
  };

  const projectImage: React.CSSProperties = {
    width:      '100%',
    height:     '150px',
    objectFit:  'cover',
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
      imageUrl: "/images/PietraLOGO.webp",  // Caminho para uma imagem representando o Pietra
      imageAlt: "Linguagem de Programação Pietra",
      title: "Pietra - Uma Linguagem que Compila para Binário",
      description: "Pietra é uma linguagem de programação moderna e de baixo nível, projetada para compilar diretamente para binário. Com uma sintaxe simples e recursos poderosos, Pietra permite aos desenvolvedores escrever código eficiente que executa com sobrecarga mínima, proporcionando controle total sobre memória e hardware.",
      link: "/pietra-lang" // Link to the project page
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={heroContainer}>
        {/* Your Photo */}
        <picture>
          <source srcSet="./images/GoffiPicture.webp" type="image/webp" />
          <img 
            src="/images/GoffiPicture.webp" 
            alt="Pedro Henrique Goffi de Paulo"
            style={heroImage} 
            loading="lazy"
          />
        </picture>

        {/* Text Content */}
        <div style={heroText}>
          <h1 style={heroHeading}>Welcome to My Portfolio</h1>
          <div style={heroParagraph}>
            <strong>Idiomas:</strong> PT, ENG, ESP
          </div>
          <div style={heroParagraph}>
            <strong>Desenvolvedor | Parsers e Compiladores | Focado em Web</strong>
          </div>
          <div style={heroParagraph}>
            Desenvolvedor focado em soluções eficientes e escaláveis. Com experiência em parsers e compilers, estou aprimorando minhas habilidades em desenvolvimento web para criar produtos de alto desempenho e fácil manutenção.
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div style={projectsContainer}>
        <h2 style={projectsHeading}>Meus Projetos</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
          {projects.map((project: Project) => (
            <Link key={project.id} href={project.link} style={{ textDecoration: 'none' }}>
              <div style={projectCard}>
                <picture>
                  <source srcSet={project.imageUrl} type="image/webp" />
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
