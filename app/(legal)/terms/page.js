import TermsPageClient from "./TermsPageClient";

// ✅ HIGH-OCTANE SEO METADATA
export const metadata = {
  title: "Terms of Service | User Agreement",
  description: "Review the PeerLox Terms of Service. Understand our user covenant, content ownership licenses, academic integrity standards, and user conduct policies.",
  keywords: ["Terms of Service", "User Agreement", "Academic Integrity", "Content License", "PeerLox Terms", "Student Contract"],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://peerlox.in/terms",
  },
  openGraph: {
    title: "Terms of Power | PeerLox Legal",
    description: "Our legal binding contract for using the PeerLox academic ecosystem.",
    url: "https://peerlox.in/terms",
    type: "website",
  },
};

export default function TermsPage() {
  return <TermsPageClient />;
}