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
    title: isFr
      ? "Créer un organisme de formation : accompagnement Qualiopi et structuration - Mentivis"
      : "Create a training organization: Qualiopi support and structuring - Mentivis",
    description: isFr
      ? "Mentivis accompagne la création d'organismes de formation de A à Z : déclaration DREETS, certification Qualiopi, modèle économique et premier déploiement commercial. Cabinet conseil spécialisé, rémunération aux résultats."
      : "Mentivis supports the creation of training organizations end-to-end: DREETS declaration, Qualiopi certification, business model and go-to-market. Specialized consulting, results-based fees.",
    openGraph: {
      title: isFr
        ? "Créer un organisme de formation : accompagnement Qualiopi et structuration - Mentivis"
        : "Create a training organization: Qualiopi support and structuring - Mentivis",
      description: isFr
        ? "Mentivis accompagne la création d'organismes de formation de A à Z : déclaration DREETS, certification Qualiopi, modèle économique et premier déploiement commercial."
        : "Mentivis supports the creation of training organizations end-to-end: DREETS declaration, Qualiopi certification, business model and go-to-market.",
      url: `${SITE.baseUrl}/${lang}/creation-organisme-formation/`,
      images: [{ url: `${SITE.baseUrl}/opengraph-image.jpg`, width: 1200, height: 630, alt: "Mentivis" }],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${SITE.baseUrl}/opengraph-image.jpg`],
    },
    ...localeAlternates(lang, "/creation-organisme-formation"),
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
          name: isFr ? "Création et structuration d'organismes de formation - Mentivis" : "Creation and structuring of training organizations - Mentivis",
          description: isFr
            ? "Mentivis accompagne la création d'organismes de formation de A à Z : déclaration DREETS, certification Qualiopi, modèle économique et déploiement commercial."
            : "Mentivis supports the creation of training organizations end-to-end: DREETS declaration, Qualiopi certification, business model and commercial deployment.",
          url: `https://mentivis.com/${lang}/creation-organisme-formation/`,
          provider: { "@type": "Organization", name: "Mentivis", url: "https://mentivis.com/fr/" },
          areaServed: { "@type": "Country", name: "France" },
          serviceType: isFr ? "Conseil en création d'organisme de formation" : "Training organization creation consulting",
          inLanguage: isFr ? "fr-FR" : "en-US",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Quelles sont les étapes pour créer un organisme de formation en France ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Créer un organisme de formation suppose de réaliser une première convention de formation, de déposer la déclaration d'activité auprès de la DREETS dans les trois mois, d'obtenir le numéro de déclaration d'activité, puis d'engager la démarche Qualiopi si l'accès aux fonds publics et mutualisés est visé. La certification Qualiopi est obligatoire depuis le 1er janvier 2022 pour accéder aux financements OPCO, CPF, France Travail et régions.",
              },
            },
            {
              "@type": "Question",
              name: "Combien de temps faut-il pour obtenir la certification Qualiopi ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "La démarche Qualiopi prend en moyenne trois à six mois entre l'engagement de la préparation et la délivrance de la certification, selon la maturité documentaire de l'organisme. Un audit blanc préalable permet d'identifier les non-conformités et de construire un plan d'action ciblé avant l'audit officiel.",
              },
            },
            {
              "@type": "Question",
              name: "Mentivis accompagne-t-il uniquement les nouvelles structures ou aussi les OF existants ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Mentivis intervient à toutes les étapes : création de A à Z pour les porteurs de projet, structuration et mise en conformité Qualiopi pour les OF existants, et développement commercial pour les organismes en phase de croissance.",
              },
            },
            {
              "@type": "Question",
              name: "Quel est le coût d'un accompagnement Qualiopi avec Mentivis ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Le modèle tarifaire de Mentivis intègre une part fixe de structuration et une part variable alignée sur les résultats : certification obtenue, apprenants recrutés. Le premier échange est sans engagement et permet de cadrer précisément le périmètre et le coût de la mission.",
              },
            },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: isFr ? "Accueil" : "Home", item: `https://mentivis.com/${lang}/` },
            { "@type": "ListItem", position: 2, name: isFr ? "Créer un organisme de formation" : "Create a training organization", item: `https://mentivis.com/${lang}/creation-organisme-formation/` },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: isFr ? "Guides pratiques : créer et structurer un organisme de formation" : "Practical guides: create and structure a training organization",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Comment obtenir la certification Qualiopi", url: `https://mentivis.com/${lang}/referentiel/comment-obtenir-la-certification-qualiopi/` },
            { "@type": "ListItem", position: 2, name: "Comment déclarer son activité de formation professionnelle", url: `https://mentivis.com/${lang}/referentiel/comment-declarer-son-activite-de-formation-professionnelle/` },
            { "@type": "ListItem", position: 3, name: "Comment créer un CFA en France en 2026", url: `https://mentivis.com/${lang}/referentiel/comment-creer-un-cfa-en-france-en-2026/` },
            { "@type": "ListItem", position: 4, name: "Comment créer un programme de formation conforme Qualiopi", url: `https://mentivis.com/${lang}/referentiel/comment-creer-un-programme-de-formation-conforme-qualiopi/` },
            { "@type": "ListItem", position: 5, name: "Comment construire un référentiel de formation de A à Z", url: `https://mentivis.com/${lang}/referentiel/comment-construire-un-referentiel-de-formation-de-a-a-z/` },
            { "@type": "ListItem", position: 6, name: "Comment préparer et réussir un audit de renouvellement Qualiopi", url: `https://mentivis.com/${lang}/referentiel/comment-preparer-et-reussir-un-audit-de-renouvellement-qualiopi/` },
          ],
        }}
      />
      <PageShell>
        <section style={{ padding: "120px 24px 60px", maxWidth: 780, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, lineHeight: 1.1, color: "var(--m-ink)", margin: "0 0 16px" }}>
            {isFr ? "Créer et structurer votre organisme de formation" : "Create and structure your training organization"}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--m-ink-3)", margin: "0 0 40px" }}>
            {isFr
              ? "Mentivis accompagne la création d'organismes de formation de A à Z : déclaration DREETS, certification Qualiopi, modèle économique et premier déploiement commercial. Rémunération alignée sur les résultats."
              : "Mentivis supports training organization creation end-to-end: DREETS declaration, Qualiopi certification, business model and go-to-market. Results-based compensation."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Pourquoi la certification Qualiopi conditionne votre accès au marché" : "Why Qualiopi certification determines market access"}</h2>
          <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)" }}>
            {isFr
              ? "Depuis le 1er janvier 2022, Qualiopi conditionne l'accès aux financements OPCO, CPF, France Travail et régions. Un organisme non certifié peut former, mais ses prestations ne sont plus finançables par ces circuits. Le référentiel national qualité (7 critères, 32 indicateurs, guide de lecture v9 du 8 janvier 2024) exige des preuves datées, versionnées et traçables pour chaque indicateur. Mentivis structure le dossier de preuves par critère, sécurise la traçabilité (exports LMS horodatés, évaluations, registres) et prépare l'audit blanc avant l'audit officiel."
              : "Since January 1, 2022, Qualiopi is required to access OPCO, CPF and public funding. Uncertified providers can still train, but their services are no longer fundable. Mentivis structures evidence per criterion and prepares the audit."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Ce que couvre un accompagnement création OF de bout en bout" : "What end-to-end OF creation support covers"}</h2>
          <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)" }}>
            {isFr
              ? "Mentivis prend en charge la définition du projet pédagogique (positionnement, cibles, référentiels, modalités), la structuration juridique et administrative (statuts, déclaration d'activité, convention de formation, CGV), la mise en conformité Qualiopi (processus, indicateurs, preuves), la construction du modèle économique (coût pédagogique, prix, financement) et le déploiement commercial (offre, canaux, première promotion). Chaque lot est opéré, pas seulement conseillé."
              : "Mentivis covers pedagogical design, legal and administrative setup, Qualiopi compliance, business modeling and commercial deployment - operated end-to-end."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Les étapes clés : de la déclaration à la première promotion" : "Key steps: from declaration to first cohort"}</h2>
          <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)" }}>
            {isFr
              ? "1) Réaliser une première convention de formation et déposer la déclaration d'activité auprès de la DREETS dans les 3 mois. 2) Obtenir le numéro de déclaration d'activité (NDA). 3) Engager la démarche Qualiopi (audit blanc, plan d'action, audit initial sur site). 4) Obtenir la certification (3 ans, avec audit de surveillance à 14-22 mois). 5) Déployer l'offre : catalogue, LMS, financement, commercial. Mentivis opère chaque étape jusqu'à la première promotion facturée."
              : "1) First training agreement and DREETS declaration within 3 months. 2) Obtain activity number. 3) Qualiopi preparation (mock audit, action plan). 4) Initial audit and 3-year certification. 5) Offer deployment through first cohort."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Quels organismes Mentivis accompagne-t-il ?" : "Which organizations does Mentivis support?"}</h2>
          <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)" }}>
            {isFr
              ? "Porteurs de projet (création ex nihilo), OF existants en mise en conformité Qualiopi ou en renouvellement, CFA en création, entreprises créant leur OF interne (intra), et structures en croissance cherchant à industrialiser leur modèle. Cas client Ecolearn : Qualiopi au premier passage, CA +85 % en 12 mois après structuration."
              : "Project holders, existing OFs seeking Qualiopi compliance or renewal, new CFA, corporate training units, and scaling organizations. Client case Ecolearn: Qualiopi first time, +85% revenue in 12 months."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Articles pratiques" : "Practical articles"}</h2>
          <ul style={{ lineHeight: 1.7 }}>
            <li><a href={`/${lang}/referentiel/comment-obtenir-la-certification-qualiopi/`}>Comment obtenir la certification Qualiopi</a></li>
            <li><a href={`/${lang}/referentiel/comment-declarer-son-activite-de-formation-professionnelle/`}>Comment déclarer son activité de formation professionnelle</a></li>
            <li><a href={`/${lang}/referentiel/comment-creer-un-cfa-en-france-en-2026/`}>Comment créer un CFA en France en 2026</a></li>
            <li><a href={`/${lang}/referentiel/comment-creer-un-programme-de-formation-conforme-qualiopi/`}>Comment créer un programme de formation conforme Qualiopi</a></li>
            <li><a href={`/${lang}/referentiel/comment-construire-un-referentiel-de-formation-de-a-a-z/`}>Comment construire un référentiel de formation de A à Z</a></li>
            <li><a href={`/${lang}/referentiel/comment-preparer-et-reussir-un-audit-de-renouvellement-qualiopi/`}>Comment préparer et réussir un audit de renouvellement Qualiopi</a></li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Questions fréquentes" : "FAQ"}</h2>
          <div style={{ display: "grid", gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: "var(--m-ink)" }}>{isFr ? "Quelles sont les étapes pour créer un organisme de formation en France ?" : "What are the steps to create a training organization in France?"}</h3>
              <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)", margin: 0 }}>{isFr ? "Créer un organisme de formation suppose de réaliser une première convention de formation, de déposer la déclaration d'activité auprès de la DREETS dans les trois mois, d'obtenir le numéro de déclaration d'activité, puis d'engager la démarche Qualiopi si l'accès aux fonds publics et mutualisés est visé. La certification Qualiopi est obligatoire depuis le 1er janvier 2022 pour accéder aux financements OPCO, CPF, France Travail et régions." : "Creating a training organization requires a first training agreement, filing the activity declaration with the DREETS within three months, obtaining the activity number, then starting the Qualiopi process if public funding is targeted. Qualiopi has been mandatory since January 1, 2022 to access OPCO, CPF and public funding."}</p>
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: "var(--m-ink)" }}>{isFr ? "Combien de temps faut-il pour obtenir la certification Qualiopi ?" : "How long does it take to obtain Qualiopi certification?"}</h3>
              <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)", margin: 0 }}>{isFr ? "La démarche Qualiopi prend en moyenne trois à six mois entre l'engagement de la préparation et la délivrance de la certification, selon la maturité documentaire de l'organisme. Un audit blanc préalable permet d'identifier les non-conformités et de construire un plan d'action ciblé avant l'audit officiel." : "The Qualiopi process takes on average three to six months from preparation to certification, depending on the organization's documentary maturity. A mock audit helps identify non-conformities beforehand."}</p>
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: "var(--m-ink)" }}>{isFr ? "Mentivis accompagne-t-il uniquement les nouvelles structures ou aussi les OF existants ?" : "Does Mentivis support only new structures or also existing training organizations?"}</h3>
              <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)", margin: 0 }}>{isFr ? "Mentivis intervient à toutes les étapes : création de A à Z pour les porteurs de projet, structuration et mise en conformité Qualiopi pour les OF existants, et développement commercial pour les organismes en phase de croissance." : "Mentivis intervenes at every stage: end-to-end creation for project holders, structuring and Qualiopi compliance for existing training organizations, and commercial development for scaling organizations."}</p>
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: "var(--m-ink)" }}>{isFr ? "Quel est le coût d'un accompagnement Qualiopi avec Mentivis ?" : "What is the cost of Qualiopi support with Mentivis?"}</h3>
              <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)", margin: 0 }}>{isFr ? "Le modèle tarifaire de Mentivis intègre une part fixe de structuration et une part variable alignée sur les résultats : certification obtenue, apprenants recrutés. Le premier échange est sans engagement et permet de cadrer précisément le périmètre et le coût de la mission." : "Mentivis pricing includes a fixed structuring part and a variable part aligned with results: certification obtained, learners recruited. The first exchange is non-binding."}</p>
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}
