import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  lang: string;
  variant?: "dark" | "light";
  width?: number;
  height?: number;
};

export default function Logo({ lang, variant = "dark", width = 120, height = 28 }: LogoProps) {
  const src = variant === "light" ? "/logo-noir.svg" : "/logo-noir.svg";
  return (
    <Link href={`/${lang}/`} className="m-logo" style={{ display: "inline-flex", alignItems: "center" }}>
      <Image src={src} alt="Mentivis" width={width} height={height} priority />
    </Link>
  );
}