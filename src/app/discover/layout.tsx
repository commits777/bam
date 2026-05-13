import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Date Night Spots in Athens",
  description:
    "Browse 50 curated date night venues in Athens by neighbourhood, vibe, budget and occasion. Wine bars, rooftops, jazz clubs and more.",
  alternates: {
    canonical: "https://getbam.fun/discover",
  },
  openGraph: {
    title: "Discover Date Night Spots in Athens | BAM!",
    description:
      "Browse 50 curated date night venues by neighbourhood, vibe, budget and occasion.",
    url: "https://getbam.fun/discover",
  },
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
