import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { useEffect } from "react";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { cn } from "@/lib/utils";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "text-muted-foreground absolute top-4 left-4 overflow-hidden text-ellipsis select-none pointer-events-none",
  paragraph: "mb-2 relative",
};

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

function OnChangePluginWrapper({ onChange }: { onChange: (value: string) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return editor.registerUpdateListener(({ editorState }: { editorState: any }) => {
      onChange(JSON.stringify(editorState.toJSON()));
    });
  }, [editor, onChange]);
  return null;
}

export const RichTextEditor = ({ value, onChange, placeholder, error }: EditorProps) => {
  const initialConfig = {
    namespace: "RichTextEditor",
    theme,
    onError: (error: Error) => {
      // eslint-disable-next-line no-console
      console.error(error);
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
      // @ts-expect-error Lexical types for editorState can be strict but we are passing a validated JSON string representation of it from the server/client
      initialConfig.editorState = value;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Invalid rich text value passed", e);
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
        error && "border-destructive focus-within:ring-destructive"
      )}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative w-full">
          <RichTextPlugin
            contentEditable={<ContentEditable className="min-h-[150px] w-full outline-none" />}
            placeholder={<div className={theme.placeholder}>{placeholder || "Enter text..."}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <MarkdownShortcutPlugin />
          {onChange && <OnChangePluginWrapper onChange={onChange} />}
        </div>
      </LexicalComposer>
    </div>
  );
};
