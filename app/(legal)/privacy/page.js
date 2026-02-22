import PrivacyPageClient from "./PrivacyPageClient";

// ✅ HIGH-OCTANE SEO METADATA
export const metadata = {
  title: "Privacy Policy | Your Data Security Engine",
  description: "Learn how StuHive protects your academic data. Our Privacy Engine outlines data minimization, encryption standards, and your rights under GDPR and the Indian Data Protection Act.",
  keywords: ["Privacy Policy", "Data Protection", "GDPR", "Secure Study Notes", "StuHive Security", "Encryption"],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://stuhive.in/privacy",
  },
  openGraph: {
    title: "Privacy Engine | StuHive Security",
    description: "Your data is your property. See how we protect it.",
    url: "https://stuhive.in/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}