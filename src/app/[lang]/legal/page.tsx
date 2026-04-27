"use client";
import { useParams } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

const messages: Record<string, typeof fr> = { fr, en };

export default function LegalPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "fr";
  const t = messages[lang] || messages.fr;

  const content = lang === "fr" ? {
    mentions: {
      title: "Mentions légales",
      date: "Dernière mise à jour : 27 avril 2026",
      sections: [
        {
          title: "Éditeur du site",
          content: `Mentivis est un operador especializado en formación y desarrollo de competencias.
Dirección: Paris, Francia
Email: contact@mentivis.com
Teléfono: +33 1 89 48 10 02`
        },
        {
          title: "Directeur de la publication",
          content: "Le directeur de la publication est Steven Delcourt."
        },
        {
          title: "Hébergement",
          content: "Le site est hébergé par Vercel Inc., 340 S Lemon Ave #8290, Walnut, CA 91789, États-Unis."
        },
        {
          title: "Propriété intellectuelle",
          content: "L'ensemble du contenu de ce site (textes, images, logos, arborescence) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable."
        },
        {
          title: "Limitation de responsabilité",
          content: "Les informations contenues sur ce site sont aussi précises que possible. Mentivis ne saurait être tenu responsable des omissions, erreurs ou inexactitudes dans les informations proposées."
        },
      ]
    },
    confidentialite: {
      title: "Politique de confidentialité",
      date: "Dernière mise à jour : 27 avril 2026",
      sections: [
        {
          title: "Responsable du traitement",
          content: "Mentivis, représenté par Steven Delcourt, est responsable du traitement de vos données personnelles."
        },
        {
          title: "Données collectées",
          content: "Nous collectons uniquement les données que vous nous transmettez via notre formulaire de contact : nom, email, téléphone (optionnel) et message. Ces données ne sont utilisées que pour répondre à vos demandes."
        },
        {
          title: "Base légale",
          content: "Le traitement de vos données repose sur votre consentement, que vous donnez en remplissant le formulaire de contact."
        },
        {
          title: "Conservation des données",
          content: "Vos données sont conservées pendant une durée maximale de 3 ans à compter du dernier contact."
        },
        {
          title: "Vos droits",
          content: "Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits, contactez-nous à contact@mentivis.com."
        },
        {
          title: "Cookies",
          content: "Notre site utilise des cookies analytiques (Google Analytics) uniquement avec votre consentement. Vous pouvez à tout moment modifier vos préférences via notre gestionnaire de cookies."
        },
      ]
    },
    cgu: {
      title: "Conditions Générales d'Utilisation",
      date: "Dernière mise à jour : 27 avril 2026",
      sections: [
        {
          title: "Objet",
          content: "Les présentes CGU ont pour objet de définir les conditions d'utilisation du site Mentivis."
        },
        {
          title: "Acceptation",
          content: "En naviguant sur ce site, vous acceptez pleinement les présentes conditions d'utilisation."
        },
        {
          title: "Services",
          content: "Mentivis propose des services de conception, structuration et déploiement de dispositifs de formation. Les informations présentées sur le site ne constituent pas une offre contractuelle."
        },
        {
          title: "Limitation de responsabilité",
          content: "Mentivis ne peut être tenu responsable des dommages résultant de l'utilisation du site ou de l'impossibilité d'y accéder."
        },
        {
          title: "Droit applicable",
          content: "Les présentes CGU sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents."
        },
      ]
    },
    cookies: {
      title: "Politique de cookies",
      date: "Dernière mise à jour : 27 avril 2026",
      sections: [
        {
          title: "Qu'est-ce qu'un cookie ?",
          content: "Un cookie est un petit fichier texte déposé sur votre ordinateur lors de votre visite sur un site web. Il permet de mémoriser des informations relatives à votre navigation."
        },
        {
          title: "Cookies utilisés",
          content: "Notre site utilise Google Analytics pour mesurer l'audience. Ces cookies analytiques ne sont activés qu'après votre consentement."
        },
        {
          title: "Gestion des cookies",
          content: "Vous pouvez à tout moment modifier vos préférences en matière de cookies via le lien 'Cookies' en bas de page ou en cliquant sur le bouton de gestion des préférences présent sur notre bandeau cookie."
        },
        {
          title: "Durée de conservation",
          content: "Les cookies déposés ont une durée de validité de 13 mois maximum. Au-delà, votre consentement sera à nouveau demandé."
        },
      ]
    }
  } : {
    mentions: {
      title: "Legal Notice",
      date: "Last updated: April 27, 2026",
      sections: [
        {
          title: "Website publisher",
          content: `Mentivis is a specialized operator in training and skills development.
Address: Paris, France
Email: contact@mentivis.com
Phone: +33 1 89 48 10 02`
        },
        {
          title: "Publication director",
          content: "The publication director is Steven Delcourt."
        },
        {
          title: "Hosting",
          content: "The site is hosted by Vercel Inc., 340 S Lemon Ave #8290, Walnut, CA 91789, United States."
        },
        {
          title: "Intellectual property",
          content: "All content on this site (texts, images, logos, structure) is protected by copyright. Any reproduction, even partial, is prohibited without prior authorization."
        },
        {
          title: "Limitation of liability",
          content: "The information on this site is as accurate as possible. Mentivis cannot be held responsible for omissions, errors, or inaccuracies in the information provided."
        },
      ]
    },
    confidentialite: {
      title: "Privacy Policy",
      date: "Last updated: April 27, 2026",
      sections: [
        {
          title: "Data controller",
          content: "Mentivis, represented by Steven Delcourt, is responsible for processing your personal data."
        },
        {
          title: "Data collected",
          content: "We only collect data that you send us via our contact form: name, email, phone (optional), and message. This data is only used to respond to your requests."
        },
        {
          title: "Legal basis",
          content: "The processing of your data is based on your consent, given by filling out the contact form."
        },
        {
          title: "Data retention",
          content: "Your data is retained for a maximum period of 3 years from the last contact."
        },
        {
          title: "Your rights",
          content: "Under GDPR, you have the rights to access, rectify, erase, and port your data. To exercise these rights, contact us at contact@mentivis.com."
        },
        {
          title: "Cookies",
          content: "Our site uses analytical cookies (Google Analytics) only with your consent. You can modify your preferences at any time via our cookie manager."
        },
      ]
    },
    cgu: {
      title: "Terms of Service",
      date: "Last updated: April 27, 2026",
      sections: [
        {
          title: "Purpose",
          content: "These Terms of Service define the conditions for using the Mentivis website."
        },
        {
          title: "Acceptance",
          content: "By browsing this site, you fully accept these terms of use."
        },
        {
          title: "Services",
          content: "Mentivis offers services for designing, structuring, and deploying training programs. The information presented on the site does not constitute a contractual offer."
        },
        {
          title: "Limitation of liability",
          content: "Mentivis cannot be held responsible for damages resulting from the use of the site or the inability to access it."
        },
        {
          title: "Applicable law",
          content: "These Terms of Service are governed by French law. In case of dispute, French courts shall have exclusive jurisdiction."
        },
      ]
    },
    cookies: {
      title: "Cookie Policy",
      date: "Last updated: April 27, 2026",
      sections: [
        {
          title: "What is a cookie?",
          content: "A cookie is a small text file placed on your computer when visiting a website. It allows the storage of information related to your browsing."
        },
        {
          title: "Cookies used",
          content: "Our site uses Google Analytics to measure audience. These analytical cookies are only activated after your consent."
        },
        {
          title: "Cookie management",
          content: "You can modify your cookie preferences at any time via the 'Cookies' link at the bottom of the page or by clicking the preference management button on our cookie banner."
        },
        {
          title: "Retention period",
          content: "Placed cookies have a maximum validity period of 13 months. After this period, your consent will be requested again."
        },
      ]
    }
  };

  return (
    <main className="page-shell">
      <TopNav t={t as any} lang={lang} setLang={() => {}} route="" />
      <section style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <Reveal>
            <h1 className="t-display" style={{ fontSize: "clamp(36px, 5vw, 56px)", margin: "0 0 16px" }}>
              {lang === "fr" ? "Informations légales" : "Legal Information"}
            </h1>
            <p style={{ color: "var(--m-ink-3)", fontSize: 14, marginBottom: 48 }}>{content.mentions.date}</p>
          </Reveal>

          {content.mentions.sections.map((section, i) => (
            <Reveal key={i} delay={i * 50}>
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
                  {section.title}
                </h2>
                <p style={{ color: "var(--m-ink-2)", fontSize: 16, lineHeight: 1.6, whiteSpace: "pre-line", margin: 0 }}>
                  {section.content}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <Footer t={t as any} lang={lang} />
    </main>
  );
}