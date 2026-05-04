import Link from "next/link";
import Icon from "./Icon";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  icon?: boolean;
  target?: string;
  rel?: string;
};

export default function ButtonLink({ href, children, variant = "primary", icon = true, target, rel }: ButtonLinkProps) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 20px",
      fontSize: 14,
      fontWeight: 600,
      color: "white",
      background: "var(--m-purple)",
      borderRadius: 12,
      textDecoration: "none",
    },
    outline: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 20px",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--m-purple)",
      background: "transparent",
      border: "1.5px solid var(--m-purple)",
      borderRadius: 12,
      textDecoration: "none",
    },
    ghost: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 20px",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--m-purple)",
      background: "transparent",
      borderRadius: 12,
      textDecoration: "none",
    },
  };

  return (
    <Link href={href} target={target} rel={rel} style={styles[variant]}>
      {children}
      {icon && <Icon name="chevron_right" size={18} />}
    </Link>
  );
}
