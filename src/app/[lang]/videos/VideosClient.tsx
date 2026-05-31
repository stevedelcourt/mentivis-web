"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import ImageHero from "@/components/ImageHero";
import Reveal from "@/components/Reveal";
import { useMessages } from "@/lib/messages";
import { useVideos } from "@/lib/videos";
import { SITE } from "@/lib/config";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/ui/Icon";

function getRatio(video: any) {
  if (video.aspectRatio) return video.aspectRatio;
  return "16 / 9";
}

function YouTubeEmbed({ video, title, isPlaying, onPlay }: {
  video: any; title: string; isPlaying: boolean; onPlay: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  const src = `https://www.youtube-nocookie.com/embed/${video.youtube}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3`;
  const ratio = getRatio(video);
  const showCover = !loaded || !isPlaying;

  const handleClick = useCallback(() => {
    if (!loaded) setLoaded(true);
    onPlay();
  }, [loaded, onPlay]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        borderRadius: "var(--r-lg)",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {loaded && isPlaying && (
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            border: "none",
            position: "absolute",
            inset: 0,
          }}
        />
      )}
      {showCover && (
        <div
          onClick={handleClick}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
          role="button"
          tabIndex={0}
          aria-label={`Play ${title}`}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            aspectRatio: ratio,
            cursor: "pointer",
          }}
        >
          <img
            src={`https://img.youtube.com/vi/${video.youtube}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              position: "absolute",
              inset: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              border: "1.5px solid rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M23 14L9 23.5L9 4.5L23 14Z" fill="white" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideosClient() {
  const { t, lang } = useMessages();
  const v = t.videosPage;
  const { data } = useVideos();
  const videos = data.videos || [];
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <PageShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: v.title,
            description: v.lead,
            url: `${SITE.baseUrl}/${lang}/videos`,
            publisher: { "@id": `${SITE.baseUrl}/#organization` },
            inLanguage: lang === "fr" ? "fr-FR" : "en-US",
          },
          ...videos.map((video: any) => ({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: video.title,
            description: video.description,
            thumbnailUrl: `https://img.youtube.com/vi/${video.youtube}/hqdefault.jpg`,
            embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtube}`,
            uploadDate: "2025-01-01",
          })),
        ]}
      />

       {/* Hero using ImageHero like /enterprise */}
       <ImageHero
         image="/images/heroes/video-open.avif"
         eyebrow={v.eyebrow}
         title={v.title}
         lead={v.lead}
       >
         <Link href={`/${lang}/contact?subject=Videos`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "white", background: "var(--m-purple)", borderRadius: 12, textDecoration: "none" }}>
           {v.contactCta}
           <Icon name="chevron_right" size={18} />
         </Link>
       </ImageHero>

      {/* Video Grid */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          {videos.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--m-ink-3)" }}>{v.noVideos}</p>
          ) : (
            <div className="videos-grid">
              <style>{`
                .videos-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 32px;
                }
                @media (max-width: 720px) {
                  .videos-grid { grid-template-columns: 1fr !important; }
                }
              `}</style>
              {videos.map((video, idx) => (
                <Reveal key={idx} delay={idx * 0.06}>
                  <div>
                    <YouTubeEmbed
                      video={video}
                      title={video.title}
                      isPlaying={playingId === video.youtube}
                      onPlay={() => setPlayingId(video.youtube ?? null)}
                    />
                    <div style={{ paddingTop: 16 }}>
                      <h3
                        style={{
                          fontSize: 17,
                          fontWeight: 600,
                          margin: "0 0 6px",
                          color: "var(--m-ink)",
                        }}
                      >
                        {video.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 14,
                          lineHeight: 1.5,
                          color: "var(--m-ink-3)",
                          margin: 0,
                        }}
                      >
                        {video.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
