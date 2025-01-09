"use client";
import React from 'react';



interface LayoutProps {
  children: React.ReactNode;  // This will hold the content of each page
}

const Header: React.FC = () => {
  return (
    <header style={headerStyles}>
      <div style={logoStyles}>
        <h1>Goffi Portfolio</h1>
      </div>
      <nav style={navStyles}>
        <ul style={navListStyles}>
          <li style={navItemStyles}><a href="#home" style={linkStyles}>Home</a></li>
          <li style={navItemStyles}><a href="#about" style={linkStyles}>About</a></li>
          <li style={navItemStyles}><a href="#projects" style={linkStyles}>Projects</a></li>
          <li style={navItemStyles}><a href="#contact" style={linkStyles}>Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

const headerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#333",
  color: "#fff",
};

const logoStyles: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
};

const navStyles: React.CSSProperties = {
  display: "flex",
};

const navListStyles: React.CSSProperties = {
  display: "flex",
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const navItemStyles: React.CSSProperties = {
  margin: "0 10px",
};

const linkStyles: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
  transition: "color 0.3s",
};


const Footer: React.FC = () => {
  return (
    <footer style={footerStyles}>
      <div style={footerContentStyles}>
        <p style={footerTextStyles}>© 2024 Goffi Portfolio. All rights reserved.</p>
        <div style={socialLinksStyles}>
          <a href="https://github.com/pedroGoffi" target="_blank" rel="noopener noreferrer" style={socialLinkStyles}>GitHub</a>
          <a href="https://www.linkedin.com/in/pedro-henrique-goffi-de-paulo-bb0426230/" target="_blank" rel="noopener noreferrer" style={socialLinkStyles}>LinkedIn</a>
          <a href="mailto:pedrohgdepauloc@gmail.com" style={socialLinkStyles}>Email</a>
        </div>
      </div>
    </footer>
  );
};

const footerStyles: React.CSSProperties = {
  backgroundColor: "#222",
  color: "#fff",
  padding: "20px 0",
  textAlign: "center",
  width: "100%",
};

const footerContentStyles: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const footerTextStyles: React.CSSProperties = {
  marginBottom: "10px",
};

const socialLinksStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
};

const socialLinkStyles: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
  transition: "color 0.3s",
};



const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <main style={{ flex: 1, textAlign: "center", padding: "20px" }}>
        {children}  {/* Render the page content here */}
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Layout;
