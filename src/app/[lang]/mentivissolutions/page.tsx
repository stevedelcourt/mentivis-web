import { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import SolutionsClient from "./SolutionsClient";
import { SITE } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
      title: isFr ? "Mentivis Solutions" : "Mentivis Solutions",
    description: isFr
      ? "Au-delà de l'accompagnement humain, Mentivis développe des solutions technologiques sur mesure pour outiller durablement vos pratiques formation."
      : "Beyond human support, Mentivis develops custom technology solutions to durably equip your training practices.",
  };
}

export default async function SolutionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: isFr ? "Mentivis Solutions" : "Mentivis Solutions",
        url: `${SITE.baseUrl}/${lang}/mentivissolutions`,
        description: isFr
          ? "Au-delà de l'accompagnement humain, Mentivis développe des solutions technologiques sur mesure pour outiller durablement vos pratiques formation."
          : "Beyond human support, Mentivis develops custom technology solutions to durably equip your training practices.",
        provider: { "@id": `${SITE.baseUrl}/#organization` },
      }} />
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "Mentivis Solutions" : "Mentivis Solutions" }
      ]} />
      <SolutionsClient />
    </>
  );
}
