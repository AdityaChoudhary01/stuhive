import TermsPageClient from "./TermsPageClient";

// ✅ HIGH-OCTANE SEO METADATA
export const metadata = {
  title: "Terms of Service | User Agreement",
  description: "Review the StuHive Terms of Service. Understand our user covenant, content ownership licenses, academic integrity standards, and user conduct policies.",
  keywords: ["Terms of Service", "User Agreement", "Academic Integrity", "Content License", "StuHive Terms", "Student Contract"],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://stuhive.in/terms",
  },
  openGraph: {
    title: "Terms of Power | StuHive Legal",
    description: "Our legal binding contract for using the StuHive academic ecosystem.",
    url: "https://stuhive.in/terms",
    type: "website",
  },
};

export default function TermsPage() {
  return <TermsPageClient />;
}