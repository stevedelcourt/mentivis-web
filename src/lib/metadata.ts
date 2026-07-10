import type { Metadata } from "next";

const baseUrl = "https://mentivis.com";

export function localeAlternates(lang: string, path: string): Pick<Metadata, "alternates"> {
  const withSlash = (s: string) => s.endsWith("/") ? s : s + "/";
  return {
    alternates: {
      canonical: withSlash(`${baseUrl}/${lang}${path}`),
      languages: {
        "fr-FR": withSlash(`${baseUrl}/fr${path}`),
        "en-US": withSlash(`${baseUrl}/en${path}`),
        "x-default": withSlash(`${baseUrl}/fr${path}`),
      },
    },
  };
}
