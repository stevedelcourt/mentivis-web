import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import AboutClient from "./AboutClient";
import { SITE } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "À propos" : "About",
    description: isFr
      ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
      : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
    ...localeAlternates(lang, "/about"),
  };
}

export default function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "À propos de Mentivis",
        url: `${SITE.baseUrl}/fr/about`,
        description: "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus.",
        publisher: { "@id": `${SITE.baseUrl}/#organization` },
      }} />
      <BreadcrumbJsonLd items={[
        { name: "Accueil", url: "https://mentivis.com/fr/" },
        { name: "À propos" }
      ]} />
      <AboutClient />
    </>
  );
}
