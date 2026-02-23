"use client";

import { useEffect, useRef } from "react";

type Props = {
  html: string;
  className?: string;
};

export default function ArticleContent({ html, className }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];
    const blocks = root.querySelectorAll("pre");

    blocks.forEach((pre) => {
      if ((pre as HTMLElement).dataset.copyReady === "true") return;
      (pre as HTMLElement).dataset.copyReady = "true";
      pre.classList.add("relative");

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Copy";
      button.className =
        "absolute right-3 top-3 rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/20";

      const onClick = async () => {
        const codeText = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
        try {
          await navigator.clipboard.writeText(codeText);
          button.textContent = "Copied";
          window.setTimeout(() => {
            button.textContent = "Copy";
          }, 1200);
        } catch {
          button.textContent = "Failed";
          window.setTimeout(() => {
            button.textContent = "Copy";
          }, 1200);
        }
      };

      button.addEventListener("click", onClick);
      pre.appendChild(button);

      cleanups.push(() => {
        button.removeEventListener("click", onClick);
        button.remove();
        delete (pre as HTMLElement).dataset.copyReady;
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [html]);

  return (
    <article
      ref={rootRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
