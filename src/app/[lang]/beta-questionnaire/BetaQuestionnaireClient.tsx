"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PageShell from "@/components/layout/PageShell";

const SC4_API = "https://sc4bovu7233.universe.wf/api/beta-questionnaire";

interface Section {
  id: string;
  labelFr: string;
  labelEn: string;
}

const sections: Section[] = [
  { id: "general", labelFr: "Informations générales", labelEn: "General Information" },
  { id: "contexte", labelFr: "Contexte actuel", labelEn: "Current Context" },
  { id: "fonctionnalites", labelFr: "Fonctionnalités", labelEn: "Features" },
  { id: "attentes", labelFr: "Attentes", labelEn: "Expectations" },
  { id: "complement", labelFr: "Complément", labelEn: "Additional" },
];

const featuresList = [
  { id: "generation", labelFr: "Génération de contenu pédagogique", labelEn: "Content generation" },
  { id: "adaptatif", labelFr: "Parcours adaptatifs", labelEn: "Adaptive learning paths" },
  { id: "analytique", labelFr: "Analytics et reporting", labelEn: "Analytics & reporting" },
  { id: "multilingue", labelFr: "Support multilingue", labelEn: "Multi-language support" },
  { id: "collaboration", labelFr: "Collaboration d'équipe", labelEn: "Team collaboration" },
  { id: "integration", labelFr: "Intégrations LMS/API", labelEn: "LMS/API integrations" },
];

const timelineOptions = [
  { value: "", labelFr: "Sélectionnez...", labelEn: "Select..." },
  { value: "1-3", labelFr: "1 à 3 mois", labelEn: "1-3 months" },
  { value: "3-6", labelFr: "3 à 6 mois", labelEn: "3-6 months" },
  { value: "6-12", labelFr: "6 à 12 mois", labelEn: "6-12 months" },
  { value: "12+", labelFr: "Plus d'un an", labelEn: "12+ months" },
];

export default function BetaQuestionnaireClient() {
  const params = useParams();
  const lang = params.lang as string;
  const isFr = lang === "fr";

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    role: "",
    currentTools: "",
    challenges: "",
    heardAbout: "",
    features: [] as string[],
    priority: "",
    expectedOutcomes: "",
    timeline: "",
    teamSize: "",
    additionalInfo: "",
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true,
    contexte: false,
    fonctionnalites: false,
    attentes: false,
    complement: false,
  });

  const update = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleFeature = (id: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(id)
        ? prev.features.filter((f) => f !== id)
        : [...prev.features, id],
    }));
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = isFr ? "Requis" : "Required";
    if (!form.email.trim()) errs.email = isFr ? "Requis" : "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = isFr ? "Email invalide" : "Invalid email";
    if (!form.consent) errs.consent = isFr ? "Consentement requis" : "Consent required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setError("");

    try {
      const res = await fetch(SC4_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          features: form.features.join(", "),
          honeypot: "",
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || (isFr ? "Erreur d'envoi" : "Submission error"));
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(isFr ? "Erreur réseau" : "Network error");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <PageShell hidePreFooterCTA>
        <section style={{ paddingTop: 140, paddingBottom: 120 }}>
          <div className="container" style={{ textAlign: "center", maxWidth: 560 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--m-purple)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24, marginBottom: 24 }}>✓</div>
            <h1 style={{ fontFamily: "var(--f-display)", fontSize: 32, fontWeight: 500, letterSpacing: "-1px", margin: "0 0 12px" }}>
              {isFr ? "Merci !" : "Thank you!"}
            </h1>
            <p style={{ color: "#999", fontSize: 16, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              {isFr
                ? "Votre questionnaire a bien été envoyé. Nous vous recontacterons rapidement pour la suite du processus de sélection des bêta-testeurs."
                : "Your questionnaire has been submitted. We will get back to you shortly regarding the next steps in the beta tester selection process."}
            </p>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell hidePreFooterCTA>
      <section style={{ paddingTop: 140, paddingBottom: 120 }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h1 style={{ fontFamily: "var(--f-display)", fontSize: 28, fontWeight: 500, letterSpacing: "-1px", margin: "0 0 6px" }}>
            {isFr ? "Questionnaire bêta-testeur" : "Beta Tester Questionnaire"}
          </h1>
          <p style={{ color: "var(--m-ink-3)", fontSize: 14, margin: "0 0 40px", lineHeight: 1.6 }}>
            {isFr
              ? "Devenir bêta-testeur MentivisOS — répondez à ce questionnaire pour nous aider à comprendre votre contexte et vos besoins."
              : "Become a MentivisOS beta tester — fill out this questionnaire to help us understand your context and needs."}
          </p>

          {error && (
            <div style={{ padding: "12px 16px", background: "#FEF2F0", borderRadius: 10, marginBottom: 24, color: "#c45c4a", fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {sections.map((section, idx) => (
              <div key={section.id} id={section.id} style={{ marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "16px 20px",
                    border: "1px solid var(--m-line)",
                    borderRadius: 12,
                    background: "var(--m-bg)",
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--m-ink-1)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  }}
                >
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--m-purple)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ flex: 1, textAlign: "left" }}>
                    {isFr ? section.labelFr : section.labelEn}
                  </span>
                  <span style={{ fontSize: 18, color: "var(--m-ink-4)", transition: "transform 0.2s", transform: openSections[section.id] ? "rotate(180deg)" : "rotate(0deg)" }}>
                    &#9660;
                  </span>
                </button>

                {openSections[section.id] && (
                  <div style={{
                    padding: "20px 24px",
                    background: "var(--m-bg)",
                    borderRadius: "0 0 12px 12px",
                    border: "1px solid var(--m-line)",
                    borderTop: "none",
                    marginTop: -12,
                  }}>
                    {section.id === "general" && (
                      <>
                        <Field label={isFr ? "Nom complet *" : "Full Name *"} error={errors.fullName}>
                          <input type="text" className="input" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
                        </Field>
                        <Field label={isFr ? "Email professionnel *" : "Professional Email *"} error={errors.email}>
                          <input type="email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" />
                        </Field>
                        <Field label={isFr ? "Entreprise / Organisation" : "Company / Organization"}>
                          <input type="text" className="input" value={form.company} onChange={(e) => update("company", e.target.value)} />
                        </Field>
                        <Field label={isFr ? "Poste / Rôle" : "Job Title / Role"}>
                          <input type="text" className="input" value={form.role} onChange={(e) => update("role", e.target.value)} />
                        </Field>
                      </>
                    )}

                    {section.id === "contexte" && (
                      <>
                        <Field label={isFr ? "Quels outils utilisez-vous actuellement pour la formation ?" : "What tools are you currently using for training?"}>
                          <textarea className="textarea" value={form.currentTools} onChange={(e) => update("currentTools", e.target.value)} rows={3} />
                        </Field>
                        <Field label={isFr ? "Quels sont vos principaux défis en matière de formation ?" : "What are your main training challenges?"}>
                          <textarea className="textarea" value={form.challenges} onChange={(e) => update("challenges", e.target.value)} rows={3} />
                        </Field>
                        <Field label={isFr ? "Comment avez-vous entendu parler de MentivisOS ?" : "How did you hear about MentivisOS?"}>
                          <input type="text" className="input" value={form.heardAbout} onChange={(e) => update("heardAbout", e.target.value)} />
                        </Field>
                      </>
                    )}

                    {section.id === "fonctionnalites" && (
                      <>
                        <Field label={isFr ? "Quelles fonctionnalités vous intéressent le plus ?" : "Which features interest you most?"}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {featuresList.map((f) => (
                              <label key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "var(--m-ink-3)" }}>
                                <input type="checkbox" checked={form.features.includes(f.id)} onChange={() => toggleFeature(f.id)} style={{ width: 18, height: 18, cursor: "pointer" }} />
                                {isFr ? f.labelFr : f.labelEn}
                              </label>
                            ))}
                          </div>
                        </Field>
                        <Field label={isFr ? "Quelle serait votre priorité absolue ?" : "What would be your top priority?"}>
                          <textarea className="textarea" value={form.priority} onChange={(e) => update("priority", e.target.value)} rows={3} />
                        </Field>
                      </>
                    )}

                    {section.id === "attentes" && (
                      <>
                        <Field label={isFr ? "Quels résultats attendez-vous de MentivisOS ?" : "What outcomes do you expect from MentivisOS?"}>
                          <textarea className="textarea" value={form.expectedOutcomes} onChange={(e) => update("expectedOutcomes", e.target.value)} rows={3} />
                        </Field>
                        <Field label={isFr ? "Horizon de déploiement envisagé" : "Expected deployment timeline"}>
                          <select className="input" value={form.timeline} onChange={(e) => update("timeline", e.target.value)}>
                            {timelineOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{isFr ? opt.labelFr : opt.labelEn}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label={isFr ? "Combien d'utilisateurs pour commencer ?" : "How many users to start with?"}>
                          <input type="text" className="input" value={form.teamSize} onChange={(e) => update("teamSize", e.target.value)} placeholder={isFr ? "Ex: 50" : "e.g. 50"} />
                        </Field>
                      </>
                    )}

                    {section.id === "complement" && (
                      <>
                        <Field label={isFr ? "Avez-vous d'autres informations à partager ?" : "Anything else you'd like to share?"}>
                          <textarea className="textarea" value={form.additionalInfo} onChange={(e) => update("additionalInfo", e.target.value)} rows={4} />
                        </Field>
                        <Field error={errors.consent}>
                          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 14, color: "var(--m-ink-3)", lineHeight: 1.5 }}>
                            <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} style={{ width: 18, height: 18, cursor: "pointer", marginTop: 2, flexShrink: 0 }} />
                            {isFr
                              ? "J'accepte d'être contacté par Mentivis dans le cadre du programme bêta et de la sélection des participants. *"
                              : "I consent to being contacted by Mentivis regarding the beta program and participant selection. *"}
                          </label>
                        </Field>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
              <button
                type="submit"
                disabled={sending}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 48px",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 12,
                  border: "none",
                  cursor: sending ? "not-allowed" : "pointer",
                  background: sending ? "var(--m-ink-4)" : "var(--m-purple)",
                  color: "#fff",
                  transition: "background 0.2s",
                }}
              >
                {sending
                  ? (isFr ? "Envoi..." : "Sending...")
                  : (isFr ? "Envoyer le questionnaire" : "Submit Questionnaire")}
              </button>
            </div>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, error, children }: { label?: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 500, color: error ? "#c45c4a" : "var(--m-ink-4)" }}>
          {label}
        </p>
      )}
      {children}
      {error && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#c45c4a" }}>{error}</p>}
    </div>
  );
}
