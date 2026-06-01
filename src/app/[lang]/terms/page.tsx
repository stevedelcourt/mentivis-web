import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import TermsClient from "./TermsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "CGU" : "Terms of Use",
    description: isFr
      ? "Conditions générales d'utilisation du site Mentivis."
      : "Terms of use of the Mentivis website.",
    ...localeAlternates(lang, "/terms"),
  };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://mentivis.com/${lang}/` },
        { name: isFr ? "CGU" : "Terms of Use" }
      ]} />
      <TermsClient />
    </>
  );
}
