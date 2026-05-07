import { ReactNode } from "react";
import type { Metadata } from "next";
import CookieConsentDeferred from "@/components/CookieConsentDeferred";
import GTMClient from "@/components/GTMClient";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";


export type Messages = typeof fr;

const AllMessages = { fr, en };

export function getMessages(lang: string): Messages {
  return AllMessages[lang as keyof typeof AllMessages] || AllMessages.fr;
}

export function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://www.mentivis.com";
  const isFr = lang === "fr";

  const title = isFr
    ? "Mentivis - Tous les métiers de la formation. De bout en bout."
    : "Mentivis - Every training discipline. End to end.";
  const description = isFr
    ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Rémunération alignée sur les résultats."
    : "Mentivis designs, structures and deploys training programs. Compensation aligned with results.";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: "%s | Mentivis",
    },
    description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    },
    manifest: "/site.webmanifest",
    openGraph: {
      type: "website",
      locale: isFr ? "fr_FR" : "en_US",
      url: `${baseUrl}/${lang}/`,
      siteName: "Mentivis",
      title,
      description,
      images: [
        {
          url: `${baseUrl}/opengraph-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Mentivis",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/opengraph-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/`,
      languages: {
        "fr-FR": `${baseUrl}/fr/`,
        "en-US": `${baseUrl}/en/`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { lang } = await params;

  return (
    <>
      {children}
      <CookieConsentDeferred lang={lang} />
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GTMClient gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
    </>
  );
}
