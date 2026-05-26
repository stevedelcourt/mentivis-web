"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useMessages } from "@/lib/messages";
import Reveal from "@/components/Reveal";

const CHAPTER_TIMES = [0, 31, 99, 143, 196, 215];

export default function PipelineSection() {
  const { t, lang } = useMessages();
  const p = t.mentivisos.pipeline;
  const isEn = lang === "en";

  const [videoSrc, setVideoSrc] = useState(
    isEn ? "/videos/mOS-product-en-sm.mp4" : "/videos/mOS-720.mp4"
  );
  const [activeChapter, setActiveChapter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { downlink: number; effectiveType: string } }).connection;
    if (connection) {
      const isSlow =
        connection.downlink < 5 ||
        ["slow-2g", "2g", "3g"].includes(connection.effectiveType);
      setVideoSrc(
        isSlow
          ? isEn
            ? "/videos/mOS-product-en-sm.mp4"
            : "/videos/mOS-720.mp4"
          : isEn
          ? "/videos/mOS-product-en.mp4"
          : "/videos/mOS-1080.mp4"
      );
    }
  }, [isEn]);

  const handlePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying((p) => !p);
  }, [playing]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
    // Auto-highlight chapter
    const t = videoRef.current.currentTime;
    let chap = 0;
    for (let i = CHAPTER_TIMES.length - 1; i >= 0; i--) {
      if (t >= CHAPTER_TIMES[i]) {
        chap = i;
        break;
      }
    }
    setActiveChapter(chap);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    const webkitVideo = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (typeof webkitVideo.webkitEnterFullscreen === "function") {
      webkitVideo.webkitEnterFullscreen();
    } else {
      video.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
    }
  };

  const progressRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleBarDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    seekFromEvent(e);
  };

  const seekFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * videoRef.current.duration;
    setProgress(ratio * 100);
  };

  useEffect(() => {
    const up = () => {
      isDragging.current = false;
    };
    const move = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      if (!progressRef.current || !videoRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const ratio = Math.max(
        0,
        Math.min(1, (x - rect.left) / rect.width)
      );
      videoRef.current.currentTime = ratio * videoRef.current.duration;
      setProgress(ratio * 100);
    };
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
    };
  }, []);

  const handleStepClick = (i: number) => {
    setActiveChapter(i);
    if (videoRef.current) {
      videoRef.current.currentTime = CHAPTER_TIMES[i];
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <section style={{ padding: "96px 0", background: "var(--m-bg)" }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p
              className="t-eyebrow"
              style={{
                marginBottom: 16,
                color: "var(--m-ink-3)",
                fontFamily: "var(--f-mono)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {p.eyebrow}
            </p>
            <h2
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(24px, 3.5vw, 40px)",
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "var(--m-ink)",
              }}
            >
              {p.title}
            </h2>
          </div>
        </Reveal>

        {/* Video player */}
        <Reveal delay={100}>
          <div
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              aspectRatio: "16/9",
              background: "var(--m-ink)",
              marginBottom: 32,
            }}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              preload="metadata"
              playsInline
              poster="/images/mentivisos/thumb-product.webp"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onLoadedMetadata={() => {}}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setPlaying(false)}
              onClick={handlePlay}
            />

            {/* Poster overlay — shown when paused/ended */}
            {!playing && (
              <img
                src="/images/mentivisos/thumb-product.webp"
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
              />
            )}

            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {/* Play/Pause */}
              <button
                onClick={handlePlay}
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 999,
                  cursor: "pointer",
                  pointerEvents: "auto",
                  border: "none",
                }}
              >
                {playing ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </button>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 999,
                  cursor: "pointer",
                  pointerEvents: "auto",
                  border: "none",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>

              {/* Progress bar */}
              <div
                ref={progressRef}
                onMouseDown={handleBarDown}
                onTouchStart={handleBarDown}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: "rgba(255,255,255,0.15)",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "var(--m-purple)",
                    transition: "width 0.15s linear",
                  }}
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Steps */}
        <Reveal delay={200}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 8,
            }}
            className="pipeline-steps-grid"
          >
            {p.steps.map((step: { label: string; desc: string }, i: number) => (
              <button
                key={i}
                onClick={() => handleStepClick(i)}
                style={{
                  border: "1.5px solid",
                  borderColor:
                    activeChapter === i
                      ? "var(--m-purple)"
                      : "var(--m-line)",
                  borderRadius: 16,
                  padding: "20px 16px 16px",
                  background:
                    activeChapter === i
                      ? "var(--m-purple-soft)"
                      : "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition: "all 0.25s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  width: "100%",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 20,
                    fontWeight: 600,
                    color:
                      activeChapter === i
                        ? "var(--m-purple)"
                        : "var(--m-ink-3)",
                    lineHeight: 1,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color:
                      activeChapter === i
                        ? "var(--m-ink)"
                        : "var(--m-ink-2)",
                    lineHeight: 1.2,
                  }}
                >
                  {step.label}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--m-ink-3)",
                    lineHeight: 1.35,
                  }}
                >
                  {step.desc.length > 50
                    ? step.desc.slice(0, 50) + "..."
                    : step.desc}
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pipeline-steps-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .pipeline-steps-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
