import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {Locale, routing} from '@i18n/routing';
import Navbar from '@ui/NavBar';
import Footer from '@ui/Footer';

import "@css/globals.css"
 
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid  
  let { locale } = await params;    
  if (!routing.locales.includes(locale as Locale))  locale = routing.defaultLocale

   
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}