"use client";
import { useRef, useEffect, useCallback } from "react";

interface Shape {
  pts: { x: number; y: number }[];
  width: number;
}

export default function BlobTwo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const S = 600;
  const PAD = 60; // generous padding to prevent any cropping

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const prng = (seed: number) => {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t = (t ^ Math.imul(t ^ (t >>> 7), t | 61)) >>> 0;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // Smooth curve through points using quadratic bezier
  const drawSmooth = (ctx: CanvasRenderingContext2D, pts: {x:number;y:number}[]) => {
    if (pts.length < 2) return;
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const xc = (pts[i].x + pts[i + 1].x) / 2;
      const yc = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
    }
    // Last point
    if (pts.length > 1) {
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);
    }
  };

  const genCurve = (rng: () => number): Shape => {
    const pts: { x: number; y: number }[] = [];
    const type = rng();

    if (type < 0.20) {
      // Long smooth S-curve inside canvas
      const startX = PAD + rng() * (S - PAD * 2);
      const startY = PAD + rng() * (S - PAD * 2);
      const endX = PAD + rng() * (S - PAD * 2);
      const endY = PAD + rng() * (S - PAD * 2);
      const cp1x = PAD + rng() * (S - PAD * 2);
      const cp1y = PAD + rng() * (S - PAD * 2);
      const cp2x = PAD + rng() * (S - PAD * 2);
      const cp2y = PAD + rng() * (S - PAD * 2);
      const n = 30;
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const mt = 1 - t;
        const x = clamp(mt*mt*mt*startX + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*endX, PAD, S - PAD);
        const y = clamp(mt*mt*mt*startY + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*endY, PAD, S - PAD);
        pts.push({ x, y });
      }
    } else if (type < 0.45) {
      // Smooth ellipse / oval - keep inside
      const maxR = Math.min(S, S) / 2 - PAD;
      const cx = PAD + maxR + (rng() - 0.5) * maxR * 0.4;
      const cy = PAD + maxR + (rng() - 0.5) * maxR * 0.4;
      const rx = 30 + rng() * (maxR * 0.45);
      const ry = 25 + rng() * (maxR * 0.4);
      const rot = rng() * Math.PI * 2;
      const n = 24 + Math.floor(rng() * 16);
      for (let i = 0; i <= n; i++) {
        const t = (i / n) * Math.PI * 2;
        const x = cx + rx * Math.cos(t) * Math.cos(rot) - ry * Math.sin(t) * Math.sin(rot);
        const y = cy + rx * Math.cos(t) * Math.sin(rot) + ry * Math.sin(t) * Math.cos(rot);
        pts.push({ x: clamp(x, PAD, S - PAD), y: clamp(y, PAD, S - PAD) });
      }
    } else if (type < 0.70) {
      // Smooth arc (partial ellipse) - keep inside
      const maxR = Math.min(S, S) / 2 - PAD;
      const cx = PAD + maxR + (rng() - 0.5) * maxR * 0.3;
      const cy = PAD + maxR + (rng() - 0.5) * maxR * 0.3;
      const r = 35 + rng() * (maxR * 0.5);
      const startAng = rng() * Math.PI * 2;
      const sweep = (0.3 + rng() * 1.2) * Math.PI;
      const n = 20 + Math.floor(rng() * 20);
      for (let i = 0; i <= n; i++) {
        const t = startAng + (i / n) * sweep;
        pts.push({
          x: clamp(cx + r * Math.cos(t), PAD, S - PAD),
          y: clamp(cy + r * Math.sin(t), PAD, S - PAD)
        });
      }
    } else if (type < 0.85) {
      // Smooth wave snake - keep inside
      const startX = PAD + rng() * (S - PAD * 2);
      const startY = PAD + rng() * (S - PAD * 2);
      const maxLen = Math.min(S - PAD * 2, S - PAD * 2) * 0.5;
      const len = 60 + rng() * maxLen;
      const ang = rng() * Math.PI * 2;
      const amp = 6 + rng() * 18;
      const freq = 1 + rng() * 3;
      const n = 30 + Math.floor(rng() * 20);
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const baseX = startX + t * len * Math.cos(ang);
        const baseY = startY + t * len * Math.sin(ang);
        const wave = amp * Math.sin(t * Math.PI * freq);
        pts.push({
          x: clamp(baseX + wave * Math.cos(ang + Math.PI/2), PAD, S - PAD),
          y: clamp(baseY + wave * Math.sin(ang + Math.PI/2), PAD, S - PAD)
        });
      }
    } else {
      // Smooth spiral segment - keep inside
      const maxR = Math.min(S, S) / 2 - PAD;
      const cx = PAD + maxR + (rng() - 0.5) * maxR * 0.3;
      const cy = PAD + maxR + (rng() - 0.5) * maxR * 0.3;
      const rStart = 15 + rng() * 25;
      const rEnd = rStart + 30 + rng() * (maxR * 0.5);
      const turns = 0.5 + rng() * 1.5;
      const startAng = rng() * Math.PI * 2;
      const n = 30 + Math.floor(rng() * 20);
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const r = rStart + (rEnd - rStart) * t;
        const a = startAng + t * turns * Math.PI * 2;
        pts.push({
          x: clamp(cx + r * Math.cos(a), PAD, S - PAD),
          y: clamp(cy + r * Math.sin(a), PAD, S - PAD)
        });
      }
    }

    return { pts, width: 12 + rng() * 16 };
  };

  const genAll = (rng: () => number, count: number): Shape[] => {
    const shapes: Shape[] = [];
    for (let i = 0; i < count; i++) {
      shapes.push(genCurve(rng));
    }
    return shapes;
  };

  // Fisher-Yates shuffle
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const go = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;

    const rng = prng(Math.floor(Math.random() * 99999));
    const shapes = shuffle(genAll(rng, 20));

    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, S, S);

    const SPD_DRAW = 1 / 30; // Build speed
    const SPD_ERASE = 1 / 30; // Erase speed
    let t0: number | null = null;
    let shapeIdx = 0;
    let ptIdx = 0;
    let phase: 'drawing' | 'holding' | 'erasing' = 'drawing';
    let holdStart: number | null = null;

    function drawShapes(upToShape: number, upToPt: number) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = '#000000';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1.0;

      for (let s = 0; s < upToShape; s++) {
        const shape = shapes[s];
        ctx.lineWidth = shape.width;
        ctx.beginPath();
        drawSmooth(ctx, shape.pts);
        ctx.stroke();
      }

      if (upToShape < shapes.length && upToPt > 0) {
        const shape = shapes[upToShape];
        ctx.lineWidth = shape.width;
        ctx.beginPath();
        const subPts = shape.pts.slice(0, upToPt);
        drawSmooth(ctx, subPts);
        ctx.stroke();
      }
    }

    function frame(ts: number) {
      if (t0 === null) t0 = ts;
      const elapsed = ts - t0;
      const totalPts = shapes.reduce((sum, s) => sum + s.pts.length, 0);

      if (phase === 'drawing') {
        const targetTotal = Math.min(totalPts, Math.ceil(elapsed * SPD_DRAW));

        let drawn = 0;
        while (shapeIdx < shapes.length && drawn < targetTotal) {
          const shape = shapes[shapeIdx];
          const remaining = shape.pts.length - ptIdx;
          const toDraw = Math.min(remaining, targetTotal - drawn);
          ptIdx += toDraw;
          drawn += toDraw;

          if (ptIdx >= shape.pts.length) {
            shapeIdx++;
            ptIdx = 0;
          }
        }

        drawShapes(shapeIdx, ptIdx);

        if (shapeIdx >= shapes.length) {
          phase = 'holding';
          holdStart = ts;
        }
      } else if (phase === 'holding') {
        if (holdStart && ts - holdStart > 2000) {
          phase = 'erasing';
          t0 = ts;
        }
      } else if (phase === 'erasing') {
        const eraseElapsed = ts - (t0 || ts);
        const targetTotal = Math.min(totalPts, Math.ceil(eraseElapsed * SPD_ERASE));
        const remainingPts = totalPts - targetTotal;

        // Calculate which shape/pt to draw up to (inverse)
        let remaining = remainingPts;
        let sIdx = 0;
        let pIdx = 0;

        for (let i = 0; i < shapes.length; i++) {
          if (remaining <= shapes[i].pts.length) {
            sIdx = i;
            pIdx = remaining;
            break;
          }
          remaining -= shapes[i].pts.length;
        }

        drawShapes(sIdx, pIdx);

        if (remainingPts <= 0) {
          setTimeout(() => go(), 500);
          return;
        }
      }

      animRef.current = requestAnimationFrame(frame);
    }

    animRef.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    go();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [go]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: S,
        margin: "0 auto",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={go}
    >
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", aspectRatio: "1 / 1" }}>
        <canvas
          ref={canvasRef}
          width={S}
          height={S}
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
