"use client";

import { useEffect, useCallback, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Highlighter } from "lucide-react";
import { cn } from "@/lib/utils";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder:
    "text-muted-foreground absolute top-0 left-0 overflow-hidden text-ellipsis select-none pointer-events-none",
  paragraph: "mb-2 relative",
  heading: {
    h2: "text-xl font-bold mb-2",
    h3: "text-lg font-semibold mb-1",
  },
  list: {
    ul: "list-disc mb-2 list-inside",
    ol: "list-decimal mb-2 list-inside",
    listitem: "mb-1",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    highlight: "bg-yellow-200 dark:bg-yellow-400/40 rounded-sm px-0.5",
  },
};

// ── Toolbar ─────────────────────────────────────────────────────────────────

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsHighlight(selection.hasFormat("highlight"));
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  const btn = (active: boolean) =>
    cn(
      "flex h-7 w-7 items-center justify-center rounded text-sm transition-colors",
      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-input pb-2 mb-2">
      {/* format */}
      <button
        type="button"
        className={btn(isBold)}
        title="Bold (Ctrl+B)"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        <Bold className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className={btn(isItalic)}
        title="Italic (Ctrl+I)"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        <Italic className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className={btn(isUnderline)}
        title="Underline (Ctrl+U)"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
      >
        <Underline className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className={btn(isStrikethrough)}
        title="Strikethrough"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        title="Highlight"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        }}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded text-sm transition-colors",
          isHighlight
            ? "bg-yellow-300 text-yellow-900 dark:bg-yellow-400/60"
            : "text-muted-foreground hover:bg-yellow-100 hover:text-yellow-800 dark:hover:bg-yellow-400/20",
        )}
      >
        <Highlighter className="h-3.5 w-3.5" />
      </button>

      <div className="mx-1 h-5 w-px bg-border" />

      {/* lists */}
      <button
        type="button"
        className={btn(false)}
        title="Bullet List"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
      >
        <List className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className={btn(false)}
        title="Numbered List"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ── OnChange sync ────────────────────────────────────────────────────────────

function OnChangePlugin({ onChange }: { onChange: (value: string) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return editor.registerUpdateListener(({ editorState }: { editorState: any }) => {
      onChange(JSON.stringify(editorState.toJSON()));
    });
  }, [editor, onChange]);
  return null;
}

// ── Public component ─────────────────────────────────────────────────────────

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

export const RichTextEditor = ({ value, onChange, placeholder, error }: EditorProps) => {
  const initialConfig: Parameters<typeof LexicalComposer>[0]["initialConfig"] = {
    namespace: "RichTextEditor",
    theme,
    onError: (err: Error) => {
      // eslint-disable-next-line no-console
      console.error(err);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      HorizontalRuleNode,
    ],
  };

  if (value) {
    try {
      // @ts-expect-error Lexical editorState can be initialised from a JSON string
      initialConfig.editorState = value;
    } catch {
      // ignore invalid saved state
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
        error && "border-destructive focus-within:ring-destructive",
      )}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative w-full">
          <RichTextPlugin
            contentEditable={<ContentEditable className="min-h-[130px] w-full outline-none" />}
            placeholder={<div className={theme.placeholder}>{placeholder || "Enter text..."}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          {onChange && <OnChangePlugin onChange={onChange} />}
        </div>
      </LexicalComposer>
    </div>
  );
};

export const RichTextRenderer = ({ value }: { value: string }) => {
  const initialConfig: Parameters<typeof LexicalComposer>[0]["initialConfig"] = {
    namespace: "RichTextRenderer",
    theme,
    editable: false,
    onError: (err: Error) => {
      // eslint-disable-next-line no-console
      console.error(err);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      HorizontalRuleNode,
    ],
  };

  if (value) {
    try {
      // @ts-expect-error Lexical editorState can be initialised from a JSON string
      initialConfig.editorState = value;
    } catch {
      // ignore
    }
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative w-full">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="w-full outline-none prose prose-sm max-w-none dark:prose-invert" />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
      </div>
    </LexicalComposer>
  );
};
