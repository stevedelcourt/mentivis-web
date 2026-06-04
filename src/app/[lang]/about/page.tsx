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
    title: isFr ? "Qui sommes-nous — Mentivis" : "About — Mentivis",
    description: isFr
      ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
      : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
    openGraph: {
      title: isFr ? "Qui sommes-nous — Mentivis" : "About — Mentivis",
      description: isFr
        ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
        : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
      url: `${SITE.baseUrl}/${lang}/about/`,
      images: [{ url: `${SITE.baseUrl}/opengraph-image.jpg`, width: 1200, height: 630, alt: "Mentivis" }],
    },
    twitter: {
      card: "summary_large_image",
      title: isFr ? "Qui sommes-nous — Mentivis" : "About — Mentivis",
      description: isFr
        ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
        : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
      images: [`${SITE.baseUrl}/opengraph-image.jpg`],
    },
    ...localeAlternates(lang, "/about"),
  };
}

export default function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "À propos de Mentivis",
          url: `${SITE.baseUrl}/fr/about`,
          description: "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus.",
          publisher: { "@id": `${SITE.baseUrl}/#organization` },
        },
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Roxan Roumégas",
          jobTitle: "Partner, Président",
          worksFor: { "@type": "Organization", name: SITE.name, url: SITE.baseUrl },
          image: `${SITE.baseUrl}/images/team/roxan-roumegas.avif`,
        },
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Mathias Costes",
          jobTitle: "Partner, Corporate Sales",
          worksFor: { "@type": "Organization", name: SITE.name, url: SITE.baseUrl },
          image: `${SITE.baseUrl}/images/team/mathias.costes.avif`,
        },
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Julie Steiner",
          jobTitle: "Partner, Direction commerciale",
          worksFor: { "@type": "Organization", name: SITE.name, url: SITE.baseUrl },
          image: `${SITE.baseUrl}/images/team/julie-steiner.webp`,
        },
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Steven Delcourt",
          jobTitle: "Partner, Strategy",
          worksFor: { "@type": "Organization", name: SITE.name, url: SITE.baseUrl },
          image: `${SITE.baseUrl}/images/team/steven-delcourt.avif`,
        },
      ]} />
      <BreadcrumbJsonLd items={[
        { name: "Accueil", url: "https://mentivis.com/fr/" },
        { name: "À propos" }
      ]} />
      <AboutClient />
    </>
  );
}
