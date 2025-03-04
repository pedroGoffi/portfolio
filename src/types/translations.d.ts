export type NavbarTranslationKeys = {
    title: string;
    home: string;
    projects: string;
    contact: string;
};
  
export type HomeTranslationKeys = {
    title: string;
    intro: string;
    about: string;
    skillsTitle: string;
    contactBtn: string;
    experienceTitle: string;
    socialLinksTitle: string;
    contactFormTitle: string;
    contactFormName: string;
    contactFormEmail: string;
    contactFormMessage: string;
    submitBtn: string
};
  
export type FooterTranslationKeys = {
    about: string;
    services: string;
    contact: string;
    copyright: string;
};
  
export type SkillCardTranslationKeys = any
export type ExperienceCardTranslationKeys = any
// Combine all translation keys into a single type
export type AllTranslations = {
    Navbar: NavbarTranslationKeys;
    Home: HomeTranslationKeys;
    Footer: FooterTranslationKeys;
    SkillCard: SkillCardTranslationKeys;    
    ExperienceCard: ExperienceCardTranslationKeys
};
  