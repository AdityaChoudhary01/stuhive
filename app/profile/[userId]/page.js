import { notFound } from "next/navigation";
import { getUserProfile, getUserNotes } from "@/actions/user.actions";
import { getBlogsForUser } from "@/actions/blog.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PublicProfileView from "@/components/profile/PublicProfileView";

export const revalidate = 60;
export const dynamic = "force-dynamic"; 

const APP_URL = process.env.NEXTAUTH_URL || "https://www.stuhive.in";

// 🚀 1. HYPER SEO METADATA FOR PROFILES
export async function generateMetadata({ params }) {
  const { userId } = await params;
  const user = await getUserProfile(userId);
  
  if (!user) return { title: "User Not Found" };

  const profileTitle = `${user.name} | Portfolio & Study Materials | StuHive`;
  
  let profileDesc = `Explore academic notes and articles contributed by ${user.name} on StuHive.`;
  
  if (user.bio) {
    profileDesc = `${user.bio.substring(0, 150)}... - ${user.university ? user.university : 'StuHive Contributor'}`; 
  } else if (user.university || user.location) {
    const uniStr = user.university ? ` at ${user.university}` : "";
    const locStr = user.location ? ` in ${user.location}` : "";
    profileDesc = `${user.name} is a student${uniStr}${locStr}. Explore their academic notes and articles.`;
  }

  return {
    title: profileTitle,
    description: profileDesc,
    alternates: {
        canonical: `${APP_URL}/profile/${userId}`,
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
      title: profileTitle,
      description: profileDesc,
      url: `${APP_URL}/profile/${userId}`,
      type: "profile",
      images: [{ url: user.avatar || `${APP_URL}/logo512.png`, width: 800, height: 800, alt: `${user.name}'s Profile Picture` }],
    },
    twitter: {
        card: "summary",
        title: profileTitle,
        description: profileDesc,
        images: [user.avatar || `${APP_URL}/logo512.png`],
    }
  };
}

export default async function PublicProfilePage({ params }) {
  const { userId } = await params;
  
  // 🚀 Fetch up to 100 items so the client-side SEO pagination has plenty of data to chunk
  const [session, profile, notesData, blogs] = await Promise.all([
    getServerSession(authOptions),
    getUserProfile(userId),
    getUserNotes(userId, 1, 100),
    getBlogsForUser(userId)
  ]);

  if (!profile) return notFound();

  const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

  // 🚀 2. PERSON & PROFILE SCHEMA
  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": profile.name,
      "description": profile.bio || `Student ${profile.university ? 'at ' + profile.university : ''}`,
      "image": profile.avatar,
      "url": `${APP_URL}/profile/${userId}`,
      "jobTitle": profile.role === 'admin' ? "Platform Admin" : "Student Contributor",
      "worksFor": {
         "@type": "Organization",
         "name": profile.university || "StuHive Academic Community"
      },
      "knowsAbout": ["Academic Research", "Study Materials", "Exam Preparation"],
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/FollowAction",
          "userInteractionCount": profile.followers?.length || 0
        }
      ]
    }
  };

  // 🚀 3. NOTES ITEMLIST SCHEMA
  const notesJsonLd = notesData?.notes?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${profile.name}'s Study Materials`,
    "itemListElement": notesData.notes.slice(0, 12).map((note, index) => { // Limit schema injection to top 12
      const thumbnailUrl = note.thumbnailKey 
        ? `${r2PublicUrl}/${note.thumbnailKey}` 
        : (note.fileType?.startsWith("image/") && note.fileKey ? `${r2PublicUrl}/${note.fileKey}` : undefined);

      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": ["LearningResource", "Course", "CreativeWork"],
          "name": note.title,
          "url": `${APP_URL}/notes/${note._id}`,
          "image": thumbnailUrl,
          "educationalLevel": "University",
          "learningResourceType": "Study Guide",
          "provider": {
            "@type": "Organization",
            "name": profile.university || "StuHive"
          },
          ...(note.rating > 0 && {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": note.rating.toFixed(1),
              "bestRating": "5",
              "worstRating": "1",
              "reviewCount": note.numReviews || 1
            }
          })
        }
      };
    })
  } : null;

  // 🚀 4. BLOGS ITEMLIST SCHEMA
  const blogsJsonLd = blogs?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${profile.name}'s Academic Blogs`,
    "itemListElement": blogs.slice(0, 12).map((blog, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "BlogPosting",
        "headline": blog.title,
        "url": `${APP_URL}/blogs/${blog.slug}`,
        "image": blog.coverImage || `${APP_URL}/default-blog.png`,
        "datePublished": blog.createdAt,
        "author": {
          "@type": "Person",
          "name": profile.name
        }
      }
    }))
  } : null;

  const isOwnProfile = session?.user?.id === profile._id.toString();
  const isFollowing = session 
    ? profile.followers.some(f => (f._id?.toString() || f.toString()) === session.user.id) 
    : false;

  const serializedProfile = {
    ...profile,
    _id: profile._id.toString(),
    bio: profile.bio || "",
    university: profile.university || "",
    location: profile.location || "",
    followers: (profile.followers || []).map(f => ({
        ...f,
        _id: f._id?.toString() || f.toString()
    })),
    following: (profile.following || []).map(f => ({
        ...f,
        _id: f._id?.toString() || f.toString()
    }))
  };

  const serializedNotes = (notesData?.notes || []).map(note => ({
    ...note,
    _id: note._id.toString(),
    user: note.user?._id ? { ...note.user, _id: note.user._id.toString() } : note.user?.toString(),
    uploadDate: note.uploadDate instanceof Date ? note.uploadDate.toISOString() : new Date(note.uploadDate).toISOString(),
  }));

  const serializedBlogs = (blogs || []).map(blog => ({
    ...blog,
    _id: blog._id.toString(),
    author: blog.author?._id ? blog.author._id.toString() : blog.author?.toString(),
    createdAt: blog.createdAt instanceof Date ? blog.createdAt.toISOString() : new Date(blog.createdAt).toISOString(),
  }));

  return (
    <main 
      className="w-full max-w-6xl mx-auto px-3 sm:px-6 md:px-8 py-8 pt-24"
      itemScope 
      itemType="https://schema.org/ProfilePage"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }} />
      {notesJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(notesJsonLd) }} />}
      {blogsJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogsJsonLd) }} />}
      
      <h1 className="sr-only" itemProp="name">{profile.name}&apos;s Profile</h1>

      <PublicProfileView 
        profile={serializedProfile}
        notes={serializedNotes}
        blogs={serializedBlogs}
        currentUser={session?.user} 
        isOwnProfile={isOwnProfile}
        initialIsFollowing={isFollowing}
      />
    </main>
  );
}