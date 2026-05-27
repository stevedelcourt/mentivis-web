"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useMessages } from "@/lib/messages";
import ButtonLink from "@/components/ui/ButtonLink";
import { buildContactUrl } from "@/lib/contact-url";

const GAP = 30;
const BASE_SPEED = 0.25;
const BACK_VR = 0.08;
const FRONT_VR = 0.15;
const FRONT_Y_OFFSET_DESKTOP = -300;
const FRONT_Y_OFFSET_MOBILE = -136;

export default function ParallaxHero() {
  const { t, lang } = useMessages();
  const h = t.mentivisos.hero;

  const sectionRef = useRef<HTMLElement>(null);
  const backTrackRef = useRef<HTMLDivElement>(null);
  const frontTrackRef = useRef<HTMLDivElement>(null);
  const imgWRef = useRef(0);
  const offsetRef = useRef(0);
  const scrollYRef = useRef(0);
  const rafRef = useRef(0);
  const fallbackTimer = useRef(0);
  const isMobileRef = useRef(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      isMobileRef.current = e.matches;
    };
    isMobileRef.current = mq.matches;
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const measure = useCallback(() => {
    if (!backTrackRef.current) return;
    const img = backTrackRef.current.querySelector("img") as HTMLImageElement | null;
    if (!img) return;
    imgWRef.current = img.getBoundingClientRect().width;
  }, []);

  const imgRef = useCallback(
    (el: HTMLImageElement | null) => {
      if (!el) return;
      if (el.complete) {
        measure();
      } else {
        el.addEventListener("load", measure, { once: true });
      }
    },
    [measure]
  );

  useEffect(() => {
    measure();
    const debouncedMeasure = () => {
      clearTimeout(fallbackTimer.current);
      fallbackTimer.current = window.setTimeout(measure, 250);
    };
    window.addEventListener("resize", debouncedMeasure);
    fallbackTimer.current = window.setTimeout(() => {
      if (imgWRef.current === 0) measure();
    }, 1000);

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const tick = () => {
      if (!visible) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const speedMul = 1 + scrollYRef.current * 0.0003;
      offsetRef.current += BASE_SPEED * speedMul;

      const stepW = imgWRef.current + GAP;
      if (imgWRef.current > 0) {
        const wrapRange = 4 * stepW;
        while (offsetRef.current > wrapRange) offsetRef.current -= wrapRange;
        while (offsetRef.current < 0) offsetRef.current += wrapRange;

        const frontOffset = isMobileRef.current
          ? FRONT_Y_OFFSET_MOBILE
          : FRONT_Y_OFFSET_DESKTOP;
        const backY = scrollYRef.current * BACK_VR;
        const frontY = frontOffset + scrollYRef.current * FRONT_VR;

        if (backTrackRef.current) {
          backTrackRef.current.style.transform = `translateX(${-offsetRef.current}px) translateY(${backY}px)`;
        }
        if (frontTrackRef.current) {
          frontTrackRef.current.style.transform = `translateX(${-offsetRef.current}px) translateY(${frontY}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", debouncedMeasure);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(fallbackTimer.current);
    };
  }, [measure]);

  const imgH = "var(--parallax-img-h, 25vh)";
  const sharedImg: React.CSSProperties = {
    height: imgH,
    width: "auto",
    flexShrink: 0,
    display: "block",
    userSelect: "none",
  };

  return (
    <>
      {/* Text hero */}
      <section
        ref={sectionRef}
        style={{
          padding: "clamp(80px, 11vw, 140px) 0 clamp(32px, 5vw, 56px)",
          background: "var(--m-bg)",
        }}
      >
        <div className="container" style={{ maxWidth: 800 }}>
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--m-ink-3)",
              marginBottom: 20,
            }}
          >
            {h.eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--m-ink)",
              marginBottom: 20,
            }}
          >
            {h.headline.split("|").map((line: string, i: number) => (
              <span key={i} style={{ display: "block" }}>
                {line}
              </span>
            ))}
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--m-ink-2)",
              maxWidth: 560,
              marginBottom: 36,
            }}
          >
            {h.subheadline}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
            <ButtonLink href="https://app.mentivisos.com/" variant="primary">
              {h.ctaPrimary}
            </ButtonLink>
            <ButtonLink href={buildContactUrl(lang, "/mentivisos")} variant="outline">
              {h.ctaSecondary}
            </ButtonLink>
          </div>
          {h.proof && (
            <p style={{ fontSize: 14, color: "var(--m-ink-3)", margin: 0 }}>
              {h.proof}
            </p>
          )}
        </div>
      </section>

      {/* Parallax module strip */}
      <div
        className="parallax-wrap"
        style={{ width: "100%", marginTop: 0 }}
      >
        <div
          ref={backTrackRef}
          style={{
            display: "flex",
            gap: `${GAP}px`,
            width: "max-content",
            willChange: "transform",
          }}
        >
          <img
            ref={imgRef}
            src="/images/mentivisos/proportions-back.webp"
            alt=""
            draggable={false}
            style={sharedImg}
          />
          <img
            src="/images/mentivisos/proportions-back.webp"
            alt=""
            draggable={false}
            style={sharedImg}
          />
          <img
            src="/images/mentivisos/proportions-back.webp"
            alt=""
            draggable={false}
            style={sharedImg}
          />
          <img
            src="/images/mentivisos/proportions-back.webp"
            alt=""
            draggable={false}
            style={sharedImg}
          />
        </div>

        <div
          ref={frontTrackRef}
          style={{
            display: "flex",
            gap: `${GAP}px`,
            width: "max-content",
            willChange: "transform",
          }}
        >
          <img
            src="/images/mentivisos/proportions-front.webp"
            alt=""
            draggable={false}
            style={sharedImg}
          />
          <img
            src="/images/mentivisos/proportions-front.webp"
            alt=""
            draggable={false}
            style={sharedImg}
          />
          <img
            src="/images/mentivisos/proportions-front.webp"
            alt=""
            draggable={false}
            style={sharedImg}
          />
          <img
            src="/images/mentivisos/proportions-front.webp"
            alt=""
            draggable={false}
            style={sharedImg}
          />
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root { --parallax-img-h: 25vh; }
            @media (max-width: 768px) {
              :root { --parallax-img-h: 18vh; }
            }
          `,
        }}
      />
    </>
  );
}
