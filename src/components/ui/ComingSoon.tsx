import Reveal from "@/components/Reveal";
import { useMessages } from "@/lib/messages";

export default function ComingSoon() {
  const { lang } = useMessages();
  const title = lang === "fr" ? "Cette page arrive bientôt." : "Coming soon.";
  return (
    <Reveal>
      <p style={{ color: "var(--m-ink-3)", fontSize: 18 }}>{title}</p>
    </Reveal>
  );
}
