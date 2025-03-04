'use client';
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Skill } from "../../types/skills";
import { contactMethods } from "../../data/contact";
import { my_skills } from "../../data/skils";
import { my_experience } from "../../data/experience";
import { SkillCardTranslationKeys } from "../../types/translations";
import { Experience } from "../../types/experience";


// Componentes
const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const t = useTranslations("SkillCard")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}    
      transition={{ duration: 1, delay: 0.2 * index }}
      className="bg-black/80 p-6 rounded-xl shadow-lg backdrop-blur-md hover:bg-black/70 transition-all hover:backdrop-contrast-50"
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-4 text-purple-400">{skill.icon}</div>
        <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
        <p className="text-sm text-gray-400">{t(skill.name as keyof SkillCardTranslationKeys)}</p>
      </div>
    </motion.div>
  );
}
const SkillsSection = () => {
  const t = useTranslations("Home");
  
  return (
    <section className="py-20 bg-black/90">
      <h2 className="text-3xl font-bold text-center text-purple-400 mb-10">{t('skillsTitle')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4">
        {my_skills.map((skill, index) => <SkillCard key={index} skill={skill} index={index} />)}
      </div>
    </section>
  );
};
const ExperienceCard = ({ exp, index }: { exp: Experience, index: number }) => {
  const t = useTranslations("ExperienceCard");
  
  return (
    <a
      href={exp.href}
      target={exp.href === "#" ? "_self" : "_blank"}
      key={`LINK:${index}`}
      className="rounded-4xl"
    >
      <motion.div
        key={`EXPERIENCE:${index}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 * index }}
        className="p-6 rounded-xl shadow-lg bg-transparent transition-colors duration-300 hover:bg-black/70"
      >
        {/* A chave de tradução agora é dinâmica, usando exp.id */}
        <h3 className="text-xl font-semibold text-purple-400">
          {t(`${exp.id}_title`)}
        </h3>
        
        {/* Aqui também, para a descrição */}
        <p className="text-sm text-gray-500">
          {t(`${exp.id}_description`)}
        </p>
      </motion.div>
    </a>
  );
};

const ExperiencesCards = () => {
  return (    
    <div className="space-y-8 flex flex-col items-center justify-center">
      <div>
        {my_experience.map((exp, index) => <ExperienceCard key={`EXP_CARD:${index}`} exp={exp} index={index}/>)}
      </div>
    </div>    
  )
}
const ExperienceSection = () => {
  const t = useTranslations("Home");
  return (
    <section className="py-20 bg-black/90">
      <h2 className="text-3xl font-bold text-center text-purple-400 mb-10">{t('experienceTitle')}</h2>
      <ExperiencesCards />
    </section>
  );
};



const ContactSection = () => {
  const t = useTranslations("Home");

  return (
    <section className="py-20 bg-black/90">
      <h2 className="text-3xl font-bold text-center text-purple-400 mb-10">{t('socialLinksTitle')}</h2>
      <div className="flex justify-center gap-8">
        {contactMethods.map((method, index) => (
          <motion.a
            key={index}
            href={method.url}
            target="_blank"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 * index }}
            className="text-3xl text-purple-400 hover:text-purple-500 transition-all"
          >
            {method.icon}          
          </motion.a>
        ))}
      </div>
    </section>
  );
};

// Função principal
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">      
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />      
    </div>
  );
}
