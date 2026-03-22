/**
 * Generate a URL-safe slug from an article title.
 * Lowercase, spaces to hyphens, strip special chars, truncate to ~80 chars.
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
    .replace(/-$/, '');
}
