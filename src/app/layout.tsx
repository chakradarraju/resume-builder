import type { Metadata } from "next";
import { nunito } from '@/ui/fonts';
import "./globals.css";
import { Provider } from "@/components/ui/provider"

export const metadata: Metadata = {
  title: "Resume builder",
  description: "Helps build resume",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${nunito.className} antialiased h-full min-h-screen`}>
        <Provider>
          {children}            
        </Provider>
      </body>
    </html>
  );
}
