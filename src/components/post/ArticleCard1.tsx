import { Article } from "@/generated/prisma";
import Link from "next/link";

function ArticleCard1({ article, size }: { article: Article; size?: string }) {
  return (
    <div className={`flex flex-col ${size === "sm" ? "gap-2" : "gap-4"}`}>
      <img
        className={`w-full aspect-video overflow-hidden object-cover object-center ${size === "sm" ? "h-40" : "h-96"}`}
        src={`${article?.coverImage ?? ""}`}
        alt={article?.title ?? "Featured Image"}
      />
      <div
        className={`flex items-center flex-wrap ${size === "sm" ? "gap-2" : "gap-4"}`}
      >
        <span
          className={`px-3 py-1 bg-gray-300 ${size === "sm" ? "text-xs" : ""}`}
        >
          Published{" "}
          {new Date(article?.publishedAt ?? "").toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </span>
        <span
          className={`px-3 py-1 bg-gray-300 ${size === "sm" ? "text-xs" : ""}`}
        >
          3 min read
        </span>
        <span
          className={`px-3 py-1 bg-gray-300 ${size === "sm" ? "hidden" : ""}`}
        >
          By Consoleflare
        </span>
      </div>
      <Link href={`/p/${article?.slug ?? "default-slug"}`}>
        <h2
          className={`text-gray-800 hover:underline underline-offset-4 duration-300 m-0 p-0 ${size === "sm" ? "text-lg font-semibold" : "text-4xl font-bold"}`}
        >
          {article?.title ?? "Featured Article"}
        </h2>
      </Link>
    </div>
  );
}

export default ArticleCard1;
