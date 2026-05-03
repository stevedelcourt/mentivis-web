import { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import EnterpriseClient from "./EnterpriseClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Conseil en formation entreprise" : "Enterprise training consulting",
    description: isFr
      ? "Académies internes, montée en compétences, structuration des dispositifs - Mentivis conçoit et déploie des solutions de formation réellement opérationnelles."
      : "Internal academies, skills development, program structuring - Mentivis designs and deploys training solutions that are truly operational.",
  };
}

export default async function EnterprisePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "Conseil entreprise" : "Enterprise consulting" }
      ]} />
      <EnterpriseClient />
    </>
  );
}
