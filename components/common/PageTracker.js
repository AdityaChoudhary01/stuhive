"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
// import { logPageView } from "@/actions/analytics.actions"; // 🛑 Disabled for now

export default function PageTracker() {
  const pathname = usePathname();
  const trackedPages = useRef(new Set()); 

  useEffect(() => {
    // 🛑 TRACKING IS GLOBALLY DISABLED 
    // Just return immediately so nothing executes.
    return;

    /* --- SAVED FOR FUTURE USE ---
    if (!pathname) return;

    // 🚀 EXPLICIT BLOCKLIST: Never track these under any circumstances
    if (pathname.startsWith('/admin') || pathname.startsWith('/profile') || pathname.startsWith('/dashboard')) {
        return; 
    }

    // 🚀 THE SHIELD: Only track specific, high-value public pages.
    const isHighValuePage = 
      pathname.startsWith('/univ/') || 
      pathname.startsWith('/search') || 
      pathname.startsWith('/shared-collections') ||
      pathname === '/'; 

    if (isHighValuePage && !trackedPages.current.has(pathname)) {
      trackedPages.current.add(pathname);
      
      setTimeout(() => {
        logPageView(pathname).catch(() => {}); 
      }, 2000); 
    }
    ------------------------------ */
  }, [pathname]);

  return null;
}