import { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import OfClient from "./OfClient";
import { SITE } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Conseil organismes de formation" : "Training organization consulting",
    description: isFr
      ? "Création, conformité, croissance - Mentivis accompagne les organismes de formation à chaque étape, de la structuration initiale au pilotage de la performance."
      : "Creation, compliance, growth - Mentivis supports training organizations at every stage, from initial structuring to performance steering.",
  };
}

export default async function OfPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: isFr ? "Organismes de formation" : "Training organizations",
        url: `${SITE.baseUrl}/${lang}/of`,
        description: isFr
          ? "Création, conformité, croissance - Mentivis accompagne les organismes de formation à chaque étape, de la structuration initiale au pilotage de la performance."
          : "Creation, compliance, growth - Mentivis supports training organizations at every stage, from initial structuring to performance steering.",
        provider: { "@id": `${SITE.baseUrl}/#organization` },
      }} />
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "Organismes de formation" : "Training organizations" }
      ]} />
      <OfClient />
    </>
  );
}
