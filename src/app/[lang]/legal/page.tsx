import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import LegalClient from "./LegalClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Mentions légales" : "Legal Notice",
    description: isFr
      ? "Mentions légales du site Mentivis."
      : "Legal notice of the Mentivis website.",
    ...localeAlternates(lang, "/legal"),
  };
}

export default async function LegalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://mentivis.com/${lang}/` },
        { name: isFr ? "Mentions légales" : "Legal Notice" }
      ]} />
      <LegalClient />
    </>
  );
}
