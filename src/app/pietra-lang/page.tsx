import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Layout from '../default_layout';
import Prism from 'prismjs';

// Definindo as palavras-chave personalizadas
const customKeywords = [
  'return', 'if', 'else', 'elif', 'while', 'proc', '::', 'use', '.'
];

// Registrando a linguagem customizada com uma classe para palavras-chave
Prism.languages.pietra = Prism.languages.extend('clike', {
  'keyword': {
    pattern: new RegExp(`\\b(?:${customKeywords.join('|')})\\b`, 'g'),
    alias: 'keyword-pietra', // Classe personalizada para palavras-chave
  }
});

// Adicionando estilo personalizado (em CSS) para a classe 'keyword-pietra'
const customStyles = `
  .keyword-pietra {
    color: yellow; /* Altere a cor aqui conforme necessário */
    font-weight: bold; /* Para tornar a palavra-chave em negrito */
  }
`;

const pietraPage: React.FC = () => {
  const pietraCode = `
use std{std}
use std{stat}

cat :: (filename: imut *i8) std.puts(map_file(filename))
show_help :: ()
{
  std.puts("pcat is created using Pietra_lang\\n")
  std.puts("./pcat filename1 filename2 filename3\\n")
  std.puts("FLAGS:\\n")
  std.puts("    --help: shows this help menu\\n")
  std.puts("    We just have one flag\\n")
}

main :: (argc: i64, argv: mut *cstr)
{
    if argc != 2
    {
      show_help()
      std.puts("Cat err...\\n")
      exit(1)
    }

    cat(argv[1])
}  `;

  return (
    <Layout>
      <style>{customStyles}</style> {/* Adicionando o estilo personalizado no componente */}
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f4f4f9' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Sobre a Linguagem pietra</h1>

        <section style={{ marginBottom: '40px', maxWidth: '800px', margin: 'auto' }}>
          <h2 style={{ color: '#2c3e50' }}>O que é pietra?</h2>
          <p>
            A <strong>pietra</strong> é uma linguagem de programação de baixo nível em construção, desenvolvida para oferecer 
            controle total das operações de sistema. Sua principal proposta é a conversão direta para assembly com um 
            pré-processamento simples, proporcionando maior responsabilidade sobre o comportamento do código. 
            O controle das operações do sistema (syscalls) é centralizado, oferecendo aos desenvolvedores a capacidade 
            de manipular diretamente o fluxo de execução do programa, otimizando o uso dos recursos do hardware.
          </p>
          <p>
            pietra está sendo projetada com foco em uma abordagem minimalista e eficaz para ambientes de baixo nível, 
            permitindo uma comunicação direta com o sistema operacional e a máquina. A sintaxe simples e poderosa 
            garante a clareza no controle de fluxos assíncronos, tornando-a ideal para a construção de programas mais 
            eficientes e com maior desempenho em nível de hardware.
          </p>
        </section>

        <section style={{ marginBottom: '40px', maxWidth: '800px', margin: 'auto' }}>
          <h2 style={{ color: '#2c3e50' }}>Exemplo de Código</h2>
          <div style={{ padding: '20px', backgroundColor: '#282c34', borderRadius: '8px' }}>
            <SyntaxHighlighter language="pietra" style={dracula}>
              {pietraCode}
            </SyntaxHighlighter>
          </div>
        </section>

        <section style={{ marginBottom: '40px', maxWidth: '800px', margin: 'auto' }}>
          <h2 style={{ color: '#2c3e50' }}>Descrição do Exemplo</h2>
          <p>
            No exemplo acima, temos um código simples da linguagem pietra, que inclui o uso de palavras-chave como <code>return</code>, 
            <code>if</code>, <code>else</code>, <code>elif</code>, <code>while</code>, entre outras.
          </p>
          <ul>
            <li><strong>return:</strong> Utilizado para retornar valores de funções.</li>
            <li><strong>if/else/elif:</strong> Condições de controle de fluxo.</li>
            <li><strong>proc:</strong> Definição de funções/procedimentos.</li>
            <li><strong>while:</strong> Loop para execução contínua enquanto a condição for verdadeira.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px', maxWidth: '800px', margin: 'auto' }}>
          <h2 style={{ color: '#2c3e50' }}>Principais Funcionalidades</h2>
          <ul>
            <li><strong>Controle de Fluxo:</strong> Utiliza estruturas como <code>if</code>, <code>else</code>, e <code>while</code>.</li>
            <li><strong>Definição de Funções:</strong> Uso de <code>proc</code> para definir procedimentos ou funções.</li>
            <li><strong>Encadeamento:</strong> Uso de <code>return</code> para devolver resultados das funções.</li>
            <li><strong>Modularidade:</strong> Uso de <code>use</code> para importar bibliotecas ou módulos.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px', maxWidth: '800px', margin: 'auto' }}>
          <h2 style={{ color: '#2c3e50' }}>Conclusão</h2>
          <p>
            A pietra é uma linguagem moderna e poderosa para o desenvolvimento de sistemas de baixo nível. Ela oferece 
            um controle completo das operações de sistema e uma conversão direta para assembly, permitindo que os 
            desenvolvedores tenham maior controle e desempenho nas suas aplicações.
          </p>
          <p>
            Se você está interessado em explorar o desenvolvimento de sistemas mais próximos do hardware, com 
            controle total sobre as operações de sistema, a pietra é uma excelente escolha.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default pietraPage;
