"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { marked } from "marked";
import PageShell from "@/components/layout/PageShell";
import Reveal from "@/components/Reveal";
import { useMessages } from "@/lib/messages";
import { HUBSPOT_PORTAL_ID, HUBSPOT_CAREERS_FORM_ID } from "@/lib/config";
import { JOB_TYPE_LABELS } from "@/data/careers-meta";
import type { Job } from "@/data/careers";

function loadHubSpotScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).hbspt) { resolve(); return; }
    const existing = document.querySelector('script[src="//js.hsforms.net/forms/embed/v2.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }
    const script = document.createElement("script");
    script.src = "//js.hsforms.net/forms/embed/v2.js";
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

const ICON_DOC = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>;
const ICON_PIN = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const ICON_BRIEF = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const ICON_GLOBE = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;

function InfoSidebar({ job, lang }: { job: Job; lang: string }) {
  const isFr = lang === "fr";
  const typeLabel = JOB_TYPE_LABELS[job.type];
  const typeStr = typeLabel ? (lang === "fr" ? typeLabel.fr : typeLabel.en) : job.type;

  const rows = [
    { icon: ICON_DOC, eyebrow: isFr ? "Département" : "Department", value: job.department },
    { icon: ICON_PIN, eyebrow: isFr ? "Lieu" : "Location", value: job.location },
    { icon: ICON_BRIEF, eyebrow: isFr ? "Contrat" : "Contract", value: typeStr },
    { icon: ICON_GLOBE, eyebrow: "Remote", value: job.remote ? (isFr ? "Oui" : "Yes") : (isFr ? "Non" : "No") },
  ];

  return (
    <div style={{ background: "var(--m-bg-soft)", borderRadius: 16, padding: 28, border: "1px solid var(--m-line-2)" }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 20, color: "var(--m-ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {isFr ? "Informations" : "Information"}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: "var(--m-ink-4)", flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--m-ink-4)", marginBottom: 2 }}>
                {row.eyebrow}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--m-ink)" }}>
                {row.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JobDetailClient({ job, lang }: { job: Job; lang: string }) {
  const { t } = useMessages();
  const c = t.careers;
  const [activeTab, setActiveTab] = useState<"description" | "apply">("description");
  const formRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const isFr = lang === "fr";

  useEffect(() => {
    if (activeTab !== "apply" || initialized.current) return;
    initialized.current = true;

    loadHubSpotScript()
      .then(() => {
        const hbspt = (window as any).hbspt;
        if (hbspt && hbspt.forms && hbspt.forms.create && formRef.current) {
          hbspt.forms.create({
            portalId: HUBSPOT_PORTAL_ID,
            formId: HUBSPOT_CAREERS_FORM_ID,
            target: "#job-hubspot-form",
            locale: lang === "fr" ? "fr" : "en",
          });
        }
      })
      .catch(() => {
        if (formRef.current) {
          formRef.current.innerHTML = `<p style="color:var(--m-ink-3);text-align:center;padding:40px 0;">${c.fallback}</p>`;
        }
      });
  }, [activeTab, lang, c.fallback]);

  const title = isFr ? job.titleFr : job.titleEn;
  const desc = isFr ? job.descriptionFr : job.descriptionEn;
  const descHtml = desc ? marked.parse(desc) as string : "";

  return (
    <PageShell>
      {/* Hero */}
      <section style={{ padding: "100px 0 60px", borderBottom: "1px solid var(--m-line)" }}>
        <div className="container">
          <Reveal>
            <Link href={`/${lang}/careers`} style={{
              fontSize: 13, fontWeight: 500, color: "var(--m-ink-3)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 24,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              {isFr ? "Carrières" : "Careers"}
            </Link>
          </Reveal>
          <Reveal delay={50}>
            <h1 className="t-display" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400 }}>
              {title}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", gap: 4, marginBottom: 32, borderBottom: "1px solid var(--m-line)" }}>
            <button onClick={() => setActiveTab("description")} style={{
              padding: "12px 24px", fontSize: 14, fontWeight: 600,
              background: "transparent", border: "none", borderBottom: activeTab === "description" ? "2px solid var(--m-purple)" : "2px solid transparent",
              color: activeTab === "description" ? "var(--m-purple)" : "var(--m-ink-3)",
              cursor: "pointer", fontFamily: "inherit",
            }}>
              {isFr ? "Description" : "Description"}
            </button>
            <button onClick={() => setActiveTab("apply")} style={{
              padding: "12px 24px", fontSize: 14, fontWeight: 600,
              background: "transparent", border: "none", borderBottom: activeTab === "apply" ? "2px solid var(--m-purple)" : "2px solid transparent",
              color: activeTab === "apply" ? "var(--m-purple)" : "var(--m-ink-3)",
              cursor: "pointer", fontFamily: "inherit",
            }}>
              {isFr ? "Postuler" : "Apply"}
            </button>
          </div>

          {activeTab === "description" && (
            <Reveal>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 48, alignItems: "start" }} className="m-split-grid">
                <div className="insight-body" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--m-ink-2)" }}
                  dangerouslySetInnerHTML={{ __html: descHtml || (isFr ? "<p>Description à venir.</p>" : "<p>Description coming soon.</p>") }}
                />
                <InfoSidebar job={job} lang={lang} />
              </div>
            </Reveal>
          )}

          {activeTab === "apply" && (
            <Reveal>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 48, alignItems: "start" }} className="m-split-grid">
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 12, color: "var(--m-ink)" }}>
                    {c.formTitle}
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--m-ink-3)", lineHeight: 1.5, marginBottom: 24 }}>
                    {c.formSub}
                  </p>
                  <div id="job-hubspot-form" ref={formRef} style={{ minHeight: 300 }} />
                  <style>{`
                    #job-hubspot-form .submitted-message,
                    #job-hubspot-form a[href*="hs-sites"],
                    #job-hubspot-form a[href*="hubspot"],
                    #job-hubspot-form .hs-richtext:has(+ .hs-richtext),
                    #job-hubspot-form .hs-form-field ~ .hs-richtext:last-of-type,
                    #job-hubspot-form > div:last-child:not(.hs-form) {
                      display: none !important;
                    }
                  `}</style>
                </div>
                <InfoSidebar job={job} lang={lang} />
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </PageShell>
  );
}
