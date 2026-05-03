import { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ScoreFormationClient from "./ScoreFormationClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Score Formation" : "Score Formation",
    description: isFr
      ? "10 minutes pour révéler la maturité réelle de votre dispositif formation, mesurer l'écart entre perception et réalité, et chiffrer la valeur que vous laissez fuir chaque année."
      : "10 minutes to reveal the real maturity of your training program, measure the gap between perception and reality, and quantify the value you are losing each year.",
  };
}

export default async function ScoreFormationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "Score Formation" : "Score Formation" }
      ]} />
      <ScoreFormationClient />
    </>
  );
}
