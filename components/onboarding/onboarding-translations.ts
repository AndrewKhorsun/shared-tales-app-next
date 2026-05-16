export type OnboardingLocale = "en" | "uk";

export interface OnboardingStep {
  title: string;
  description: string;
}

export interface OnboardingT {
  prev: string;
  next: string;
  finish: string;
  steps: OnboardingStep[];
}

export const ONBOARDING_TRANSLATIONS: Record<OnboardingLocale, OnboardingT> = {
  en: {
    prev: "Back",
    next: "Next",
    finish: "Start writing",
    steps: [
      {
        title: "Welcome to Shared Tales",
        description:
          'This is your book library. Click "+ New Book" to create your first project. In the top-right corner you can switch the app language between EN and UA at any time.',
      },
      {
        title: "Create your first book",
        description:
          "Give your book a title and a short description — don't worry about perfection, you can edit everything later. Click Create and your book is ready.",
      },
      {
        title: "Your book's home",
        description:
          'Upload a cover to personalize your book. Click "Edit book plan" to go to the plan, or "Continue writing" to jump straight to chapters. Export to Word is available now — PDF and EPUB are coming soon.',
      },
      {
        title: "Fill in the book plan",
        description:
          "The plan is the brain of your story. Fill in genre, characters, world, conflict, and resolution. The AI reads every field when generating chapters — the richer the plan, the better the prose.",
      },
      {
        title: "Start your first chapter",
        description:
          'When the plan is ready, go to the Chapters tab. Click the "+" next to CHAPTERS in the sidebar, or use the "Begin your story" button in the center to create your first chapter.',
      },
      {
        title: "Name your chapter",
        description:
          "Give the chapter a title — it can be anything, you'll always be able to rename it. Then hit Create and you'll land inside the chapter editor.",
      },
      {
        title: "Generate with AI",
        description:
          'You\'re inside the chapter. Add an optional hint to guide the AI — a direction, a mood, a scene idea — then click "Generate chapter". The AI will draft a plan first, you approve it, and the chapter is written automatically.',
      },
    ],
  },
  uk: {
    prev: "Назад",
    next: "Далі",
    finish: "Почати писати",
    steps: [
      {
        title: "Ласкаво просимо до Shared Tales",
        description:
          "Це ваша бібліотека книг. Натисніть «+ New Book» щоб створити перший проект. У правому верхньому куті можна будь-коли змінити мову додатку між EN та UA.",
      },
      {
        title: "Створіть свою першу книгу",
        description:
          "Дайте книзі назву і короткий опис — не переймайтесь досконалістю, усе можна відредагувати пізніше. Натисніть Create і книга готова.",
      },
      {
        title: "Головна сторінка книги",
        description:
          "Завантажте обкладинку щоб персоналізувати книгу. Натисніть «Edit book plan» щоб перейти до плану, або «Continue writing» щоб одразу до розділів. Експорт у Word доступний зараз — PDF та EPUB незабаром.",
      },
      {
        title: "Заповніть план книги",
        description:
          "План — це мозок вашої історії. Заповніть жанр, персонажів, світ, конфлікт і розв'язку. ШІ читає кожне поле при генерації розділів — чим багатший план, тим краща проза.",
      },
      {
        title: "Почніть першу главу",
        description:
          "Коли план готовий, перейдіть на вкладку Chapters. Натисніть «+» поруч із CHAPTERS у сайдбарі або кнопку «Begin your story» по центру щоб створити першу главу.",
      },
      {
        title: "Назвіть свою главу",
        description:
          "Дайте главі назву — будь-яку, її завжди можна перейменувати. Натисніть Create і ви потрапите всередину редактора глави.",
      },
      {
        title: "Генерація за допомогою ШІ",
        description:
          "Ви всередині глави. Додайте необов'язкову підказку для ШІ — напрямок, настрій, ідею сцени — і натисніть «Generate chapter». ШІ спочатку складе план, ви його затвердите, і глава буде написана автоматично.",
      },
    ],
  },
};
