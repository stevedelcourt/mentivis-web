import { ReactNode } from "react";
import TopNav from "../TopNav";
import Footer from "../Footer";
import { useMessages } from "@/lib/messages";

export default function PageShell({ children, route = "" }: { children: ReactNode; route?: string }) {
  const { t, lang } = useMessages();
  return (
    <main className="page-shell">
      <TopNav t={t} lang={lang} route={route} />
      {children}
      <Footer t={t} lang={lang} />
    </main>
  );
}
