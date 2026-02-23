import { Editor } from "@tiptap/react";

export type SlashItem = {
  title: string;
  description: string;
  searchTerms: string[];
  command: (editor: Editor) => void;
};

export function getSlashItems(): SlashItem[] {
  return [
    {
      title: "Text",
      description: "Start writing with plain text.",
      searchTerms: ["paragraph", "text", "p"],
      command: (ed) => ed.chain().focus().setParagraph().run(),
    },
    {
      title: "Heading 1",
      description: "Big section heading.",
      searchTerms: ["h1", "heading", "title"],
      command: (ed) => ed.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      searchTerms: ["h2", "heading", "subtitle"],
      command: (ed) => ed.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      searchTerms: ["ul", "list", "bullet"],
      command: (ed) => ed.chain().focus().toggleBulletList().run(),
    },
    {
      title: "Numbered List",
      description: "Create an ordered list.",
      searchTerms: ["ol", "list", "number"],
      command: (ed) => ed.chain().focus().toggleOrderedList().run(),
    },
    {
      title: "To-do List",
      description: "Track tasks with checkboxes.",
      searchTerms: ["task", "todo", "checklist"],
      command: (ed) => ed.chain().focus().toggleTaskList().run(),
    },
    {
      title: "Quote",
      description: "Capture an important quote.",
      searchTerms: ["blockquote", "quote", "callout"],
      command: (ed) => ed.chain().focus().toggleBlockquote().run(),
    },
    {
      title: "Code Block",
      description: "Write and format code snippets.",
      searchTerms: ["code", "snippet", "pre"],
      command: (ed) => ed.chain().focus().toggleCodeBlock().run(),
    },
    {
      title: "Divider",
      description: "Insert a horizontal divider.",
      searchTerms: ["divider", "hr", "line"],
      command: (ed) => ed.chain().focus().setHorizontalRule().run(),
    },
  ];
}
