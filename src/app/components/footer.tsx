"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer style={footerStyles}>
      <div style={footerContentStyles}>
        <p style={footerTextStyles}>© 2024 Goffi Portfolio. All rights reserved.</p>
        <div style={socialLinksStyles}>
          <a href="https://github.com/pedroGoffi" target="_blank" rel="noopener noreferrer" style={socialLinkStyles}>GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={socialLinkStyles}>LinkedIn</a>
          <a href="mailto:email@example.com" style={socialLinkStyles}>Email</a>
        </div>
      </div>
    </footer>
  );
};

const footerStyles: React.CSSProperties = {
  backgroundColor: "#333",
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


export default Footer;
