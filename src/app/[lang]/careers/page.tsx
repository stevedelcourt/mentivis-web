"use client";

import { useEffect, useRef } from "react";
import PageShell from "@/components/layout/PageShell";
import Reveal from "@/components/Reveal";
import { useMessages } from "@/lib/messages";
import { HUBSPOT_PORTAL_ID, HUBSPOT_CAREERS_FORM_ID } from "@/lib/config";

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

export default function CareersPage() {
  const { lang } = useMessages();
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
          formRef.current.innerHTML = `<p style="color:var(--m-ink-3);text-align:center;padding:40px 0;">${lang === "fr" ? "Le formulaire est temporairement indisponible. Veuillez envoyer votre candidature directement à contact@mentivis.com" : "The form is temporarily unavailable. Please send your application directly to contact@mentivis.com"}</p>`;
        }
      });
  }, [lang]);

  return (
    <PageShell>
      <section
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          minHeight: 420,
          maxHeight: 640,
          backgroundImage: "url(/site-images/blobs.webp)",
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
              {lang === "fr" ? "Rejoindre l'équipe" : "Join the team"}
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
              {lang === "fr" ? "Carrières" : "Careers"}
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
              {lang === "fr"
                ? "Vous partagez notre conviction que la formation est un levier stratégique ? Envoyez-nous votre candidature."
                : "You share our belief that training is a strategic lever? Send us your application."}
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingBottom: 100 }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <Reveal>
            <div
              style={{
                background: "white",
                border: "1px solid var(--m-line)",
                borderRadius: 20,
                padding: "40px 36px",
                boxShadow: "0 4px 24px rgba(16,24,40,0.04)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  margin: "0 0 8px",
                  color: "var(--m-ink)",
                }}
              >
                {lang === "fr" ? "Postuler" : "Apply"}
              </h2>
              <p
                style={{
                  color: "var(--m-ink-3)",
                  fontSize: 15,
                  lineHeight: 1.5,
                  margin: "0 0 28px",
                }}
              >
                {lang === "fr"
                  ? "Remplissez le formulaire ci-dessous et joignez votre CV. Nous étudions chaque candidature avec attention."
                  : "Fill in the form below and attach your CV. We review every application carefully."}
              </p>
              <div
                id="careers-hubspot-form"
                ref={formRef}
                style={{ minHeight: 200 }}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
