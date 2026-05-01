"use client";

import { useEffect, useRef } from "react";

interface BlobConfig {
  color: string;
  baseRadius: number;
  originX: number;
  originY: number;
  // Offset for initial disconnected position (smallest blob only)
  initialOffsetX?: number;
  initialOffsetY?: number;
}

const BLOBS: BlobConfig[] = [
  { color: "#000776", baseRadius: 112, originX: 0.85, originY: 0.291 },
  { color: "#4a4a9e", baseRadius: 88, originX: 0.82, originY: 0.52 },
  { color: "#b8b8e0", baseRadius: 72,  originX: 0.68, originY: 0.68, initialOffsetX: 180, initialOffsetY: 120 },
];

interface BlobState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
  r: number;
  color: string;
}

function getScale(w: number): number {
  // Scale blobs based on container width; 1440px is reference
  if (w >= 1440) return 1;
  if (w >= 1200) return 0.9;
  if (w >= 950) return 0.8;
  if (w >= 720) return 0.65;
  return 0.5;
}

export default function HeroBlobs() {
  const svgRef = useRef<SVGSVGElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const blobsRef = useRef<BlobState[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const isMobileRef = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Detect mobile (no animation on mobile/touch devices)
    const isMobile = window.innerWidth < 950 || "ontouchstart" in window;
    isMobileRef.current = isMobile;

    function initSize() {
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
      const scale = getScale(rect.width);

      // Initialize blob positions
      if (blobsRef.current.length === 0) {
        blobsRef.current = BLOBS.map((b) => {
          const ox = b.originX * rect.width;
          const oy = b.originY * rect.height;
          const r = b.baseRadius * scale;
          // Smallest blob starts offset so it's not connected
          const offsetX = b.initialOffsetX ? b.initialOffsetX * scale : 0;
          const offsetY = b.initialOffsetY ? b.initialOffsetY * scale : 0;
          return {
            x: ox + offsetX,
            y: oy + offsetY,
            vx: 0,
            vy: 0,
            ox,
            oy,
            r,
            color: b.color,
          };
        });
      } else {
        // Resize: recompute origins and radii
        blobsRef.current.forEach((blob, i) => {
          const cfg = BLOBS[i];
          blob.ox = cfg.originX * rect.width;
          blob.oy = cfg.originY * rect.height;
          blob.r = cfg.baseRadius * scale;
        });
      }
    }

    initSize();

    function onMouseMove(e: MouseEvent) {
      if (!svg || isMobileRef.current) return;
      const rect = svg.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    function onResize() {
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const oldW = sizeRef.current.w;
      sizeRef.current = { w: rect.width, h: rect.height };
      const scale = getScale(rect.width);

      blobsRef.current.forEach((blob, i) => {
        const cfg = BLOBS[i];
        blob.ox = cfg.originX * rect.width;
        blob.oy = cfg.originY * rect.height;
        blob.r = cfg.baseRadius * scale;
        if (oldW === 0) {
          blob.x = blob.ox + (cfg.initialOffsetX ? cfg.initialOffsetX * scale : 0);
          blob.y = blob.oy + (cfg.initialOffsetY ? cfg.initialOffsetY * scale : 0);
        }
      });

      // Update DOM radii immediately on resize
      const circles = svg.querySelectorAll("circle");
      circles.forEach((circle, i) => {
        const blob = blobsRef.current[i];
        if (blob) {
          circle.setAttribute("r", String(blob.r));
        }
      });
    }

    function distance(x1: number, y1: number, x2: number, y2: number) {
      const dx = x1 - x2;
      const dy = y1 - y2;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function animate() {
      if (isMobileRef.current) return;

      const { w, h } = sizeRef.current;
      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const mouse = mouseRef.current;
      const blobs = blobsRef.current;

      blobs.forEach((blob) => {
        // 1. Repulsion from mouse (flee)
        const dMouse = distance(blob.x, blob.y, mouse.x, mouse.y);
        const repelRadius = 350;
        if (dMouse < repelRadius && dMouse > 1) {
          const force = (repelRadius - dMouse) / repelRadius;
          const angle = Math.atan2(blob.y - mouse.y, blob.x - mouse.x);
          blob.vx += Math.cos(angle) * force * 3.5;
          blob.vy += Math.sin(angle) * force * 3.5;
        }

        // 2. Attraction to origin (gentle return)
        blob.vx += (blob.ox - blob.x) * 0.012;
        blob.vy += (blob.oy - blob.y) * 0.012;
      });

      // 3. Inter-blob repulsion
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const a = blobs[i];
          const b = blobs[j];
          const d = distance(a.x, a.y, b.x, b.y);
          const minDist = a.r + b.r + 20;
          if (d < minDist && d > 1) {
            const force = (minDist - d) / minDist;
            const angle = Math.atan2(a.y - b.y, a.x - b.x);
            a.vx += Math.cos(angle) * force * 1.5;
            a.vy += Math.sin(angle) * force * 1.5;
            b.vx -= Math.cos(angle) * force * 1.5;
            b.vy -= Math.sin(angle) * force * 1.5;
          }
        }
      }

      // 4. Friction + apply
      blobs.forEach((blob) => {
        blob.vx *= 0.94;
        blob.vy *= 0.94;
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Keep within bounds (soft)
        const margin = blob.r + 50;
        if (blob.x < -margin) blob.x = -margin;
        if (blob.x > w + margin) blob.x = w + margin;
        if (blob.y < -margin) blob.y = -margin;
        if (blob.y > h + margin) blob.y = h + margin;
      });

      // Update DOM
      if (!svg) return;
      const circles = svg.querySelectorAll("circle");
      circles.forEach((circle, i) => {
        const blob = blobs[i];
        if (blob) {
          circle.setAttribute("cx", String(blob.x));
          circle.setAttribute("cy", String(blob.y));
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);

    if (!isMobile) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      // On mobile: set blobs to their origin positions (static)
      const circles = svg.querySelectorAll("circle");
      circles.forEach((circle, i) => {
        const blob = blobsRef.current[i];
        if (blob) {
          circle.setAttribute("cx", String(blob.ox));
          circle.setAttribute("cy", String(blob.oy));
          circle.setAttribute("r", String(blob.r));
        }
      });
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        <defs>
          <filter id="gooey">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="22"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10"
              result="goo"
            />
          </filter>
        </defs>
        <g filter="url(#gooey)">
          {BLOBS.map((b, i) => (
            <circle
              key={i}
              cx={b.originX * 100 + "%"}
              cy={b.originY * 100 + "%"}
              r={b.baseRadius}
              fill={b.color}
              style={{ willChange: "transform" }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
