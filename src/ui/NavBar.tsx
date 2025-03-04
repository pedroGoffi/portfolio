'use client';
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";


export default function Navbar() {
  const t = useTranslations("Navbar");

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full p-4 bg-black/60 backdrop-blur-lg text-white shadow-md border-b border-white/10 items-center justify-center px-6 z-50 flex"
    >
      <div className="text-2xl font-bold text-purple-400 flex justify-center items-center text-center">
        {t("title")}
      </div>
            
      {/* Linha Neon com Animação de Gradiente */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] overflow-hidden">
        <motion.div 
          className="w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.nav>
  );
}