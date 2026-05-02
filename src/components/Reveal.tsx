"use client";
import { useRef, useState, useEffect, ReactNode, ElementType } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  style?: React.CSSProperties;
};

export default function Reveal({ children, delay = 0, as: Tag = "div", style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      requestAnimationFrame(() => setShown(true));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          requestAnimationFrame(() => setShown(true));
          io.disconnect();
        }
      });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const TagComponent = Tag as React.ElementType;
  return (
    <TagComponent ref={ref} style={{
      ...style,
      opacity: shown ? 1 : 0,
       transform: shown ? "translateY(0) scale(1)" : "translateY(18px) scale(0.98)",
       transition: `opacity 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, transform 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
    }}>
      {children}
    </TagComponent>
  );
}