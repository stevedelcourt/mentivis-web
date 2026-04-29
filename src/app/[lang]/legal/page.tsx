"use client";
import PageShell from "@/components/layout/PageShell";
import LegalPageLayout from "@/components/ui/LegalPageLayout";
import { useMessages } from "@/lib/messages";
import { encodeEntities } from "@/lib/utils";

export default function LegalPage() {
  const { lang } = useMessages();

  const content = lang === "fr" ? {
    title: "Mentions légales",
    date: "Dernière mise à jour : 27 avril 2026",
    sections: [
      {
        title: "Éditeur du site",
        body: `Mentivis SAS\nSociété par actions simplifiée au capital de dix mille euros\nSiège social : 60 rue François 1er, 75008 Paris\n941 914 814 R.C.S. Paris\nEmail : ${encodeEntities("contact@mentivis.com")}\nTéléphone : ${encodeEntities("+33 1 89 48 10 02")}`,
      },
      {
        title: "Directeur de la publication",
        body: "Le directeur de la publication est Steven Delcourt.",
      },
      {
        title: "Hébergement",
        body: `O2switch\nSiret : 510 909 807 00032\nRCS Clermont Ferrand\nSAS au capital de 100 000€`,
      },
      {
        title: "Propriété intellectuelle",
        body: "L'ensemble du contenu de ce site (textes, images, logos, arborescence) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.",
      },
      {
        title: "Limitation de responsabilité",
        body: "Les informations contenues sur ce site sont aussi précises que possible. Mentivis ne saurait être tenu responsable des omissions, erreurs ou inexactitudes dans les informations proposées.",
      },
    ],
  } : {
    title: "Legal Notice",
    date: "Last updated: April 27, 2026",
    sections: [
      {
        title: "Website publisher",
        body: `Mentivis SAS\nSimplified Joint Stock Company with capital of 10,000 euros\nHeadquarters: 60 rue François 1er, 75008 Paris\n941 914 814 R.C.S. Paris\nEmail: ${encodeEntities("contact@mentivis.com")}\nPhone: ${encodeEntities("+33 1 89 48 10 02")}`,
      },
      {
        title: "Publication director",
        body: "The publication director is Steven Delcourt.",
      },
      {
        title: "Hosting",
        body: `O2switch\nSiret: 510 909 807 00032\nRCS Clermont Ferrand\nSAS with capital of 100,000€`,
      },
      {
        title: "Intellectual property",
        body: "All content on this site (texts, images, logos, structure) is protected by copyright. Any reproduction, even partial, is prohibited without prior authorization.",
      },
      {
        title: "Limitation of liability",
        body: "The information on this site is as accurate as possible. Mentivis cannot be held responsible for omissions, errors, or inaccuracies in the information provided.",
      },
    ],
  };

  return (
    <PageShell>
      <LegalPageLayout title={content.title} date={content.date} sections={content.sections} />
    </PageShell>
  );
}
