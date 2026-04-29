import { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";
import CookieConsentBanner from "@/components/CookieConsent";

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
    ? "Mentivis - Opérateur en formation et développement des compétences"
    : "Mentivis - Operator in training & skills development";
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
          url: `${baseUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
          alt: "Mentivis",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/android-chrome-512x512.png`],
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
    <html lang={lang}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PM93CCQL');`}
        </Script>
      </head>
      <body>
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
