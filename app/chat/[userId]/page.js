import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/actions/user.actions";
import { getConversationWithMessages } from "@/services/chat.service";
import ChatBox from "@/components/chat/ChatBox";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  
  const user = await getUserProfile(resolvedParams.userId);
  return { title: user ? `Chat with ${user.name}` : "Chat" };
}

export default async function ChatPage({ params }) {
  const resolvedParams = await params;
  
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  // Prevent user from chatting with themselves
  if (session.user.id === resolvedParams.userId) redirect("/chat");

  const recipient = await getUserProfile(resolvedParams.userId);

  if (!recipient) notFound();

  const { conversationId, messages } = await getConversationWithMessages(
    session.user.id,
    resolvedParams.userId
  );

  return (
    // 🚀 THE FIX: Restored normal document flow using `h-[calc(100dvh-4rem)]`.
    // This explicitly takes up the exact height of the screen (minus the navbar),
    // which physically pushes the global footer down out of view where it belongs.
    <div className="w-full flex justify-center items-start md:items-center p-0 md:p-6 lg:p-12 overflow-hidden bg-background relative h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)]">
      
      {/* 2. Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none hidden md:block" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none hidden md:block" />

      {/* 3. The Sizing Container: Now fills exactly 100% of the calculated wrapper height */}
      <div className="w-full h-full max-w-4xl relative z-10 flex flex-col">
        <ChatBox
          currentUser={session.user}
          recipient={recipient}
          conversationId={conversationId}
          initialMessages={messages}
        />
      </div>
      
    </div>
  );
}