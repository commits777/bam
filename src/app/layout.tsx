import type { Metadata, Viewport } from "next";
import { Archivo_Black, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { LangProvider } from "@/contexts/lang-context";
import ProfileSetupModal from "@/components/profile-setup-modal";
import "./globals.css";

const GA_ID = "G-NLWVBF51LV";

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

const BASE_URL = "https://getbam.fun";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "BAM! | Date Night in Athens, Sorted.",
    template: "%s | BAM!",
  },
  description:
    "50 curated date night spots in Athens. Wine bars, rooftops, jazz clubs and cocktail bars hand-picked for couples. Find your perfect spot in seconds. Tap. Book. Go.",
  keywords: [
    "Athens date night",
    "Athens restaurants couples",
    "Athens bars",
    "romantic Athens",
    "Athens nightlife",
    "Αθήνα ρομαντικό βράδυ",
    "wine bar Athens",
    "rooftop Athens",
    "cocktail bar Athens",
    "jazz club Athens",
    "Athens date ideas",
    "best bars Athens",
    "getbam",
  ],
  authors: [{ name: "BAM!", url: BASE_URL }],
  creator: "BAM!",
  publisher: "BAM!",

  // Canonical + alternates
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": BASE_URL,
      "el-GR": BASE_URL,
    },
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph
  openGraph: {
    title: "BAM! | Date Night in Athens, Sorted.",
    description:
      "50 curated date night spots in Athens. Wine bars, rooftops, jazz clubs and cocktail bars, hand-picked for couples.",
    url: BASE_URL,
    siteName: "BAM!",
    locale: "en_US",
    alternateLocale: ["el_GR"],
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "BAM! - Date Night in Athens",
        type: "image/png",
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "BAM! | Date Night in Athens, Sorted.",
    description: "50 curated date night spots in Athens. Tap. Book. Go.",
    images: ["/og.png"],
    creator: "@getbamfun",
    site: "@getbamfun",
  },

  // PWA / Apple
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BAM!",
  },

  // Verification (add when you have these)
  // verification: {
  //   google: "your-google-site-verification",
  // },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#FF2D2D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BAM!",
  alternateName: "BAM! Athens",
  url: BASE_URL,
  description:
    "Curated date night discovery for Athens. Find the perfect spot in seconds.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/discover?vibe={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "BAM!",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/icon-512.png`,
    },
  },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics (GA4) — must be in <head> for GA's tag detector */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
          }}
        />
        {/* Plausible Analytics */}
        <script
          defer
          data-domain="getbam.fun"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body className="h-full">
        <SessionProvider>
          <LangProvider>
            {children}
          </LangProvider>
          <ProfileSetupModal />
        </SessionProvider>
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
