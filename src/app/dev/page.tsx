"use client";

import { useState } from "react";
import Layout from "../default_layout";
import ThreeScene from "./render/page";
const heroSectionStyle: React.CSSProperties = {
  padding: '5rem 0',
  textAlign: 'center',
  background: '#333',
  color: '#fff',
  position: 'relative',
};
const headingStyle: React.CSSProperties = {
  fontSize: '3.5rem',
  fontWeight: '700',
  textShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
  color: '#ff6347',
};
const paragraphStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  maxWidth: '800px',
  margin: '0 auto',
  lineHeight: '1.6',
  fontWeight: '400',
};
const buttonStyle: React.CSSProperties = {
  marginTop: '2rem',
  padding: '1rem 2rem',
  fontSize: '1.2rem',
  backgroundColor: '#ff6347',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  color: '#fff',
  fontWeight: '500',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
};

const DevPage: React.FC = () => {     
  const [initializeThree, setInitializeThree] = useState<boolean>(false);
  let HandleInitializeThree = () => {
    setInitializeThree(!initializeThree);    
  }
  return (
      <Layout>
          <div style={{ background: '#282c34', minHeight: '100vh', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
              {/* Seção de Apresentação Bonita */}
              <section style={heroSectionStyle}>
                  <h1 style={headingStyle}>
                  Bem-vindo ao Meu Mundo 3D
                  </h1>
                  <p style={paragraphStyle}>
                  Mergulhe em uma experiência 3D cativante. Explore as formas rotacionando e se envolva com a beleza dos gráficos interativos. Junte-se a mim em uma jornada através do design e da inovação.
                  </p>
                  <button style={buttonStyle} onClick={HandleInitializeThree}>
                    {!initializeThree? "Comece Sua Aventura": "Finalizar Aventura"}                                      
                  </button>
                  
              </section>
              {/* Seção do Canvas */}
              <section style={{ position: 'relative', height: '60vh', display: (initializeThree? 'block': 'none')}}>                  
                  {<ThreeScene />}
              </section>     

              <script about="fix three bug">
                console.log(window.document)
              </script>               
          </div>      
      </Layout>
  );
}
  


export default DevPage;