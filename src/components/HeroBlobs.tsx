"use client";

import { useEffect, useRef } from "react";

interface BlobConfig {
  color: string;
  radius: number;
  originX: number; // 0-1 percentage of container width
  originY: number; // 0-1 percentage of container height
}

const BLOBS: BlobConfig[] = [
  { color: "#000776", radius: 140, originX: 0.75, originY: 0.30 },
  { color: "#4a4a9e", radius: 110, originX: 0.82, originY: 0.52 },
  { color: "#b8b8e0", radius: 90,  originX: 0.68, originY: 0.68 },
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

export default function HeroBlobs() {
  const svgRef = useRef<SVGSVGElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const blobsRef = useRef<BlobState[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function initSize() {
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };

      // Initialize blob positions based on origin percentages
      if (blobsRef.current.length === 0) {
        blobsRef.current = BLOBS.map((b) => ({
          x: b.originX * rect.width,
          y: b.originY * rect.height,
          vx: 0,
          vy: 0,
          ox: b.originX * rect.width,
          oy: b.originY * rect.height,
          r: b.radius,
          color: b.color,
        }));
      }
    }

    initSize();

    function onMouseMove(e: MouseEvent) {
      if (!svg) return;
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
      const oldH = sizeRef.current.h;
      sizeRef.current = { w: rect.width, h: rect.height };

      // Recompute origins proportionally
      blobsRef.current.forEach((blob, i) => {
        const cfg = BLOBS[i];
        blob.ox = cfg.originX * rect.width;
        blob.oy = cfg.originY * rect.height;
        // If first init, set position to origin
        if (oldW === 0) {
          blob.x = blob.ox;
          blob.y = blob.oy;
        }
      });
    }

    function distance(x1: number, y1: number, x2: number, y2: number) {
      const dx = x1 - x2;
      const dy = y1 - y2;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function animate() {
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
    rafRef.current = requestAnimationFrame(animate);

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
              r={b.radius}
              fill={b.color}
              style={{ willChange: "transform" }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
