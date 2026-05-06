"use client";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollCardsSection({
  lang,
  entries,
}: {
  lang: string;
  entries: {
    enterprise: { kicker: string; title: string; items: string[]; cta: string };
    of: { kicker: string; title: string; items: string[]; cta: string };
    solutions: { kicker: string; title: string; items: string[]; cta: string };
  };
}) {
  const bgRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  // Measure ALL cards bounding box — batched via ResizeObserver + rAF
  useEffect(() => {
    if (!wrapperRef.current) return;
    const cards = wrapperRef.current.querySelectorAll('.m-dual-card');
    if (cards.length === 0) return;
    
    let rafId: number | null = null;
    
    const update = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const first = (cards[0] as HTMLElement).getBoundingClientRect();
        const last = (cards[cards.length - 1] as HTMLElement).getBoundingClientRect();
        const wrapperRect = wrapperRef.current!.getBoundingClientRect();
        const gap = wrapperRect.width * 0.03; // 3% gap
        
        const container = wrapperRef.current!.querySelector('.container') as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const style = getComputedStyle(container);
        const pl = parseFloat(style.paddingLeft) || 0;
        const pr = parseFloat(style.paddingRight) || 0;
        
        // Container content bounds relative to wrapper
        const contentLeft = containerRect.left - wrapperRect.left + pl;
        const contentRight = containerRect.right - wrapperRect.left - pr;
        
        // Calculate purple bg position (around all cards with 3% gap)
        let left = first.left - wrapperRect.left - gap;
        let width = (last.right - first.left) + (2 * gap);
        
        // Mobile: match container content bounds exactly (aligns with hero text)
        const isMobile = window.innerWidth <= 720;
        if (isMobile) {
          left = contentLeft;
          width = contentRight - contentLeft;
        } else {
          // Desktop: constrain to container bounds
          left = Math.max(left, contentLeft);
          width = Math.min(width, contentRight - left);
        }
        
        setRect({
          left,
          top: first.top - wrapperRect.top - gap,
          width,
          height: (last.bottom - first.top) + (2 * gap),
        });
      });
    };

    update();
    
    // ResizeObserver fires after layout is settled (no forced reflow)
    const observer = new ResizeObserver(update);
    observer.observe(wrapperRef.current);
    
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Set initial position + scroll animation (ONLY left/width)
  useLayoutEffect(() => {
    if (!bgRef.current || !wrapperRef.current || !rect) return;

    const ctx = gsap.context(() => {
      // Set initial: exact size around all cards, 5% gap
      gsap.set(bgRef.current, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        borderRadius: 16,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
          pin: false,
        },
      });

      // Animate left/width to full bleed + borderRadius to 0
      tl.to(
        bgRef.current,
        {
          left: 0,
          width: "100%",
          borderRadius: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        0
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [rect]);

  const headings: Record<string, string[]> = {
    fr: ["Entreprise", "Organisme de formation", "Solutions numériques"],
    en: ["Enterprise", "Training Organization", "Digital Solutions"],
  };
  const labels = headings[lang] || headings.fr;
  const numbers = ["01｜", "02｜", "03｜"];

  const cardData = [
    { ...entries.enterprise, href: `/${lang}/enterprise` },
    { ...entries.of, href: `/${lang}/of` },
    { ...entries.solutions, href: `/${lang}/solutions` },
  ];

  const cards = cardData.map((c, i) => ({
    kicker: c.kicker.split("｜")[1] || c.kicker,
    number: numbers[i],
    heading: labels[i],
    subtitle: c.title,
    items: c.items,
    cta: c.cta,
    href: c.href,
  }));

  return (
    <section id="services" style={{ padding: "100px 0 80px", position: "relative" }}>
      <div ref={wrapperRef} style={{ position: "relative" }}>
        {/* Background: starts around ALL cards (3% gap), expands left/right only */}
        {/* Background: starts around ALL cards (5% gap), expands left/right only */}
        <div
          ref={bgRef}
          style={{
            position: "absolute",
            background: "var(--m-purple)",
            borderRadius: 16,
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24,
            }}
            className="m-triple-grid"
          >
            {cards.map((card, i) => (
              <GlassCard key={i} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GlassCard({
  kicker,
  number,
  heading,
  subtitle,
  items,
  cta,
  href,
}: {
  kicker: string;
  number: string;
  heading: string;
  subtitle: string;
  items: string[];
  cta: string;
  href: string;
}) {
  return (
    <div
      className="m-dual-card"
      style={{
        background: "rgba(255,255,255,0.08)",
        color: "white",
        padding: "clamp(24px, 4vw, 44px) clamp(20px, 3vw, 40px)",
        borderRadius: 16,
        position: "relative",
        overflow: "hidden",
        minHeight: 380,
        border: "0.5px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Link
        href={href}
        style={{
          display: "block",
          position: "absolute",
          inset: 0,
          zIndex: 1,
          borderRadius: 16,
        }}
        aria-label={cta}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 320,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ minHeight: 148 }}>
          <div
            style={{
              fontFamily: "var(--f-display)",
              fontSize: 15,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.06em",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            {number}
          </div>
          <div
            style={{
              fontFamily: "var(--f-display)",
              fontSize: 13,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.04em",
              fontWeight: 500,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {kicker}
          </div>
<h3
             style={{
               fontFamily: "var(--f-display)",
               fontSize: "clamp(36px, 7vw, 42px)",
               fontWeight: 400,
               letterSpacing: "-0.02em",
               lineHeight: 1.1,
               margin: 0,
               maxWidth: 420,
             }}
           >
            {heading}
          </h3>
        </div>
        <p
          style={{
            fontFamily: "var(--f-display)",
            fontSize: 17,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.01em",
            fontWeight: 400,
            lineHeight: 1.35,
            margin: "12px 0 24px",
            maxWidth: 380,
          }}
        >
          {subtitle}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, marginTop: "auto" }}>
          {items.map((it, i) => (
            <li
              key={i}
              style={{
                padding: "11px 0",
                borderTop: "1px solid rgba(255,255,255,0.15)",
                fontSize: 14.5,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {it}
            </li>
          ))}
        </ul>
        <div
          style={{
            marginTop: 24,
            display: "inline-flex",
            alignItems: "center",
            position: "relative",
            zIndex: 3,
          }}
        >
{/* REVERT POINT: black button, white hover - to undo: swap colors + revert globals.css .m-glass-btn:hover */}
          <Link
             href={href}
             className="m-glass-btn"
             style={{
               display: "inline-flex",
               alignItems: "center",
               gap: 8,
               padding: "8px 20px",
               fontSize: 13.5,
               fontWeight: 600,
               color: "white",
               background: "var(--m-ink)",
               borderRadius: 12,
               textDecoration: "none",
               transition: "all 0.18s ease",
             }}
           >
            {cta}
            <Icon name="chevron_right" size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
