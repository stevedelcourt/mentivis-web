"use client";
import { ReactNode } from "react";

interface ImageHeroProps {
  image: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
}

export default function ImageHero({ image, eyebrow, title, lead, children }: ImageHeroProps) {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: 560,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          paddingTop: 140,
          paddingBottom: 100,
          textAlign: "left",
        }}
      >
        <div className="m-hero-text m-hero-text-delay-0 t-eyebrow" style={{ marginBottom: 28, color: "white" }}>
          {eyebrow}
        </div>
        <h1
          className="m-hero-text m-hero-text-delay-1 t-display"
          style={{
            fontSize: "clamp(32px, 5vw, 68px)",
            maxWidth: 1080,
            margin: 0,
            color: "white",
          }}
        >
          {title}
        </h1>
        {lead && (
          <p
            className="m-hero-text m-hero-text-delay-2 t-lead"
            style={{
              marginTop: 28,
              maxWidth: 680,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {lead}
          </p>
        )}
        {children && (
          <div
            className="m-hero-text m-hero-text-delay-3"
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap" as const,
              marginTop: 36,
            }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
