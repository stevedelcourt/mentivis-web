"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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

  const typeLabel = JOB_TYPE_LABELS[job.type];
  const title = isFr ? job.titleFr : job.titleEn;
  const desc = isFr ? job.descriptionFr : job.descriptionEn;
  const typeStr = typeLabel ? (lang === "fr" ? typeLabel.fr : typeLabel.en) : job.type;
  const remoteStr = isFr ? "Remote" : "Remote";

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
            <h1 className="t-display" style={{ fontSize: "clamp(28px, 4vw, 48px)", marginBottom: 16, fontWeight: 400 }}>
              {title}
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 14, color: "var(--m-ink-3)", marginBottom: 24 }}>
              <span>{job.department}</span>
              <span>·</span>
              <span>{job.location}</span>
              <span>·</span>
              <span>{typeStr}</span>
              {job.remote && <><span>·</span><span>{remoteStr}</span></>}
            </div>
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
              <div className="insight-body" style={{ maxWidth: 720 }}>
                {desc ? desc.split("\n\n").map((p: string, i: number) => (
                  <p key={i} style={{ fontSize: 15, lineHeight: 1.7, color: "var(--m-ink-2)", marginBottom: 16 }}>{p}</p>
                )) : (
                  <p style={{ color: "var(--m-ink-3)" }}>{isFr ? "Description à venir." : "Description coming soon."}</p>
                )}
              </div>
            </Reveal>
          )}

          {activeTab === "apply" && (
            <Reveal>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "start" }} className="m-split-grid">
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 12, color: "var(--m-ink)" }}>
                    {c.formTitle}
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--m-ink-3)", lineHeight: 1.5, marginBottom: 24 }}>
                    {c.formSub}
                  </p>
                  <div id="job-hubspot-form" ref={formRef} style={{ minHeight: 200 }} />
                </div>
                <div style={{
                  background: "var(--m-bg-soft)", borderRadius: 16, padding: 28,
                  border: "1px solid var(--m-line-2)",
                }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "var(--m-ink)" }}>
                    {isFr ? "Informations" : "Information"}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
                    <div>
                      <div style={{ color: "var(--m-ink-3)", marginBottom: 2, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {isFr ? "Département" : "Department"}
                      </div>
                      <div style={{ color: "var(--m-ink)", fontWeight: 500 }}>{job.department}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--m-ink-3)", marginBottom: 2, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {isFr ? "Type" : "Type"}
                      </div>
                      <div style={{ color: "var(--m-ink)", fontWeight: 500 }}>{typeStr}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--m-ink-3)", marginBottom: 2, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {isFr ? "Lieu" : "Location"}
                      </div>
                      <div style={{ color: "var(--m-ink)", fontWeight: 500 }}>{job.location}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--m-ink-3)", marginBottom: 2, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Remote
                      </div>
                      <div style={{ color: "var(--m-ink)", fontWeight: 500 }}>
                        {job.remote ? (isFr ? "Oui" : "Yes") : (isFr ? "Non" : "No")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </PageShell>
  );
}
