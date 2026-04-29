"use client";
import Reveal from "@/components/Reveal";
import PageShell from "@/components/layout/PageShell";
import ContactSidebar from "@/components/ui/ContactSidebar";
import { useMessages } from "@/lib/messages";

export default function MeetingPage() {
  const { t, lang } = useMessages();

  return (
    <PageShell hidePreFooterCTA>
      <section
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          minHeight: 480,
          maxHeight: 640,
          backgroundImage: "url(/site-images/circularline.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          textAlign: "left",
          color: "white",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 140, paddingBottom: 100 }}>
          <div className="t-eyebrow" style={{ marginBottom: 28, color: "white" }}>
            {lang === "fr" ? "Prendre rendez-vous" : "Book a meeting"}
          </div>
          <h1 className="t-display" style={{ fontSize: "clamp(32px, 5vw, 64px)", margin: 0, maxWidth: 900, color: "white" }}>
            {lang === "fr" ? "Un échange," : "A conversation,"}<br />
            <em style={{ color: "white", fontStyle: "normal" }}>{lang === "fr" ? "sans détour" : "straight to the point"}</em>
          </h1>
          <p style={{ marginTop: 28, maxWidth: 680, color: "rgba(255,255,255,0.9)", fontSize: 18, lineHeight: 1.5 }}>
            {lang === "fr"
              ? "Premier rendez-vous gratuit et sans engagement. Nous écoutons, puis nous vous disons honnêtement si nous sommes les bons interlocuteurs."
              : "First meeting free and without commitment. We listen, then we honestly tell you if we are the right people for your project."}
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 0 100px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="m-split-grid">
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid var(--m-line)",
                background: "var(--m-bg-soft)",
              }}
            >
              <iframe
                src="https://meetings.hubspot.com/mcostes?embed=true"
                title={lang === "fr" ? "Prendre rendez-vous" : "Book a meeting"}
                style={{
                  width: "100%",
                  height: 700,
                  border: "none",
                  display: "block",
                }}
                scrolling="no"
              />
            </div>

            <aside style={{ borderLeft: "1px solid var(--m-line)", paddingLeft: 40 }} className="m-aside">
              <ContactSidebar
                lang={lang}
                eyebrow={lang === "fr" ? "Nous serions ravis d'échanger avec vous. Chaque situation est unique : regardons ensemble comment faire progresser votre dispositif de formation." : "We would be delighted to talk with you. Every situation is unique: let's explore together how to advance your training system."}
                showImage
              />
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
