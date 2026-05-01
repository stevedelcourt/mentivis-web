"use client";
import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/JsonLd";
import ContactSidebar from "@/components/ui/ContactSidebar";
import { useMessages } from "@/lib/messages";
import { SITE } from "@/lib/config";
import { useHubSpotSubmit } from "@/lib/hubspot";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

function ContactSuccess({ title, body, back }: { title: string; body: string; back: string }) {
  return (
    <div style={{ padding: "60px 48px", border: "1px solid var(--m-line)", borderRadius: 20, background: "var(--m-bg-soft)", textAlign: "center" as const }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%", background: "var(--m-purple)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24,
        marginBottom: 24,
      }}>✓</div>
      <h3 style={{ fontFamily: "var(--f-display)", fontSize: 32, fontWeight: 700, letterSpacing: "-1px", margin: "0 0 12px" }}>{title}</h3>
      <p style={{ color: "var(--m-ink-3)", fontSize: 16, lineHeight: 1.55, margin: "0 0 24px" }}>{body}</p>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--m-purple)", textDecoration: "none" }}>
        {back}
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
      </Link>
    </div>
  );
}

export default function ContactPage() {
  const { t, lang } = useMessages();
  const c = t.contact;
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", phone: "", project: "" });
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const { submit: hsSubmit, loading, error } = useHubSpotSubmit();

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstname || !form.lastname || !form.email || !form.project || !consent) return;
    if (honeypot) return;

    const ok = await hsSubmit(
      {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        phone: form.phone,
        message: form.project,
      },
      {
        pageUri: typeof window !== "undefined" ? window.location.href : "https://www.mentivis.com/fr/contact",
        pageName: "Contact",
      }
    );

    if (ok) setSent(true);
  };

  return (
    <PageShell hidePreFooterCTA>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: c.title,
        description: c.lead,
        url: `${SITE.baseUrl}/${lang}/contact`,
        mainEntity: { "@id": `${SITE.baseUrl}/#organization` },
        inLanguage: lang === "fr" ? "fr-FR" : "en-US",
      }} />
      <section style={{ paddingTop: 120, paddingBottom: 60 }}>
        <div className="container">
          <Reveal>
            <div className="t-eyebrow" style={{ marginBottom: 28 }}>
              {c.eyebrow}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="t-display" style={{ fontSize: "clamp(36px, 5vw, 68px)", margin: 0, maxWidth: 880 }}>
              {c.title[0]}<br />
              <em>{c.title[1]}</em><br />
              {c.title[2]}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="t-lead" style={{ marginTop: 28, maxWidth: 580 }}>{c.lead}</p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "40px 0 100px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 80, alignItems: "start" }} className="m-split-grid">
            {sent ? (
              <ContactSuccess title={c.successTitle} body={c.successBody} back={c.successBack} />
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column" as const, gap: 24 }}>
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="m-grid-2">
                  <Field label={c.labels.firstname}>
                    <input className="input" required value={form.firstname} onChange={(e) => update("firstname", e.target.value)} />
                  </Field>
                  <Field label={c.labels.lastname}>
                    <input className="input" required value={form.lastname} onChange={(e) => update("lastname", e.target.value)} />
                  </Field>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="m-grid-2">
                  <Field label={c.labels.email}>
                    <input type="email" className="input" required value={form.email} onChange={(e) => update("email", e.target.value)} />
                  </Field>
                  <Field label={c.labels.phone}>
                    <input type="tel" className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                  </Field>
                </div>
                <Field label={c.labels.project}>
                  <textarea className="textarea" required value={form.project} onChange={(e) => update("project", e.target.value)} />
                </Field>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, color: "var(--m-ink-3)", lineHeight: 1.5 }}>
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <span>
                    {c.labels.consent}{" "}
                    <Link href={`/${lang}/privacy`} style={{ color: "var(--m-purple)", textDecoration: "underline" }}>{c.labels.consentLink}</Link>.
                  </span>
                </label>
                {error && (
                  <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>
                    {lang === "fr" ? "Une erreur est survenue. Veuillez réessayer." : "An error occurred. Please try again."}
                  </p>
                )}
                <div>
                  <button type="submit" disabled={loading} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "white", background: loading ? "var(--m-ink-4)" : "var(--m-purple)", border: "none", borderRadius: 999, cursor: loading ? "not-allowed" : "pointer", marginTop: 8 }}>
                    {loading ? (lang === "fr" ? "Envoi en cours..." : "Sending...") : c.labels.submit}
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                  </button>
                </div>
              </form>
            )}

            <aside style={{ borderLeft: "1px solid var(--m-line)", paddingLeft: 40 }} className="m-aside">
              <ContactSidebar lang={lang} eyebrow="Un échange, sans détour" showImage />
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
