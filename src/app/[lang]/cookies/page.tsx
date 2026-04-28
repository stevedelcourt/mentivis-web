"use client";
import PageShell from "@/components/layout/PageShell";
import LegalPageLayout from "@/components/ui/LegalPageLayout";
import { useMessages } from "@/lib/messages";

export default function CookiesPage() {
  const { lang } = useMessages();

  const content = lang === "fr" ? {
    title: "Politique de cookies",
    date: "Dernière mise à jour : 27 avril 2026",
    sections: [
      {
        title: "Qu'est-ce qu'un cookie ?",
        body: "Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site web. Il permet de stocker des informations relatives à votre navigation.",
      },
      {
        title: "Cookies utilisés sur ce site",
        body: "Cookies nécessaires : essentiels au fonctionnement du site.\n\nCookies analytiques : Google Analytics (_ga, _gid, _gat) permettent de mesurer l'audience et d'améliorer le site. Ils ne sont déposés qu'avec votre consentement.",
      },
      {
        title: "Durée de conservation",
        body: "Les cookies nécessaires sont conservés pendant la durée de votre session. Les cookies analytics sont conservés pendant 13 mois maximum.",
      },
      {
        title: "Comment gérer vos préférences",
        body: "Vous pouvez modifier vos préférences à tout moment en cliquant sur le bouton Cookies en bas de page, ou via les paramètres de votre navigateur.",
      },
    ],
  } : {
    title: "Cookie Policy",
    date: "Last updated: April 27, 2026",
    sections: [
      {
        title: "What is a cookie?",
        body: "A cookie is a small text file placed on your device when you visit a website. It stores information related to your browsing.",
      },
      {
        title: "Cookies used on this site",
        body: "Necessary cookies: essential for the site to function.\n\nAnalytics cookies: Google Analytics (_ga, _gid, _gat) allow us to measure audience and improve the site. They are only placed with your consent.",
      },
      {
        title: "Retention period",
        body: "Necessary cookies are kept for the duration of your session. Analytics cookies are kept for a maximum of 13 months.",
      },
      {
        title: "How to manage your preferences",
        body: "You can change your preferences at any time by clicking the Cookies button at the bottom of the page, or via your browser settings.",
      },
    ],
  };

  return (
    <PageShell>
      <LegalPageLayout title={content.title} date={content.date} sections={content.sections} />
    </PageShell>
  );
}
