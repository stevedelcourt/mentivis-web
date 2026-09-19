import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import PageShell from "@/components/layout/PageShell";
import { SITE } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Cabinet conseil en formation professionnelle - Mentivis" : "Training consulting firm - Mentivis",
    description: isFr
      ? "Mentivis, cabinet conseil dédié à la formation professionnelle : stratégie, ingénierie, déploiement opérationnel. Spécialiste, pas généraliste. Rémunération aux résultats."
      : "Mentivis, consulting firm dedicated to professional training: strategy, engineering, operational deployment. Specialist, results-based.",
    openGraph: {
      title: isFr ? "Cabinet conseil en formation professionnelle - Mentivis" : "Training consulting firm - Mentivis",
      description: isFr
        ? "Mentivis, cabinet conseil dédié à la formation professionnelle : stratégie, ingénierie, déploiement opérationnel. Spécialiste, pas généraliste."
        : "Mentivis, consulting firm dedicated to professional training: strategy, engineering, operational deployment.",
      url: `${SITE.baseUrl}/${lang}/cabinet-conseil-formation/`,
      images: [{ url: `${SITE.baseUrl}/opengraph-image.jpg`, width: 1200, height: 630, alt: "Mentivis" }],
    },
    twitter: { card: "summary_large_image", images: [`${SITE.baseUrl}/opengraph-image.jpg`] },
    ...localeAlternates(lang, "/cabinet-conseil-formation"),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: isFr ? "Cabinet conseil en formation professionnelle - Mentivis" : "Training consulting firm - Mentivis",
          description: isFr ? "Mentivis, cabinet conseil dédié à la formation professionnelle : stratégie, ingénierie, déploiement opérationnel." : "Mentivis, consulting firm dedicated to professional training.",
          url: `https://mentivis.com/${lang}/cabinet-conseil-formation/`,
          provider: { "@type": "Organization", name: "Mentivis", url: "https://mentivis.com/fr/" },
          areaServed: { "@type": "Country", name: "France" },
          serviceType: "Cabinet conseil en formation",
          inLanguage: isFr ? "fr-FR" : "en-US",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: isFr ? "Accueil" : "Home", item: `https://mentivis.com/${lang}/` },
            { "@type": "ListItem", position: 2, name: isFr ? "Cabinet conseil en formation" : "Training consulting firm", item: `https://mentivis.com/${lang}/cabinet-conseil-formation/` },
          ],
        }}
      />
      <PageShell>
        <section style={{ padding: "120px 24px 60px", maxWidth: 780, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, lineHeight: 1.1, color: "var(--m-ink)", margin: "0 0 16px" }}>
            {isFr ? "Un cabinet conseil dédié à la formation professionnelle" : "A consulting firm dedicated to professional training"}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--m-ink-3)", margin: "0 0 40px" }}>
            {isFr
              ? "Mentivis est exclusivement spécialisé dans la formation et l'éducation. Pas de slideware : nous opérons jusqu'au résultat - certification obtenue, première promotion lancée."
              : "Mentivis is exclusively focused on training and education. We operate through to results - certification achieved, first cohort launched."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Pourquoi un cabinet spécialiste plutôt que généraliste" : "Why a specialist firm"}</h2>
          <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)" }}>
            {isFr
              ? "Un cabinet généraliste livre des recommandations. Mentivis livre des dispositifs en ordre de marche : référentiels, process Qualiopi, financement OPCO, LMS, planning. Notre rémunération intègre une part variable aux résultats (certification, apprenants)."
              : "Generalist firms deliver recommendations. Mentivis delivers operational systems: frameworks, Qualiopi processes, OPCO funding, LMS, scheduling. Fees include results-based variable."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Nos interventions" : "Our interventions"}</h2>
          <ul style={{ lineHeight: 1.7, color: "var(--m-ink-2)" }}>
            <li>{isFr ? "Stratégie : GEPP, cartographie des compétences, plan de développement" : "Strategy: GEPP, skills mapping, development plan"}</li>
            <li>{isFr ? "Ingénierie : référentiels, programmes, évaluations, certificateurs" : "Engineering: frameworks, programs, assessments"}</li>
            <li>{isFr ? "Déploiement : OF, CFA, école entreprise, campus" : "Deployment: training org, CFA, corporate academy"}</li>
            <li>{isFr ? "Financement : OPCO, CPF, FSE, taxe d'apprentissage" : "Funding: OPCO, CPF, ESF"}</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Nous confier votre projet" : "Entrust us with your project"}</h2>
          <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)" }}>
            <a href={`/${lang}/contact/`}>{isFr ? "Parler à un consultant" : "Talk to a consultant"}</a> - {isFr ? "premier échange sans engagement." : "first call free."}
          </p>
        </section>
      </PageShell>
    </>
  );
}
