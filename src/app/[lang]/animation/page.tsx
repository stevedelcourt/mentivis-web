"use client";
import { useTypewriter } from "@/lib/useTypewriter";
import { useMessages } from "@/lib/messages";

export default function AnimationPage() {
  const { t } = useMessages();
  const words = t.animation?.words ?? ["Concevoir", "Structurer", "Déployer"];
  const subtitle = t.animation?.subtitle ?? "des dispositifs de formation qui fonctionnent";

  const { displayedText } = useTypewriter({
    words,
    typeSpeed: 100,
    deleteSpeed: 60,
    pauseType: 1200,
    pauseDelete: 250,
    loop: true,
  });

  const heroFontSize = "clamp(32px, 5vw, 68px)";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "var(--m-ink)",
        padding: "0 32px",
      }}
    >
      <div className="container" style={{ textAlign: "left", maxWidth: 900, width: "100%" }}>
        {/* Ligne 1 — typewriter */}
        <h1
          className="t-display"
          aria-live="polite"
          aria-atomic="true"
          style={{
            fontSize: heroFontSize,
            color: "white",
            margin: 0,
            minHeight: "1.2em",
            lineHeight: 1.17,
          }}
        >
          {displayedText}
        </h1>

        {/* Ligne 2 — subtitle statique */}
        <p
          className="t-display"
          style={{
            fontSize: heroFontSize,
            color: "rgba(255,255,255,0.75)",
            marginTop: 4,
            lineHeight: 1.17,
            marginBottom: 0,
          }}
        >
          {subtitle}
        </p>
      </div>
    </main>
  );
}
