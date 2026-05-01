import Link from "next/link";
import Image from "next/image";
import Icon from "./Icon";
import { SITE } from "@/lib/config";
import { encodeEntities } from "@/lib/utils";

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
        <p style={{ fontSize: 15, fontWeight: 500, color: "var(--m-ink)", margin: "0 0 8px", lineHeight: 1.35 }}>
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
        <div style={{ fontWeight: 500, fontSize: 18, color: "var(--m-ink)", marginBottom: 2 }}>Mathias Costes</div>
      </Link>
      <div style={{ fontSize: 13, color: "var(--m-ink-3)", marginBottom: 20 }}>Partner Mentivis</div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, fontSize: 14, color: "var(--m-ink-3)" }}>
        <Link href={`/${lang}/contact`} className="m-footer-link" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon name="mail" size={16} />
          <span dangerouslySetInnerHTML={{ __html: encodeEntities(SITE.email) }} />
        </Link>
        <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="m-footer-link" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon name="phone" size={16} />
          <span dangerouslySetInnerHTML={{ __html: encodeEntities(SITE.phone) }} />
        </a>
        <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="m-footer-link" style={{ display: "inline-flex", alignItems: "flex-start", gap: 8, lineHeight: 1.45 }}>
          <Icon name="location_on" size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span dangerouslySetInnerHTML={{ __html: encodeEntities(SITE.address) }} />
        </a>
      </div>
    </div>
  );
}
