/**
 * Encode text as HTML entities to prevent scraping bots from reading emails/phones.
 */
export function encodeEntities(text: string): string {
  return text.split("").map((c) => `&#${c.charCodeAt(0)};`).join("");
}

/**
 * Format a number as euros with locale-aware formatting.
 */
export function formatEuro(n: number, lang: string): string {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
