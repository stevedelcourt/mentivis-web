import { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ReferentielClient from "./ReferentielClient";
import { localeAlternates } from "@/lib/metadata";

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

export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: "https://mentivis.com/fr/" },
          { name: "Le Référentiel" },
        ]}
      />
      <ReferentielClient />
    </>
  );
}
