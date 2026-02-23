import { forwardRef, useImperativeHandle, useState } from "react";
import { SlashItem } from "./slashItems";

export type SlashMenuRef = {
  onKeyDown: (event: KeyboardEvent) => boolean;
};

type SlashMenuProps = {
  items: SlashItem[];
  command: (item: SlashItem) => void;
};

export const SlashMenu = forwardRef<SlashMenuRef, SlashMenuProps>(
  function SlashMenu({ items, command }, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    function select(index: number) {
      const safeIndex = ((index % items.length) + items.length) % items.length;
      const item = items[safeIndex];
      if (item) {
        command(item);
      }
    }

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (!items.length) {
          return false;
        }

        if (event.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }

        if (event.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }

        if (event.key === "Enter") {
          select(selectedIndex);
          return true;
        }

        return false;
      },
    }));

    if (!items.length) {
      return (
        <div className="w-72 rounded-xl border border-neutral-200 bg-white p-2 text-sm text-neutral-500 shadow-xl">
          No commands found
        </div>
      );
    }

    return (
      <div className="w-72 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
        <div className="max-h-80 overflow-auto">
          {items.map((item, index) => (
            <button
              key={`${item.title}-${index}`}
              type="button"
              onClick={() => select(index)}
              className={`w-full rounded-lg px-3 py-2 text-left ${
                index === selectedIndex
                  ? "bg-neutral-900 text-white"
                  : "hover:bg-neutral-100"
              }`}
            >
              <div className="text-sm font-medium">{item.title}</div>
              <div
                className={`text-xs ${
                  index === selectedIndex ? "text-neutral-300" : "text-neutral-500"
                }`}
              >
                {item.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  },
);
