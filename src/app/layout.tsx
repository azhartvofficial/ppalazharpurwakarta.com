import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const customFont = localFont({
  src: "../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-custom",
});

export const metadata: Metadata = {
  title: "Pondok Pesantren Al Azhar Purwakarta | Pusat Pendidikan Islam Terpadu",
  description: "Selamat datang di Website Resmi Pondok Pesantren Al Azhar Purwakarta. Pusat pendaftaran santri baru dan pengelolaan data akademik.",
  keywords: "Pondok Pesantren, Al Azhar Purwakarta, PPDB Pesantren, Pendidikan Islam, Purwakarta",
};

import { LanguageProvider } from "@/context/LanguageContext";
import Preloader from "@/components/Preloader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={customFont.variable}>
      <body>
        <Preloader />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
