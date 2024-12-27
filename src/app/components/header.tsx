"use client";

import React from "react";

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



export default Header;
