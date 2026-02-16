import slugify from "slugify";

export function makeSlug(title: string) {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  return base || "post";
}