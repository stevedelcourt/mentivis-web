"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import ImageHero from "@/components/ImageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import Reveal from "@/components/Reveal";
import { useMessages } from "@/lib/messages";
import { useVideos } from "@/lib/videos";
import { SITE } from "@/lib/config";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/ui/Icon";

export default function VideosClient() {
  const { t, lang } = useMessages();
  const v = t.videosPage;
  const { data } = useVideos();
  const videos = data.videos || [];
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const handlePlay = (e: Event) => {
      const current = e.target as HTMLVideoElement;
      videoRefs.current.forEach((video) => {
        if (video && video !== current) {
          video.pause();
        }
      });
    };

    videoRefs.current.forEach((video) => {
      if (video) {
        video.addEventListener("play", handlePlay);
      }
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.removeEventListener("play", handlePlay);
        }
      });
    };
  }, [videos]);

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
            thumbnailUrl: video.poster ? `${SITE.baseUrl}/${video.poster}` : undefined,
            contentUrl: video.filepath ? `${SITE.baseUrl}/${video.filepath}` : undefined,
            embedUrl: video.youtube ? `https://www.youtube-nocookie.com/embed/${video.youtube}` : undefined,
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
                .video-wrap video::-webkit-media-controls {
                  opacity: 0;
                  transition: opacity 0.35s ease;
                }
                .video-wrap:hover video::-webkit-media-controls {
                  opacity: 1;
                }
                .video-wrap video::-webkit-media-controls-start-playback-button,
                .video-wrap video::-webkit-media-controls-overlay-play-button {
                  display: none !important;
                }
              `}</style>
              {videos.map((video, idx) => (
                <Reveal key={idx} delay={idx * 0.06}>
                  <div>
                    <div className="video-wrap">
                      {video.youtube ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${video.youtube}?modestbranding=1&rel=0&iv_load_policy=3`}
                          title={video.title}
                          name={`youtube-${video.youtube}`}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          sandbox="allow-scripts allow-same-origin allow-presentation"
                          style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            aspectRatio: "16 / 9",
                            border: "none",
                            borderRadius: "var(--r-lg)",
                          }}
                        />
                      ) : (
                        <video
                          ref={(el) => { videoRefs.current[idx] = el; }}
                          controls
                          poster={video.poster ? `/${video.poster}` : undefined}
                          preload="metadata"
                          style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            aspectRatio: "16 / 9",
                            objectFit: "contain",
                            background: "#fff",
                            borderRadius: "var(--r-lg)",
                          }}
                        >
                          <source src={`/${video.filepath}`} type="video/mp4" />
                        </video>
                      )}
                    </div>
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
