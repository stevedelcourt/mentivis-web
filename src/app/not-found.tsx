"use client";

import { useMemo } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

const PARTICLE_COUNT = 24;

function Particles() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = Math.random() * 8 + 8;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              bottom: `-10px`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              animation: `m-float-up ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function NotFound() {
  const lang = "fr";

  const navT = useMemo(() => ({
    nav: {
      home: "Accueil",
      about: "À propos",
      enterprise: "Entreprises",
      of: "Organismes de formation",
      solutions: "Solutions",
      resources: "Ressources",
      corporate: "Corporate",
      contact: "Contact",
      cta: "Contactez-nous",
    },
  }), []);

  const footerT = useMemo(() => ({
    nav: {
      cta: "Contactez-nous",
      home: "Accueil",
      about: "À propos",
      enterprise: "Entreprises",
      of: "Organismes de formation",
      solutions: "Solutions",
      resources: "Ressources",
      corporate: "Corporate",
    },
    footer: {
      tagline: "Dispositifs de formation qui fonctionnent.",
      ctaTitle: "Démarrer un projet, c'est simple",
      ctaLead: "Premier échange gratuit, sans engagement. Nous écoutons, puis nous vous disons honnêtement si nous sommes les bons interlocuteurs.",
      navigation: "Navigation",
      copy: "© 2026 Mentivis. Opérateur en formation et développement des compétences.",
    },
    common: { learnMore: "En savoir plus" },
  }), []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes m-float-up {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-110vh) scale(0.5); opacity: 0; }
        }
        @keyframes m-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes m-fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes m-pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.25); }
          50% { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
        }
      `}</style>

      <TopNav t={navT} lang={lang} route="" />

      <main
        style={{
          flex: 1,
          background: "var(--m-purple)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          paddingTop: 96,
        }}
      >
        <Particles />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "60px 24px",
            position: "relative",
            zIndex: 5,
          }}
        >
          {/* 404 */}
          <div
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(100px, 18vw, 200px)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-4px",
              color: "white",
              animation: "m-bob 4s ease-in-out infinite",
              userSelect: "none",
            }}
          >
            404
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 700,
              lineHeight: 1.2,
              margin: "24px 0 16px",
              maxWidth: 600,
              animation: "m-fade-in-up 0.8s ease-out 0.2s both",
            }}
          >
            Cette page a pris la tangente
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "rgba(255,255,255,0.7)",
              maxWidth: 480,
              margin: "0 0 36px",
              lineHeight: 1.5,
              animation: "m-fade-in-up 0.8s ease-out 0.35s both",
            }}
          >
            Même Einstein n’a pas trouvé la formule pour la faire réapparaître.
          </p>

          {/* Quote card */}
          <div
            style={{
              maxWidth: 560,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 20,
              padding: "28px 32px",
              marginBottom: 40,
              animation: "m-fade-in-up 0.8s ease-out 0.5s both",
            }}
          >
            <p
              style={{
                fontSize: 18,
                fontStyle: "italic",
                lineHeight: 1.55,
                margin: "0 0 12px",
                color: "rgba(255,255,255,0.95)",
              }}
            >
              «&nbsp;Deux choses sont infinies : l’univers et la bêtise humaine. Et je ne suis pas sûr pour l’univers.&nbsp;»
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                margin: 0,
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              - Albert Einstein
            </p>
          </div>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "m-fade-in-up 0.8s ease-out 0.7s both",
            }}
          >
            <Link
              href="/fr"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--m-purple)",
                background: "white",
                borderRadius: 999,
                textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
                animation: "m-pulse-glow 2.5s ease-in-out infinite",
              }}
            >
              Retour à l'accueil →
            </Link>
            <Link
              href="/fr/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                color: "white",
                background: "rgba(255,255,255,0.1)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                borderRadius: 999,
                textDecoration: "none",
                transition: "background 0.2s",
              }}
            >
              Nous contacter →
            </Link>
          </div>
        </div>
      </main>

      <Footer t={footerT} lang={lang} />
    </div>
  );
}
