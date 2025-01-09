// app/layout.tsx (or you can name it Layout.tsx based on your folder structure)
import React from 'react';
import Header from './components/Header';  // Make sure the path is correct
import Footer from './components/Footer';  // Make sure the path is correct


interface LayoutProps {
  children: React.ReactNode;  // This will hold the content of each page
}

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
