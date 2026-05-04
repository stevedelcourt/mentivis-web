"use client";
import { useRef, useEffect, useCallback } from "react";

export default function FeutreBalls() {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const curRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const W = 680, H = 430;

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

  const genBall = (
    rng: () => number,
    ocx: number,
    ocy: number,
    r: number,
    nLoops: number
  ): { x: number; y: number }[] => {
    const pts: { x: number; y: number }[] = [];

    for (let i = 0; i < nLoops; i++) {
      const roll = rng();
      let rx: number, ry: number, dcx: number, dcy: number, ang: number, wob: number, nPts: number;

      // More extreme shapes to fill the ball
      if (roll < 0.42) {
        // Elongated vertical - fills top/bottom
        rx = r * (0.30 + rng() * 0.40);
        ry = r * (0.80 + rng() * 0.20);
        dcx = ocx + (rng() - 0.5) * r * 0.4;
        dcy = ocy + (rng() - 0.5) * r * 0.4;
        ang = rng() * Math.PI;
        wob = r * (0.18 + rng() * 0.15); // More wobble
        nPts = 56;
      } else if (roll < 0.78) {
        // Elongated horizontal - fills left/right
        rx = r * (0.80 + rng() * 0.20);
        ry = r * (0.30 + rng() * 0.40);
        dcx = ocx + (rng() - 0.5) * r * 0.4;
        dcy = ocy + (rng() - 0.5) * r * 0.4;
        ang = rng() * Math.PI;
        wob = r * (0.14 + rng() * 0.12);
        nPts = 42;
      } else {
        // Small dense circles - fill center
        const rs = r * (0.20 + rng() * 0.35);
        rx = rs;
        ry = rs * (0.80 + rng() * 0.20);
        dcx = ocx + (rng() - 0.5) * r * 0.6;
        dcy = ocy + (rng() - 0.5) * r * 0.6;
        ang = rng() * Math.PI;
        wob = r * (0.045 + rng() * 0.055);
        nPts = 26;
      }

      // Higher frequency waves for more distortion
      const freqs = [2.5 + rng() * 4.5, 8 + rng() * 10, 18 + rng() * 14];
      const waves = freqs.map(f => ({ f, px: rng() * Math.PI * 2, py: rng() * Math.PI * 2 }));
      const amps = [0.55, 0.65, 0.35]; // Higher amplitudes
      const cosA = Math.cos(ang), sinA = Math.sin(ang);

      for (let j = 0; j <= nPts; j++) {
        const t = (j / nPts) * Math.PI * 2;
        const ex = rx * Math.cos(t);
        const ey = ry * Math.sin(t);
        const rpx = ex * cosA - ey * sinA;
        const rpy = ex * sinA + ey * cosA;
        let wx = 0, wy = 0;
        waves.forEach((w, k) => {
          wx += amps[k] * wob * Math.sin(w.f * t + w.px);
          wy += amps[k] * wob * Math.sin(w.f * t + w.py);
        });
        pts.push({ x: dcx + rpx + wx, y: dcy + rpy + wy });
      }
    }
    return pts;
  };

  const go = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const base = baseRef.current;
    const curEl = curRef.current;
    if (!base || !curEl) return;

    const bCtx = base.getContext('2d')!;
    const cCtx = curEl.getContext('2d')!;

    const rng = prng(Math.floor(Math.random() * 99999));
    // Many loops to fill the ball completely
    const pts = genBall(rng, 320, 270, 70, 48);

    bCtx.fillStyle = '#ffffff';
    bCtx.fillRect(0, 0, W, H);
    cCtx.clearRect(0, 0, W, H);

    bCtx.strokeStyle = '#111111';
    bCtx.lineWidth = 2;
    bCtx.lineCap = 'round';
    bCtx.lineJoin = 'round';
    bCtx.globalAlpha = 0.78;

    const SPD = 1 / 3.6;
    let t0: number | null = null;
    let ptIdx = 0;

    function drawDot(x: number, y: number) {
      cCtx.clearRect(0, 0, W, H);
      cCtx.beginPath();
      cCtx.arc(x, y, 3, 0, Math.PI * 2);
      cCtx.fillStyle = '#111';
      cCtx.fill();
    }

    function frame(ts: number) {
      if (t0 === null) t0 = ts;
      const elapsed = ts - t0;
      const target = Math.min(pts.length, Math.ceil(elapsed * SPD));

      if (target > ptIdx) {
        bCtx.beginPath();
        const from = ptIdx > 0 ? ptIdx - 1 : 0;
        bCtx.moveTo(pts[from].x, pts[from].y);
        for (let i = ptIdx; i < target; i++) {
          bCtx.lineTo(pts[i].x, pts[i].y);
        }
        bCtx.stroke();
        ptIdx = target;
      }

      if (ptIdx > 0 && ptIdx <= pts.length) {
        const dotPt = pts[Math.max(0, ptIdx - 1)];
        drawDot(dotPt.x, dotPt.y);
      }

      if (ptIdx < pts.length) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        setTimeout(() => go(), 100);
      }
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
        maxWidth: 680,
        margin: "0 auto",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={go}
    >
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ position: "relative" }}>
          <canvas
            ref={baseRef}
            width={W}
            height={H}
            style={{ display: "block", width: "100%", height: "auto" }}
          />
          <canvas
            ref={curRef}
            width={W}
            height={H}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          fontFamily: "Georgia, serif",
          fontSize: 12,
          color: "#bbb",
          letterSpacing: "0.06em",
          padding: "10px 0 13px",
          opacity: 0, // Hidden since we loop immediately
          transition: "opacity 1.6s",
          cursor: "pointer",
        }}
      >
        cliquer pour recommencer
      </div>
    </div>
  );
}
