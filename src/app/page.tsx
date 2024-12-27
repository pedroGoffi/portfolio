"use client";
import React from "react";
import Header from "./components/header"; // Adjust path based on your structure
import Footer from "./components/footer"; // Adjust path based on your structure
import SimplePage from "./components/Index"; // Adjust path if necessary

const Home: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main style={{ flex: 1, textAlign: "center", padding: "20px" }}>
        <SimplePage />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
