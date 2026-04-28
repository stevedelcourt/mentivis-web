import { useParams } from "next/navigation";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

export type Messages = typeof fr;

const allMessages: Record<string, Messages> = { fr, en };

export function getMessages(lang: string): Messages {
  return allMessages[lang] || allMessages.fr;
}

export function useLang(): string {
  const params = useParams();
  return (params?.lang as string) || "fr";
}

export function useMessages(): { t: Messages; lang: string } {
  const lang = useLang();
  return { t: getMessages(lang), lang };
}
