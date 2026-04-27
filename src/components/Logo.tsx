import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  variant?: "dark" | "light";
  width?: number;
  height?: number;
};

export default function Logo({ variant = "dark", width = 120, height = 28 }: LogoProps) {
  const src = variant === "light" ? "/logo-white.svg" : "/logo-noir.svg";
  return (
    <Link href="/" className="m-logo" style={{ display: "inline-flex", alignItems: "center" }}>
      <Image src={src} alt="Mentivis" width={width} height={height} priority />
    </Link>
  );
}