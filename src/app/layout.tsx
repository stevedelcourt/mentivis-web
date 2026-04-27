import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mentivis — Opérateur en formation et développement des compétences",
  description: "Mentivis conçoit, structure et déploie des dispositifs de formation. Rémunération alignée sur les résultats.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}