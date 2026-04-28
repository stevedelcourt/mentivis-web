"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useMessages } from "@/lib/messages";
import "./OpcoCalculator.css";

/* ============================================================
   TYPES
   ============================================================ */

interface FormData {
  sector: string;
  employees: number;
  payroll: number;
  objective: string;
  learners: number;
  duration: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
}

interface Results {
  contributionAnnual: number;
  fundingFormation: number;
  aidCampus: number;
  otherAids: number;
  total3Years: number;
  rate: number;
}

/* ============================================================
   HELPERS
   ============================================================ */

const BLOCKED_DOMAINS = [
  "gmail.com", "googlemail.com",
  "hotmail.com", "hotmail.fr", "outlook.com", "outlook.fr", "live.com", "live.fr",
  "yahoo.com", "yahoo.fr", "ymail.com",
  "orange.fr", "wanadoo.fr",
  "free.fr", "sfr.fr",
  "laposte.net",
  "aol.com", "icloud.com", "me.com",
];

function isValidProEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain && !BLOCKED_DOMAINS.includes(domain);
}

function formatEuro(amount: number, lang: string) {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US", {
    style: "currency", currency: "EUR", maximumFractionDigits: 0,
  }).format(amount);
}

function computeResults(data: FormData): Results {
  const { employees, payroll, objective, learners, duration } = data;
  const rate = employees < 11 ? 0.0055 : 0.01;
  const contributionAnnual = payroll * rate;
  const fundingFormation = contributionAnnual * 0.7;

  let aidCampus = 0;
  if (objective === "campus") aidCampus = 150000;
  else if (objective === "alternance") aidCampus = learners * 5000;
  else if (objective === "certifications") aidCampus = learners * duration * 12;

  let otherAids = employees >= 50 ? 50000 : 25000;
  if (data.sector === "industry" || data.sector === "construction") {
    otherAids += 30000;
  }

  const total3Years = contributionAnnual * 3 + aidCampus + otherAids;

  return {
    contributionAnnual: Math.round(contributionAnnual),
    fundingFormation: Math.round(fundingFormation),
    aidCampus: Math.round(aidCampus),
    otherAids: Math.round(otherAids),
    total3Years: Math.round(total3Years),
    rate,
  };
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function OpcoCalculator() {
  const { t, lang } = useMessages();
  const s = t.opco;

  const [screen, setScreen] = useState<"form" | "results">("form");
  const [form, setForm] = useState<FormData>({
    sector: "", employees: 0, payroll: 0, objective: "",
    learners: 0, duration: 0,
    firstName: "", lastName: "", email: "", company: "", phone: "",
  });
  const [results, setResults] = useState<Results | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const updateForm = useCallback((k: keyof FormData, v: string | number) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (results) setResults(null);
  }, [results]);

  const validateAndSubmit = useCallback(() => {
    if (!form.sector || !form.objective || form.employees <= 0 || form.payroll <= 0
        || !form.firstName || !form.lastName || !form.email || !form.company) {
      alert(lang === "fr" ? "Merci de compléter tous les champs obligatoires." : "Please fill in all required fields.");
      return;
    }
    if (!isValidProEmail(form.email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    const res = computeResults(form);
    setResults(res);
    setScreen("results");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [form, lang]);

  const restart = useCallback(() => {
    setForm({
      sector: "", employees: 0, payroll: 0, objective: "",
      learners: 0, duration: 0,
      firstName: "", lastName: "", email: "", company: "", phone: "",
    });
    setResults(null);
    setEmailError(false);
    setContactName("");
    setContactEmail("");
    setContactSent(false);
    setScreen("form");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleContact = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) return;
    setContactSent(true);
  }, [contactName, contactEmail]);

  const exportPDF = useCallback(async () => {
    if (!results || !pdfRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const clone = pdfRef.current.cloneNode(true) as HTMLDivElement;
    clone.style.position = "fixed";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.opacity = "0";
    clone.style.pointerEvents = "none";
    clone.style.zIndex = "9999";
    clone.style.width = "794px";
    document.body.appendChild(clone);

    const opt = {
      margin: 0,
      filename: `mentivis_opco_${form.company.replace(/\s+/g, "_").toLowerCase()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    try {
      await html2pdf().set(opt as any).from(clone).save();
    } finally {
      document.body.removeChild(clone);
    }
  }, [results, form.company]);

  /* PDF HTML builder */
  const pdfHTML = useMemo(() => {
    if (!results) return null;
    const today = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" });

    const rows = [
      { label: s.resultContribution, value: formatEuro(results.contributionAnnual, lang) + " / " + (lang === "fr" ? "an" : "yr") },
      { label: s.resultFunding, value: formatEuro(results.fundingFormation, lang) + " / " + (lang === "fr" ? "an" : "yr") },
      { label: s.resultCampus, value: formatEuro(results.aidCampus, lang) },
      { label: s.resultOther, value: formatEuro(results.otherAids, lang) },
    ];

    return `
      <div class="oc-pdf-page">
        <div class="oc-pdf-header">
          <div class="oc-pdf-brand"><span class="oc-pdf-brand-purple">M</span>entivis OPCO</div>
          <div class="oc-pdf-page-num">${s.pdf.eyebrow}</div>
        </div>
        <div class="oc-pdf-h1-eyebrow">${s.pdf.eyebrow}</div>
        <h1 class="oc-pdf-h1">${s.pdf.title}</h1>
        <div class="oc-pdf-company">${form.company}</div>
        <div class="oc-pdf-meta">
          <div><strong>${s.pdf.sector}:</strong> ${form.sector}</div>
          <div><strong>${s.pdf.employees}:</strong> ${form.employees}</div>
          <div><strong>${s.pdf.payroll}:</strong> ${formatEuro(form.payroll, lang)}</div>
          <div><strong>${s.pdf.objective}:</strong> ${form.objective}</div>
          <div><strong>${s.pdf.date}:</strong> ${today}</div>
        </div>
        <div class="oc-pdf-total-block">
          <div class="oc-pdf-total-label">${s.resultTotal3Years}</div>
          <div class="oc-pdf-total-value">${formatEuro(results.total3Years, lang)}</div>
        </div>
        <table class="oc-pdf-table">
          <thead><tr><th>${s.pdf.tableLabel}</th><th class="right">${s.pdf.tableValue}</th></tr></thead>
          <tbody>
            ${rows.map(r => `<tr><td class="oc-pdf-dim-name">${r.label}</td><td class="right"><strong>${r.value}</strong></td></tr>`).join("")}
          </tbody>
        </table>
        <div class="oc-pdf-disclaimer">${s.pdf.disclaimer}</div>
        <div class="oc-pdf-footer">
          <span>${s.pdf.footerLeft}</span>
          <span>${s.pdf.footerRight}</span>
        </div>
      </div>
    `;
  }, [results, form, lang, s]);

  return (
    <div className="oc-app">
      {/* ==================== SCREEN 1: FORM ==================== */}
      <section className={`oc-screen ${screen === "form" ? "active" : ""}`}>
        <div className="oc-container">
          <div className="oc-eyebrow">{s.eyebrow}</div>
          <h1 className="oc-hero-title">{s.title}</h1>
          <p className="oc-hero-sub">{s.sub}</p>

          <div className="oc-info-box">
            <strong>{s.infoTitle}</strong>
            <br />
            {s.infoBody}
          </div>

          <div className="oc-form-card">
            {/* Company info */}
            <div className="oc-form-row">
              <label className="oc-form-label">{s.sector} <span className="oc-required">*</span></label>
              <select className="oc-form-select" value={form.sector} onChange={e => updateForm("sector", e.target.value)}>
                <option value="">{s.choose}</option>
                {s.sectors.map((opt: string, i: number) => (
                  <option value={s.sectorValues[i]} key={i}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="oc-form-row-grid">
              <div className="oc-form-row">
                <label className="oc-form-label">{s.employees} <span className="oc-required">*</span></label>
                <input type="number" className="oc-form-input" placeholder={s.phEmployees} min={1} value={form.employees || ""} onChange={e => updateForm("employees", parseInt(e.target.value) || 0)} />
              </div>
              <div className="oc-form-row">
                <label className="oc-form-label">{s.payroll} <span className="oc-required">*</span></label>
                <input type="number" className="oc-form-input" placeholder={s.phPayroll} min={0} value={form.payroll || ""} onChange={e => updateForm("payroll", parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="oc-form-row">
              <label className="oc-form-label">{s.objective} <span className="oc-required">*</span></label>
              <select className="oc-form-select" value={form.objective} onChange={e => updateForm("objective", e.target.value)}>
                <option value="">{s.choose}</option>
                {s.objectives.map((opt: string, i: number) => (
                  <option value={s.objectiveValues[i]} key={i}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="oc-form-row-grid">
              <div className="oc-form-row">
                <label className="oc-form-label">{s.learners}</label>
                <input type="number" className="oc-form-input" placeholder={s.phLearners} min={1} value={form.learners || ""} onChange={e => updateForm("learners", parseInt(e.target.value) || 0)} />
              </div>
              <div className="oc-form-row">
                <label className="oc-form-label">{s.duration}</label>
                <input type="number" className="oc-form-input" placeholder={s.phDuration} min={1} value={form.duration || ""} onChange={e => updateForm("duration", parseInt(e.target.value) || 0)} />
              </div>
            </div>

            {/* Contact section */}
            <div className="oc-contact-divider" />
            <div className="oc-contact-title">{s.contactTitle}</div>

            <div className="oc-form-row-grid">
              <div className="oc-form-row">
                <label className="oc-form-label">{s.firstName} <span className="oc-required">*</span></label>
                <input type="text" className="oc-form-input" placeholder={s.phFirstName} value={form.firstName} onChange={e => updateForm("firstName", e.target.value)} />
              </div>
              <div className="oc-form-row">
                <label className="oc-form-label">{s.lastName} <span className="oc-required">*</span></label>
                <input type="text" className="oc-form-input" placeholder={s.phLastName} value={form.lastName} onChange={e => updateForm("lastName", e.target.value)} />
              </div>
            </div>

            <div className="oc-form-row">
              <label className="oc-form-label">{s.email} <span className="oc-required">*</span></label>
              <input type="email" className={`oc-form-input ${emailError ? "error" : ""}`} placeholder={s.phEmail} value={form.email} onChange={e => { updateForm("email", e.target.value); setEmailError(false); }} onBlur={() => { if (form.email && !isValidProEmail(form.email)) setEmailError(true); }} />
              {emailError && <div className="oc-error-msg">{s.emailError}</div>}
            </div>

            <div className="oc-form-row-grid">
              <div className="oc-form-row">
                <label className="oc-form-label">{s.company} <span className="oc-required">*</span></label>
                <input type="text" className="oc-form-input" placeholder={s.phCompany} value={form.company} onChange={e => updateForm("company", e.target.value)} />
              </div>
              <div className="oc-form-row">
                <label className="oc-form-label">{s.phone}</label>
                <input type="tel" className="oc-form-input" placeholder={s.phPhone} value={form.phone} onChange={e => updateForm("phone", e.target.value)} />
              </div>
            </div>

            <div className="oc-rgpd">{s.rgpd}</div>

            <button className="sc-btn-primary oc-submit-btn" onClick={validateAndSubmit}>
              {s.submit}
              <span className="material-symbols-outlined sc-btn-chevron">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== SCREEN 2: RESULTS ==================== */}
      <section className={`oc-screen ${screen === "results" ? "active" : ""}`}>
        <div className="oc-container">
          <div className="oc-dash-head">
            <div>
              <div className="oc-dash-eyebrow">{s.resultEyebrow}</div>
              <h2 className="oc-dash-title">{form.company}</h2>
              <div className="oc-dash-meta">{form.employees} {lang === "fr" ? "salariés" : "employees"} · {formatEuro(form.payroll, lang)} {lang === "fr" ? "masse salariale" : "payroll"}</div>
            </div>
            <div className="oc-dash-actions">
              <button className="sc-btn-outline" onClick={restart}>{s.restart}</button>
              <button className="sc-btn-primary" onClick={exportPDF}>
                {s.download}
                <span className="material-symbols-outlined sc-btn-chevron">chevron_right</span>
              </button>
            </div>
          </div>

          {results && (
            <>
              <div className="oc-result-card">
                <div className="oc-result-total-block">
                  <div className="oc-result-total-label">{s.resultTotal3Years}</div>
                  <div className="oc-result-total-value">{formatEuro(results.total3Years, lang)}</div>
                </div>

                <div className="oc-result-rows">
                  <div className="oc-result-row">
                    <span className="oc-result-label">{s.resultContribution}</span>
                    <span className="oc-result-value">{formatEuro(results.contributionAnnual, lang)} / {lang === "fr" ? "an" : "yr"}</span>
                  </div>
                  <div className="oc-result-row">
                    <span className="oc-result-label">{s.resultFunding}</span>
                    <span className="oc-result-value">{formatEuro(results.fundingFormation, lang)} / {lang === "fr" ? "an" : "yr"}</span>
                  </div>
                  <div className="oc-result-row">
                    <span className="oc-result-label">{s.resultCampus}</span>
                    <span className="oc-result-value">{formatEuro(results.aidCampus, lang)}</span>
                  </div>
                  <div className="oc-result-row">
                    <span className="oc-result-label">{s.resultOther}</span>
                    <span className="oc-result-value">{formatEuro(results.otherAids, lang)}</span>
                  </div>
                </div>

                <div className="oc-result-disclaimer">{s.disclaimer}</div>
              </div>

              {/* CTA card */}
              <div className="oc-cta-card">
                <div className="sc-cta-eyebrow">{s.ctaEyebrow}</div>
                <h2 className="sc-cta-title">{s.ctaTitle}</h2>
                <p className="sc-cta-sub">{s.ctaSub}</p>
                {!contactSent ? (
                  <form className="sc-cta-form" onSubmit={handleContact}>
                    <input type="text" required placeholder={s.ctaName} value={contactName} onChange={e => setContactName(e.target.value)} />
                    <input type="email" required placeholder={s.ctaEmail} value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                    <button type="submit" className="sc-btn-primary">
                      {s.ctaSubmit}
                      <span className="material-symbols-outlined sc-btn-chevron">chevron_right</span>
                    </button>
                  </form>
                ) : (
                  <div className="sc-cta-success visible">{s.ctaSuccess}</div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Hidden PDF report */}
      <div className="oc-pdf-report" ref={pdfRef} dangerouslySetInnerHTML={{ __html: pdfHTML || "" }} />
    </div>
  );
}
