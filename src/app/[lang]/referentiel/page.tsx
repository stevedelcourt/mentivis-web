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
  return {
    title: "Le Référentiel — Guides de référence",
    description:
      "Le Référentiel : articles pratiques et conformes pour les organismes de formation. Qualiopi, financement, apprentissage, certification, pédagogie.",
    openGraph: {
      images: [{
        url: "https://mentivis.com/images/referentiel-og.jpg",
        width: 1200,
        height: 630,
        alt: "Le Référentiel — Mentivis",
      }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["https://mentivis.com/images/referentiel-og.jpg"],
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
