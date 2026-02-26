import { getUniversityHubData } from "@/actions/university.actions";
import { notFound } from "next/navigation";
import UniversityHubClient from "@/components/university/UniversityHubClient";
import { School, MapPin } from "lucide-react";

export const revalidate = 3600; // Edge cache for 1 hour

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.stuhive.in";

// 🚀 ULTRA-LOCALIZED SEO METADATA
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { universityName, stats } = await getUniversityHubData(slug);

  const title = `${universityName} Study Materials, Notes & PYQs | StuHive`;
  const description = `Download free handwritten notes, previous year question papers (PYQs), and study bundles for ${universityName}. Join ${stats.noteCount}+ resources uploaded by top students.`;

  return {
    title,
    description,
    keywords: [
      `${universityName} notes`,
      `${universityName} PYQs`,
      `${universityName} study materials`,
      `${universityName} semester notes`,
      `${universityName} btech notes`,
      `download ${universityName} syllabus`
    ],
    alternates: { canonical: `${APP_URL}/univ/${slug}` },
    openGraph: {
      title,
      description,
      url: `${APP_URL}/univ/${slug}`,
      siteName: "StuHive",
      type: "website",
    }
  };
}

export default async function UniversityPage({ params }) {
  const { slug } = await params;
  const data = await getUniversityHubData(slug);

  if (!data.success || (data.notes.length === 0 && data.requests.length === 0)) {
    return notFound();
  }

  // 🚀 LOCALIZED KNOWLEDGE GRAPH: Links the digital page to the physical university
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": APP_URL },
        { "@type": "ListItem", "position": 2, "name": "Universities", "item": `${APP_URL}/univ` },
        { "@type": "ListItem", "position": 3, "name": data.universityName, "item": `${APP_URL}/univ/${slug}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${data.universityName} Academic Resources`,
      "description": `Study materials for ${data.universityName}`,
      "about": {
        "@type": "CollegeOrUniversity",
        "name": data.universityName
      }
    }
  ];

  return (
    <main 
      className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-cyan-500/30 pt-20"
      itemScope 
      itemType="https://schema.org/CollectionPage"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-cyan-950/30 to-background pointer-events-none" aria-hidden="true" />
      <div className="absolute top-[-10%] left-[20%] w-[50vw] h-[30vw] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="container relative z-10 max-w-6xl py-12 px-4 sm:px-6 mx-auto">
        
        {/* 🚀 UNIVERSITY HERO HEADER */}
        <header className="mb-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
             <School className="w-10 h-10 text-cyan-400" aria-hidden="true" />
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4" itemProp="headline">
            {data.universityName}
          </h1>
          
          <div className="flex items-center gap-2 text-gray-400 font-medium text-sm sm:text-base mb-8">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span>Dedicated Student Hive</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <StatBadge label="Total Notes" value={data.stats.noteCount} />
            <StatBadge label="Study Bundles" value={data.stats.collectionCount} />
            <StatBadge label="Open Requests" value={data.stats.requestCount} />
          </div>
        </header>

        {/* 🚀 INTERACTIVE HUB CLIENT */}
        <UniversityHubClient data={data} slug={slug} />

      </div>
    </main>
  );
}

function StatBadge({ label, value }) {
  return (
    <div className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 min-w-[120px]">
      <span className="text-2xl sm:text-3xl font-black text-white">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">{label}</span>
    </div>
  );
}