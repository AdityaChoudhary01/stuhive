import { notFound, redirect } from "next/navigation";
import { getCollectionById } from "@/actions/collection.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NoteCard from "@/components/notes/NoteCard";
import CollectionActions from "@/components/notes/CollectionActions"; // 🚀 Unified Client Component
import { FolderOpen, Calendar, Globe, Lock, GraduationCap, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { removeNoteFromCollection } from "@/actions/collection.actions"; 
import Link from "next/link";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  
  const collection = await getCollectionById(resolvedParams.id);
  return {
    title: collection ? `${collection.name} | Manage Archive` : "Archive Not Found",
    robots: { index: false, follow: false }
  };
}

export default async function ViewCollectionPage({ params }) {
  const resolvedParams = await params;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const collection = await getCollectionById(resolvedParams.id);
  
  if (!collection) {
    return notFound();
  }

  const collectionOwnerId = collection.user?._id?.toString() || collection.user?.toString();

  if (collectionOwnerId !== session.user.id) {
    return notFound();
  }

  const serializedCollection = JSON.parse(JSON.stringify(collection));

  return (
    <div className="container max-w-6xl py-12 min-h-[80vh] pt-28">
      
      {/* 🚀 UPGRADED HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-6 mb-10 pb-8 border-b border-white/10">
        <div className="flex-1 pr-4">
           <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              <Badge variant="outline" className="flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-3 py-1">
                 <FolderOpen className="w-3.5 h-3.5" aria-hidden="true" /> Archive
              </Badge>
              
              <Badge variant="outline" className={`flex items-center gap-1.5 px-3 py-1 ${collection.visibility === 'public' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                 {collection.visibility === 'public' ? <Globe className="w-3.5 h-3.5" aria-hidden="true" /> : <Lock className="w-3.5 h-3.5" aria-hidden="true" />}
                 <span className="capitalize">{collection.visibility || 'Private'}</span>
              </Badge>

              {collection.university && (
                <Badge variant="outline" className="flex items-center gap-1.5 bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1">
                   <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" /> {collection.university}
                </Badge>
              )}
           </div>

           <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
             {collection.name}
           </h1>

           {collection.description && (
             <p className="text-gray-400 text-sm sm:text-base max-w-2xl mb-6 leading-relaxed">
               {collection.description}
             </p>
           )}
           
           <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" aria-hidden="true" /> Created {formatDate(collection.createdAt)}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-700 hidden sm:block" aria-hidden="true" /> 
              <span>{collection.notes.length} Notes</span>
              
              {collection.visibility === 'public' && collection.slug && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700 hidden sm:block" aria-hidden="true" /> 
                  <Link href={`/shared-collections/${collection.slug}`} className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-400/10 px-3 py-1.5 rounded-md">
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> View Public Page
                  </Link>
                </>
              )}
           </div>
        </div>

        {/* 🚀 FIXED: Only CollectionActions is rendered here now to prevent duplicate buttons */}
        <div className="shrink-0 w-full md:w-auto">
          <CollectionActions collection={serializedCollection} />
        </div>
      </div>

      {/* Notes Grid */}
      {collection.notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.notes.map((note, index) => {
            const removeNoteAction = removeNoteFromCollection.bind(null, collection._id, note._id, session.user.id);

            return (
              <div key={note._id} className="relative group h-full">
                 <NoteCard note={note} priority={index < 3} />
                 
                 <form action={removeNoteAction}>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 z-50 h-8 px-3 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95"
                    >
                      Remove
                    </Button>
                 </form>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white/[0.01] rounded-3xl border border-dashed border-white/10 text-center px-4">
            <div className="p-5 bg-white/5 rounded-full mb-5">
              <FolderOpen className="h-10 w-10 text-gray-500" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">This archive is empty</h3>
            <p className="text-sm text-gray-400 mb-8 max-w-sm leading-relaxed">Start browsing the repository to add study materials and notes to this bundle.</p>
            <Button asChild className="rounded-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold px-8 h-12">
                <Link href="/search">Explore Notes</Link>
            </Button>
        </div>
      )}
    </div>
  );
}