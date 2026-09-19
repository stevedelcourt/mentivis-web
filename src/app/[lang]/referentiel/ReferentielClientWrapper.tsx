"use client";
import dynamic from "next/dynamic";

const ReferentielClient = dynamic(() => import("./ReferentielClient"), { ssr: false });

export default function ReferentielClientWrapper() {
  return <ReferentielClient />;
}
