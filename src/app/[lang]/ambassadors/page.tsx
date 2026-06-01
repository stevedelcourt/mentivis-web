import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import AmbassadorsClient from "./AmbassadorsClient";
import { SITE } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Ambassadeurs" : "Ambassadors",
    description: isFr
      ? "Recommandez Mentivis et développez votre activité. Un programme pour les professionnels de la formation, du recrutement et du conseil."
      : "Recommend Mentivis and grow your business. A program for training, recruitment and consulting professionals.",
    ...localeAlternates(lang, "/ambassadors"),
  };
}

export default function AmbassadorsPage({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Ambassadeurs — Mentivis",
        url: `${SITE.baseUrl}/fr/ambassadors`,
        publisher: { "@id": `${SITE.baseUrl}/#organization` },
      }} />
      <BreadcrumbJsonLd items={[
        { name: "Accueil", url: "https://mentivis.com/fr/" },
        { name: "Ambassadeurs" }
      ]} />
      <AmbassadorsClient />
    </>
  );
}
