import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import EnterpriseClient from "./EnterpriseClient";
import { SITE } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Conseil en formation et GEPP en entreprise" : "Enterprise training and GEPP consulting",
    description: isFr
      ? "Mentivis accompagne les entreprises sur la GEPP, la montée en compétences et la création de dispositifs de formation opérationnels. Stratégie, déploiement, conformité."
      : "Mentivis supports enterprises on GEPP, skills development, and building operational training programs. Strategy, deployment, compliance.",
    openGraph: {
      title: isFr ? "Conseil en formation et GEPP en entreprise" : "Enterprise training and GEPP consulting",
      description: isFr
        ? "Mentivis accompagne les entreprises sur la GEPP, la montée en compétences et la création de dispositifs de formation opérationnels. Stratégie, déploiement, conformité."
        : "Mentivis supports enterprises on GEPP, skills development, and building operational training programs. Strategy, deployment, compliance.",
      url: `${SITE.baseUrl}/${lang}/enterprise/`,
      images: [{ url: `${SITE.baseUrl}/opengraph-image.jpg`, width: 1200, height: 630, alt: "Mentivis" }],
    },
    twitter: {
      card: "summary_large_image",
      title: isFr ? "Conseil en formation et GEPP en entreprise" : "Enterprise training and GEPP consulting",
      description: isFr
        ? "Mentivis accompagne les entreprises sur la GEPP, la montée en compétences et la création de dispositifs de formation opérationnels. Stratégie, déploiement, conformité."
        : "Mentivis supports enterprises on GEPP, skills development, and building operational training programs. Strategy, deployment, compliance.",
      images: [`${SITE.baseUrl}/opengraph-image.jpg`],
    },
    ...localeAlternates(lang, "/enterprise"),
  };
}

export default async function EnterprisePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: isFr ? "Conseil entreprise" : "Enterprise consulting",
        url: `${SITE.baseUrl}/${lang}/enterprise`,
        description: isFr
          ? "Mentivis accompagne les entreprises sur la GEPP, la montée en compétences et la création de dispositifs de formation opérationnels. Stratégie, déploiement, conformité."
          : "Mentivis supports enterprises on GEPP, skills development, and building operational training programs. Strategy, deployment, compliance.",
        serviceType: isFr ? "Conseil en formation" : "Training consulting",
        areaServed: { "@type": "Country", name: "France" },
        provider: { "@id": `${SITE.baseUrl}/#organization` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: isFr ? "Services entreprise" : "Enterprise services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: isFr ? "Stratégie formation" : "Training strategy" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: isFr ? "Opérationnel" : "Operations" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: isFr ? "Administratif" : "Administrative" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: isFr ? "Création de structure" : "Entity creation" } },
          ],
        },
      }} />
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://mentivis.com/${lang}/` },
        { name: isFr ? "Conseil entreprise" : "Enterprise consulting" }
      ]} />
      <EnterpriseClient />
    </>
  );
}
