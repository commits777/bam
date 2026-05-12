import type { Metadata, Viewport } from "next";
import { Archivo_Black, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { LangProvider } from "@/contexts/lang-context";
import "./globals.css";

const archivo = Archivo_Black({
  weight: "400",
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  weight: ["400", "500", "700", "800"],
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "700"],
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BAM! — Date night, handled.",
  description:
    "Curated date-night discovery for Athens. Find the perfect spot in seconds — wine bars, rooftops, cocktail bars, experiences. Tap. Book. Go.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BAM!",
  },
  openGraph: {
    title: "BAM! — Date night, handled.",
    description: "Curated date-night discovery for Athens.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF2D2D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${bricolage.variable} ${jetbrains.variable} h-full`}
    >
      <body className="h-full">
        <SessionProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
