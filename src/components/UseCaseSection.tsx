"use client";

import { useState, useEffect, useRef } from "react";

interface UseCaseItem {
  title: string;
  subtitle: string;
  status: string;
  meta: string;
  context: string;
  solutions: string[];
  results: string;
  budget: string;
  duration: string;
}

interface UseCaseData {
  eyebrow: string;
  title: string;
  lead: string;
  labels?: {
    context: string;
    solutions: string;
    results: string;
    budget: string;
    duration: string;
  };
  items: UseCaseItem[];
}

export default function UseCaseSection({ t }: { t: UseCaseData }) {
  const labels = t.labels ?? {
    context: "Contexte & défi",
    solutions: "Solutions déployées",
    results: "Résultat",
    budget: "Budget investi",
    duration: "Durée",
  };
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "clamp(4rem, 10vw, 9rem) 0",
        background: "var(--m-ink)",
        color: "white",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(60px)",
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "clamp(2.5rem, 6vw, 6rem)",
          }}
          className="m-faq-grid"
        >
          {/* Left intro */}
          <div className="m-faq-intro">
            <div
              className="t-eyebrow"
              style={{
                marginBottom: "1.75rem",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {t.eyebrow}
            </div>
            <h2
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)",
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                margin: "0 0 1.75rem",
              }}
            >
              {t.title}
            </h2>
            <p
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.75)",
                maxWidth: "36ch",
                margin: 0,
              }}
            >
              {t.lead}
            </p>
          </div>

          {/* Right accordion */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {t.items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <article
                  key={index}
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <button
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={`usecase-panel-${index}`}
                    type="button"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: 0,
                      color: "white",
                      fontFamily: "inherit",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "1.85rem 0",
                      display: "grid",
                      gridTemplateColumns: "2.25rem 1fr auto",
                      alignItems: "center",
                      gap: "1.5rem",
                      fontSize: "1.0625rem",
                      fontWeight: 400,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.4,
                      transition: "color 0.25s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        color: isOpen ? "white" : "rgba(255,255,255,0.45)",
                        fontVariantNumeric: "tabular-nums",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span>{item.title}</span>
                      <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)" }}>
                        {item.subtitle} · <span style={{ opacity: 0.7 }}>{item.status}</span> · {item.meta}
                      </span>
                    </span>
                    <span
                      style={{
                        position: "relative",
                        width: 14,
                        height: 14,
                        flexShrink: 0,
                        display: "block",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: 0,
                          width: "100%",
                          height: 1,
                          background: isOpen ? "white" : "rgba(255,255,255,0.45)",
                          transform: "translateY(-50%)",
                          transition: "background 0.3s ease, transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: 0,
                          width: 1,
                          height: "100%",
                          background: isOpen ? "white" : "rgba(255,255,255,0.45)",
                          transform: isOpen ? "translateX(-50%) rotate(90deg)" : "translateX(-50%)",
                          transition: "background 0.3s ease, transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)",
                        }}
                      />
                    </span>
                  </button>
                  <div
                    id={`usecase-panel-${index}`}
                    role="region"
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <div
                        style={{
                          padding: "0 0 2.25rem calc(2.25rem + 1.5rem)",
                          fontSize: "0.9375rem",
                          lineHeight: 1.75,
                          color: "rgba(255,255,255,0.75)",
                          maxWidth: "62ch",
                          fontWeight: 400,
                        }}
                      >
                        <div style={{ marginBottom: "1.5rem" }}>
                          <strong style={{ color: "white", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                            {labels.context}
                          </strong>
                          <p style={{ margin: 0 }}>{item.context}</p>
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                          <strong style={{ color: "white", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                            {labels.solutions}
                          </strong>
                          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                            {item.solutions.map((sol, i) => (
                              <li key={i} style={{ marginBottom: "0.35rem" }}>{sol}</li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                          <strong style={{ color: "white", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                            {labels.results}
                          </strong>
                          <p style={{ margin: 0 }}>{item.results}</p>
                        </div>

                        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", fontSize: "0.875rem" }}>
                          <div>
                            <strong style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500, display: "block", marginBottom: 2 }}>
                              {labels.budget}
                            </strong>
                            <span style={{ color: "white", fontWeight: 600 }}>{item.budget}</span>
                          </div>
                          <div>
                            <strong style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500, display: "block", marginBottom: 2 }}>
                              {labels.duration}
                            </strong>
                            <span style={{ color: "white", fontWeight: 600 }}>{item.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            {/* Bottom border */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
