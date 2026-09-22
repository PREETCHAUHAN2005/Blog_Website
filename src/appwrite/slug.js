export function makeSlug(title) {
  const base = String(title || "post")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20);
  const suffix = Math.random().toString(36).slice(2, 8);
  let slug = `${base || "post"}-${suffix}`.replace(/[^a-z0-9._-]/g, "");
  slug = slug.slice(0, 36);
  if (!/^[a-z0-9]/i.test(slug)) slug = `p${slug}`.slice(0, 36);
  return slug;
}

export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function plainText(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
