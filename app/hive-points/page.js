import HivePointsClient from "./HivePointsClient";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.stuhive.in";

// 🚀 ULTRA SEO METADATA
export const metadata = {
  title: "Earn Hive Points & Badges | StuHive Rewards",
  description: "Learn how to earn Hive Points on StuHive. Upload study notes, write academic blogs, create bundles, and climb your University Leaderboard to unlock exclusive badges.",
  keywords: [
    "StuHive points", "earn Hive Points", "student leaderboard", 
    "academic rewards", "top contributor badge", "gamified learning",
    "study note rewards", "university ranking"
  ],
  alternates: {
    canonical: `${APP_URL}/hive-points`,
  },
  openGraph: {
    title: "Earn Hive Points & Climb the Leaderboard | StuHive",
    description: "Discover how your academic contributions can earn you points, ranks, and exclusive badges on the StuHive network.",
    url: `${APP_URL}/hive-points`,
    siteName: "StuHive",
    type: "website",
    images: [{ url: "/logo512.png", width: 1200, height: 630, alt: "StuHive Gamification" }]
  },
};

export default function HivePointsPage() {
  // 🚀 SEO: FAQ Schema for Rich Snippets in Google Search
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are Hive Points on StuHive?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hive Points are reputation points earned by contributing valuable academic resources to the StuHive community. They determine your rank on the global and university-specific leaderboards."
        }
      },
      {
        "@type": "Question",
        "name": "How do I earn Hive Points?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can earn Hive Points by uploading notes (+10 points), having your notes downloaded by peers (+2 points per download), creating curated study bundles (+15 points), and publishing academic blogs (+20 points)."
        }
      },
      {
        "@type": "Question",
        "name": "What are the benefits of earning points?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Accumulating points unlocks exclusive profile badges like 'Top Contributor', puts you at the top of the Hall of Fame, and establishes you as a verified academic leader at your university."
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-background overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* INJECT KNOWLEDGE GRAPH */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* 🚀 Render the interactive client UI */}
      <HivePointsClient />
    </main>
  );
}