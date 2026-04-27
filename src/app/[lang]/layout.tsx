import { ReactNode } from "react";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

export type Messages = typeof fr;

const AllMessages = { fr, en };

export function getMessages(lang: string): Messages {
  return AllMessages[lang as keyof typeof AllMessages] || AllMessages.fr;
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { lang } = await params;
  const messages = getMessages(lang);

  return (
    <html lang={lang}>
      <body>
        {children}
      </body>
    </html>
  );
}