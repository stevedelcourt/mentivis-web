"use client";

import { useState } from "react";
import { useMessages } from "@/lib/messages";
import Reveal from "@/components/Reveal";

interface Sector {
  id: string;
  titleFr: string;
  titleEn: string;
  membersFr: string[];
  membersEn: string[];
  advantagesFr: string[];
  advantagesEn: string[];
  image: string;
}

const SECTORS: Sector[] = [
  {
    id: "entreprises",
    titleFr: "Entreprises & Réseaux",
    titleEn: "Companies & Networks",
    membersFr: [
      "Entreprises", "ETI", "Grands Groupes", "PME", "ESN",
      "Campus d'entreprise", "Franchises", "Santé"
    ],
    membersEn: [
      "Companies", "Mid-caps", "Large Groups", "SMEs", "ESNs",
      "Corporate Campuses", "Franchises", "Healthcare"
    ],
    advantagesFr: [
      "Parcours générés par IA, calibrés par métier",
      "Pilotage centralisé à l'échelle du groupe",
      "Recrutement calibré aux besoins opérationnels",
      "Onboarding ciblé par profil et site",
      "Déploiement multi-sites, multi-pays",
      "Connexion SIRH, ATS, outils internes"
    ],
    advantagesEn: [
      "AI-generated paths, calibrated by profession",
      "Centralised management at group level",
      "Recruitment calibrated to operational needs",
      "Targeted onboarding by profile and site",
      "Multi-site, multi-country deployment",
      "HRIS, ATS, internal tools integration"
    ],
    image: "/images/mentivisos/formation.avif",
  },
  {
    id: "formation",
    titleFr: "Formation & Éducation",
    titleEn: "Training & Education",
    membersFr: [
      "CFA", "Écoles", "Universités", "Organismes de formation", "Centres de formation internes"
    ],
    membersEn: [
      "Apprentice Training Centers", "Schools", "Universities", "Training Organizations", "Internal Training Centers"
    ],
    advantagesFr: [
      "Formation personnalisée par apprenant",
      "Recalibrage pédagogique automatique",
      "Conformité Qualiopi et certification intégrée",
      "Gestion OPCO et financements automatiques",
      "Évaluation des acquis, pas de la consommation",
      "Workflows pédagogiques automatisés"
    ],
    advantagesEn: [
      "Personalised training per learner",
      "Automatic pedagogical recalibration",
      "Qualiopi compliance and integrated certification",
      "OPCO management and automatic funding",
      "Skills assessment, not consumption metrics",
      "Automated pedagogical workflows"
    ],
    image: "/images/mentivisos/student.avif",
  },
  {
    id: "public",
    titleFr: "Public & Institutionnel",
    titleEn: "Public & Institutional",
    membersFr: [
      "Collectivités", "Ministères", "Agences publiques", "Réseaux associatifs", "Acteurs de l'insertion"
    ],
    membersEn: [
      "Local Authorities", "Ministries", "Public Agencies", "Associations", "Integration Actors"
    ],
    advantagesFr: [
      "Diagnostic des écarts territoriaux",
      "Recommandations adaptées aux politiques publiques",
      "Mise en oeuvre rapide, sans refonte",
      "Optimisation des budgets formation publics",
      "Mesure d'impact sur l'emploi et l'insertion",
      "Infrastructure souveraine et évolutive"
    ],
    advantagesEn: [
      "Territorial gap diagnostics",
      "Recommendations tailored to public policy",
      "Rapid implementation, no overhaul needed",
      "Public training budget optimisation",
      "Employment and integration impact measurement",
      "Sovereign and scalable infrastructure"
    ],
    image: "/images/mentivisos/ministere.avif",
  },
  {
    id: "professionnels",
    titleFr: "Professionnels & Métiers",
    titleEn: "Professionals & Trades",
    membersFr: [
      "Cabinets de conseil", "Opérateurs de compétences", "Fédérations professionnelles", "Branches métiers"
    ],
    membersEn: [
      "Consulting Firms", "Skills Operators", "Professional Federations", "Trade Branches"
    ],
    advantagesFr: [
      "Analyse de faisabilité avant prescription",
      "Scoring technique et opérationnel des parcours",
      "Agents IA métier, embarqués dans les référentiels",
      "Tableaux de bord par branche et fédération",
      "Veille compétences et upskilling continu",
      "Orchestration formation et placement"
    ],
    advantagesEn: [
      "Feasibility analysis before prescription",
      "Technical and operational path scoring",
      "Domain-specific AI agents, embedded in frameworks",
      "Dashboards by branch and federation",
      "Skills monitoring and continuous upskilling",
      "Training and placement orchestration"
    ],
    image: "/images/mentivisos/workers.avif",
  },
];

export default function SectorShowcase() {
  const { t, lang } = useMessages();
  const s = t.mentivisos.sectors;
  const isFr = lang === "fr";
  const [activeIdx, setActiveIdx] = useState(0);
  const sector = SECTORS[activeIdx];
  const title = isFr ? sector.titleFr : sector.titleEn;
  const members = isFr ? sector.membersFr : sector.membersEn;
  const advantages = isFr ? sector.advantagesFr : sector.advantagesEn;

  return (
    <section style={{ padding: "96px 0", background: "var(--m-bg)" }}>
      <div className="container">
        <Reveal>
          <h2
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(24px, 3.5vw, 40px)",
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "var(--m-ink)",
              maxWidth: 760,
              marginBottom: 48,
            }}
          >
            {s.headline}
          </h2>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={100}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginBottom: 32,
            }}
            className="sector-tab-grid"
          >
            {SECTORS.map((sec, i) => (
              <button
                key={sec.id}
                onClick={() => setActiveIdx(i)}
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  border: "1.5px solid",
                  borderColor: activeIdx === i ? "var(--m-purple)" : "var(--m-line)",
                  background: activeIdx === i ? "var(--m-purple)" : "transparent",
                  color: activeIdx === i ? "#fff" : "var(--m-ink-2)",
                  fontFamily: "var(--f-sans)",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                  textAlign: "left",
                  lineHeight: 1.4,
                }}
              >
                {isFr ? sec.titleFr : sec.titleEn}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Content */}
        <Reveal delay={200}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
            className="sector-content-grid"
          >
            {/* Left */}
            <div
              style={{
                background: "var(--m-bg-soft)",
                borderRadius: 20,
                padding: "36px 32px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--m-ink-3)",
                  marginBottom: 16,
                }}
              >
                {title}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 8px",
                  marginBottom: 32,
                }}
              >
                {members.map((m) => (
                  <span
                    key={m}
                    style={{
                      fontFamily: "var(--f-sans)",
                      fontSize: 12,
                      fontWeight: 400,
                      color: "var(--m-ink-2)",
                      padding: "5px 12px",
                      borderRadius: 999,
                      background: "var(--m-bg)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {advantages.map((adv, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "var(--m-purple)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <p style={{ fontFamily: "var(--f-sans)", fontSize: 14, fontWeight: 400, lineHeight: 1.5, color: "var(--m-ink-2)" }}>
                      {adv}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 360 }}>
              <img
                src={sector.image}
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  padding: "6px 12px 6px 8px",
                  position: "absolute",
                  top: 20,
                  left: 20,
                }}
              >
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                  MentivisOS
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Baseline + CTA */}
        <Reveal delay={300}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 48,
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <p style={{ fontFamily: "var(--f-sans)", fontSize: 15, fontWeight: 400, color: "var(--m-ink-2)", lineHeight: 1.5 }}>
              {s.baseline}
            </p>
            <a
              href="https://app.mentivisos.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                color: "white",
                background: "var(--m-purple)",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              {s.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sector-tab-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .sector-content-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
