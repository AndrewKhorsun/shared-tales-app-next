"use client";

import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useEffect, useReducer, useState } from "react";
import ReactMarkdown from "react-markdown";
import { TriangleAlert } from "lucide-react";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "plan_review"; plan: string }
  | { status: "generating" }
  | { status: "done"; content: string }
  | { status: "error_planner"; message: string }
  | { status: "error_writer"; message: string; plan: string | null };

type Action =
  | { type: "GENERATE" }
  | { type: "PLAN_READY"; plan: string }
  | { type: "APPROVE" }
  | { type: "REVISE" }
  | { type: "DONE"; content: string }
  | { type: "ERROR"; stage: string; message: string; plan?: string | null }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "GENERATE":
      return { status: "loading" };
    case "PLAN_READY":
      return { status: "plan_review", plan: action.plan };
    case "APPROVE":
      return { status: "generating" };
    case "REVISE":
      return { status: "loading" };
    case "DONE":
      return { status: "done", content: action.content };
    case "ERROR":
      if (action.stage === "writer" || action.stage === "editor") {
        return { status: "error_writer", message: action.message, plan: action.plan ?? null };
      }
      return { status: "error_planner", message: action.message };
    case "RESET":
      return { status: "idle" };
    default:
      return state;
  }
}

interface GenerationPanelProps {
  bookId: string;
  chapterId: string;
  onContentGenerated: () => void;
}

export function GenerationPanel({
  bookId,
  chapterId,
  onContentGenerated,
}: GenerationPanelProps) {
  const t = useTranslations("GenerationPanel");
  const [state, dispatch] = useReducer(reducer, { status: "idle" });
  const [progressMessage, setProgressMessage] = useState("");
  const [hint, setHint] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleGenerate = async () => {
    dispatch({ type: "GENERATE" });
    await api.post(
      `/api/books/${bookId}/chapters/${chapterId}/generate`,
      hint ? { hint } : {}
    );
  };

  const handleApprove = async () => {
    dispatch({ type: "APPROVE" });
    await api.post(`/api/books/${bookId}/chapters/${chapterId}/feedback`, {
      approved: true,
    });
  };

  const handleRevise = async () => {
    dispatch({ type: "REVISE" });
    setFeedback("");
    await api.post(`/api/books/${bookId}/chapters/${chapterId}/feedback`, {
      approved: false,
      feedback,
    });
  };

  useEffect(() => {
    api.get<{ status: string; plan: string | null }>(
      `/api/books/${bookId}/chapters/${chapterId}/state`
    ).then(({ data }) => {
      if (!data) return;
      if (data.status === "waiting_approval" && data.plan) {
        dispatch({ type: "PLAN_READY", plan: data.plan });
      } else if (data.status === "generating") {
        dispatch({ type: "APPROVE" });
      }
    });
  }, [bookId, chapterId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("chapter:plan_ready", (data) => {
      dispatch({ type: "PLAN_READY", plan: data.plan });
    });

    socket.on("chapter:done", (data) => {
      dispatch({ type: "DONE", content: data.content });
      onContentGenerated();
    });

    socket.on("chapter:progress", (data: { stage: string; message: string }) => {
      setProgressMessage(data.message);
    });

    socket.on("chapter:error", (data) => {
      dispatch({ type: "ERROR", stage: data.stage ?? "planner", message: data.message, plan: data.plan });
    });

    return () => {
      socket.off("chapter:plan_ready");
      socket.off("chapter:done");
      socket.off("chapter:progress");
      socket.off("chapter:error");
    };
  }, [onContentGenerated]);

  return (
    <div className="flex flex-col gap-6 p-6 rounded-xl bg-surface border border-border-soft">
      <div className="flex items-center gap-2">
        <span className="text-amber-dim">✦</span>
        <h2 className="text-sm font-medium text-parchment">{t("title")}</h2>
      </div>

      {state.status === "idle" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-fog font-light">
              {t("hintLabel")} <span className="text-fog/40">{t("hintOptional")}</span>
            </label>
            <textarea
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder={t("hintPlaceholder")}
              rows={3}
              className="bg-elevated rounded-lg px-3 py-2 text-sm text-parchment placeholder:text-fog/40 outline-none focus:ring-1 focus:ring-fog/30 transition resize-none"
            />
          </div>
          <button
            onClick={handleGenerate}
            className="self-start px-4 py-2 rounded-lg text-sm bg-amber-dim text-parchment hover:bg-amber transition-colors cursor-pointer"
          >
            {t("generate")}
          </button>
        </div>
      )}

      {state.status === "loading" && (
        <div className="flex items-center gap-3 text-fog text-sm">
          <span className="animate-pulse">◆</span>
          <span>{progressMessage || t("generatingPlan")}</span>
        </div>
      )}

      {state.status === "plan_review" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-fog font-light uppercase tracking-wider">
              {t("chapterPlan")}
            </p>
            <div className="plan-prose prose prose-sm max-w-none">
              <ReactMarkdown>{state.plan}</ReactMarkdown>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleApprove}
              className="self-start px-4 py-2 rounded-lg text-sm bg-amber-dim text-parchment hover:bg-amber transition-colors cursor-pointer"
            >
              {t("approve")}
            </button>
            <div className="flex flex-col gap-1.5">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t("revisePlaceholder")}
                rows={2}
                className="bg-elevated rounded-lg px-3 py-2 text-sm text-parchment placeholder:text-fog/40 outline-none focus:ring-1 focus:ring-fog/30 transition resize-none"
              />
              <button
                onClick={handleRevise}
                disabled={!feedback.trim()}
                className="self-start px-4 py-2 rounded-lg text-sm text-fog hover:text-parchment border border-border-soft hover:border-fog/40 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {t("revisePlan")}
              </button>
            </div>
          </div>
        </div>
      )}

      {state.status === "generating" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-fog text-sm">
            <span className="animate-pulse">◆</span>
            <span>{progressMessage || t("writingChapter")}</span>
          </div>
          {progressMessage && (
            <p className="text-xs text-fog/50 pl-6">{t("takesAMinute")}</p>
          )}
        </div>
      )}

      {state.status === "done" && (
        <div className="flex items-center gap-3 text-fog text-sm">
          <span className="text-amber-dim">✦</span>
          <span>{t("writtenSuccessfully")}</span>
        </div>
      )}

      {state.status === "error_planner" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-rust/10 border border-rust/30 text-sm text-rust">
            <TriangleAlert size={15} className="shrink-0 mt-0.5" />
            <span>{state.message}</span>
          </div>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="self-start px-4 py-2 rounded-lg text-sm text-fog hover:text-parchment border border-border-soft hover:border-fog/40 transition-colors cursor-pointer"
          >
            {t("tryAgain")}
          </button>
        </div>
      )}

      {state.status === "error_writer" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-rust/10 border border-rust/30 text-sm text-rust">
            <TriangleAlert size={15} className="shrink-0 mt-0.5" />
            <span>{state.message}</span>
          </div>
          {state.plan && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-fog font-light uppercase tracking-wider">
                {t("chapterPlan")}
              </p>
              <div className="plan-prose prose prose-sm max-w-none">
                <ReactMarkdown>{state.plan}</ReactMarkdown>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleApprove}
                  className="self-start px-4 py-2 rounded-lg text-sm bg-amber-dim text-parchment hover:bg-amber transition-colors cursor-pointer"
                >
                  {t("approve")}
                </button>
                <div className="flex flex-col gap-1.5">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={t("revisePlaceholder")}
                    rows={2}
                    className="bg-elevated rounded-lg px-3 py-2 text-sm text-parchment placeholder:text-fog/40 outline-none focus:ring-1 focus:ring-fog/30 transition resize-none"
                  />
                  <button
                    onClick={handleRevise}
                    disabled={!feedback.trim()}
                    className="self-start px-4 py-2 rounded-lg text-sm text-fog hover:text-parchment border border-border-soft hover:border-fog/40 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {t("revisePlan")}
                  </button>
                </div>
              </div>
            </div>
          )}
          {!state.plan && (
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="self-start px-4 py-2 rounded-lg text-sm text-fog hover:text-parchment border border-border-soft hover:border-fog/40 transition-colors cursor-pointer"
            >
              {t("tryAgain")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
