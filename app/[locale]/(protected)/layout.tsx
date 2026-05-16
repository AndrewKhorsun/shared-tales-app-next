import { redirect } from "next/navigation";
import { TopNav } from "@/components/dashboard/topnav";
import { User } from "@/types/auth";
import { serverApi } from "@/lib/server-api";
import { SocketProvider } from "@/components/dashboard/socket-provider";
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import { getLocale } from "next-intl/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const { data, error } = await serverApi.get<{ user: User }>("/api/auth/me");
  if (!data) {
    // serverApi already redirects to /login on 401/no-token
    // Any other error (e.g. 500) should surface as an error page, not a redirect loop
    throw new Error(error ?? "Failed to load user");
  }

  if (!data.user.email_verified) {
    redirect(`/${locale}/verify-email`);
  }

  const onboardingCompleted = data.user.onboarding_completed_at !== null;

  return (
    <SocketProvider userId={data.user.id}>
      <OnboardingProvider
        initialCompleted={onboardingCompleted}
        locale={locale as "en" | "uk"}
      >
        <div className="min-h-screen flex flex-col">
          <TopNav user={data.user} />
          <main className="flex-1 overflow-auto bg-canvas">
            {children}
          </main>
        </div>
      </OnboardingProvider>
    </SocketProvider>
  );
}
