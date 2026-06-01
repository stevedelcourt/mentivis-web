import type { Metadata } from "next";

const baseUrl = "https://mentivis.com";

export function localeAlternates(lang: string, path: string): Pick<Metadata, "alternates"> {
  return {
    alternates: {
      canonical: `${baseUrl}/${lang}${path}`,
      languages: {
        "fr-FR": `${baseUrl}/fr${path}`,
        "en-US": `${baseUrl}/en${path}`,
        "x-default": `${baseUrl}/fr${path}`,
      },
    },
  };
}
