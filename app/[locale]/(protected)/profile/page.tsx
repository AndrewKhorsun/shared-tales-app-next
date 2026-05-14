import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { serverApi } from "@/lib/server-api";
import { User } from "@/types/auth";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function ProfilePage() {
  const t = await getTranslations("ProfilePage");
  const { data, error } = await serverApi.get<{ user: User }>("/api/auth/me");
  if (error || !data) {
    const locale = await getLocale();
    redirect(`/${locale}/login`);
  }

  const { user } = data;

  return (
    <div className="px-8 pt-8 max-w-lg">
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-sm text-fog hover:text-parchment transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        {t("backToBooks")}
      </Link>

      <h1 className="font-serif text-parchment text-2xl mb-8">{t("title")}</h1>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-surface border border-border-soft flex items-center justify-center shrink-0">
          <span className="font-serif text-amber text-xl">
            {user.first_name[0]}{user.last_name[0]}
          </span>
        </div>
        <div>
          <p className="text-parchment font-medium text-lg">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-fog text-sm">{user.email}</p>
        </div>
      </div>

      <div className="grid gap-5">
        <Field label={t("firstName")} value={user.first_name} />
        <Field label={t("lastName")} value={user.last_name} />
        <Field label={t("email")} value={user.email} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-fog/60 uppercase tracking-wider">{label}</span>
      <span className="text-sm text-parchment">{value}</span>
    </div>
  );
}
