// pages/404.tsx
'use client';
import { motion } from "framer-motion";
import "@css/globals.css"

const Block404 = () => (
  <div className="relative text-center p-12 max-w-lg bg-white/20 rounded-2xl shadow-xl backdrop-blur-2xl z-10">
    <motion.h1
      className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-500 mb-6"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: [0, 1.2, 1],
      }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      404
    </motion.h1>

    <motion.p
      className="text-2xl font-light mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      A página que você está procurando não foi encontrada.
    </motion.p>

    <motion.a
      href="/"
      className="text-lg font-semibold text-cyan-400 hover:text-cyan-600 transition duration-300 ease-in-out transform hover:scale-105"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1 }}
      style={{ zIndex: 10 }}
    >
      Voltar para o início
    </motion.a>
  </div>
)
export default function NotFound() {
  return (
    <html lang="pt-BR">
      <body className="h-screen bg-background text-foreground flex justify-center items-center relative">
        <Block404 />
      </body>
    </html>
  );
}
