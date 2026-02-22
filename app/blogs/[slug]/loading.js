import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container min-h-[70vh] flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-cyan-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] mb-4" />
      <h2 className="text-lg font-bold text-muted-foreground animate-pulse tracking-widest uppercase">
        Decrypting Article...
      </h2>
    </div>
  );
}