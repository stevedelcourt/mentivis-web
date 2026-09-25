import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";
import PageShell from "@/components/layout/PageShell";
import { SITE } from "@/lib/config";
import { getOgImage } from "@/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  const og = getOgImage("/ecole-entreprise", lang);
  return {
    // absolute bypasses the layout "%s | Mentivis" template (avoids double "Mentivis")
    title: { absolute: isFr ? "École interne et université d’entreprise — Mentivis" : "Corporate academy and university — Mentivis" },
    description: isFr
      ? "Mentivis conçoit et pilote les écoles internes, campus corporate et universités d'entreprise : ingénierie pédagogique, certification RNCP, déploiement opérationnel. Spécialiste formation pour entreprises."
      : "Mentivis designs and runs corporate academies and universities: learning engineering, RNCP certification, operational deployment. Enterprise training specialist.",
    openGraph: {
      title: isFr ? "École pour entreprises et université d’entreprise - Mentivis" : "Corporate academy and corporate university - Mentivis",
      description: isFr
        ? "Mentivis conçoit et pilote les écoles internes, campus corporate et universités d'entreprise : ingénierie pédagogique, certification RNCP, déploiement opérationnel."
        : "Mentivis designs and runs corporate academies and universities: learning engineering, RNCP certification, operational deployment.",
      url: `${SITE.baseUrl}/${lang}/ecole-entreprise/`,
      images: [og],
    },
    twitter: { card: "summary_large_image", images: [og.url] },
    ...localeAlternates(lang, "/ecole-entreprise"),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  const og = getOgImage("/ecole-entreprise", lang);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: isFr ? "Création d'école interne et université d'entreprise - Mentivis" : "Corporate academy and university creation - Mentivis",
          description: isFr
            ? "Mentivis conçoit et pilote les écoles internes, campus corporate et universités d'entreprise : ingénierie des référentiels de compétences, certification RNCP, déploiement opérationnel."
            : "Mentivis designs and runs corporate academies and universities: competency frameworks, RNCP certification, operational deployment.",
          url: `https://mentivis.com/${lang}/ecole-entreprise/`,
          provider: { "@type": "Organization", name: "Mentivis", url: `https://mentivis.com/${lang}/` },
          areaServed: { "@type": "Country", name: "France" },
          serviceType: isFr ? "Création d'école interne et université d'entreprise" : "Corporate academy creation",
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
              name: isFr ? "Pourquoi une entreprise crée-t-elle sa propre école interne ?" : "Why does a company create its own corporate academy?",
              acceptedAnswer: {
                "@type": "Answer",
                text: isFr
                  ? "Pour sécuriser les compétences critiques non disponibles sur le marché, réduire le turnover en offrant des parcours certifiants, et transformer la formation en levier de performance opérationnelle plutôt qu'en centre de coûts."
                  : "To secure critical skills not available on the market, reduce turnover with certifying pathways, and turn training into operational performance.",
              },
            },
            {
              "@type": "Question",
              name: isFr ? "Quelle différence entre école interne, campus corporate et université d'entreprise ?" : "What is the difference between internal school, corporate campus and corporate university?",
              acceptedAnswer: {
                "@type": "Answer",
                text: isFr
                  ? "L'école interne forme à un métier ou une filière, le campus corporate mutualise plusieurs parcours pour un groupe, l'université d'entreprise structure une offre certifiante et diplômante à l'échelle du groupe avec gouvernance, référentiels et financements OPCO."
                  : "Internal school trains for a specific role, corporate campus pools multiple pathways, corporate university structures certifying provision at group scale with governance and funding.",
              },
            },
            {
              "@type": "Question",
              name: isFr ? "Quels financements mobiliser pour une école entreprise ?" : "Which funding can be mobilized for a corporate academy?",
              acceptedAnswer: {
                "@type": "Answer",
                text: isFr
                  ? "OPCO (plan de développement des compétences, alternance), CPF (si certification RNCP/RS), FSE, et taxe d'apprentissage via CFA interne. Mentivis optimise le montage financier et sécurise la conformité."
                  : "OPCO, CPF if RNCP-certified, ESF and apprenticeship tax via internal CFA. Mentivis optimizes the funding mix and compliance.",
              },
            },
            {
              "@type": "Question",
              name: isFr ? "Combien de temps pour créer une école interne opérationnelle ?" : "How long to create an operational corporate academy?",
              acceptedAnswer: {
                "@type": "Answer",
                text: isFr
                  ? "De 4 à 9 mois selon le périmètre : ingénierie des référentiels, certification RNCP si visée, outillage LMS, recrutement des formateurs et première promotion."
                  : "4 to 9 months depending on scope: framework engineering, RNCP certification if needed, LMS tooling, trainer recruitment and first cohort.",
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
            { "@type": "ListItem", position: 2, name: isFr ? "École pour entreprises" : "Corporate academy", item: `https://mentivis.com/${lang}/ecole-entreprise/` },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: isFr ? "Guides : école interne et université d'entreprise" : "Guides: corporate academy",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Comment développer une activité de formation en entreprise (intra)", url: `https://mentivis.com/${lang}/referentiel/comment-developper-une-activite-de-formation-en-entreprise-intra/` },
            { "@type": "ListItem", position: 2, name: "Comment construire un plan de développement des compétences efficace", url: `https://mentivis.com/${lang}/referentiel/comment-construire-un-plan-de-developpement-des-competences-efficace/` },
            { "@type": "ListItem", position: 3, name: "Comment piloter la formation dans un groupe multi-sites", url: `https://mentivis.com/${lang}/referentiel/comment-piloter-la-formation-dans-un-groupe-multi-sites-ou-international/` },
            { "@type": "ListItem", position: 4, name: "Qu'est-ce que la GEPP différence GPEC", url: `https://mentivis.com/${lang}/referentiel/quest-ce-que-la-gepp-difference-gpec/` },
          ],
        }}
      />
      <PageShell>
        <section style={{ padding: "120px 24px 60px", maxWidth: 780, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, lineHeight: 1.1, color: "var(--m-ink)", margin: "0 0 16px" }}>
            {isFr ? "Créer votre école interne ou université d'entreprise" : "Create your corporate academy or university"}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--m-ink-3)", margin: "0 0 40px" }}>
            {isFr
              ? "Mentivis conçoit et pilote les écoles internes, campus corporate et universités d'entreprise : ingénierie des référentiels, certification RNCP, financement OPCO et déploiement jusqu'à la première promotion."
              : "Mentivis designs and runs corporate academies and universities: frameworks, RNCP certification, OPCO funding and deployment through first cohort."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Pourquoi les entreprises créent leur propre structure de formation" : "Why companies create their own academy"}</h2>
          <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)" }}>
            {isFr
              ? "La pénurie de compétences rend le recrutement externe coûteux et lent. Une école interne sécurise les compétences critiques, fidélise (parcours certifiants) et transforme la formation en levier de performance. Cas PSH Sup : CFA interne créé avec Mentivis, première promotion opérationnelle en 6 mois."
              : "Skills shortages make external hiring costly. A corporate academy secures critical skills, retains talent with certifying pathways and turns training into performance."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "École interne, campus corporate, université d'entreprise : quelle structure choisir" : "Which structure to choose"}</h2>
          <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)" }}>
            {isFr
              ? "École interne : un métier/filière, 20-50 apprenants/an. Campus corporate : plusieurs parcours mutualisés pour un groupe. Université d'entreprise : offre certifiante/diplômante à l'échelle groupe avec gouvernance, référentiels, financements. Mentivis aide à arbitrer selon taille, maturité et ambition."
              : "Internal school: one craft, 20-50 learners/year. Corporate campus: pooled pathways. Corporate university: certifying offer at group scale with governance and funding."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Ce que Mentivis opère de la stratégie au premier apprenant" : "What Mentivis operates end-to-end"}</h2>
          <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)" }}>
            {isFr
              ? "Stratégie (cartographie des compétences, GEPP), ingénierie (référentiels, programmes, évaluations), certification (RNCP/Qualiopi si OF interne), outillage (LMS, SIRH), financement (OPCO, CPF, taxe d'apprentissage), opérationnel (recrutement formateurs, planning, première promotion). Opéré, pas seulement conseillé."
              : "Strategy, engineering, certification, tooling, funding and operations - operated, not just advised."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Financement et dispositifs mobilisables" : "Funding"}</h2>
          <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)" }}>
            {isFr
              ? "Plan de développement des compétences, contrats d'alternance, CPF si certification RNCP/RS, FSE, taxe d'apprentissage via CFA interne. Mentivis monte le dossier financier et sécurise la conformité DREETS/France Compétences."
              : "Skills development plan, apprenticeships, CPF if RNCP, ESF, apprenticeship tax via internal CFA. Mentivis handles the funding mix and compliance."}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Articles pratiques" : "Practical articles"}</h2>
          <ul style={{ lineHeight: 1.7 }}>
            <li><a href={`/${lang}/referentiel/comment-developper-une-activite-de-formation-en-entreprise-intra/`}>Comment développer une activité de formation en entreprise (intra)</a></li>
            <li><a href={`/${lang}/referentiel/comment-construire-un-plan-de-developpement-des-competences-efficace/`}>Comment construire un plan de développement des compétences efficace</a></li>
            <li><a href={`/${lang}/referentiel/comment-piloter-la-formation-dans-un-groupe-multi-sites-ou-international/`}>Comment piloter la formation dans un groupe multi-sites</a></li>
            <li><a href={`/${lang}/referentiel/quest-ce-que-la-gepp-difference-gpec/`}>Qu'est-ce que la GEPP, différence avec la GPEC</a></li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "40px 0 16px" }}>{isFr ? "Questions fréquentes" : "FAQ"}</h2>
          <div style={{ display: "grid", gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: "var(--m-ink)" }}>{isFr ? "Pourquoi une entreprise crée-t-elle sa propre école interne ?" : "Why does a company create its own corporate academy?"}</h3>
              <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)", margin: 0 }}>{isFr ? "Pour sécuriser les compétences critiques non disponibles sur le marché, réduire le turnover en offrant des parcours certifiants, et transformer la formation en levier de performance opérationnelle plutôt qu'en centre de coûts." : "To secure critical skills not available on the market, reduce turnover with certifying pathways, and turn training into operational performance."}</p>
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: "var(--m-ink)" }}>{isFr ? "Quelle différence entre école interne, campus corporate et université d'entreprise ?" : "What is the difference between internal school, corporate campus and corporate university?"}</h3>
              <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)", margin: 0 }}>{isFr ? "L'école interne forme à un métier ou une filière, le campus corporate mutualise plusieurs parcours pour un groupe, l'université d'entreprise structure une offre certifiante et diplômante à l'échelle du groupe avec gouvernance, référentiels et financements OPCO." : "Internal school trains for a specific role, corporate campus pools multiple pathways, corporate university structures certifying provision at group scale with governance and funding."}</p>
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: "var(--m-ink)" }}>{isFr ? "Quels financements mobiliser pour une école entreprise ?" : "Which funding can be mobilized for a corporate academy?"}</h3>
              <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)", margin: 0 }}>{isFr ? "OPCO (plan de développement des compétences, alternance), CPF (si certification RNCP/RS), FSE, et taxe d'apprentissage via CFA interne. Mentivis optimise le montage financier et sécurise la conformité." : "OPCO, CPF if RNCP-certified, ESF and apprenticeship tax via internal CFA. Mentivis optimizes the funding mix and compliance."}</p>
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: "var(--m-ink)" }}>{isFr ? "Combien de temps pour créer une école interne opérationnelle ?" : "How long to create an operational corporate academy?"}</h3>
              <p style={{ lineHeight: 1.7, color: "var(--m-ink-2)", margin: 0 }}>{isFr ? "De 4 à 9 mois selon le périmètre : ingénierie des référentiels, certification RNCP si visée, outillage LMS, recrutement des formateurs et première promotion." : "4 to 9 months depending on scope: framework engineering, RNCP certification if needed, LMS tooling, trainer recruitment and first cohort."}</p>
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}
