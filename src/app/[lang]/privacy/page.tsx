"use client";
import PageShell from "@/components/layout/PageShell";
import LegalPageLayout from "@/components/ui/LegalPageLayout";
import { useMessages } from "@/lib/messages";

export default function PrivacyPage() {
  const { lang } = useMessages();

  const content = lang === "fr" ? {
    title: "Politique de confidentialité",
    date: "Dernière mise à jour : 27 avril 2026",
    sections: [
      {
        title: "Responsable du traitement",
        body: `Mentivis SAS\n60 rue François 1er, 75008 Paris\nEmail : contact@mentivis.com`,
      },
      {
        title: "Données collectées",
        body: "Nous collectons uniquement les données que vous nous transmettez volontairement via le formulaire de contact : nom, email, téléphone, et description de votre projet. Ces données sont utilisées pour répondre à votre demande.",
      },
      {
        title: "Cookies et suivi",
        body: "Nous utilisons Google Analytics pour mesurer l'audience du site. Les cookies _ga, _gid et _gat sont déposés avec votre consentement. Vous pouvez modifier vos préférences à tout moment via le bouton Cookies en bas de page.",
      },
      {
        title: "Durée de conservation",
        body: "Les données de contact sont conservées pendant 13 mois maximum. Les cookies analytics sont conservés pendant 13 mois.",
      },
      {
        title: "Vos droits",
        body: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Contactez-nous à contact@mentivis.com pour exercer ces droits.",
      },
    ],
  } : {
    title: "Privacy Policy",
    date: "Last updated: April 27, 2026",
    sections: [
      {
        title: "Data controller",
        body: `Mentivis SAS\n60 rue François 1er, 75008 Paris\nEmail: contact@mentivis.com`,
      },
      {
        title: "Data collected",
        body: "We only collect data that you voluntarily provide through the contact form: name, email, phone, and project description. This data is used to respond to your request.",
      },
      {
        title: "Cookies and tracking",
        body: "We use Google Analytics to measure site audience. The _ga, _gid and _gat cookies are placed with your consent. You can change your preferences at any time via the Cookies button at the bottom of the page.",
      },
      {
        title: "Retention period",
        body: "Contact data is kept for a maximum of 13 months. Analytics cookies are kept for 13 months.",
      },
      {
        title: "Your rights",
        body: "In accordance with the GDPR, you have the right to access, rectify, delete and port your data. Contact us at contact@mentivis.com to exercise these rights.",
      },
    ],
  };

  return (
    <PageShell>
      <LegalPageLayout title={content.title} date={content.date} sections={content.sections} />
    </PageShell>
  );
}
