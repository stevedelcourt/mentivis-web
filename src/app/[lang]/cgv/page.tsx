import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CgvClient from "./CgvClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "CGV" : "Terms of Sale",
    description: isFr
      ? "Conditions générales de vente de Mentivis."
      : "Terms of sale of Mentivis.",
    ...localeAlternates(lang, "/cgv"),
  };
}

export default async function CgvPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "CGV" : "Terms of Sale" }
      ]} />
      <CgvClient />
    </>
  );
}
