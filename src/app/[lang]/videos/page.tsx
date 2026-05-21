import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import VideosClient from "./VideosClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Vidéos" : "Videos",
    description: isFr
      ? "Découvrez nos vidéos sur la formation, l'ingénierie pédagogique et les solutions digitales."
      : "Discover our videos on training, instructional design and digital solutions.",
    ...localeAlternates(lang, "/videos"),
  };
}

export default async function VideosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "Vidéos" : "Videos" }
      ]} />
      <VideosClient />
    </>
  );
}
