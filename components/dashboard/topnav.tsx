"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { User } from "@/types/auth";
import { ProfileDropdown } from "./profile-dropdown";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { BookOpen } from "lucide-react";

export function TopNav({ user }: { user: User }) {
  const t = useTranslations("TopNav");
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname.includes(href);
  };

  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

  return (
    <nav className="w-full h-[52px] bg-page border-b border-border-soft flex items-center justify-between px-6">
      <Link href="/books" className="font-serif text-amber text-[22px] tracking-[0.02em]">
        Shared Tales
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/books"
          className={`text-sm rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
            isActive("/books")
              ? "bg-surface text-parchment font-medium"
              : "text-fog hover:text-parchment"
          }`}
        >
          {t("myBooks")}
        </Link>

        <Link
          href="/profile"
          className={`text-sm rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
            isActive("/profile")
              ? "bg-surface text-parchment font-medium"
              : "text-fog hover:text-parchment"
          }`}
        >
          {t("profile")}
        </Link>

        <div className="w-px h-5 bg-border-soft mx-1" />

        <LocaleSwitcher />

        <div className="w-px h-5 bg-border-soft mx-1" />

        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-onboarding"))}
          className="flex items-center gap-1.5 text-fog hover:text-parchment transition-colors text-xs px-2.5 py-1 rounded-md border border-border-soft hover:border-border-mid hover:bg-surface cursor-pointer"
          title="Guide"
        >
          <BookOpen size={14} />
          Guide
        </button>

        <div className="w-px h-5 bg-border-soft mx-1" />

        <ProfileDropdown
          user={user}
          trigger={
            <div className="w-[30px] h-[30px] rounded-full bg-amber-dim flex items-center justify-center font-serif text-[13px] text-parchment cursor-pointer">
              {initials}
            </div>
          }
        />
      </div>
    </nav>
  );
}
