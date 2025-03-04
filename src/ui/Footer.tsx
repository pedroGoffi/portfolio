"use client";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';


export default function Footer() {
  const t = useTranslations<'Footer'>('Footer');  


  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="relative w-full p-6 bg-black/60 backdrop-blur-lg text-white flex flex-col items-center justify-center gap-4 shadow-xl border-t border-white/10"
    >
      {/* <nav className="flex gap-6">*/}
      {/*   <a href="#" className="hover:text-gray-300 transition-colors">{t('about')}</a>*/}
      {/*   <a href="#" className="hover:text-gray-300 transition-colors">{t('services')}</a>*/}
      {/*   <a href="#" className="hover:text-gray-300 transition-colors">{t('contact')}</a>*/}
      {/* </nav>*/}
      {/*
      <div className="flex gap-4">
        <motion.a 
          href="#" 
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Facebook className="w-5 h-5" />
        </motion.a>
        <motion.a 
          href="#" 
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Twitter className="w-5 h-5" />
        </motion.a>
        <motion.a 
          href="#" 
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Instagram className="w-5 h-5" />
        </motion.a>
      </div>
      */}
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-sm text-gray-400"
      >
        {t('copyright', { year: new Date().getFullYear()})}
      </motion.p>
    </motion.footer>
  );
}
