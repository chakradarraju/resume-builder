'use client';

import { nunito } from '@/ui/fonts';
import "./globals.css";
import { Provider } from "@/components/ui/provider"
import { ProfileProvider } from './ProfileContext';
import { ConfigProvider } from './ConfigContext';
import { SessionProvider } from 'next-auth/react';

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
              <SessionProvider>
                {children}       
              </SessionProvider>       
            </ConfigProvider>
          </ProfileProvider>       
        </Provider>
      </body>
    </html>
  );
}
