import { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import ReferentielClient from "./ReferentielClient";
import { localeAlternates } from "@/lib/metadata";
import { REFERENTIEL_META } from "@/data/referentiel-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Le Référentiel — Guides de référence" : "The Reference — Practical guides",
    description: isFr
      ? "Le Référentiel : articles pratiques et conformes pour les organismes de formation. Qualiopi, financement, apprentissage, certification, pédagogie."
      : "The Reference: practical compliance guides for training organizations. Qualiopi, funding, apprenticeship, certification, pedagogy.",
    openGraph: {
      images: [{
        url: "/images/referentiel-og.jpg",
        width: 1200,
        height: 630,
        alt: isFr ? "Le Référentiel — Mentivis" : "The Reference — Mentivis",
      }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/images/referentiel-og.jpg"],
    },
    ...localeAlternates(lang, "/referentiel"),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  const referentielHasPart = REFERENTIEL_META.filter((a) => a.lang === lang).map((a) => ({
    "@type": "TechArticle",
    name: a.title,
    url: `https://mentivis.com/${lang}/referentiel/${a.slug}/`,
  }));
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: isFr ? "Le Référentiel — Guides pratiques formation professionnelle" : "The Reference — Practical guides",
          description: isFr
            ? "Base de connaissance opérationnelle Mentivis : guides pratiques sur la création d'organismes de formation, la certification Qualiopi, la GEPP, le financement et les outils EdTech."
            : "Mentivis knowledge base: practical guides on creating training organizations, Qualiopi certification, GEPP, funding and EdTech tools.",
          url: `https://mentivis.com/${lang}/referentiel/`,
          inLanguage: isFr ? "fr-FR" : "en-US",
          hasPart: referentielHasPart,
        }}
      />
      <BreadcrumbJsonLd
        items={
          isFr
            ? [
                { name: "Accueil", url: "https://mentivis.com/fr/" },
                { name: "Le Référentiel" },
              ]
            : [
                { name: "Home", url: "https://mentivis.com/en/" },
                { name: "The Reference" },
              ]
        }
      />
      <ReferentielClient />
    </>
  );
}
