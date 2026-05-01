"use client";
import PageShell from "@/components/layout/PageShell";
import FinalCTA from "@/components/FinalCTA";
import { useMessages } from "@/lib/messages";

/* ============================================================
   USE CASES — Design prototype page
   Hardcoded content. Not linked from nav. Will be broken into
   modules for /enterprise, /of, /solutions integration.
   ============================================================ */

interface UseCase {
  tag: string;
  context: string;
  solutions: string[];
  results: { value: string; label: string }[];
}

const casesEntreprise: UseCase[] = [
  {
    tag: "Industrie manufacturière · ETI · 2 500 salariés",
    context:
      "Dispositif de formation historique sous-utilisé, budget OPCO non mobilisé, taux de completion inférieur à 30 %. Aucune visibilité sur les écarts de compétences critiques pour la production.",
    solutions: [
      "Cartographie des compétences critiques et mise en place d\'un plan de formation aligné sur la stratégie industrielle",
      "Déploiement d\'un LMS sectoriel avec parcours mixtes (présentiel + digital) et évaluation post-formation systématique",
      "Mobilisation complète du budget OPCO et mise en place d\'un reporting ROI mensuel",
    ],
    results: [
      { value: "+47%", label: "Taux de completion" },
      { value: "2.3M€", label: "Budget mobilisé" },
      { value: "12 mois", label: "Déploiement" },
    ],
  },
  {
    tag: "Services · Grande entreprise · 8 000 salariés",
    context:
      "Transformation digitale majeure avec résistance au changement. 40 % des managers non formés aux nouveaux outils. Turnover élevé sur les postes techniques.",
    solutions: [
      "Programme de change management intégré aux parcours de formation digitale",
      "Académie interne par métiers avec certification et reconnaissance des compétences",
      "Partenariat avec écoles et centres de formation pour un pipeline de recrutement qualifié",
    ],
    results: [
      { value: "-28%", label: "Turnover technique" },
      { value: "94%", label: "Adoption outils" },
      { value: "18 mois", label: "Déploiement" },
    ],
  },
];

const casesOf: UseCase[] = [
  {
    tag: "Organisme de formation · B2B · 150 clients actifs",
    context:
      "Croissance rapide mais processus non structurés. Qualiopi en cours mais documentation incomplète. Taux de satisfaction client en baisse.",
    solutions: [
      "Structuration du système qualité et préparation complète à l\'audit Qualiopi",
      "Refonte des parcours pédagogiques avec modularité et évaluation des acquis",
      "Mise en place d\'un CRM formation et automatisation du suivi administratif",
    ],
    results: [
      { value: "100%", label: "Obtention Qualiopi" },
      { value: "+35%", label: "Satisfaction client" },
      { value: "6 mois", label: "Déploiement" },
    ],
  },
  {
    tag: "CFA · Secteur santé · 800 apprentis",
    context:
      "Taux d\'abandon en hausse (22 %). Formation trop éloignée des besoins terrain. Partenaires entreprises insuffisamment impliqués.",
    solutions: [
      "Co-construction des parcours avec les employeurs et immersion clinique renforcée",
      "Tutorat pair-à-pair et suivi individualisé des apprentis à risque",
      "Digitalisation des ressources pédagogiques et plateforme de suivi des compétences",
    ],
    results: [
      { value: "-18pts", label: "Taux d\'abandon" },
      { value: "92%", label: "Insertion professionnelle" },
      { value: "9 mois", label: "Déploiement" },
    ],
  },
];

const casesSolutions: UseCase[] = [
  {
    tag: "Conseil · PME · 120 collaborateurs",
    context:
      "Projets complexes nécessitant une expertise formation externe. Manque de temps interne pour structurer les dispositifs. Besoin d\'un interlocuteur unique et d\'un reporting clair.",
    solutions: [
      "Mission de conseil en ingénierie de formation : diagnostic, structuration, déploiement",
      "Mise en place d\'un comité de pilotage mensuel avec reporting chiffré des indicateurs clés",
      "Formation des équipes RH internes à l\'autonomie sur le pilotage des dispositifs",
    ],
    results: [
      { value: "+60%", label: "Efficacité formation" },
      { value: "1 interlocuteur", label: "Point unique" },
      { value: "8 mois", label: "Déploiement" },
    ],
  },
  {
    tag: "Tech · Start-up · 45 salariés",
    context:
      "Scaling rapide avec recrutement de profils juniors. Besoin de monter en compétence sur les bonnes pratiques techniques et le produit. Culture d\'apprentissage à créer.",
    solutions: [
      "Bootcamp d\'onboarding technique personnalisé par rôle (dev, product, data)",
      "Programme de mentorat interne et accès à une plateforme de formation tech continue",
      "Ateliers mensuels de veille technologique et partage de connaissances",
    ],
    results: [
      { value: "-40%", label: "Time-to-productivity" },
      { value: "100%", label: "Juniors accompagnés" },
      { value: "4 mois", label: "Déploiement" },
    ],
  },
];

function CaseCard({ data, index }: { data: UseCase; index: number }) {
  return (
    <article
      style={{
        background: "var(--m-ink)",
        color: "white",
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      {/* Header */}
      <div style={{ padding: "36px 36px 0" }}>
        <div
          className="t-eyebrow"
          style={{
            color: "rgba(255,255,255,0.55)",
            marginBottom: 20,
            fontSize: 11,
            letterSpacing: "0.08em",
          }}
        >
          {data.tag}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0 36px", flex: 1 }}>
        {/* Contexte */}
        <div style={{ marginBottom: 28 }}>
          <h4
            style={{
              fontFamily: "var(--f-display)",
              fontSize: 16,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 10px",
            }}
          >
            Contexte et défi
          </h4>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 15,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {data.context}
          </p>
        </div>

        {/* Solutions */}
        <div style={{ marginBottom: 32 }}>
          <h4
            style={{
              fontFamily: "var(--f-display)",
              fontSize: 16,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 10px",
            }}
          >
            Solutions
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {data.solutions.map((sol, i) => (
              <li
                key={i}
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 15,
                  lineHeight: 1.55,
                  paddingLeft: 20,
                  position: "relative" as const,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 6,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--m-purple)",
                  }}
                />
                {sol}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Results bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: "rgba(255,255,255,0.08)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
        className="m-case-results"
      >
        {data.results.map((res, i) => (
          <div
            key={i}
            style={{
              padding: "28px 20px",
              textAlign: "center" as const,
              background: "var(--m-ink)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 700,
                color: "white",
                lineHeight: 1,
                marginBottom: 8,
                letterSpacing: "-1px",
              }}
            >
              {res.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              {res.label}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function CaseSection({
  title,
  cases,
}: {
  title: string;
  cases: UseCase[];
}) {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="container">
        <h2
          style={{
            fontFamily: "var(--f-display)",
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 700,
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
            margin: "0 0 48px",
            color: "var(--m-ink)",
          }}
        >
          {title}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
          className="m-usecase-grid"
        >
          {cases.map((c, i) => (
            <CaseCard key={i} data={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function UseCasesPage() {
  const { t, lang } = useMessages();

  return (
    <PageShell hidePreFooterCTA>
      {/* Page header */}
      <section style={{ padding: "120px 0 40px" }}>
        <div className="container">
          <div className="t-eyebrow" style={{ marginBottom: 16 }}>
            {lang === "fr" ? "Références" : "References"}
          </div>
          <h1
            className="t-display"
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              margin: "0 0 20px",
              maxWidth: 700,
            }}
          >
            {lang === "fr" ? "Cas clients" : "Client cases"}
          </h1>
          <p
            style={{
              color: "var(--m-ink-3)",
              fontSize: 18,
              lineHeight: 1.55,
              maxWidth: 560,
              margin: 0,
            }}
          >
            {lang === "fr"
              ? "Retour d\'expérience sur des missions réelles. Données anonymisées."
              : "Feedback on real missions. Anonymised data."}
          </p>
        </div>
      </section>

      {/* Enterprise */}
      <CaseSection
        title={lang === "fr" ? "Entreprises" : "Enterprises"}
        cases={casesEntreprise}
      />

      {/* Divider */}
      <div className="container">
        <div style={{ height: 1, background: "var(--m-line)" }} />
      </div>

      {/* Organismes de formation */}
      <CaseSection
        title={lang === "fr" ? "Organismes de formation" : "Training organisations"}
        cases={casesOf}
      />

      {/* Divider */}
      <div className="container">
        <div style={{ height: 1, background: "var(--m-line)" }} />
      </div>

      {/* Solutions */}
      <CaseSection
        title={lang === "fr" ? "Solutions" : "Solutions"}
        cases={casesSolutions}
      />

      <FinalCTA
        t={t}
        title={
          lang === "fr"
            ? "Votre projet mérite un diagnostic"
            : "Your project deserves a diagnosis"
        }
        lang={lang}
        accent="purple"
      />
    </PageShell>
  );
}
