import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPaginatedNotifications } from "@/actions/notification.actions";
import NotificationClientPage from "@/components/notifications/NotificationClientPage";
import { Bell } from "lucide-react";

export const metadata = {
  title: "Notifications | StuHive",
  robots: { index: false, follow: false } // We don't want search engines indexing personal notifications
};

export default async function NotificationsPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const sp = await searchParams;
  const currentPage = parseInt(sp?.page) || 1;
  
  // Fetch paginated notifications for the full page view
  const { notifications, totalPages, unreadCount } = await getPaginatedNotifications(session.user.id, currentPage, 20);

  return (
    <main className="min-h-screen bg-background relative selection:bg-cyan-500/30">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
      
      <div className="container max-w-3xl pt-28 pb-20 px-4 relative z-10">
        
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Activity Feed</h1>
              <p className="text-gray-400 text-sm mt-1 font-medium">
                {unreadCount > 0 ? `You have ${unreadCount} unread notifications.` : "You're all caught up on alerts."}
              </p>
            </div>
          </div>
        </header>

        {/* Client Component to handle Mark Read / Delete interactions */}
        <NotificationClientPage 
          initialNotifications={notifications} 
          totalPages={totalPages} 
          currentPage={currentPage}
          userId={session.user.id}
        />

      </div>
    </main>
  );
}