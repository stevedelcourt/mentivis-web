"use client";
import { useParams } from "next/navigation";

export default function MentivosWebsitePage() {
  const { lang } = useParams<{ lang: string }>();
  return (
    <iframe
      src={`https://mentivisos.vercel.app/${lang}/`}
      style={{ width: "100vw", height: "100vh", border: "none", position: "fixed", top: 0, left: 0 }}
      title="MentivisOS"
      referrerPolicy="unsafe-url"
    />
  );
}
