import { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MeetingClient from "./MeetingClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Prendre rendez-vous" : "Book a meeting",
    description: isFr
      ? "Premier rendez-vous gratuit et sans engagement."
      : "First meeting free and without commitment.",
  };
}

export default async function MeetingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "Prendre rendez-vous" : "Book a meeting" }
      ]} />
      <MeetingClient />
    </>
  );
}
