import { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import AboutClient from "./AboutClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "À propos" : "About",
    description: isFr
      ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
      : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
  };
}

export default function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Accueil", url: "https://www.mentivis.com/fr/" },
        { name: "À propos" }
      ]} />
      <AboutClient />
    </>
  );
}
