import { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import SolutionsClient from "./SolutionsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Solutions numériques formation" : "Digital training solutions",
    description: isFr
      ? "Au-delà de l'accompagnement humain, Mentivis développe des solutions technologiques sur mesure pour outiller durablement vos pratiques formation."
      : "Beyond human support, Mentivis develops custom technology solutions to durably equip your training practices.",
  };
}

export default async function SolutionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "Solutions numériques" : "Digital solutions" }
      ]} />
      <SolutionsClient />
    </>
  );
}
