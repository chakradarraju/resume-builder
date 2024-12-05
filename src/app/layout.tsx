'use client';

import { nunito } from '@/ui/fonts';
import "./globals.css";
import { Provider } from "@/components/ui/provider"
import { ProfileProvider } from './ProfileContext';
import { ConfigProvider } from './ConfigContext';
import Script from 'next/script';

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>Resume builder</title>
      </head>
      <body className={`${nunito.className} antialiased h-full min-h-screen`}>
        <Provider forcedTheme='light'>
          <ProfileProvider>
            <ConfigProvider>
              {children}              
            </ConfigProvider>
          </ProfileProvider>       
        </Provider>
        <Script src="/supportBot.js" strategy='afterInteractive' />
      </body>
    </html>
  );
}
