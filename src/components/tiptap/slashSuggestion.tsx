import { ReactRenderer } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import Suggestion, { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { SlashMenu, SlashMenuRef } from "./SlashMenu";
import { getSlashItems, SlashItem } from "./slashItems";

function positionElement(el: HTMLElement, props: SuggestionProps<SlashItem>) {
  const rect = props.clientRect?.();
  if (!rect) return;

  el.style.position = "fixed";
  el.style.left = `${rect.left}px`;
  el.style.top = `${rect.bottom + 8}px`;
  el.style.zIndex = "60";
}

export const slashSuggestion: Omit<SuggestionOptions<SlashItem>, "editor"> = {
  char: "/",
  startOfLine: true,
  items: ({ query }) => {
    const normalized = query.trim().toLowerCase();
    const items = getSlashItems();

    if (!normalized) return items;

    return items.filter((item) => {
      if (item.title.toLowerCase().includes(normalized)) return true;
      if (item.description.toLowerCase().includes(normalized)) return true;
      return item.searchTerms.some((term) => term.includes(normalized));
    });
  },
  command: ({ editor, range, props }) => {
    editor.chain().focus().deleteRange(range).run();
    props.command(editor);
  },
  render: () => {
    let component: ReactRenderer<SlashMenuRef> | null = null;
    let host: HTMLDivElement | null = null;

    return {
      onStart: (props) => {
        component = new ReactRenderer(SlashMenu, {
          props,
          editor: props.editor,
        });

        host = document.createElement("div");
        host.className = "tiptap-slash-menu";
        host.appendChild(component.element);
        document.body.appendChild(host);

        positionElement(host, props);
      },
      onUpdate: (props) => {
        component?.updateProps(props);
        if (host) {
          positionElement(host, props);
        }
      },
      onKeyDown: (props) => {
        if (props.event.key === "Escape") {
          host?.remove();
          host = null;
          component?.destroy();
          component = null;
          return true;
        }

        return component?.ref?.onKeyDown(props.event) ?? false;
      },
      onExit: () => {
        host?.remove();
        host = null;
        component?.destroy();
        component = null;
      },
    };
  },
};

export const createSlashSuggestion = (editor: Editor) =>
  Suggestion<SlashItem>({
    editor,
    ...slashSuggestion,
  });
