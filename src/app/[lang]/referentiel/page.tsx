import { Metadata } from "next";
import { Suspense } from "react";
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
      <Suspense fallback={<main style={{ padding: "80px 0", textAlign: "center" }}>Chargement...</main>}>
        <ReferentielClient />
      </Suspense>
    </>
  );
}
