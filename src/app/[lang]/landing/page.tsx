import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import LandingClient from "./LandingClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Vous gérez un OF - On peut vous aider" : "You run a training organization - We can help",
    description: isFr
      ? "Un échange d'une heure. Sans engagement. Sans présentation commerciale. Vous parlez de votre situation, on vous dit franchement si on peut faire quelque chose et comment."
      : "A one-hour conversation. No commitment. No sales deck. You talk about your situation, we tell you frankly whether and how we can help.",
    ...localeAlternates(lang, "/landing"),
  };
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://mentivis.com/${lang}/` },
        { name: isFr ? "Échange" : "Conversation" }
      ]} />
      <LandingClient />
    </>
  );
}
