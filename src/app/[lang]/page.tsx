import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import HomeClient from "./HomeClient";
import { SITE } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Mentivis — Opérateur en formation à Paris" : "Mentivis — Training Operator in Paris",
    description: isFr
      ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
      : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
    ...localeAlternates(lang, "/"),
  };
}

export default function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE.baseUrl}/#organization`,
          name: SITE.name,
          url: SITE.baseUrl,
          logo: `${SITE.baseUrl}/images/ui/logo-dark.svg`,
          sameAs: [SITE.linkedin, SITE.instagram],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: SITE.phone,
            contactType: "customer service",
            email: SITE.email,
            availableLanguage: ["French", "English"],
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: "60 Rue François 1er",
            addressLocality: "Paris",
            postalCode: "75008",
            addressCountry: "FR",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: `${SITE.baseUrl}/fr/`,
          publisher: { "@id": `${SITE.baseUrl}/#organization` },
        },
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${SITE.baseUrl}/#localbusiness`,
          name: SITE.name,
          url: SITE.baseUrl,
          logo: `${SITE.baseUrl}/images/ui/logo-dark.svg`,
          image: `${SITE.baseUrl}/images/ui/logo-dark.svg`,
          telephone: SITE.phone,
          email: SITE.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: "60 Rue François 1er",
            addressLocality: "Paris",
            postalCode: "75008",
            addressCountry: "FR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 48.8698,
            longitude: 2.3070,
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
          sameAs: [SITE.linkedin, SITE.instagram],
        },
      ]} />
      <BreadcrumbJsonLd items={[
        { name: "Accueil", url: "https://www.mentivis.com/fr/" }
      ]} />
      <HomeClient />
    </>
  );
}
