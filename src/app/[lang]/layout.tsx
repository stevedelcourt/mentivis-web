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

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = 'https://www.mentivis.com';

  return {
    metadataBase: new URL(baseUrl),
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    title: {
      default: lang === 'fr'
        ? 'Mentivis — Opérateur en formation et développement des compétences'
        : 'Mentivis — Operator in training & skills development',
      template: '%s | Mentivis',
    },
    description: lang === 'fr'
      ? 'Mentivis conçoit, structure et déploie des dispositifs de formation. Rémunération alignée sur les résultats.'
      : 'Mentivis designs, structures and deploys training programs. Compensation aligned with results.',
    alternates: {
      canonical: `${baseUrl}/${lang}/`,
      languages: {
        'fr-FR': `${baseUrl}/fr/`,
        'en-US': `${baseUrl}/en/`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <head>
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