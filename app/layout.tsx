import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EV Charger Installers - Find Local Pros Near You | Antigravity",
  description: "Compare quotes from licensed electricians for EV charger installation. Get matched with local pros, read reviews, and save on your Level 2 home charging station.",
  keywords: "EV charger installation, electric vehicle charging, home charging station, licensed electrician, tesla wall connector installation",
  openGraph: {
    title: "EV Charger Installers - Find Local Pros",
    description: "Compare quotes from licensed electricians for EV charger installation.",
    type: "website",
    siteName: "Antigravity EV Installers",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
