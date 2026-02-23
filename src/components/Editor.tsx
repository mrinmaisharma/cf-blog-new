"use client";

import {
  Command,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  HorizontalRule,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TiptapLink,
  UpdatedImage,
  Youtube,
  createSuggestionItems,
  renderItems,
  type JSONContent,
} from "novel";
import { useMemo } from "react";
import {
  LuCode,
  LuHeading1,
  LuHeading2,
  LuImage,
  LuLink,
  LuList,
  LuListTodo,
  LuListOrdered,
  LuMinus,
  LuPilcrow,
  LuQuote,
  LuYoutube,
} from "react-icons/lu";

type Props = {
  value: JSONContent;
  onChange: (v: JSONContent) => void;
};

export default function Editor({ value, onChange }: Props) {
  const suggestionItems = useMemo(
    () =>
      createSuggestionItems([
        {
          title: "Text",
          description: "Start writing with plain text",
          searchTerms: ["paragraph", "text", "p"],
          icon: <LuPilcrow className="size-4" />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setParagraph().run();
          },
        },
        {
          title: "Heading 1",
          description: "Large section heading",
          searchTerms: ["h1", "heading", "title"],
          icon: <LuHeading1 className="size-4" />,
          command: ({ editor, range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .toggleHeading({ level: 1 })
              .run();
          },
        },
        {
          title: "Heading 2",
          description: "Medium section heading",
          searchTerms: ["h2", "heading", "subtitle"],
          icon: <LuHeading2 className="size-4" />,
          command: ({ editor, range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .toggleHeading({ level: 2 })
              .run();
          },
        },
        {
          title: "Bullet List",
          description: "Create a bulleted list",
          searchTerms: ["ul", "list", "bullet"],
          icon: <LuList className="size-4" />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
          },
        },
        {
          title: "Numbered List",
          description: "Create an ordered list",
          searchTerms: ["ol", "list", "number"],
          icon: <LuListOrdered className="size-4" />,
          command: ({ editor, range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .toggleOrderedList()
              .run();
          },
        },
        {
          title: "To-do List",
          description: "Track tasks with checkboxes",
          searchTerms: ["task", "todo", "checklist"],
          icon: <LuListTodo className="size-4" />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run();
          },
        },
        {
          title: "Quote",
          description: "Capture a quote",
          searchTerms: ["blockquote", "quote"],
          icon: <LuQuote className="size-4" />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
          },
        },
        {
          title: "Code Block",
          description: "Insert a code block",
          searchTerms: ["code", "snippet", "pre"],
          icon: <LuCode className="size-4" />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
          },
        },
        {
          title: "Divider",
          description: "Insert a horizontal line",
          searchTerms: ["divider", "hr", "line"],
          icon: <LuMinus className="size-4" />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run();
          },
        },
        {
          title: "Image",
          description: "Insert an image from URL",
          searchTerms: ["image", "photo", "picture"],
          icon: <LuImage className="size-4" />,
          command: ({ editor, range }) => {
            const src = window.prompt("Image URL");
            if (!src?.trim()) return;
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setImage({ src: src.trim() })
              .run();
          },
        },
        {
          title: "Link",
          description: "Insert or update a link",
          searchTerms: ["link", "url", "anchor"],
          icon: <LuLink className="size-4" />,
          command: ({ editor, range }) => {
            const href = window.prompt("Link URL");
            if (!href?.trim()) return;
            const cleanHref = href.trim();
            const { empty } = editor.state.selection;

            if (empty) {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent({
                  type: "text",
                  text: cleanHref,
                  marks: [{ type: "link", attrs: { href: cleanHref } }],
                })
                .run();
              return;
            }

            editor
              .chain()
              .focus()
              .deleteRange(range)
              .extendMarkRange("link")
              .setLink({ href: cleanHref })
              .run();
          },
        },
        {
          title: "YouTube",
          description: "Embed a YouTube video",
          searchTerms: ["youtube", "video", "embed"],
          icon: <LuYoutube className="size-4" />,
          command: ({ editor, range }) => {
            const src = window.prompt("YouTube URL");
            if (!src?.trim()) return;
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setYoutubeVideo({ src: src.trim(), width: 840, height: 472 })
              .run();
          },
        },
      ]),
    [],
  );

  return (
    <EditorRoot>
      <EditorContent
        className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm"
        initialContent={value}
        immediatelyRender={false}
        extensions={[
          StarterKit,
          TaskList,
          TaskItem.configure({ nested: true }),
          UpdatedImage.configure({
            HTMLAttributes: {
              class:
                "mx-auto my-4 rounded-lg border border-neutral-200 shadow-sm max-w-full h-auto",
            },
          }),
          TiptapLink.configure({
            openOnClick: true,
            autolink: true,
            defaultProtocol: "https",
            HTMLAttributes: {
              class: "text-blue-600 underline underline-offset-2",
              rel: "noopener noreferrer nofollow",
              target: "_blank",
            },
          }),
          Youtube.configure({
            nocookie: true,
            controls: true,
            modestBranding: true,
            HTMLAttributes: {
              class: "w-full aspect-video rounded-lg my-4",
            },
          }),
          HorizontalRule,
          Command.configure({
            suggestion: {
              items: () => suggestionItems,
              render: renderItems,
            },
          }),
          Placeholder.configure({
            placeholder: "Write your story. Type / for commands.",
          }),
        ]}
        editorProps={{
          attributes: {
            class:
              "min-h-[420px] px-1 py-1 text-[16px] leading-7 text-neutral-900 focus:outline-none [&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h2]:mt-7 [&_h2]:mb-3 [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-2xl [&_h3]:font-semibold [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_ul[data-type='taskList']]:my-3 [&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']]:pl-0 [&_ul[data-type='taskList']_li]:my-2 [&_ul[data-type='taskList']_li]:list-none [&_ul[data-type='taskList']_li]:pl-0 [&_ul[data-type='taskList']_li]:flex [&_ul[data-type='taskList']_li]:items-start [&_ul[data-type='taskList']_li]:gap-2 [&_ul[data-type='taskList']_li>label]:mt-1 [&_ul[data-type='taskList']_li>div]:flex-1 [&_ul[data-type='taskList']_li>div_p]:my-0 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-neutral-950 [&_pre]:p-4 [&_pre]:text-neutral-100 [&_pre]:shadow-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[14px] [&_pre_code]:leading-6 [&_pre_code]:text-neutral-100 [&_pre_code]:font-mono [&_p_code]:rounded [&_p_code]:bg-neutral-100 [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:font-mono [&_p_code]:text-[0.92em] [&_li_code]:rounded [&_li_code]:bg-neutral-100 [&_li_code]:px-1.5 [&_li_code]:py-0.5 [&_li_code]:font-mono [&_blockquote_code]:rounded [&_blockquote_code]:bg-neutral-100 [&_blockquote_code]:px-1.5 [&_blockquote_code]:py-0.5 [&_blockquote_code]:font-mono [&_hr]:my-6 [&_hr]:border-neutral-200",
          },
        }}
        onUpdate={({ editor }) => onChange(editor.getJSON())}
      >
        <EditorCommand className="z-50 h-auto max-h-80 w-72 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 shadow-2xl">
          <EditorCommandEmpty className="px-2 py-3 text-sm text-neutral-500">
            No commands found
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                key={item.title}
                value={item.title}
                onCommand={(props) => item.command?.(props)}
                className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left hover:bg-neutral-100 data-[selected=true]:bg-neutral-900 data-[selected=true]:text-white"
              >
                <span className="mt-0.5 text-neutral-500">
                  {item.icon}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{item.title}</span>
                  <span className="block text-xs text-neutral-500">
                    {item.description}
                  </span>
                </span>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
      </EditorContent>
    </EditorRoot>
  );
}
