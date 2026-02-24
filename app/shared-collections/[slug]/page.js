import { getCollectionBySlug } from "@/actions/collection.actions";
import { notFound } from "next/navigation";
import NoteCard from "@/components/notes/NoteCard";
import { FolderHeart, Library, ArrowLeft, Globe, ShieldCheck, Zap, BookOpen } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShareCollectionButton from "@/components/collections/ShareCollectionButton";

// 🚀 PERFORMANCE & SEO: Cache this page at the edge for 1 hour. TTFB < 50ms.
export const revalidate = 3600;

const APP_URL = process.env.NEXTAUTH_URL || "https://www.stuhive.in";

// 🚀 EXTREME SEO METADATA
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) return { title: "Collection Not Found | StuHive", robots: { index: false } };

  const title = `${collection.name} | Study Notes by ${collection.user?.name}`;
  const description = collection.description 
    ? `${collection.description.substring(0, 150)}...` 
    : `Access "${collection.name}", a premium academic collection of ${collection.notes?.length || 0} study resources curated by ${collection.user?.name} on StuHive.`;

  return {
    title,
    description,
    keywords: [
      collection.name, 
      collection.user?.name,
      "study notes bundle", 
      "handwritten academic notes", 
      "university resources", 
      "exam preparation",
      "free study materials",
      "StuHive collections"
    ],
    authors: [{ name: collection.user?.name, url: `${APP_URL}/profile/${collection.user?._id}` }],
    category: "Education",
    alternates: { 
      canonical: `${APP_URL}/shared-collections/${slug}` 
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: `${APP_URL}/shared-collections/${slug}`,
      siteName: "StuHive",
      images: [
        { 
          url: collection.user?.avatar || `${APP_URL}/logo512.png`,
          width: 1200,
          height: 630,
          alt: `${collection.name} curated by ${collection.user?.name}`
        }
      ],
      type: "article",
      publishedTime: collection.createdAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [collection.user?.avatar || `${APP_URL}/logo512.png`],
    },
  };
}

export default async function PublicCollectionDetails({ params }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) return notFound();

  // 🚀 DUAL JSON-LD FOR MAXIMUM RICH SNIPPETS
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": APP_URL },
      { "@type": "ListItem", "position": 2, "name": "Shared Collections", "item": `${APP_URL}/shared-collections` },
      { "@type": "ListItem", "position": 3, "name": collection.name, "item": `${APP_URL}/shared-collections/${slug}` }
    ]
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": collection.name,
    "description": collection.description || `Curated academic bundle by ${collection.user?.name}`,
    "url": `${APP_URL}/shared-collections/${slug}`,
    "author": {
      "@type": "Person",
      "name": collection.user?.name,
      "url": `${APP_URL}/profile/${collection.user?._id}`,
      "image": collection.user?.avatar
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": collection.notes?.length || 0,
      "itemListElement": collection.notes?.map((note, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "name": note.title,
          "url": `${APP_URL}/notes/${note._id}`,
          "author": { "@type": "Person", "name": note.user?.name }
        }
      }))
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-cyan-500/30">
      {/* JSON-LD Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      {/* 🚀 REFINED BACKGROUND - Removed oversized blurs, added subtle noise and top grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
         <div className="absolute top-0 left-0 w-full h-[40vh] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
         <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[30vw] bg-cyan-900/10 blur-[120px] rounded-full opacity-50" />
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="container relative z-10 max-w-5xl py-12 md:py-20 px-4 sm:px-6 mx-auto">
        
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10 sm:mb-16 animate-in fade-in slide-in-from-left-4 duration-500">
           <Link 
              href="/shared-collections" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all text-sm font-medium"
            >
              <ArrowLeft size={14} /> Back to Archives
           </Link>
        </nav>

        {/* 🚀 PREMIUM HEADER SECTION */}
        <header className="flex flex-col items-start mb-16 sm:mb-20">
          <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-cyan-400 mb-6 shadow-sm">
            <FolderHeart size={28} strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 leading-[1.1]">
            {collection.name}
          </h1>

          {collection.description && (
            <p className="text-gray-400 text-base md:text-lg max-w-3xl mb-8 leading-relaxed font-normal">
                {collection.description}
            </p>
          )}

          {/* Author & Stats Meta */}
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              href={`/profile/${collection.user?._id}`} 
              className="group flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all duration-300"
            >
              <Avatar className="h-6 w-6 border border-white/10">
                <AvatarImage src={collection.user?.avatar} alt={collection.user?.name} />
                <AvatarFallback className="bg-cyan-900 text-cyan-100 font-bold text-[10px]">
                  {collection.user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                Curated by {collection.user?.name}
              </span>
            </Link>

            <div className="flex items-center gap-2 bg-white/[0.02] text-gray-300 px-4 py-2 rounded-full border border-white/10">
               <Library size={14} className="text-gray-400" />
               <span className="text-sm font-medium tracking-wide">
                 {collection.notes?.length || 0} Resources
               </span>
            </div>
          </div>
        </header>

        {/* 🚀 GRID SECTION */}
        <section aria-labelledby="collection-contents">
          <h2 id="collection-contents" className="sr-only">Documents in this collection</h2>
          
          {collection.notes && collection.notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {collection.notes.map((note, index) => (
                <article 
                  key={note._id} 
                  className="h-full transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* LCP Fix: Prioritize first 3 images if NoteCard uses next/image */}
                  <NoteCard note={note} priority={index < 3} />
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 sm:py-32 rounded-3xl bg-white/[0.01] border border-dashed border-white/10">
              <div className="p-4 bg-white/5 rounded-full mb-5">
                <BookOpen size={28} className="text-gray-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-300 tracking-tight">Empty Archive</h3>
              {/* ✅ ESLINT FIX: Changed hasn't to hasn&apos;t */}
              <p className="text-sm text-gray-500 max-w-xs text-center mt-2 leading-relaxed">
                The curator hasn&apos;t added any study materials to this bundle yet. Check back soon.
              </p>
            </div>
          )}
        </section>

        {/* 🚀 PROFESSIONAL FOOTER CTA */}
        <footer className="mt-24 sm:mt-32 pt-12 border-t border-white/10 flex flex-col items-center text-center gap-6">
            <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-white">Share the Knowledge</h3>
                <p className="text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
                  Help your peers by sharing this curated curriculum. Good resources are meant to be circulated.
                </p>
            </div>
            
            <ShareCollectionButton />
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-4">
                <span className="flex items-center gap-1.5"><Zap size={12} className="text-yellow-500/70" /> High-Speed</span>
                <span className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500/70" /> Public Link</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-green-500/70" /> Verified</span>
            </div>
        </footer>
      </div>
    </main>
  );
}