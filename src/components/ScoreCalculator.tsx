"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { useMessages } from "@/lib/messages";
import { useHubSpotSubmit } from "@/lib/hubspot";
import "./ScoreCalculator.css";

/* ============================================================
   DATA
   ============================================================ */

const dimensions = [
  { code: "STRAT", weight: 0.20 },
  { code: "SKILL", weight: 0.15 },
  { code: "SYS",   weight: 0.20 },
  { code: "ROI",   weight: 0.20 },
  { code: "FUND",  weight: 0.10 },
  { code: "COMP",  weight: 0.15 }
] as const;

type DimCode = typeof dimensions[number]["code"];

const questions: Record<DimCode, { sliders: { id: string; fr: string; en: string }[]; proofs: { id: string; fr: string; en: string; malus: number }[] }> = {
  STRAT: {
    sliders: [
      { id: "S1", fr: "Nos formations sont directement reliées à des objectifs business explicites.", en: "Our training programs are directly tied to explicit business objectives." },
      { id: "S2", fr: "Les dirigeants considèrent la formation comme un levier stratégique, pas un coût.", en: "Leadership views training as a strategic lever, not a cost." },
      { id: "S3", fr: "Les compétences critiques de l'entreprise sont identifiées et documentées.", en: "The company's critical skills are identified and documented." },
      { id: "S4", fr: "Les plans de formation sont révisés en fonction des évolutions stratégiques.", en: "Training plans are revised in response to strategic shifts." }
    ],
    proofs: [
      { id: "SP1", fr: "Disposez-vous d'un plan de formation formalisé et à jour ?", en: "Do you have a formal, up-to-date training plan?", malus: 10 },
      { id: "SP2", fr: "Existe-t-il une cartographie des compétences critiques de votre organisation ?", en: "Does a critical skills map exist for your organization?", malus: 8 }
    ]
  },
  SKILL: {
    sliders: [
      { id: "SK1", fr: "Nous connaissons précisément les écarts de compétences entre le niveau actuel et le niveau attendu.", en: "We know precisely the skill gaps between current and expected levels." },
      { id: "SK2", fr: "Les compétences des équipes sont évaluées de façon régulière et structurée.", en: "Team competencies are assessed regularly and in a structured way." },
      { id: "SK3", fr: "Nos formations ciblent en priorité les compétences les plus critiques pour la performance.", en: "Our training primarily targets the skills most critical to performance." }
    ],
    proofs: [
      { id: "SKP1", fr: "Utilisez-vous une matrice compétences contre rôles formalisée ?", en: "Do you use a formal competency vs role matrix?", malus: 10 },
      { id: "SKP2", fr: "Ces évaluations produisent-elles des données exploitables (pas seulement des impressions) ?", en: "Do these assessments produce actionable data (not just impressions)?", malus: 8 }
    ]
  },
  SYS: {
    sliders: [
      { id: "SY1", fr: "Les parcours de formation sont structurés, pas improvisés selon les disponibilités.", en: "Training paths are structured, not improvised around availability." },
      { id: "SY2", fr: "Nous utilisons des formats variés et adaptés (présentiel, digital, blended).", en: "We use varied and adapted formats (in-person, digital, blended)." },
      { id: "SY3", fr: "Les formations font l'objet d'une évaluation post-formation systématique.", en: "Training is followed by systematic post-training evaluation." },
      { id: "SY4", fr: "Les parcours sont personnalisés selon les profils et niveaux des collaborateurs.", en: "Learning paths are personalized according to employee profiles and levels." }
    ],
    proofs: [
      { id: "SYP1", fr: "Disposez-vous d'un LMS ou d'un outil de suivi des formations ?", en: "Do you have an LMS or training tracking tool?", malus: 8 },
      { id: "SYP2", fr: "Les évaluations post-formation sont-elles documentées et archivées ?", en: "Are post-training evaluations documented and archived?", malus: 10 }
    ]
  },
  ROI: {
    sliders: [
      { id: "R1", fr: "Nous mesurons l'impact réel des formations sur la performance opérationnelle.", en: "We measure the real impact of training on operational performance." },
      { id: "R2", fr: "Nous pouvons identifier quelles formations produisent des résultats, et lesquelles non.", en: "We can identify which training programs produce results and which do not." },
      { id: "R3", fr: "Les budgets formation sont alloués en fonction de l'impact attendu, pas des habitudes.", en: "Training budgets are allocated based on expected impact, not habit." },
      { id: "R4", fr: "Nous avons déjà abandonné ou restructuré une formation jugée inefficace.", en: "We have previously discontinued or restructured training deemed ineffective." }
    ],
    proofs: [
      { id: "RP1", fr: "Disposez-vous d'indicateurs de performance liés à la formation (KPIs) ?", en: "Do you have performance indicators linked to training (KPIs)?", malus: 12 },
      { id: "RP2", fr: "Avez-vous réalisé une analyse coût-bénéfice d'une formation au cours des 2 dernières années ?", en: "Have you conducted a cost-benefit analysis of any training in the past 2 years?", malus: 10 }
    ]
  },
  FUND: {
    sliders: [
      { id: "F1", fr: "Nous mobilisons activement les dispositifs de financement disponibles (OPCO, aides publiques).", en: "We actively use available funding mechanisms (OPCO, public grants)." },
      { id: "F2", fr: "Nous avons une vision claire de notre enveloppe de financement disponible chaque année.", en: "We have a clear view of our available funding envelope each year." }
    ],
    proofs: [
      { id: "FP1", fr: "Avez-vous utilisé votre OPCO au cours des 12 derniers mois ?", en: "Have you used your OPCO in the past 12 months?", malus: 10 },
      { id: "FP2", fr: "Un responsable en interne suit-il activement les évolutions des dispositifs de financement ?", en: "Does someone internally actively track funding mechanism changes?", malus: 8 }
    ]
  },
  COMP: {
    sliders: [
      { id: "C1", fr: "Nous respectons toutes les obligations légales en matière de formation (entretiens, CPF, etc.).", en: "We comply with all legal training obligations (interviews, CPF, etc.)." },
      { id: "C2", fr: "La traçabilité de nos formations est assurée et exploitable en cas d'audit.", en: "Our training traceability is maintained and usable in the event of an audit." },
      { id: "C3", fr: "Nous avons une vision claire de notre exposition réglementaire en matière de formation.", en: "We have a clear view of our regulatory exposure regarding training." }
    ],
    proofs: [
      { id: "CP1", fr: "Vos dossiers de formation sont-ils à jour et classifiés (émargements, conventions, etc.) ?", en: "Are your training files current and organized (sign-in sheets, agreements, etc.)?", malus: 10 },
      { id: "CP2", fr: "Avez-vous subi un audit ou un contrôle formation sans anomalie majeure au cours des 3 dernières années ?", en: "Have you undergone a training audit or inspection without major issues in the past 3 years?", malus: 8 }
    ]
  }
};

const narrativeRules = {
  diagnostic: [
    { condition: (s: Scores, q: Qualification) => s.reality.SYS > 65 && s.reality.ROI < 50, fr: "Vous formez mais vous ne mesurez pas. L'effort est réel, l'impact reste invisible.", en: "You train but you do not measure. The effort is real, the impact remains invisible." },
    { condition: (s: Scores, q: Qualification) => s.reality.STRAT > 65 && s.reality.FUND < 50, fr: "Votre vision stratégique est claire mais vous laissez des financements publics sur la table.", en: "Your strategic vision is clear but you leave public funding on the table." },
    { condition: (s: Scores, q: Qualification) => s.globalGap > 20, fr: "Un écart significatif sépare votre perception de la réalité processuelle. C'est souvent là que se cachent les vraies pertes.", en: "A significant gap separates your perception from process reality. That is often where real losses hide." },
    { condition: (s: Scores, q: Qualification) => s.globalReality < 40, fr: "La formation est aujourd'hui un coût subi, pas un investissement piloté.", en: "Training is today an endured cost, not a managed investment." },
    { condition: (s: Scores, q: Qualification) => s.globalReality >= 40 && s.globalReality < 60, fr: "Vous remplissez vos obligations mais sans en tirer un avantage compétitif. Le potentiel d'optimisation est élevé.", en: "You meet your obligations but without extracting a competitive advantage. The optimization potential is high." },
    { condition: (s: Scores, q: Qualification) => s.globalReality >= 60 && s.globalReality < 75, fr: "Votre dispositif de formation est correctement structuré. La marge de progression se situe désormais sur la mesure d'impact et l'alignement stratégique.", en: "Your training system is correctly structured. The room for progress now lies in impact measurement and strategic alignment." },
    { condition: (s: Scores, q: Qualification) => s.globalReality >= 75, fr: "Votre dispositif est mature. L'enjeu est désormais la transformation de la formation en levier de croissance différenciant.", en: "Your system is mature. The stakes now are turning training into a differentiating growth lever." },
    { condition: (s: Scores, q: Qualification) => s.reality.COMP < 50, fr: "Votre exposition réglementaire est sous-estimée et constitue un risque immédiat.", en: "Your regulatory exposure is underestimated and constitutes an immediate risk." },
    { condition: (s: Scores, q: Qualification) => s.reality.SKILL < 45, fr: "Vous formez sans visibilité claire sur les écarts de compétences à combler.", en: "You train without clear visibility on the skill gaps to fill." }
  ],
  risks: [
    { condition: (s: Scores, q: Qualification) => s.reality.ROI < 50, fr: "Inefficacité budgétaire : sans mesure d'impact, vos arbitrages se font à l'aveugle.", en: "Budget inefficiency: without impact measurement, your arbitrations happen blind." },
    { condition: (s: Scores, q: Qualification) => s.reality.COMP < 60, fr: "Risque réglementaire latent en cas de contrôle ou d'audit.", en: "Latent regulatory risk in the event of inspection or audit." },
    { condition: (s: Scores, q: Qualification) => s.reality.ROI < 40 && q.budget > 50000, fr: "Vous investissez un budget conséquent sans mesure de retour. Le risque de gaspillage est élevé.", en: "You invest a substantial budget without return measurement. The waste risk is high." },
    { condition: (s: Scores, q: Qualification) => s.reality.STRAT < 50, fr: "Désalignement entre la stratégie business et le plan de formation.", en: "Misalignment between business strategy and the training plan." },
    { condition: (s: Scores, q: Qualification) => s.reality.FUND < 50, fr: "Sous-utilisation des dispositifs de financement disponibles, traduite par un coût net plus élevé que nécessaire.", en: "Underuse of available funding mechanisms, translating into a higher net cost than necessary." },
    { condition: (s: Scores, q: Qualification) => s.reality.SYS < 50, fr: "Système de formation non structuré : la performance dépend de la disponibilité des managers, pas d'un processus.", en: "Unstructured training system: performance depends on manager availability, not a process." },
    { condition: (s: Scores, q: Qualification) => s.reality.SKILL < 50, fr: "Compétences critiques mal cartographiées : risque d'investir sur les mauvaises priorités.", en: "Critical skills poorly mapped: risk of investing in wrong priorities." },
    { condition: (s: Scores, q: Qualification) => s.gap.STRAT > 25 || s.gap.ROI > 25, fr: "Décalage majeur entre conviction dirigeante et réalité processuelle, source de mauvaises décisions.", en: "Major disconnect between leadership conviction and process reality, source of poor decisions." }
  ],
  opportunities: [
    { condition: (s: Scores, q: Qualification) => s.reality.FUND < 60, fr: "Activation des dispositifs de financement non utilisés (OPCO, aides publiques) : gain rapide sur le coût net.", en: "Activation of unused funding mechanisms (OPCO, public grants): quick win on net cost." },
    { condition: (s: Scores, q: Qualification) => s.reality.ROI < 60, fr: "Mise en place d'indicateurs ROI simples pour distinguer formations efficaces et inefficaces.", en: "Setup of simple ROI indicators to distinguish effective from ineffective training." },
    { condition: (s: Scores, q: Qualification) => s.reality.SYS < 60, fr: "Structuration du système de formation et déploiement d'un outil de suivi unique.", en: "Structuring the training system and deploying a unified tracking tool." },
    { condition: (s: Scores, q: Qualification) => s.reality.STRAT < 65, fr: "Alignement du plan de formation sur les compétences critiques de votre stratégie business.", en: "Alignment of the training plan with the critical skills of your business strategy." },
    { condition: (s: Scores, q: Qualification) => s.reality.SKILL < 60, fr: "Construction d'une cartographie des compétences critiques pour cibler vos investissements.", en: "Construction of a critical skills map to target your investments." },
    { condition: (s: Scores, q: Qualification) => s.reality.COMP < 70, fr: "Mise à niveau de la traçabilité et de la documentation pour neutraliser le risque d'audit.", en: "Upgrading traceability and documentation to neutralize audit risk." },
    { condition: (s: Scores, q: Qualification) => s.reality.SYS > 70 && s.reality.ROI < 60, fr: "Vous avez la plomberie mais pas le compteur. Ajouter une mesure d'impact transformerait votre dispositif sans refonte.", en: "You have the plumbing but not the meter. Adding impact measurement would transform your system without rebuild." }
  ]
};

/* ============================================================
   TYPES
   ============================================================ */

interface Qualification {
  company: string;
  sector: string;
  size: string;
  role: string;
  budget: number;
}

interface Scores {
  perception: Record<string, number>;
  reality: Record<string, number>;
  gap: Record<string, number>;
  weights: Record<string, number>;
  globalPerception: number;
  globalReality: number;
  globalGap: number;
  weakest: string;
  strongest: string;
  weakestScore: number;
  strongestScore: number;
}

type Screen = "landing" | "qualification" | "questionnaire" | "transition" | "dashboard";

/* ============================================================
   HELPERS
   ============================================================ */

function computeScores(answers: Record<string, number>, proofs: Record<string, boolean>) {
  const result: Scores = {
    perception: {},
    reality: {},
    gap: {},
    weights: {},
    globalPerception: 0,
    globalReality: 0,
    globalGap: 0,
    weakest: "",
    strongest: "",
    weakestScore: 0,
    strongestScore: 0,
  };

  dimensions.forEach(d => {
    const block = questions[d.code];
    let sliderSum = 0;
    block.sliders.forEach(q => {
      sliderSum += answers[q.id] ?? 3;
    });
    const perception = (sliderSum / block.sliders.length) * 20;

    let malus = 0;
    block.proofs.forEach(q => {
      if (proofs[q.id] === false) {
        malus += q.malus;
      }
    });

    const reality = Math.max(0, Math.min(perception, perception - malus));

    result.perception[d.code] = perception;
    result.reality[d.code] = reality;
    result.gap[d.code] = perception - reality;
    result.weights[d.code] = d.weight;

    result.globalPerception += perception * d.weight;
    result.globalReality += reality * d.weight;
  });

  result.globalGap = result.globalPerception - result.globalReality;
  result.globalPerception = Math.round(result.globalPerception);
  result.globalReality = Math.round(result.globalReality);
  result.globalGap = Math.round(result.globalGap);

  Object.keys(result.perception).forEach(k => {
    result.perception[k] = Math.round(result.perception[k]);
    result.reality[k] = Math.round(result.reality[k]);
    result.gap[k] = Math.round(result.gap[k]);
  });

  let minScore = 101, maxScore = -1;
  dimensions.forEach(d => {
    if (result.reality[d.code] < minScore) {
      minScore = result.reality[d.code];
      result.weakest = d.code;
    }
    if (result.reality[d.code] > maxScore) {
      maxScore = result.reality[d.code];
      result.strongest = d.code;
    }
  });
  result.weakestScore = minScore;
  result.strongestScore = maxScore;

  return result;
}

function getMaturityLevel(score: number) {
  if (score < 40) return { num: 1, key: "lvl1" as const };
  if (score < 60) return { num: 2, key: "lvl2" as const };
  if (score < 75) return { num: 3, key: "lvl3" as const };
  if (score < 90) return { num: 4, key: "lvl4" as const };
  return { num: 5, key: "lvl5" as const };
}

function formatEuro(amount: number, lang: string) {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);
}

/* ============================================================
   RADAR SVG
   ============================================================ */

function RadarSVG({ scores }: { scores: Scores }) {
  const cx = 200, cy = 200, radius = 130;
  const dims = dimensions.map(d => d.code);
  const n = dims.length;

  const gridPolys = useMemo(() => {
    const arr = [];
    for (let level = 1; level <= 5; level++) {
      const r = radius * (level / 5);
      let pts = "";
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
        pts += `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r} `;
      }
      arr.push(pts.trim());
    }
    return arr;
  }, [n]);

  const axisLines = useMemo(() => {
    return Array.from({ length: n }, (_, i) => {
      const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
      return { x2: cx + Math.cos(angle) * radius, y2: cy + Math.sin(angle) * radius };
    });
  }, [n]);

  const percPts = useMemo(() => {
    let pts = "";
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
      const v = (scores.perception[dims[i]] ?? 0) / 100;
      pts += `${cx + Math.cos(angle) * radius * v},${cy + Math.sin(angle) * radius * v} `;
    }
    return pts.trim();
  }, [scores, n, dims]);

  const realPts = useMemo(() => {
    let pts = "";
    const coords = [];
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
      const v = (scores.reality[dims[i]] ?? 0) / 100;
      const x = cx + Math.cos(angle) * radius * v;
      const y = cy + Math.sin(angle) * radius * v;
      pts += `${x},${y} `;
      coords.push({ x, y });
    }
    return { pts: pts.trim(), coords };
  }, [scores, n, dims]);

  return (
    <svg className="sc-radar-svg" viewBox="0 0 400 400">
      {gridPolys.map((pts, i) => (
        <polygon key={i} className="sc-radar-grid-poly" points={pts} />
      ))}
      {axisLines.map((line, i) => (
        <line key={i} className="sc-radar-axis-line" x1={cx} y1={cy} x2={line.x2} y2={line.y2} />
      ))}
      <polygon className="sc-radar-poly-perception" points={percPts} />
      <polygon className="sc-radar-poly-reality" points={realPts.pts} />
      {realPts.coords.map((p, i) => (
        <circle key={i} className="sc-radar-dot" cx={p.x} cy={p.y} r="3.5" />
      ))}
      {dims.map((dim, i) => {
        const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
        const labelR = radius + 28;
        const x = cx + Math.cos(angle) * labelR;
        const y = cy + Math.sin(angle) * labelR;
        return (
          <g key={dim}>
            <text className="sc-radar-label" x={x} y={y} dy="0">{dim}</text>
            <text className="sc-radar-label-sub" x={x} y={y} dy="14">{scores.reality[dim]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
   QUADRANT SVG
   ============================================================ */

function QuadrantSVG({ scores }: { scores: Scores }) {
  const cx = 200, cy = 200, padX = 60, padY = 50;
  const w = 400 - padX * 2;
  const h = 400 - padY * 2;

  const labels = { tl: "QUICK WINS", tr: "STRUCTURAL", bl: "SECONDARY", br: "OVER-INVESTED" };

  return (
    <svg className="sc-radar-svg" viewBox="0 0 400 400">
      <line className="sc-quad-axis" x1={padX} y1={cy} x2={400 - padX} y2={cy} />
      <line className="sc-quad-axis" x1={cx} y1={padY} x2={cx} y2={400 - padY} />
      {[1, 3].map(i => {
        const x = padX + (w / 4) * i;
        const y = padY + (h / 4) * i;
        return (
          <g key={i}>
            <line className="sc-quad-grid" x1={x} y1={padY} x2={x} y2={400 - padY} />
            <line className="sc-quad-grid" x1={padX} y1={y} x2={400 - padX} y2={y} />
          </g>
        );
      })}
      <text className="sc-quad-quadrant-label" x={padX + w * 0.25} y={padY + h * 0.18} textAnchor="middle">{labels.tl}</text>
      <text className="sc-quad-quadrant-label" x={padX + w * 0.75} y={padY + h * 0.18} textAnchor="middle">{labels.tr}</text>
      <text className="sc-quad-quadrant-label" x={padX + w * 0.25} y={padY + h * 0.82} textAnchor="middle">{labels.bl}</text>
      <text className="sc-quad-quadrant-label" x={padX + w * 0.75} y={padY + h * 0.82} textAnchor="middle">{labels.br}</text>
      <text className="sc-quad-axis-title" x={cx} y={400 - 18} textAnchor="middle">EFFORT</text>
      <text className="sc-quad-axis-title" x="22" y={cy} textAnchor="middle" transform={`rotate(-90, 22, ${cy})`}>IMPACT</text>
      {dimensions.map(d => {
        const effortNorm = (100 - scores.reality[d.code]) / 100;
        const impactNorm = d.weight / 0.20;
        const x = padX + effortNorm * w;
        const y = padY + (1 - impactNorm) * h;
        return (
          <g key={d.code}>
            <circle className="sc-quad-bubble" cx={x} cy={y} r="22" />
            <text className="sc-quad-bubble-label" x={x} y={y + 4}>{d.code}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function ScoreCalculator() {
  const { t, lang } = useMessages();
  const s = t.score;

  const [screen, setScreen] = useState<Screen>("landing");
  const [qualification, setQualification] = useState<Qualification>({ company: "", sector: "", size: "", role: "", budget: 0 });
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [proofs, setProofs] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<Scores | null>(null);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const { submit: hsSubmit, loading: hsLoading, error: hsError } = useHubSpotSubmit();
  const pdfRef = useRef<HTMLDivElement>(null);

  const goToScreen = useCallback((name: Screen) => {
    setScreen(name);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleQualSubmit = useCallback(() => {
    const { company, sector, size, role, budget } = qualification;
    if (!company || !sector || !size || !role || !budget || budget <= 0) {
      alert(lang === "fr" ? "Merci de compléter tous les champs." : "Please fill in all fields.");
      return;
    }
    setCurrentBlock(0);
    setAnswers({});
    setProofs({});
    goToScreen("questionnaire");
  }, [qualification, lang, goToScreen]);

  const currentDim = dimensions[currentBlock].code;
  const currentBlockData = questions[currentDim];

  const handleSliderChange = useCallback((id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: parseInt(value) }));
  }, []);

  const handleProof = useCallback((id: string, value: boolean) => {
    setProofs(prev => ({ ...prev, [id]: value }));
  }, []);

  const nextBlock = useCallback(() => {
    for (const p of currentBlockData.proofs) {
      if (proofs[p.id] === undefined) {
        alert(lang === "fr" ? "Merci de répondre aux questions de preuve avant de continuer." : "Please answer the proof questions before continuing.");
        return;
      }
    }
    if (currentBlock < 5) {
      setCurrentBlock(prev => prev + 1);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      goToScreen("transition");
      setTimeout(() => {
        const sc = computeScores(answers, proofs);
        setScores(sc);
        goToScreen("dashboard");
      }, 2200);
    }
  }, [currentBlock, currentBlockData, proofs, answers, lang, goToScreen]);

  const prevBlock = useCallback(() => {
    if (currentBlock > 0) {
      setCurrentBlock(prev => prev - 1);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentBlock]);

  const restart = useCallback(() => {
    setQualification({ company: "", sector: "", size: "", role: "", budget: 0 });
    setAnswers({});
    setProofs({});
    setScores(null);
    setCurrentBlock(0);
    setContactName("");
    setContactEmail("");
    setContactSent(false);
    setHoneypot("");
    setConsent(false);
    goToScreen("landing");
  }, [goToScreen]);

  const handleContact = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !consent) return;
    if (honeypot) return;
    await hsSubmit(
      { firstname: contactName.trim(), email: contactEmail.trim() },
      {
        pageUri: typeof window !== "undefined" ? window.location.href : "https://www.mentivis.com/fr/score-formation",
        pageName: "Score Formation",
      }
    );
    setContactSent(true);
  }, [contactName, contactEmail, consent, honeypot, hsSubmit]);

  const exportPDF = useCallback(async () => {
    if (!scores || !pdfRef.current) return;

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    // Build a temporary visible container inside a 1x1px overflow-hidden wrapper
    // so the user never sees it, but html2canvas captures it fully.
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;z-index:-1;";

    const inner = document.createElement("div");
    inner.style.width = "794px";
    inner.innerHTML = pdfRef.current.innerHTML;
    inner.className = pdfRef.current.className;
    wrapper.appendChild(inner);
    document.body.appendChild(wrapper);

    try {
      const canvas = await html2canvas(inner, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`mentivis_diagnostic_${qualification.company.replace(/\s+/g, "_").toLowerCase()}.pdf`);
    } finally {
      document.body.removeChild(wrapper);
    }
  }, [scores, qualification.company]);

  /* Derived dashboard data */
  const maturityLevel = scores ? getMaturityLevel(scores.globalReality) : null;

  const narrative = useMemo(() => {
    if (!scores) return { diag: [], risks: [], opps: [] };
    const q = qualification;
    const generate = (rules: typeof narrativeRules.diagnostic) => {
      return rules
        .filter(r => r.condition(scores, q))
        .map(r => (lang === "fr" ? r.fr : r.en))
        .slice(0, 4);
    };
    return {
      diag: generate(narrativeRules.diagnostic),
      risks: generate(narrativeRules.risks),
      opps: generate(narrativeRules.opportunities),
    };
  }, [scores, qualification, lang]);

  const funnelStages = useMemo(() => {
    if (!scores) return [];
    const budget = qualification.budget;
    const r = scores.reality;
    const stages = [
      { label: s.funnel.budget, sub: s.funnel.budgetSub, ratio: 1.0, cls: "" },
      { label: s.funnel.attended, sub: s.funnel.attendedSub, ratio: 1.0 * (0.5 + 0.5 * (r.SYS ?? 0) / 100), cls: "fade" },
      { label: s.funnel.acquired, sub: s.funnel.acquiredSub, ratio: (0.5 + 0.5 * (r.SYS ?? 0) / 100) * (0.4 + 0.6 * (r.SKILL ?? 0) / 100), cls: "fade-2" },
      { label: s.funnel.used, sub: s.funnel.usedSub, ratio: (0.5 + 0.5 * (r.SYS ?? 0) / 100) * (0.4 + 0.6 * (r.SKILL ?? 0) / 100) * (0.3 + 0.7 * (r.ROI ?? 0) / 100), cls: "fade-3" },
      { label: s.funnel.impact, sub: s.funnel.impactSub, ratio: (0.5 + 0.5 * (r.SYS ?? 0) / 100) * (0.4 + 0.6 * (r.SKILL ?? 0) / 100) * (0.3 + 0.7 * (r.ROI ?? 0) / 100) * (0.4 + 0.6 * (r.STRAT ?? 0) / 100), cls: "fade-4" },
    ];
    return stages.map((st, i) => ({
      ...st,
      amount: Math.round(budget * st.ratio),
      widthPercent: Math.max(8, st.ratio * 100),
      lossFromPrevious: i === 0 ? 0 : Math.round((stages[i - 1].ratio - st.ratio) * 100),
    }));
  }, [scores, qualification.budget, s.funnel]);

  const funnelLoss = useMemo(() => {
    if (!funnelStages.length) return 0;
    return qualification.budget - funnelStages[funnelStages.length - 1].amount;
  }, [funnelStages, qualification.budget]);

  const recommendedTier = useMemo(() => {
    if (!scores) return 2;
    if (scores.globalReality < 50 || scores.reality.COMP < 50 || scores.reality.FUND < 40) return 1;
    if (scores.globalReality < 75) return 2;
    return 3;
  }, [scores]);

  /* PDF report builder */
  const pdfHTML = useMemo(() => {
    if (!scores) return null;
    const q = qualification;
    const lvl = getMaturityLevel(scores.globalReality);
    const today = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" });
    let gapInterp: string;
    if (scores.globalGap < 10) gapInterp = s.pdf.summaryGapLow;
    else if (scores.globalGap < 20) gapInterp = s.pdf.summaryGapMid;
    else gapInterp = s.pdf.summaryGapHigh;

    const diag = narrativeRules.diagnostic.filter(r => r.condition(scores, q)).map(r => (lang === "fr" ? r.fr : r.en)).slice(0, 4);
    const risks = narrativeRules.risks.filter(r => r.condition(scores, q)).map(r => (lang === "fr" ? r.fr : r.en)).slice(0, 5);
    const opps = narrativeRules.opportunities.filter(r => r.condition(scores, q)).map(r => (lang === "fr" ? r.fr : r.en)).slice(0, 5);

    const budget = q.budget;
    const r = scores.reality;
    const ratios = [
      1.0,
      1.0 * (0.5 + 0.5 * (r.SYS ?? 0) / 100),
      (0.5 + 0.5 * (r.SYS ?? 0) / 100) * (0.4 + 0.6 * (r.SKILL ?? 0) / 100),
      (0.5 + 0.5 * (r.SYS ?? 0) / 100) * (0.4 + 0.6 * (r.SKILL ?? 0) / 100) * (0.3 + 0.7 * (r.ROI ?? 0) / 100),
      (0.5 + 0.5 * (r.SYS ?? 0) / 100) * (0.4 + 0.6 * (r.SKILL ?? 0) / 100) * (0.3 + 0.7 * (r.ROI ?? 0) / 100) * (0.4 + 0.6 * (r.STRAT ?? 0) / 100)
    ];
    const funnelLabels = [s.funnel.budget, s.funnel.attended, s.funnel.acquired, s.funnel.used, s.funnel.impact];
    const finalImpact = Math.round(budget * ratios[4]);
    const lossAmount = budget - finalImpact;
    const recTier = recommendedTier;

    const sectorLabel = s.qual["s" + q.sector.charAt(0).toUpperCase() + q.sector.slice(1) as keyof typeof s.qual] || q.sector;
    const sizeLabelRaw = s.qual["sz" + q.size.charAt(0).toUpperCase() + q.size.slice(1) as keyof typeof s.qual] || q.size;
    const sizeLabel = String(sizeLabelRaw).split("(")[0].trim();
    const roleLabel = s.qual["r" + q.role.charAt(0).toUpperCase() + q.role.slice(1) as keyof typeof s.qual] || q.role;

    // PDF Radar SVG
    const pcx = 180, pcy = 180, pradius = 120;
    const pdims = dimensions.map(d => d.code);
    const pn = pdims.length;
    let pdfRadar = `<svg width="360" height="360" viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">`;
    for (let level = 1; level <= 5; level++) {
      const rad = pradius * (level / 5);
      let pts = "";
      for (let i = 0; i < pn; i++) {
        const angle = (Math.PI * 2 * i / pn) - Math.PI / 2;
        pts += `${pcx + Math.cos(angle) * rad},${pcy + Math.sin(angle) * rad} `;
      }
      pdfRadar += `<polygon points="${pts.trim()}" fill="none" stroke="#dedee5" stroke-width="1" stroke-dasharray="2 4" opacity="0.6"/>`;
    }
    for (let i = 0; i < pn; i++) {
      const angle = (Math.PI * 2 * i / pn) - Math.PI / 2;
      pdfRadar += `<line x1="${pcx}" y1="${pcy}" x2="${pcx + Math.cos(angle) * pradius}" y2="${pcy + Math.sin(angle) * pradius}" stroke="#dedee5" stroke-width="1"/>`;
    }
    let pperc = "", preal = "";
    for (let i = 0; i < pn; i++) {
      const angle = (Math.PI * 2 * i / pn) - Math.PI / 2;
      const vp = (scores.perception[pdims[i]] ?? 0) / 100;
      const vr = (scores.reality[pdims[i]] ?? 0) / 100;
      pperc += `${pcx + Math.cos(angle) * pradius * vp},${pcy + Math.sin(angle) * pradius * vp} `;
      preal += `${pcx + Math.cos(angle) * pradius * vr},${pcy + Math.sin(angle) * pradius * vr} `;
    }
    pdfRadar += `<polygon points="${pperc.trim()}" fill="rgba(0,7,118,0.10)" stroke="rgba(0,7,118,0.4)" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    pdfRadar += `<polygon points="${preal.trim()}" fill="rgba(0,7,118,0.22)" stroke="#000776" stroke-width="2.5"/>`;
    for (let i = 0; i < pn; i++) {
      const angle = (Math.PI * 2 * i / pn) - Math.PI / 2;
      const lr = pradius + 24;
      const lx = pcx + Math.cos(angle) * lr;
      const ly = pcy + Math.sin(angle) * lr;
      pdfRadar += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="10" font-weight="700" fill="#101114">${pdims[i]}</text>`;
      pdfRadar += `<text x="${lx}" y="${ly + 12}" text-anchor="middle" font-size="9" font-weight="500" fill="#9497a9">${scores.reality[pdims[i]]}</text>`;
    }
    pdfRadar += `</svg>`;

    const pdfPages = [];

    // Cover
    pdfPages.push(`
      <div class="sc-pdf-page">
        <div class="sc-pdf-cover">
          <div class="sc-pdf-cover-eyebrow">${s.pdf.coverEyebrow}</div>
          <div class="sc-pdf-cover-title">${s.pdf.coverTitle}</div>
          <div class="sc-pdf-cover-company">${q.company}</div>
          <div class="sc-pdf-cover-score-block">
            <div class="sc-pdf-cover-score-label">${s.pdf.coverScoreLabel}</div>
            <div class="sc-pdf-cover-score">${scores.globalReality}<sup> / 100</sup></div>
            <div class="sc-pdf-cover-level">${s.maturity[lvl.key]}</div>
          </div>
          <div class="sc-pdf-cover-meta">
            <div><strong>${s.pdf.coverGap}:</strong> ${scores.globalGap} pts</div>
            <div><strong>${s.pdf.coverRespondent}:</strong> ${roleLabel}</div>
            <div><strong>${s.pdf.coverBudget}:</strong> ${formatEuro(q.budget, lang)}</div>
            <div><strong>${s.pdf.coverDate}:</strong> ${today}</div>
          </div>
          <div class="sc-pdf-cover-footer">
            <span>${s.pdf.coverFooter}</span>
            <span>${sectorLabel} . ${sizeLabel}</span>
          </div>
        </div>
      </div>
    `);

    // Summary
    pdfPages.push(`
      <div class="sc-pdf-page">
        <div class="sc-pdf-header">
          <div class="sc-pdf-brand"><span class="sc-pdf-brand-purple">M</span>entivis Diagnostic</div>
          <div class="sc-pdf-page-num">${s.pdf.summaryEyebrow}</div>
        </div>
        <div class="sc-pdf-h1-eyebrow">${s.pdf.summaryEyebrow}</div>
        <h1 class="sc-pdf-h1">${s.pdf.summaryTitle}</h1>
        <p class="sc-pdf-text" style="margin-top:24px">${s.pdf.summaryIntro.replace("{company}", q.company)}</p>
        <div class="sc-pdf-summary-block">
          <p class="sc-pdf-text" style="margin-bottom:8px">${s.pdf.summaryScore.replace("{score}", String(scores.globalReality)).replace("{level}", s.maturity[lvl.key])}</p>
          <p class="sc-pdf-text" style="margin-bottom:8px">${s.pdf.summaryGap.replace("{gap}", String(scores.globalGap)).replace("{gapInterpretation}", gapInterp)}</p>
          <p class="sc-pdf-text" style="margin-bottom:8px">${s.pdf.summaryWeakest.replace("{weakest}", s.dimNames[scores.weakest as keyof typeof s.dimNames]).replace("{weakestScore}", String(scores.weakestScore))}</p>
          <p class="sc-pdf-text" style="margin-bottom:0">${s.pdf.summaryStrongest.replace("{strongest}", s.dimNames[scores.strongest as keyof typeof s.dimNames]).replace("{strongestScore}", String(scores.strongestScore))}</p>
        </div>
        <div class="sc-pdf-callout">
          <div class="sc-pdf-callout-label">${s.dash.lossLabel}</div>
          <div class="sc-pdf-callout-value">${formatEuro(lossAmount, lang)}</div>
          <div class="sc-pdf-callout-sub">${s.pdf.valueLossSub}</div>
        </div>
        <div class="sc-pdf-footer">
          <span>${s.pdf.footerLeft}</span>
          <span>${s.pdf.footerRight.replace("{page}", "1")}</span>
        </div>
      </div>
    `);

    // Scoring
    let scoringRows = "";
    dimensions.forEach(d => {
      scoringRows += `
        <tr>
          <td class="sc-pdf-dim-name">${d.code} . ${s.dimNames[d.code as keyof typeof s.dimNames]}</td>
          <td class="right">${Math.round(d.weight * 100)}%</td>
          <td class="right">${scores.perception[d.code]}</td>
          <td class="right"><span class="sc-pdf-bar-bg"><span class="sc-pdf-bar" style="width:${scores.reality[d.code]}%"></span></span><strong>${scores.reality[d.code]}</strong></td>
          <td class="right">${scores.gap[d.code]} pts</td>
        </tr>
      `;
    });
    pdfPages.push(`
      <div class="sc-pdf-page">
        <div class="sc-pdf-header">
          <div class="sc-pdf-brand"><span class="sc-pdf-brand-purple">M</span>entivis Diagnostic</div>
          <div class="sc-pdf-page-num">${s.pdf.scoringEyebrow}</div>
        </div>
        <div class="sc-pdf-h1-eyebrow">${s.pdf.scoringEyebrow}</div>
        <h1 class="sc-pdf-h1">${s.pdf.scoringTitle}</h1>
        <p class="sc-pdf-text" style="margin-top:16px">${s.pdf.scoringSubtitle}</p>
        <div class="sc-pdf-radar-wrap">${pdfRadar}</div>
        <h2 class="sc-pdf-h2">${s.pdf.scoringTableTitle}</h2>
        <table class="sc-pdf-table"><thead><tr><th>${s.dim.dimension}</th><th class="right">${s.dim.weight}</th><th class="right">${s.dim.perception}</th><th class="right">${s.dim.reality}</th><th class="right">${s.dim.gap}</th></tr></thead><tbody>${scoringRows}</tbody></table>
        <div class="sc-pdf-footer"><span>${s.pdf.footerLeft}</span><span>${s.pdf.footerRight.replace("{page}", "2")}</span></div>
      </div>
    `);

    // Diagnostic
    pdfPages.push(`
      <div class="sc-pdf-page">
        <div class="sc-pdf-header">
          <div class="sc-pdf-brand"><span class="sc-pdf-brand-purple">M</span>entivis Diagnostic</div>
          <div class="sc-pdf-page-num">${s.pdf.diagEyebrow}</div>
        </div>
        <div class="sc-pdf-h1-eyebrow">${s.pdf.diagEyebrow}</div>
        <h1 class="sc-pdf-h1">${s.pdf.diagTitle}</h1>
        <p class="sc-pdf-text" style="margin-top:16px">${s.pdf.diagIntro}</p>
        <h2 class="sc-pdf-h2">${s.pdf.diagDiag}</h2>
        <ul class="sc-pdf-list">${diag.length ? diag.map(it => `<li>${it}</li>`).join("") : `<li>${lang === "fr" ? "Diagnostic global équilibré sur l'ensemble des dimensions." : "Globally balanced diagnostic across all dimensions."}</li>`}</ul>
        <h2 class="sc-pdf-h2">${s.pdf.diagRisks}</h2>
        <ul class="sc-pdf-list risks">${risks.length ? risks.map(it => `<li>${it}</li>`).join("") : `<li>${lang === "fr" ? "Aucun risque majeur identifié." : "No major risk identified."}</li>`}</ul>
        <h2 class="sc-pdf-h2">${s.pdf.diagOpp}</h2>
        <ul class="sc-pdf-list opportunities">${opps.length ? opps.map(it => `<li>${it}</li>`).join("") : `<li>${lang === "fr" ? "Optimisations marginales possibles." : "Marginal optimizations possible."}</li>`}</ul>
        <div class="sc-pdf-footer"><span>${s.pdf.footerLeft}</span><span>${s.pdf.footerRight.replace("{page}", "3")}</span></div>
      </div>
    `);

    // Value
    let valueRows = "";
    ratios.forEach((ratio, i) => {
      const amount = Math.round(budget * ratio);
      valueRows += `
        <tr>
          <td class="sc-pdf-dim-name">${funnelLabels[i]}</td>
          <td class="right">${formatEuro(amount, lang)}</td>
          <td class="right"><span class="sc-pdf-bar-bg"><span class="sc-pdf-bar" style="width:${ratio * 100}%"></span></span><strong>${Math.round(ratio * 100)}%</strong></td>
        </tr>
      `;
    });
    pdfPages.push(`
      <div class="sc-pdf-page">
        <div class="sc-pdf-header">
          <div class="sc-pdf-brand"><span class="sc-pdf-brand-purple">M</span>entivis Diagnostic</div>
          <div class="sc-pdf-page-num">${s.pdf.valueEyebrow}</div>
        </div>
        <div class="sc-pdf-h1-eyebrow">${s.pdf.valueEyebrow}</div>
        <h1 class="sc-pdf-h1">${s.pdf.valueTitle}</h1>
        <p class="sc-pdf-text" style="margin-top:16px">${s.pdf.valueIntro}</p>
        <table class="sc-pdf-table" style="margin-top:24px"><thead><tr><th>${s.pdf.valueTableHeader1}</th><th class="right">${s.pdf.valueTableHeader2}</th><th class="right">${s.pdf.valueTableHeader3}</th></tr></thead><tbody>${valueRows}</tbody></table>
        <div class="sc-pdf-callout">
          <div class="sc-pdf-callout-label">${s.pdf.valueLossLabel}</div>
          <div class="sc-pdf-callout-value">${formatEuro(lossAmount, lang)}</div>
          <div class="sc-pdf-callout-sub">${s.pdf.valueLossSub}</div>
        </div>
        <div class="sc-pdf-footer"><span>${s.pdf.footerLeft}</span><span>${s.pdf.footerRight.replace("{page}", "4")}</span></div>
      </div>
    `);

    // Plan
    let planTiers = "";
    [1, 2, 3].forEach(num => {
      const isRec = num === recTier;
      planTiers += `
        <div class="sc-pdf-tier ${isRec ? "recommended" : ""}">
          <div class="sc-pdf-tier-num">${isRec ? s.scenarios.recommended : s.scenarios["tier" + num + "Tag" as keyof typeof s.scenarios]}</div>
          <div class="sc-pdf-tier-title">${s.scenarios["tier" + num + "Title" as keyof typeof s.scenarios]}</div>
          <ul class="sc-pdf-tier-list">
            <li>${s.scenarios["tier" + num + "It1" as keyof typeof s.scenarios]}</li>
            <li>${s.scenarios["tier" + num + "It2" as keyof typeof s.scenarios]}</li>
            <li>${s.scenarios["tier" + num + "It3" as keyof typeof s.scenarios]}</li>
          </ul>
        </div>
      `;
    });
    pdfPages.push(`
      <div class="sc-pdf-page">
        <div class="sc-pdf-header">
          <div class="sc-pdf-brand"><span class="sc-pdf-brand-purple">M</span>entivis Diagnostic</div>
          <div class="sc-pdf-page-num">${s.pdf.planEyebrow}</div>
        </div>
        <div class="sc-pdf-h1-eyebrow">${s.pdf.planEyebrow}</div>
        <h1 class="sc-pdf-h1">${s.pdf.planTitle}</h1>
        <p class="sc-pdf-text" style="margin-top:16px">${s.pdf.planIntro}</p>
        <div class="sc-pdf-tier-grid">${planTiers}</div>
        <div class="sc-pdf-summary-block" style="margin-top:32px">
          <p class="sc-pdf-text" style="margin:0">${s.pdf.planContact}</p>
        </div>
        <div class="sc-pdf-footer"><span>${s.pdf.footerLeft}</span><span>${s.pdf.footerRight.replace("{page}", "5")}</span></div>
      </div>
    `);

    return pdfPages.join("");
  }, [scores, qualification, lang, s, recommendedTier]);

  const qPercent = Math.round((currentBlock / 6) * 100);

  return (
    <div className="sc-app">
      {/* ==================== SCREEN 1: LANDING ==================== */}
      <section className={`sc-screen ${screen === "landing" ? "active" : ""}`}>
        <div className="sc-container sc-landing">
          <div className="sc-eyebrow">{s.landing.eyebrow}</div>
          <h1 className="sc-hero-title">
            {s.landing.title1}{" "}
            <span className="sc-accent">{s.landing.title2}</span>{" "}
            {s.landing.title3}
          </h1>
          <p className="sc-hero-sub">{s.landing.sub}</p>
          <button className="sc-btn-primary" onClick={() => goToScreen("qualification")}>
            {s.landing.cta}
            <span className="material-symbols-outlined sc-btn-chevron">chevron_right</span>
          </button>

          <div className="sc-landing-feats">
            <div className="sc-feat">
              <div className="sc-feat-num">6</div>
              <div className="sc-feat-title">{s.landing.feat1Title}</div>
              <div className="sc-feat-desc">{s.landing.feat1Desc}</div>
            </div>
            <div className="sc-feat">
              <div className="sc-feat-num">32</div>
              <div className="sc-feat-title">{s.landing.feat2Title}</div>
              <div className="sc-feat-desc">{s.landing.feat2Desc}</div>
            </div>
            <div className="sc-feat">
              <div className="sc-feat-num">∅</div>
              <div className="sc-feat-title">{s.landing.feat3Title}</div>
              <div className="sc-feat-desc">{s.landing.feat3Desc}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCREEN 2: QUALIFICATION ==================== */}
      <section className={`sc-screen ${screen === "qualification" ? "active" : ""}`}>
        <div className="sc-container">
          <div className="sc-section-head">
            <h2 className="sc-section-title">{s.qual.title}</h2>
            <p className="sc-section-sub">{s.qual.sub}</p>
          </div>
          <div className="sc-form-card">
            <div className="sc-form-row">
              <label className="sc-form-label">{s.qual.company}</label>
              <input type="text" className="sc-form-input" placeholder={s.qual.companyPh} value={qualification.company} onChange={e => setQualification(prev => ({ ...prev, company: e.target.value }))} />
            </div>
            <div className="sc-form-row">
              <label className="sc-form-label">{s.qual.sector}</label>
              <select className="sc-form-select" value={qualification.sector} onChange={e => setQualification(prev => ({ ...prev, sector: e.target.value }))}>
                <option value="">{s.qual.choose}</option>
                <option value="industry">{s.qual.sIndustry}</option>
                <option value="services">{s.qual.sServices}</option>
                <option value="retail">{s.qual.sRetail}</option>
                <option value="health">{s.qual.sHealth}</option>
                <option value="construction">{s.qual.sConstruction}</option>
                <option value="tech">{s.qual.sTech}</option>
                <option value="finance">{s.qual.sFinance}</option>
                <option value="other">{s.qual.sOther}</option>
              </select>
            </div>
            <div className="sc-form-row">
              <label className="sc-form-label">{s.qual.size}</label>
              <select className="sc-form-select" value={qualification.size} onChange={e => setQualification(prev => ({ ...prev, size: e.target.value }))}>
                <option value="">{s.qual.choose}</option>
                <option value="tpe">{s.qual.szTpe}</option>
                <option value="pme">{s.qual.szPme}</option>
                <option value="eti">{s.qual.szEti}</option>
                <option value="large">{s.qual.szLarge}</option>
              </select>
            </div>
            <div className="sc-form-row">
              <label className="sc-form-label">{s.qual.role}</label>
              <select className="sc-form-select" value={qualification.role} onChange={e => setQualification(prev => ({ ...prev, role: e.target.value }))}>
                <option value="">{s.qual.choose}</option>
                <option value="ceo">{s.qual.rCeo}</option>
                <option value="hr">{s.qual.rHr}</option>
                <option value="training">{s.qual.rTraining}</option>
                <option value="manager">{s.qual.rManager}</option>
                <option value="other">{s.qual.rOther}</option>
              </select>
            </div>
            <div className="sc-form-row">
              <label className="sc-form-label">{s.qual.budget}</label>
              <input type="number" className="sc-form-input" placeholder={s.qual.budgetPh} min={0} step={1000} value={qualification.budget || ""} onChange={e => setQualification(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div className="sc-form-actions">
              <button className="sc-btn-secondary" onClick={() => goToScreen("landing")}>{s.common.back}</button>
                <button className="sc-btn-primary" onClick={handleQualSubmit}>
                  {s.common.start}
                  <span className="material-symbols-outlined sc-btn-chevron">chevron_right</span>
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCREEN 3: QUESTIONNAIRE ==================== */}
      <section className={`sc-screen ${screen === "questionnaire" ? "active" : ""}`}>
        <div className="sc-container">
          <div className="sc-q-progress-wrap">
            <div className="sc-q-progress-track">
              <div className="sc-q-progress-fill" style={{ width: qPercent + "%" }} />
            </div>
            <div className="sc-q-progress-meta">
              <span className="sc-q-progress-step">{s.q.block.replace("{0}", String(currentBlock + 1))}</span>
              <span className="sc-q-progress-total">{qPercent}%</span>
            </div>
          </div>

          <div className="sc-q-block">
            <div className="sc-q-block-eyebrow">{currentDim} . {currentBlock + 1} / 6</div>
            <h2 className="sc-q-block-title">{s.dimNames[currentDim as keyof typeof s.dimNames]}</h2>
            <p className="sc-q-block-desc">{s.blockDesc[currentDim as keyof typeof s.blockDesc]}</p>

            {currentBlockData.sliders.map(q => {
              const val = answers[q.id] ?? 3;
              return (
                <div className="sc-q-item" key={q.id}>
                  <div className="sc-q-text">{lang === "fr" ? q.fr : q.en}</div>
                  <div className="sc-q-slider-wrap">
                    <input
                      type="range"
                      className="sc-q-slider"
                      min={1}
                      max={5}
                      step={1}
                      value={val}
                      onChange={e => handleSliderChange(q.id, e.target.value)}
                    />
                    <div className="sc-q-ticks">
                      <span className="sc-q-tick" /><span className="sc-q-tick" /><span className="sc-q-tick" /><span className="sc-q-tick" /><span className="sc-q-tick" />
                    </div>
                    <div className="sc-q-scale">
                      <span>{s.q.scaleLow}</span>
                      <span>{s.q.scaleHigh}</span>
                    </div>
                    <div className="sc-q-value-display">{val}</div>
                  </div>
                </div>
              );
            })}

            {currentBlockData.proofs.map(q => {
              const selected = proofs[q.id];
              return (
                <div className="sc-q-item" key={q.id}>
                  <div className="sc-q-proof-tag">{s.q.proofTag}</div>
                  <div className="sc-q-text">{lang === "fr" ? q.fr : q.en}</div>
                  <div className="sc-q-proof">
                    <button className={`sc-q-proof-btn ${selected === true ? "selected" : ""}`} onClick={() => handleProof(q.id, true)}>
                      <span className="sc-q-proof-radio" />
                      <span>{s.common.yes}</span>
                    </button>
                    <button className={`sc-q-proof-btn ${selected === false ? "selected" : ""}`} onClick={() => handleProof(q.id, false)}>
                      <span className="sc-q-proof-radio" />
                      <span>{s.common.no}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sc-q-nav">
            <button className="sc-btn-secondary" style={{ visibility: currentBlock === 0 ? "hidden" : "visible" }} onClick={prevBlock}>{s.common.prev}</button>
              <button className="sc-btn-primary" onClick={nextBlock}>
                {currentBlock === 5 ? s.common.finish : s.common.next}
                <span className="material-symbols-outlined sc-btn-chevron">chevron_right</span>
              </button>
          </div>
        </div>
      </section>

      {/* ==================== SCREEN 4: TRANSITION ==================== */}
      <section className={`sc-screen ${screen === "transition" ? "active" : ""}`}>
        <div className="sc-transition-screen">
          <div className="sc-transition-orb" />
          <div className="sc-transition-text">{s.trans.text}</div>
          <div className="sc-transition-sub">{s.trans.sub}</div>
        </div>
      </section>

      {/* ==================== SCREEN 5: DASHBOARD ==================== */}
      <section className={`sc-screen ${screen === "dashboard" ? "active" : ""}`}>
        <div className="sc-container-wide">
          <div className="sc-dash-head">
            <div className="sc-dash-title-block">
              <div className="sc-dash-eyebrow">{s.dash.eyebrow}</div>
              <h1 className="sc-dash-title">{qualification.company}</h1>
              <div className="sc-dash-meta">
                {String(s.qual["sz" + qualification.size.charAt(0).toUpperCase() + qualification.size.slice(1) as keyof typeof s.qual] || qualification.size).split("(")[0].trim()}
                {" . "}
                {s.qual["s" + qualification.sector.charAt(0).toUpperCase() + qualification.sector.slice(1) as keyof typeof s.qual] || qualification.sector}
                {" . "}
                {s.qual["r" + qualification.role.charAt(0).toUpperCase() + qualification.role.slice(1) as keyof typeof s.qual] || qualification.role}
              </div>
            </div>
            <div className="sc-dash-actions">
              <button className="sc-btn-outline" onClick={restart}>{s.dash.restart}</button>
              <button className="sc-btn-primary" onClick={exportPDF}>
                {s.dash.download}
                <span className="material-symbols-outlined sc-btn-chevron">chevron_right</span>
              </button>
            </div>
          </div>

          {scores && maturityLevel && (
            <>
              {/* Hero score card */}
              <div className="sc-hero-card">
                <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                  <div className="sc-score-label">{s.dash.globalScore}</div>
                  <div style={{ marginTop: 12 }}>
                    <span className="sc-score-number">{scores.globalReality}</span>
                    <span className="sc-score-denom"> / 100</span>
                  </div>
                  <div className={`sc-maturity-badge lvl-${maturityLevel.num}`}>{s.maturity[maturityLevel.key]}</div>
                </div>
                <div className="sc-hero-stats">
                  <div className="sc-stat-row">
                    <span className="sc-stat-label">{s.dash.perception}</span>
                    <span className="sc-stat-value">{scores.globalPerception} / 100</span>
                  </div>
                  <div className="sc-stat-row">
                    <span className="sc-stat-label">{s.dash.gap}</span>
                    <span className={`sc-stat-value ${scores.globalGap >= 20 ? "danger" : scores.globalGap >= 10 ? "warn" : "good"}`}>{scores.globalGap} pts</span>
                  </div>
                  <div className="sc-stat-row">
                    <span className="sc-stat-label">{s.dash.weakest}</span>
                    <span className="sc-stat-value danger">{s.dimNames[scores.weakest as keyof typeof s.dimNames]} ({scores.weakestScore})</span>
                  </div>
                  <div className="sc-stat-row">
                    <span className="sc-stat-label">{s.dash.strongest}</span>
                    <span className="sc-stat-value good">{s.dimNames[scores.strongest as keyof typeof s.dimNames]} ({scores.strongestScore})</span>
                  </div>
                </div>
              </div>

              {/* Visualizations */}
              <div className="sc-viz-grid">
                <div className="sc-card">
                  <div className="sc-card-eyebrow">{s.dash.radarEyebrow}</div>
                  <div className="sc-card-title">{s.dash.radarTitle}</div>
                  <div className="sc-card-desc">{s.dash.radarDesc}</div>
                  <div className="sc-radar-wrap">
                    <RadarSVG scores={scores} />
                  </div>
                  <div className="sc-radar-legend">
                    <div className="sc-legend-item"><span className="sc-legend-dot sc-legend-perception" /> <span>{s.dash.legendPerception}</span></div>
                    <div className="sc-legend-item"><span className="sc-legend-dot sc-legend-reality" /> <span>{s.dash.legendReality}</span></div>
                  </div>
                </div>

                <div className="sc-card">
                  <div className="sc-card-eyebrow">{s.dash.quadEyebrow}</div>
                  <div className="sc-card-title">{s.dash.quadTitle}</div>
                  <div className="sc-card-desc">{s.dash.quadDesc}</div>
                  <div className="sc-quadrant-wrap">
                    <QuadrantSVG scores={scores} />
                  </div>
                </div>

                <div className="sc-card sc-viz-grid-full">
                  <div className="sc-card-eyebrow">{s.dash.funnelEyebrow}</div>
                  <div className="sc-card-title">{s.dash.funnelTitle}</div>
                  <div className="sc-card-desc">{s.dash.funnelDesc}</div>
                  <div className="sc-funnel-wrap">
                    {funnelStages.map((st, i) => (
                      <div className="sc-funnel-step" key={i}>
                        <div>
                          <div className="sc-funnel-stage-label">{st.label}</div>
                          <div className="sc-funnel-stage-sub">{st.sub}</div>
                        </div>
                        <div className="sc-funnel-bar-wrap">
                          <div className={`sc-funnel-bar ${st.cls}`} style={{ width: st.widthPercent + "%" }}>{Math.round(st.ratio * 100)}%</div>
                        </div>
                        <div>
                          <div className="sc-funnel-amount">{formatEuro(st.amount, lang)}</div>
                          {i > 0 && st.lossFromPrevious > 0 && <div className="sc-funnel-loss">{st.lossFromPrevious}% {lang === "fr" ? "perte étape" : "step loss"}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="sc-funnel-summary">
                    <div className="sc-funnel-summary-label">{s.dash.lossLabel}</div>
                    <div className="sc-funnel-summary-value">{formatEuro(funnelLoss, lang)}</div>
                  </div>
                </div>

                <div className="sc-card sc-viz-grid-full">
                  <div className="sc-card-eyebrow">{s.dash.dimEyebrow}</div>
                  <div className="sc-card-title">{s.dash.dimTitle}</div>
                  <table className="sc-dim-table" style={{ marginTop: 24 }}>
                    <thead>
                      <tr>
                        <th>{s.dim.dimension}</th>
                        <th>{s.dim.weight}</th>
                        <th>{s.dim.perception}</th>
                        <th>{s.dim.reality}</th>
                        <th className="right">{s.dim.gap}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dimensions.map(d => {
                        const perc = scores.perception[d.code];
                        const real = scores.reality[d.code];
                        const gap = scores.gap[d.code];
                        return (
                          <tr key={d.code}>
                            <td>
                              <span className="sc-dim-code">{d.code}</span>
                              <span className="sc-dim-name">{s.dimNames[d.code as keyof typeof s.dimNames]}</span>
                            </td>
                            <td>{Math.round(d.weight * 100)}%</td>
                            <td>
                              <span className="sc-dim-bar-wrap"><span className="sc-dim-bar" style={{ width: perc + "%", background: "rgba(0,7,118,0.4)" }} /></span>
                              <span className="sc-dim-score" style={{ color: "var(--sc-silver-blue)" }}>{perc}</span>
                            </td>
                            <td>
                              <span className="sc-dim-bar-wrap"><span className="sc-dim-bar" style={{ width: real + "%" }} /></span>
                              <span className="sc-dim-score">{real}</span>
                            </td>
                            <td className={`sc-dim-gap ${gap < 8 ? "muted" : ""}`}>{gap > 0 ? gap + " pts" : "0 pts"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="sc-card sc-viz-grid-full">
                  <div className="sc-card-eyebrow">{s.dash.narrEyebrow}</div>
                  <div className="sc-card-title">{s.dash.narrTitle}</div>
                  <div style={{ marginTop: 24 }}>
                    <div className="sc-narrative-section">
                      <div className="sc-narrative-label diagnostic"><span className="sc-dot" /> <span>{s.narr.diag}</span></div>
                      <ul className="sc-narrative-list">
                        {narrative.diag.length ? narrative.diag.map((it, i) => <li className="sc-narrative-item" key={i}>{it}</li>) : <li className="sc-narrative-item">{lang === "fr" ? "Diagnostic global équilibré sur l'ensemble des dimensions." : "Globally balanced diagnostic across all dimensions."}</li>}
                      </ul>
                    </div>
                    <div className="sc-narrative-section">
                      <div className="sc-narrative-label risks"><span className="sc-dot" /> <span>{s.narr.risks}</span></div>
                      <ul className="sc-narrative-list">
                        {narrative.risks.length ? narrative.risks.map((it, i) => <li className="sc-narrative-item" key={i}>{it}</li>) : <li className="sc-narrative-item">{lang === "fr" ? "Aucun risque majeur identifié au niveau de maturité actuel." : "No major risk identified at the current maturity level."}</li>}
                      </ul>
                    </div>
                    <div className="sc-narrative-section">
                      <div className="sc-narrative-label opportunities"><span className="sc-dot" /> <span>{s.narr.opp}</span></div>
                      <ul className="sc-narrative-list">
                        {narrative.opps.length ? narrative.opps.map((it, i) => <li className="sc-narrative-item" key={i}>{it}</li>) : <li className="sc-narrative-item">{lang === "fr" ? "Optimisations marginales possibles. Concentrez vos efforts sur le maintien du niveau atteint." : "Marginal optimizations possible. Focus efforts on maintaining the achieved level."}</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA card */}
              <div className="sc-cta-card">
                <div className="sc-cta-eyebrow">{s.cta.eyebrow}</div>
                <h2 className="sc-cta-title">{s.cta.title}</h2>
                <p className="sc-cta-sub">{s.cta.sub}</p>
                {!contactSent ? (
                  <form className="sc-cta-form" onSubmit={handleContact}>
                    <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                    <input type="text" required placeholder={s.cta.name} value={contactName} onChange={e => setContactName(e.target.value)} />
                    <input type="email" required placeholder={s.cta.email} value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, color: "var(--m-ink-3)", lineHeight: 1.5 }}>
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        style={{ marginTop: 2, flexShrink: 0 }}
                      />
                      <span>
                        {s.cta.consent}{" "}
                        <Link href={`/${lang}/privacy`} style={{ color: "var(--m-purple)", textDecoration: "underline" }}>{s.cta.consentLink}</Link>.
                      </span>
                    </label>
                    {hsError && (
                      <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>
                        {lang === "fr" ? "Une erreur est survenue. Veuillez réessayer." : "An error occurred. Please try again."}
                      </p>
                    )}
                    <button type="submit" className="sc-btn-primary" disabled={hsLoading}>
                      {hsLoading ? (lang === "fr" ? "Envoi en cours..." : "Sending...") : s.cta.submit}
                      <span className="material-symbols-outlined sc-btn-chevron">chevron_right</span>
                    </button>
                  </form>
                ) : (
                  <div className="sc-cta-success visible">{s.cta.success}</div>
                )}
                <div style={{ marginTop: 32, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.1)", position: "relative", zIndex: 1 }}>
                  <div className="sc-cta-eyebrow">{s.cta.scenariosLabel}</div>
                  <h3 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.4px", marginTop: 8, marginBottom: 8 }}>{s.cta.scenariosTitle}</h3>
                </div>
                <div className="sc-scenarios">
                  {[1, 2, 3].map(num => {
                    const isRec = num === recommendedTier;
                    return (
                      <div className={`sc-scenario ${isRec ? "recommended" : ""}`} key={num}>
                        <div className="sc-scenario-tag">{isRec ? s.scenarios.recommended : s.scenarios["tier" + num + "Tag" as keyof typeof s.scenarios]}</div>
                        <div className="sc-scenario-title">{s.scenarios["tier" + num + "Title" as keyof typeof s.scenarios]}</div>
                        <div className="sc-scenario-desc">{s.scenarios["tier" + num + "Desc" as keyof typeof s.scenarios]}</div>
                        <ul className="sc-scenario-list">
                          <li>{s.scenarios["tier" + num + "It1" as keyof typeof s.scenarios]}</li>
                          <li>{s.scenarios["tier" + num + "It2" as keyof typeof s.scenarios]}</li>
                          <li>{s.scenarios["tier" + num + "It3" as keyof typeof s.scenarios]}</li>
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Hidden PDF report */}
      <div className="sc-pdf-report" ref={pdfRef} dangerouslySetInnerHTML={{ __html: pdfHTML || "" }} />
    </div>
  );
}
