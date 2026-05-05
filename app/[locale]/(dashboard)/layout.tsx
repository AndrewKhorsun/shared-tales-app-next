import { redirect } from "next/navigation";
import { TopNav } from "@/components/dashboard/topnav";
import { User } from "@/types/auth";
import { serverApi } from "@/lib/server-api";
import { SocketProvider } from "@/components/dashboard/socket-provider";
import { getLocale } from "next-intl/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const { data, error } = await serverApi.get<{ user: User }>("/api/auth/me");
  if (error || !data) {
    redirect(`/${locale}/login`);
  }

  if (!data.user.email_verified) {
    redirect(`/${locale}/verify-email`);
  }

  return (
    <SocketProvider userId={data.user.id}>
      <div className="min-h-screen flex flex-col">
        <TopNav user={data.user} />
        <main className="flex-1 overflow-auto bg-canvas">
          {children}
        </main>
      </div>
    </SocketProvider>
  );
}
