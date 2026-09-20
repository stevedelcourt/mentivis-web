import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import HomeClient from "./HomeClient";
import { SITE } from "@/lib/config";
import { getOgImage } from "@/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  const og = getOgImage("/", lang);
  return {
    title: isFr ? "Mentivis - Opérateur en formation à Paris" : "Mentivis - Training Operator in Paris",
    description: isFr
      ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
      : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
    openGraph: {
      title: isFr ? "Mentivis - Opérateur en formation à Paris" : "Mentivis - Training Operator in Paris",
      description: isFr
        ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
        : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
      url: `${SITE.baseUrl}/${lang}/`,
      images: [og],
      type: "website",
      locale: isFr ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: isFr ? "Mentivis - Opérateur en formation à Paris" : "Mentivis - Training Operator in Paris",
      description: isFr
        ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
        : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
      images: [og.url],
    },
    ...localeAlternates(lang, "/"),
  };
}

export default function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE.baseUrl}/#organization`,
          name: SITE.name,
          url: SITE.baseUrl,
          logo: {
            "@type": "ImageObject",
            url: "https://mentivis.com/images/mentivis-logo-400x400.png",
            width: 512,
            height: 512,
          },
          sameAs: [SITE.linkedin, SITE.instagram, SITE.bluesky],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: SITE.phone,
            contactType: "customer service",
            email: SITE.email,
            availableLanguage: ["French", "English"],
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: "60 Rue François 1er",
            addressLocality: "Paris",
            postalCode: "75008",
            addressCountry: "FR",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: `${SITE.baseUrl}/fr/`,
          publisher: { "@id": `${SITE.baseUrl}/#organization` },
        },
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${SITE.baseUrl}/#localbusiness`,
          name: SITE.name,
          url: SITE.baseUrl,
          logo: {
            "@type": "ImageObject",
            url: "https://mentivis.com/images/mentivis-logo-400x400.png",
            width: 512,
            height: 512,
          },
          image: {
            "@type": "ImageObject",
            url: "https://mentivis.com/images/mentivis-logo-400x400.png",
            width: 512,
            height: 512,
          },
          telephone: SITE.phone,
          email: SITE.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: "60 Rue François 1er",
            addressLocality: "Paris",
            postalCode: "75008",
            addressCountry: "FR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 48.8698,
            longitude: 2.3070,
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
          sameAs: [SITE.linkedin, SITE.instagram, SITE.bluesky],
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Qu'est-ce qu'un cabinet conseil en formation professionnelle ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Un cabinet conseil en formation professionnelle accompagne les entreprises et les organismes dans la conception, la structuration et le pilotage de leurs dispositifs de formation. Il intervient sur la stratégie, la conformité réglementaire (Qualiopi, RNCP), l'ingénierie pédagogique et le déploiement opérationnel.",
              },
            },
            {
              "@type": "Question",
              name: "Mentivis accompagne-t-il la création d'un organisme de formation de A à Z ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Oui. Mentivis prend en charge l'intégralité du parcours : définition du projet pédagogique, structuration juridique et administrative, déclaration auprès de la DREETS, obtention de la certification Qualiopi, mise en place des process opérationnels et premier déploiement commercial.",
              },
            },
            {
              "@type": "Question",
              name: "Mentivis peut-il aider une entreprise à créer son école interne ou son université d'entreprise ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Oui. Mentivis conçoit et pilote les écoles internes, campus corporate et universités d'entreprise : ingénierie des référentiels de compétences, certification des parcours (RNCP, Qualiopi), intégration aux dispositifs de financement OPCO et déploiement opérationnel jusqu'à la première promotion.",
              },
            },
            {
              "@type": "Question",
              name: "Comment Mentivis facture-t-il ses missions ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Le modèle de rémunération de Mentivis intègre une part variable alignée sur les résultats obtenus : alternants recrutés, apprenants formés, certification obtenue. Cette structure garantit la convergence d'intérêts entre le cabinet et le client.",
              },
            },
            {
              "@type": "Question",
              name: "Quelle est la différence entre Mentivis et un cabinet de conseil généraliste ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Mentivis est exclusivement spécialisé dans la formation et l'éducation. Contrairement à un cabinet généraliste dont la mission s'arrête à la remise de livrables, Mentivis assure le déploiement opérationnel jusqu'au résultat : certification obtenue, première promotion lancée, organisation en ordre de marche.",
              },
            },
          ],
        },
      ]} />
      <BreadcrumbJsonLd items={[
        { name: "Accueil", url: "https://mentivis.com/fr/" }
      ]} />
      <HomeClient />
    </>
  );
}
