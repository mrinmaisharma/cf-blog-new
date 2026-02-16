"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  return (
    <div className="border rounded p-3">
      <EditorContent editor={editor} />
    </div>
  );
}
