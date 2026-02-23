import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/providers/AuthProvider";
import AblyProvider from "@/components/providers/AblyProvider";
import PWARegister from "@/components/common/PWARegister";

// Replace the current Inter font import line near the top with this:
const inter = Inter({ subsets: ["latin"], display: "swap" });

// ✅ 1. FIXED VIEWPORT FOR 100/100 BEST PRACTICES & ACCESSIBILITY
// Lighthouse strictly requires users to be able to zoom in up to 5x for visual accessibility.
export const viewport = {
  themeColor: "#0a0118",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Increased from 1 to 5 to pass Lighthouse Best Practices
  // userScalable: false, // REMOVED: This is flagged as an accessibility violation by Google
};

// ✅ Global SEO Safety Net
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://stuhive.in"),
  title: {
    default: "StuHive | Free Academic Notes & Study Materials",
    template: "%s | StuHive"
  },
  description: "Join StuHive to discover, share, and review university notes, PDFs, and study materials.",
  manifest: "/manifest.json", 
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StuHive",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/logo192.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stuhive.in",
    siteName: "StuHive",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "StuHive Logo",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* ✅ FIXED: Removed crossOrigin (not needed for basic images) and added Google Avatars */}
        <link rel="preconnect" href="https://cdn.stuhive.in" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <meta name="msvalidate.01" content="2395AC146C62BB5D66E421F75E9E7DCF" />
      </head>
      
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        {/* ✅ AUTH PROVIDER: Supplies session context to useSession() across the app */}
        <AuthProvider>
          {/* ✅ ABLY PROVIDER: Nested inside Auth so it can access the authenticated user ID */}
          <AblyProvider>
            <PWARegister /> 
            
            <Navbar />

            {/* Main content wrapper with padding to account for fixed navbar */}
            <main className="flex-grow pt-20">
              {children}
            </main>

            <Footer />
            
            {/* Global UI Components */}
            <Toaster />
          </AblyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
