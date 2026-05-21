import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CareersClient from "./CareersClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Carrières" : "Careers",
    description: isFr
      ? "Vous partagez notre conviction que la formation est un levier stratégique ? Envoyez-nous votre candidature. Nous recrutons des profils passionnés, curieux et animés par l'impact."
      : "You share our belief that training is a strategic lever? Send us your application. We recruit passionate, curious profiles driven by impact.",
    ...localeAlternates(lang, "/careers"),
  };
}

export default async function CareersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "Carrières" : "Careers" }
      ]} />
      <CareersClient />
    </>
  );
}
