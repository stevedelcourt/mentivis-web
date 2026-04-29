import { ReactNode } from "react";
import TopNav from "../TopNav";
import Footer from "../Footer";
import PreFooterCTA from "../PreFooterCTA";
import { useMessages } from "@/lib/messages";

export default function PageShell({ children, route = "", hidePreFooterCTA = false }: { children: ReactNode; route?: string; hidePreFooterCTA?: boolean }) {
  const { t, lang } = useMessages();
  return (
    <main className="page-shell">
      <TopNav t={t} lang={lang} route={route} />
      {children}
      {!hidePreFooterCTA && <PreFooterCTA t={t} lang={lang} />}
      <Footer t={t} lang={lang} />
    </main>
  );
}
