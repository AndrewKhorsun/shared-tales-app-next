"use client";

import { useTranslations } from "next-intl";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createBookPlanSchema,
  characterSchema,
  type CreateBookPlanDto,
} from "@/lib/validations/book-plan.schema";
import { upperCaseFirstLetter } from "@/lib/utils";
import { BookPlan } from "@/types";
import { api } from "@/lib/api";
import { useState } from "react";
import { useActiveSection } from "@/hooks/use-active-section";
import { useRouter, Link } from "@/i18n/navigation";
import { CharacterModal } from "./character-modal";
import { Tooltip } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type CharacterDto = z.infer<typeof characterSchema>;

const LANGUAGES = createBookPlanSchema.shape.language.options;

const ROLE_COLORS: Record<string, string> = {
  protagonist: "#6E9B7B",
  antagonist: "#9B4A35",
  supporting: "#C9A96E",
};

const inputClass =
  "w-full bg-input border border-border-soft rounded-[8px] px-3 py-2.5 font-sans text-sm text-parchment placeholder:text-fog/50 outline-none transition-[border] focus:border-border-active";

const textareaClass =
  "w-full bg-input border border-border-soft rounded-[8px] px-3 py-2.5 font-serif-body text-sm leading-relaxed text-parchment placeholder:text-fog/50 outline-none transition-[border] focus:border-border-active resize-none overflow-hidden [field-sizing:content]";

const SECTIONS = [
  { id: "core", labelKey: "nav.core" },
  { id: "world", labelKey: "nav.world" },
  { id: "arc", labelKey: "nav.arc" },
  { id: "cast", labelKey: "nav.cast" },
  { id: "summaries", labelKey: "nav.summaries" },
] as const;

function Field({ label, tooltip, hint, children }: { label: string; tooltip?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-[11px] uppercase tracking-[.06em] text-fog/87 font-medium">{label}</label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <button type="button" className="text-fog/40 hover:text-fog/70 transition-colors cursor-default">
              <Info size={11} />
            </button>
          </Tooltip>
        )}
      </div>
      {children}
      {hint && <div className="text-sm text-fog/60 font-serif-body italic">{hint}</div>}
    </div>
  );
}

function SectionBlock({
  id, title, sub, action, children,
}: {
  id: string; title: string; sub?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-[18px]" style={{ scrollMarginTop: 24 }}>
      <div className="flex items-end justify-between pb-2.5 border-b border-border-soft">
        <div>
          <h2 className="font-serif text-[22px] text-parchment font-normal m-0">{title}</h2>
          {sub && <div className="font-serif-body italic text-[15px] text-fog/80 mt-1">{sub}</div>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

interface BookPlanFormProps {
  bookId: string;
  bookTitle?: string;
  existingPlan?: BookPlan;
}

export function BookPlanForm({ bookId, bookTitle, existingPlan }: BookPlanFormProps) {
  const t = useTranslations("BookPlanForm");
  const router = useRouter();
  const activeSection = useActiveSection(SECTIONS.map((s) => s.id));
  const [characterEditingIndex, setCharacterEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [planExists, setPlanExists] = useState(!!existingPlan);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreateBookPlanDto>({
    resolver: zodResolver(createBookPlanSchema),
    defaultValues: existingPlan
      ? {
          genre: existingPlan.genre,
          target_audience: existingPlan.target_audience,
          writing_style: existingPlan.writing_style,
          language: existingPlan.language,
          total_chapters: existingPlan.total_chapters,
          generation_settings: existingPlan.generation_settings,
        }
      : undefined,
  });

  const {
    fields: characterFields,
    append: appendCharacter,
    remove: removeCharacter,
    update: updateCharacter,
  } = useFieldArray({ control, name: "generation_settings.characters" });

  const { fields: chapterFields } = useFieldArray({ control, name: "generation_settings.chapter_summaries" });

  function handleSaveCharacter(character: CharacterDto) {
    if (characterEditingIndex === null) return;
    if (characterEditingIndex === -1) {
      appendCharacter(character);
    } else {
      updateCharacter(characterEditingIndex, character);
    }
    setCharacterEditingIndex(null);
  }

  async function onSubmit(data: CreateBookPlanDto) {
    setIsSaving(true);
    setSaveError(null);
    try {
      const method = planExists ? "put" : "post";
      const { error } = await api[method](`/api/books/${bookId}/plan`, data);
      if (error) {
        setSaveError(error);
        return;
      }
      setPlanExists(true);
      reset(data);
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t("failedToSave"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div
        className="flex flex-1"
        style={{ maxWidth: 1180, width: "100%", margin: "0 auto", padding: "32px 32px 64px 0", gap: 36, boxSizing: "border-box" }}
      >
        {/* Side TOC */}
        <aside className="w-[200px] shrink-0 fixed self-start" style={{ top: 52 + 32, paddingLeft: 32 }}>
          {bookTitle && (
            <Link
              href={`/books/${bookId}`}
              className="inline-flex items-center gap-1.5 text-xs text-fog mb-4 no-underline hover:text-parchment transition-colors"
            >
              ← {bookTitle}
            </Link>
          )}
          <div className="text-[11px] text-fog/67 tracking-[.14em] uppercase mb-3.5 font-semibold">
            {t("nav.bookPlan")}
          </div>
          <div className="flex flex-col gap-0.5">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`text-sm px-2.5 py-1.5 rounded-md font-sans no-underline transition-colors ${
                  activeSection === s.id
                    ? "text-amber bg-amber/10"
                    : "text-fog hover:text-parchment"
                }`}
              >
                {t(s.labelKey)}
              </a>
            ))}
          </div>
          <div className="mt-8 p-3.5 bg-surface rounded-[10px] border border-border-soft">
            <div className="text-[11px] text-amber tracking-[.14em] uppercase font-semibold mb-2">
              ✺ {t("whyMatters.title")}
            </div>
            <div className="text-sm text-fog leading-[1.55] font-serif-body">
              {t("whyMatters.body")}
            </div>
          </div>
        </aside>

        {/* Form */}
        <main className="flex-1 min-w-0" style={{ marginLeft: 236, paddingTop: 0 }}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-9">
            {/* Page header */}
            <div>
              {bookTitle && (
                <div className="text-[11px] text-fog/67 tracking-[.14em] uppercase mb-2">{bookTitle}</div>
              )}
              <h1 className="font-serif text-[40px] text-parchment m-0 font-normal">{t("pageTitle")}</h1>
              <p className="font-serif-body italic text-[15px] text-fog mt-2.5 max-w-[580px]">
                {t("pageSubtitle")}
              </p>
            </div>

            {/* Core */}
            <SectionBlock id="core" title={t("sections.main")} sub={t("sections.mainSub")}>
              <div className="grid grid-cols-2 gap-[18px]">
                <Field label={t("fields.genre")} tooltip={t("fields.genreTooltip")}>
                  <input
                    {...register("genre")}
                    placeholder={t("fields.genrePlaceholder")}
                    className={inputClass}
                  />
                  {errors.genre && <p className="text-xs text-rust">{errors.genre.message}</p>}
                </Field>
                <Field label={t("fields.language")} tooltip={t("fields.languageTooltip")}>
                  <select
                    {...register("language")}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>{t("fields.languagePlaceholder")}</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{upperCaseFirstLetter(lang)}</option>
                    ))}
                  </select>
                  {errors.language && <p className="text-xs text-rust">{errors.language.message}</p>}
                </Field>
              </div>

              <Field label={t("fields.totalChapters")} tooltip={t("fields.totalChaptersTooltip")}>
                <input
                  {...register("total_chapters", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  max={100}
                  placeholder={t("fields.totalChaptersPlaceholder")}
                  className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
                {errors.total_chapters && (
                  <p className="text-xs text-rust">{errors.total_chapters.message}</p>
                )}
              </Field>

              <Field label={t("fields.targetAudience")} tooltip={t("fields.targetAudienceTooltip")}>
                <input
                  {...register("target_audience")}
                  placeholder={t("fields.targetAudiencePlaceholder")}
                  className={inputClass}
                />
                {errors.target_audience && (
                  <p className="text-xs text-rust">{errors.target_audience.message}</p>
                )}
              </Field>

              <Field
                label={t("fields.writingStyle")}
                tooltip={t("fields.writingStyleTooltip")}
              >
                <textarea
                  {...register("writing_style")}
                  placeholder={t("fields.writingStylePlaceholder")}
                  rows={3}
                  className={textareaClass}
                />
                {errors.writing_style && (
                  <p className="text-xs text-rust">{errors.writing_style.message}</p>
                )}
              </Field>
            </SectionBlock>

            {/* World */}
            <SectionBlock id="world" title={t("sections.world")} sub={t("sections.worldSub")}>
              <Field label={t("fields.world")} tooltip={t("fields.worldTooltip")}>
                <textarea
                  {...register("generation_settings.setting.world")}
                  placeholder={t("fields.worldPlaceholder")}
                  rows={3}
                  className={textareaClass}
                />
                {errors.generation_settings?.setting?.world && (
                  <p className="text-xs text-rust">{errors.generation_settings.setting.world.message}</p>
                )}
              </Field>

              <Field label={t("fields.atmosphere")} tooltip={t("fields.atmosphereTooltip")}>
                <textarea
                  {...register("generation_settings.setting.atmosphere")}
                  placeholder={t("fields.atmospherePlaceholder")}
                  rows={3}
                  className={textareaClass}
                />
                {errors.generation_settings?.setting?.atmosphere && (
                  <p className="text-xs text-rust">{errors.generation_settings.setting.atmosphere.message}</p>
                )}
              </Field>
            </SectionBlock>

            {/* Arc */}
            <SectionBlock id="arc" title={t("sections.plot")} sub={t("sections.plotSub")}>
              <Field label={t("fields.premise")} tooltip={t("fields.premiseTooltip")}>
                <textarea
                  {...register("generation_settings.plot_arc.premise")}
                  placeholder={t("fields.premisePlaceholder")}
                  rows={2}
                  className={textareaClass}
                />
                {errors.generation_settings?.plot_arc?.premise && (
                  <p className="text-xs text-rust">{errors.generation_settings.plot_arc.premise.message}</p>
                )}
              </Field>

              <Field label={t("fields.conflict")} tooltip={t("fields.conflictTooltip")}>
                <textarea
                  {...register("generation_settings.plot_arc.conflict")}
                  placeholder={t("fields.conflictPlaceholder")}
                  rows={2}
                  className={textareaClass}
                />
                {errors.generation_settings?.plot_arc?.conflict && (
                  <p className="text-xs text-rust">{errors.generation_settings.plot_arc.conflict.message}</p>
                )}
              </Field>

              <Field label={t("fields.resolution")} tooltip={t("fields.resolutionTooltip")}>
                <textarea
                  {...register("generation_settings.plot_arc.resolution")}
                  placeholder={t("fields.resolutionPlaceholder")}
                  rows={2}
                  className={textareaClass}
                />
                {errors.generation_settings?.plot_arc?.resolution && (
                  <p className="text-xs text-rust">{errors.generation_settings.plot_arc.resolution.message}</p>
                )}
              </Field>
            </SectionBlock>

            {/* Cast */}
            <SectionBlock
              id="cast"
              title={t("sections.characters")}
              sub={t("sections.charactersSub")}
              action={
                <button
                  type="button"
                  onClick={() => setCharacterEditingIndex(-1)}
                  className="bg-elevated text-fog border border-border-soft px-3 py-1.5 rounded-md font-sans text-xs cursor-pointer hover:text-parchment transition-colors"
                >
                  + {t("characters.addCharacter")}
                </button>
              }
            >
              {characterFields.length > 0 && (
                <div className="flex flex-col gap-3.5">
                  {characterFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-[18px] bg-surface border border-border-soft rounded-[10px] flex items-center gap-4"
                      style={{ borderLeft: `3px solid ${ROLE_COLORS[field.role] ?? "#C9A96E"}` }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-parchment truncate">{field.name}</div>
                        <div className="text-xs text-fog/70 capitalize mt-0.5">{field.role}</div>
                        {field.description && (
                          <div className="text-xs text-fog/70 mt-1 line-clamp-2">{field.description}</div>
                        )}
                      </div>
                      <div className="flex gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => setCharacterEditingIndex(index)}
                          className="text-xs text-fog hover:text-parchment transition-colors"
                        >
                          {t("characters.edit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCharacter(index)}
                          className="text-xs text-rust hover:text-rust/80 transition-colors"
                        >
                          {t("characters.remove")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionBlock>

            {/* Chapter Summaries */}
            <SectionBlock
              id="summaries"
              title={t("sections.chapterSummaries")}
              sub={t("sections.chapterSummariesSub")}
            >
              {chapterFields.length === 0 ? (
                <p className="text-sm text-fog/50 italic">{t("chapterSummaries.empty")}</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
                  {chapterFields.map((field, index) => (
                    <div key={field.id} className="grid gap-3 items-center" style={{ gridTemplateColumns: "60px 1fr" }}>
                      <span className="font-mono text-[11px] text-fog/67 text-center tracking-[.06em]">
                        CH {String(field.chapter).padStart(2, "0")}
                      </span>
                      <div>
                        <textarea
                          {...register(`generation_settings.chapter_summaries.${index}.summary`)}
                          placeholder={t("chapterSummaries.placeholder")}
                          rows={1}
                          className={textareaClass}
                        />
                        {errors.generation_settings?.chapter_summaries?.[index]?.summary && (
                          <p className="mt-1 text-xs text-rust">{t("chapterSummaries.summaryCannotBeEmpty")}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionBlock>

            {saveError && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-[8px] bg-rust/10 border border-rust/30 text-sm text-rust">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{saveError}</span>
              </div>
            )}

            <div className="flex gap-3 justify-end py-5 border-t border-border-soft">
              <button
                type="button"
                onClick={() => reset()}
                disabled={!isDirty}
                className="disabled:opacity-40 disabled:cursor-not-allowed bg-transparent text-fog border border-border-mid px-[18px] py-2.5 rounded-[8px] font-sans text-[13px] cursor-pointer hover:text-parchment transition-colors"
              >
                {t("discardChanges")}
              </button>
              <button
                type="submit"
                disabled={!isDirty || isSaving}
                className="disabled:opacity-50 disabled:cursor-not-allowed bg-amber text-canvas border-0 px-[22px] py-2.5 rounded-[8px] font-sans text-[13px] font-medium cursor-pointer hover:bg-amber/90 transition-colors"
              >
                {isSaving ? t("saving") : t("save")}
              </button>
            </div>
          </form>
        </main>
      </div>

      <CharacterModal
        key={characterEditingIndex}
        isOpen={characterEditingIndex !== null}
        onClose={() => setCharacterEditingIndex(null)}
        onSave={handleSaveCharacter}
        defaultValues={
          characterEditingIndex !== null && characterEditingIndex !== -1
            ? characterFields[characterEditingIndex]
            : undefined
        }
      />
    </>
  );
}
