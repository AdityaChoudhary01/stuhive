import DMCAPageClient from "./DMCAPageClient";

// ✅ 1. HIGH-OCTANE SEO METADATA
// This establishes PeerLox as a legally compliant, trustworthy entity.
export const metadata = {
  title: "DMCA & Intellectual Property Protection",
  description: "Learn about PeerLox's commitment to copyright protection. Our DMCA policy outlines the takedown process for infringing academic materials and study notes.",
  keywords: ["DMCA", "Copyright Infringement", "IP Protection", "Legal Notice", "Safe Harbor", "PeerLox Legal"],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://peerlox.in/dmca",
  },
  openGraph: {
    title: "IP Protection & DMCA | PeerLox",
    description: "Our policy for protecting student creators and intellectual property.",
    url: "https://peerlox.in/dmca",
    type: "website",
  },
};

export default function DMCAPage() {
  return <DMCAPageClient />;
}