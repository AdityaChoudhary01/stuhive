"use client";

import dynamic from "next/dynamic";

// 🚀 SERVER BUNDLE PROTECTOR: We use dynamic + ssr: false INSIDE a Client Component
const PDFViewer = dynamic(() => import("@/components/notes/PDFViewer"), { 
  ssr: false, 
  loading: () => (
    <div className="w-full min-h-[500px] flex items-center justify-center bg-black/40 text-cyan-400 font-black tracking-widest uppercase text-sm animate-pulse">
      Initializing Secure Viewer...
    </div>
  )
});

export default function ClientPDFLoader(props) {
  return <PDFViewer {...props} />;
}