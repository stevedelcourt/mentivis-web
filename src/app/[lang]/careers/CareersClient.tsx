"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { useMessages } from "@/lib/messages";
import { HUBSPOT_PORTAL_ID, HUBSPOT_CAREERS_FORM_ID, SITE } from "@/lib/config";

function loadHubSpotScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).hbspt) {
      resolve();
      return;
    }
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

export default function CareersClient() {
  const { t, lang } = useMessages();
  const c = t.careers;
  const formRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    loadHubSpotScript()
      .then(() => {
        const hbspt = (window as any).hbspt;
        if (hbspt && hbspt.forms && hbspt.forms.create && formRef.current) {
          hbspt.forms.create({
            portalId: HUBSPOT_PORTAL_ID,
            formId: HUBSPOT_CAREERS_FORM_ID,
            target: "#careers-hubspot-form",
            locale: lang === "fr" ? "fr" : "en",
          });
        }
      })
      .catch(() => {
        if (formRef.current) {
          formRef.current.innerHTML = `<p style="color:var(--m-ink-3);text-align:center;padding:40px 0;">${c.fallback}</p>`;
        }
      });
  }, [lang, c.fallback]);

  return (
    <PageShell>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: c.title,
        description: c.lead,
        url: `${SITE.baseUrl}/${lang}/careers`,
        publisher: { "@id": `${SITE.baseUrl}/#organization` },
        image: `${SITE.baseUrl}/images/heroes/blobs.avif`,
        inLanguage: lang === "fr" ? "fr-FR" : "en-US",
      }} />
      {/* Hero */}
      <section
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          minHeight: 420,
          maxHeight: 640,
          backgroundImage: "url(/images/heroes/blobs.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          textAlign: "left",
          color: "white",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 80 }}>
          <Reveal>
            <span
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              {c.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1
              className="t-display"
              style={{
                fontSize: "clamp(40px, 6vw, 72px)",
                margin: "16px 0 20px",
                lineHeight: 1.05,
              }}
            >
              {c.title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                lineHeight: 1.55,
                maxWidth: 560,
                opacity: 0.9,
              }}
            >
              {c.lead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Content: two columns */}
      <section style={{ padding: "80px 0 100px" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              alignItems: "start",
            }}
            className="m-split-grid"
          >
            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {/* About */}
              <Reveal>
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: 32,
                      fontWeight: 500,
                      letterSpacing: "-0.8px",
                      margin: "0 0 18px",
                      color: "var(--m-ink)",
                      lineHeight: 1.15,
                    }}
                  >
                    {c.aboutTitle}
                  </h2>
                  <p
                    style={{
                      color: "var(--m-ink-2)",
                      fontSize: 15.5,
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {c.aboutBody}
                  </p>
                </div>
              </Reveal>

              {/* Equity values */}
              <Reveal delay={60}>
                <div
                  style={{
                    background: "var(--m-bg-soft)",
                    border: "1px solid var(--m-line-2)",
                    borderRadius: 16,
                    padding: "28px 28px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: 18,
                      fontWeight: 500,
                      letterSpacing: "-0.3px",
                      margin: "0 0 10px",
                      color: "var(--m-ink)",
                    }}
                  >
                    {c.equityTitle}
                  </h3>
                  <p
                    style={{
                      color: "var(--m-ink-2)",
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {c.equityBody}
                  </p>
                </div>
              </Reveal>

              {/* Marie Castelli */}
              <Reveal delay={120}>
                <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 96,
                      aspectRatio: "1 / 1",
                      borderRadius: 16,
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "var(--m-line-2)",
                    }}
                  >
                    <Image
                      src="/images/team/marie-castelli.avif"
                      alt={c.marieName}
                      width={320}
                      height={320}
                      style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: 16,
                        color: "var(--m-ink)",
                        marginBottom: 2,
                      }}
                    >
                      {c.marieName}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--m-ink-3)",
                        marginBottom: 10,
                      }}
                    >
                      {c.marieRole}
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--m-ink-2)",
                        lineHeight: 1.55,
                        fontStyle: "italic",
                        margin: 0,
                      }}
                    >
                      &ldquo;{c.marieQuote}&rdquo;
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* CTA paragraph */}
              <Reveal delay={180}>
                <div
                  style={{
                    borderLeft: "3px solid var(--m-purple)",
                    paddingLeft: 20,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: 18,
                      fontWeight: 500,
                      letterSpacing: "-0.3px",
                      margin: "0 0 8px",
                      color: "var(--m-ink)",
                    }}
                  >
                    {c.ctaTitle}
                  </h3>
                  <p
                    style={{
                      color: "var(--m-ink-2)",
                      fontSize: 15,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {c.ctaBody}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Right column — form */}
            <Reveal delay={80}>
              <div
                style={{
                  background: "white",
                  border: "1px solid var(--m-line)",
                  borderRadius: 20,
                  padding: "36px 32px",
                  boxShadow: "0 4px 24px rgba(16,24,40,0.04)",
                  position: "sticky",
                  top: 100,
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 22,
                    fontWeight: 500,
                    letterSpacing: "-0.5px",
                    margin: "0 0 8px",
                    color: "var(--m-ink)",
                  }}
                >
                  {c.formTitle}
                </h2>
                <p
                  style={{
                    color: "var(--m-ink-3)",
                    fontSize: 14.5,
                    lineHeight: 1.5,
                    margin: "0 0 24px",
                  }}
                >
                  {c.formSub}
                </p>
                <div
                  id="careers-hubspot-form"
                  ref={formRef}
                  style={{ minHeight: 200 }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
