import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PrivacyClient from "./PrivacyClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Confidentialité" : "Privacy Policy",
    description: isFr
      ? "Politique de confidentialité de Mentivis."
      : "Privacy policy of Mentivis.",
    ...localeAlternates(lang, "/privacy"),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "Confidentialité" : "Privacy Policy" }
      ]} />
      <PrivacyClient />
    </>
  );
}
