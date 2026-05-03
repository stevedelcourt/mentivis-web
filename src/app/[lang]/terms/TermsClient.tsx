"use client";
import PageShell from "@/components/layout/PageShell";
import LegalPageLayout from "@/components/ui/LegalPageLayout";
import { useMessages } from "@/lib/messages";

export default function TermsClient() {
  const { lang } = useMessages();

  const content = lang === "fr" ? {
    title: "Conditions générales d'utilisation",
    date: "Dernière mise à jour : 27 avril 2026",
    sections: [
      {
        title: "Objet",
        body: "Les présentes conditions régissent l'accès et l'utilisation du site mentivis.com. En accédant au site, vous acceptez ces conditions.",
      },
      {
        title: "Propriété intellectuelle",
        body: "Tous les éléments du site sont la propriété exclusive de Mentivis SAS. Toute reproduction, représentation ou diffusion, intégrale ou partielle, est interdite sans autorisation préalable.",
      },
      {
        title: "Responsabilité",
        body: "Mentivis s'efforce d'assurer l'exactitude des informations publiées sur le site. Cependant, elle ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées.",
      },
      {
        title: "Liens externes",
        body: "Le site peut contenir des liens vers des sites tiers. Mentivis n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
      },
      {
        title: "Droit applicable",
        body: "Les présentes conditions sont soumises au droit français. En cas de litige, les tribunaux compétents seront ceux du ressort de la Cour d'appel de Paris.",
      },
    ],
  } : {
    title: "Terms of Use",
    date: "Last updated: April 27, 2026",
    sections: [
      {
        title: "Purpose",
        body: "These terms govern access to and use of the mentivis.com website. By accessing the site, you accept these terms.",
      },
      {
        title: "Intellectual property",
        body: "All elements of the site are the exclusive property of Mentivis SAS. Any reproduction, representation or distribution, in whole or in part, is prohibited without prior authorization.",
      },
      {
        title: "Liability",
        body: "Mentivis strives to ensure the accuracy of information published on the site. However, it cannot guarantee the accuracy, completeness or timeliness of the information disseminated.",
      },
      {
        title: "External links",
        body: "The site may contain links to third-party sites. Mentivis exercises no control over these sites and declines all responsibility for their content.",
      },
      {
        title: "Applicable law",
        body: "These terms are governed by French law. In the event of a dispute, the competent courts shall be those within the jurisdiction of the Paris Court of Appeal.",
      },
    ],
  };

  return (
    <PageShell>
      <LegalPageLayout title={content.title} date={content.date} sections={content.sections} />
    </PageShell>
  );
}
