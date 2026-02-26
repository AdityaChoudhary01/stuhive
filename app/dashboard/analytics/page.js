import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust the path as needed
import { redirect } from "next/navigation";
import { getCreatorAnalytics } from "@/actions/analytics.actions";
import AnalyticsClient from "./AnalyticsClient";
export const metadata = {
  title: "Creator Analytics | StuHive Dashboard",
  robots: { index: false, follow: false } // Never index private dashboards
};

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Fetch the last 30 days of data for this user
  const rawData = await getCreatorAnalytics(session.user.id);

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container max-w-6xl px-4 mx-auto">
        <AnalyticsClient rawData={rawData} />
      </div>
    </main>
  );
}