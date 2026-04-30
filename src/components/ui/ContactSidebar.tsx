import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/config";

type ContactSidebarProps = {
  lang: string;
  eyebrow?: string;
  title?: string;
  showImage?: boolean;
};

export default function ContactSidebar({ lang, eyebrow, title, showImage = true }: ContactSidebarProps) {
  return (
    <div style={{ maxWidth: 260 }}>
      {title && (
        <p style={{ fontSize: 15, fontWeight: 700, color: "var(--m-ink)", margin: "0 0 8px", lineHeight: 1.35 }}>
          {title}
        </p>
      )}
      {eyebrow && (
        <p style={{ fontSize: 14, fontWeight: title ? 400 : 600, color: "var(--m-ink-2)", margin: "0 0 16px", lineHeight: 1.5 }}>
          {eyebrow}
        </p>
      )}
      {showImage && (
        <Link href={`/${lang}/meeting`} style={{ textDecoration: "none", display: "block" }}>
          <div style={{ aspectRatio: "1 / 1", borderRadius: 16, overflow: "hidden", marginBottom: 16, background: "var(--m-line-2)" }}>
            <Image
              src="/images/team/mathias.costes.avif"
              alt="Mathias Costes"
              width={320}
              height={320}
              style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }}
            />
          </div>
        </Link>
      )}
      <Link href={`/${lang}/meeting`} style={{ textDecoration: "none" }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: "var(--m-ink)", marginBottom: 2 }}>Mathias Costes</div>
      </Link>
      <div style={{ fontSize: 13, color: "var(--m-ink-3)", marginBottom: 20 }}>Partner Mentivis</div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, fontSize: 14, color: "var(--m-ink-3)" }}>
        <a href={`mailto:${SITE.email}`} className="m-footer-link" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>mail</span>
          {SITE.email}
        </a>
        <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="m-footer-link" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>phone</span>
          {SITE.phone}
        </a>
        <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 8, lineHeight: 1.45 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>location_on</span>
          {SITE.address}
        </span>
      </div>
    </div>
  );
}
