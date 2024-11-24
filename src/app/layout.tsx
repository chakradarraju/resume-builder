'use client';

import { nunito } from '@/ui/fonts';
import "./globals.css";
import { Provider } from "@/components/ui/provider"
import { ProfileProvider } from './ProfileContext';

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>Resume builder</title>
      </head>
      <body className={`${nunito.className} antialiased h-full min-h-screen`}>
        <Provider>
          <ProfileProvider>
            {children}     
          </ProfileProvider>       
        </Provider>
      </body>
    </html>
  );
}
