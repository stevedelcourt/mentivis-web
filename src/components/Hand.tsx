"use client";
import { useRef, useEffect } from "react";

export default function Hand() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const W = 600;
  const H = 600;
  const BLUE = "#000776"; // Mentivis blue

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Cube vertices
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ];

    const edges = [
      [0,1], [1,2], [2,3], [3,0], // back face
      [4,5], [5,6], [6,7], [7,4], // front face
      [0,4], [1,5], [2,6], [3,7], // connecting edges
    ];

    let angleX = 0;
    let angleY = 0;

    function rotateX(y: number, z: number, angle: number) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [y * cos - z * sin, y * sin + z * cos];
    }

    function rotateY(x: number, z: number, angle: number) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x * cos - z * sin, x * sin + z * cos];
    }

    function project(x: number, y: number, z: number) {
      const scale = 180;
      const distance = 4;
      const persp = distance / (distance + z);
      return [
        W / 2 + x * scale * persp,
        H / 2 + y * scale * persp,
        persp,
      ];
    }

    function drawHand() {
      ctx.save();
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = "#000000";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Hand positioned bottom left, reaching toward center-right
      const hx = 120;
      const hy = 420;

      // Palm/base
      ctx.beginPath();
      ctx.moveTo(hx, hy + 60);
      ctx.quadraticCurveTo(hx - 20, hy + 30, hx + 10, hy);
      ctx.quadraticCurveTo(hx + 30, hy - 20, hx + 50, hy - 10);
      ctx.quadraticCurveTo(hx + 70, hy, hx + 80, hy + 20);
      ctx.quadraticCurveTo(hx + 90, hy + 50, hx + 70, hy + 70);
      ctx.quadraticCurveTo(hx + 40, hy + 80, hx, hy + 60);
      ctx.fill();

      // Thumb
      ctx.beginPath();
      ctx.moveTo(hx + 50, hy - 10);
      ctx.quadraticCurveTo(hx + 80, hy - 40, hx + 110, hy - 30);
      ctx.quadraticCurveTo(hx + 130, hy - 20, hx + 120, hy);
      ctx.quadraticCurveTo(hx + 100, hy + 10, hx + 70, hy + 20);
      ctx.stroke();

      // Fingers reaching up
      const fingers = [
        { x: hx + 20, y: hy - 10, cx: hx + 10, cy: hy - 60, ex: hx + 30, ey: hy - 90 },
        { x: hx + 40, y: hy - 15, cx: hx + 40, cy: hy - 70, ex: hx + 55, ey: hy - 100 },
        { x: hx + 60, y: hy - 10, cx: hx + 70, cy: hy - 65, ex: hx + 85, ey: hy - 95 },
        { x: hx + 75, y: hy + 5, cx: hx + 95, cy: hy - 50, ex: hx + 110, ey: hy - 75 },
      ];

      fingers.forEach((f) => {
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.quadraticCurveTo(f.cx, f.cy, f.ex, f.ey);
        ctx.stroke();

        // Finger tip
        ctx.beginPath();
        ctx.arc(f.ex, f.ey, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);

      angleX += 0.008;
      angleY += 0.012;

      const projected: number[][] = [];

      vertices.forEach((v) => {
        let [x, y, z] = v;
        // Rotate Y
        [x, z] = rotateY(x, z, angleY);
        // Rotate X
        [y, z] = rotateX(y, z, angleX);
        projected.push(project(x, y, z));
      });

      // Draw edges
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      edges.forEach(([a, b]) => {
        const [x1, y1] = projected[a];
        const [x2, y2] = projected[b];
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Draw nodes
      projected.forEach(([x, y, p]) => {
        const r = 12 * p;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = BLUE;
        ctx.fill();
      });

      // Draw hand on top
      drawHand();

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: W,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div style={{ background: "transparent", borderRadius: 12, overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
