import {defineRouting} from 'next-intl/routing';

export type Locale = 'en' | 'de' | 'ja' | 'pt'
export const locales: Locale[] = ['en', 'de', 'ja', 'pt']

export const routing = defineRouting({
  // A list of all locales that are supported
  locales, 
  // Used when no locale matches
  defaultLocale: 'pt',  
});