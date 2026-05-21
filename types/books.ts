import type { BookLanguage } from "@/lib/validations/book-plan.schema";

export interface Book {
  id: number;
  title: string;
  description: string;
  content: string;
  author_id: number;
  author_name: string;
  created_at: string;
  updated_at: string;
  category_id?: number | null;
  rating?: string;
  views?: number;
  total_chapters?: number;
  published_chapters?: number;
  total_word_count?: number;
  has_generating_chapter?: boolean;
  cover_image_url?: string | null;
}

export interface BooksResponse {
  books: Book[];
  total: number;
}

export interface BookPlan {
  id: number;
  book_id: number;
  genre: string;
  target_audience: string;
  writing_style: string;
  language: BookLanguage;
  total_chapters?: number;
  generation_settings: {
    characters: Array<{
      name: string;
      role: "protagonist" | "antagonist" | "supporting";
      description: string;
      traits: string[];
    }>;
    setting: {
      world: string;
      atmosphere: string;
    };
    plot_arc: {
      premise: string;
      conflict: string;
      resolution: string;
    };
    chapter_summaries: Array<{
      chapter: number;
      summary: string;
    }>;
  };
  created_at: string;
  updated_at: string;
}
