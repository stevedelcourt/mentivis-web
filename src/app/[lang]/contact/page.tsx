import { Metadata } from "next";
import { Suspense } from "react";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ContactClient from "./ContactClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Contact" : "Contact",
    description: isFr
      ? "Une page sans friction. Pas de long formulaire, pas de promesse marketing - juste une invitation à la conversation."
      : "A page without friction. No long form, no marketing promise - just an invitation to a conversation.",
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "Contact" : "Contact" }
      ]} />
      <Suspense fallback={<div style={{ minHeight: "80vh" }} />}>
        <ContactClient />
      </Suspense>
    </>
  );
}
