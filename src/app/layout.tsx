import "@css/globals.css"
 
export default async function LocaleLayout({
  children,  
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  
 
  return (
    <html lang="pt-BR">
      <body>        
        {children}        
      </body>
    </html>
  );
}