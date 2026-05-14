import { serverApi } from "@/lib/server-api";
import { BooksResponse } from "@/types/books";
import { BookGrid } from "@/components/books/book-grid";
import { CreateBookModal } from "@/components/books/create-book-modal";
import { getTranslations } from "next-intl/server";

export default async function BooksPage() {
  const t = await getTranslations("BooksPage");
  const { data, error } = await serverApi.get<BooksResponse>("/api/books");

  if (error) {
    return <p className="text-fog text-sm">{error}</p>;
  }

  if (!data || data.books.length === 0) {
    return (
      <div className="px-8 pt-8 flex flex-col items-center justify-center py-24 gap-3 text-center">
        <p className="font-serif text-parchment text-xl">{t("noBooksTitle")}</p>
        <p className="text-fog text-sm font-light">{t("noBooksSubtitle")}</p>
        <CreateBookModal />
      </div>
    );
  }

  return (
    <div>
      <div className="px-8 pt-8 pb-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog mb-4">{t("theLibrary")}</p>
        <h1 className="font-serif text-[44px] font-normal text-parchment leading-[1.1] mb-2">{t("yourBooks")}</h1>
        <p className="font-serif-body italic text-[15px] text-fog mb-6">
          {data.books.length} {data.books.length === 1 ? t("bookSingular") : t("bookPlural")} {t("inYourCollection")}
        </p>
      </div>
      <div className="px-8 pt-6">
        <BookGrid books={data.books} />
      </div>
    </div>
  );
}
