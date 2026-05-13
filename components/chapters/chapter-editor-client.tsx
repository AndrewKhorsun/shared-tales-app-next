"use client";

import { useState, useCallback } from "react";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  toolbarPlugin,
  diffSourcePlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  Separator,
  UndoRedo,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  StrikeThroughSupSubToggles,
  HighlightToggle,
  DiffSourceToggleWrapper,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import type { ChapterEditorProps } from "./chapter-editor";

function countWords(markdown: string) {
  return markdown
    .replace(/[#*_~`>\[\]()!-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export default function ChapterEditorClient({
  onSave,
  isDirty,
  saveState,
  onChange,
  ...props
}: ChapterEditorProps) {
  const [wordCount, setWordCount] = useState(() =>
    countWords(props.markdown ?? ""),
  );

  const handleChange = useCallback(
    (value: string, normalized: boolean) => {
      setWordCount(countWords(value));
      onChange?.(value, normalized);
    },
    [onChange],
  );

  return (
    <MDXEditor
      contentEditableClassName="prose prose-invert max-w-none focus:outline-none"
      {...props}
      onChange={handleChange}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper options={["rich-text", "source"]}>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />

              <HighlightToggle />
              <Separator />
              <BlockTypeSelect />
              <Separator />
              <ListsToggle />
              <Separator />
              <CreateLink />
              <InsertTable />
              <InsertThematicBreak />
              <Separator />
              <span
                className="px-2 text-xs tabular-nums select-none"
                style={{ color: "rgba(232,213,170,0.6)" }}
              >
                {wordCount.toLocaleString()} words
              </span>
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={!isDirty || saveState === "saving"}
                  className="ml-auto px-3 py-1 text-sm rounded transition-colors bg-moss text-canvas disabled:opacity-30 enabled:hover:bg-sage"
                >
                  {saveState === "saving"
                    ? "Saving..."
                    : saveState === "saved"
                      ? "Saved"
                      : "Save"}
                </button>
              )}
            </DiffSourceToggleWrapper>
          ),
        }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        diffSourcePlugin({ viewMode: "rich-text" }),
        markdownShortcutPlugin(),
      ]}
    />
  );
}
