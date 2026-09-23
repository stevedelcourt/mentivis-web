import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import HomeClient from "./HomeClient";
import { SITE } from "@/lib/config";
import { getOgImage } from "@/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  const og = getOgImage("/", lang);
  return {
    title: isFr ? "Mentivis - Opérateur en formation à Paris" : "Mentivis - Training Operator in Paris",
    description: isFr
      ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
      : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
    openGraph: {
      title: isFr ? "Mentivis - Opérateur en formation à Paris" : "Mentivis - Training Operator in Paris",
      description: isFr
        ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
        : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
      url: `${SITE.baseUrl}/${lang}/`,
      images: [og],
      type: "website",
      locale: isFr ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: isFr ? "Mentivis - Opérateur en formation à Paris" : "Mentivis - Training Operator in Paris",
      description: isFr
        ? "Mentivis conçoit, structure et déploie des dispositifs de formation. Notre rémunération est alignée sur les résultats obtenus."
        : "Mentivis designs, structures and deploys training programs. Our compensation is aligned with the results we deliver.",
      images: [og.url],
    },
    ...localeAlternates(lang, "/"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  // FAQPage mirrors the visible homepage FAQ (src/messages/{fr,en}.json home.faq.items)
  // verbatim and in the same order — visible HTML is the source of truth.
  const faqQa: Array<[string, string]> = isFr
    ? [
        ["Êtes-vous un cabinet de conseil ?", "Oui. Mentivis est une boutique de conseil dédiée à la formation et à l'éducation. La différence se joue sur la suite : nous ne livrons pas seulement des slides, nous implémentons réellement, et nous restons jusqu'au terme de vos projets. C'est cette posture, conseil plus exécution, qui définit notre métier d'opérateur."],
        ["À qui s'adresse Mentivis ?", "Aux entreprises qui veulent faire de la formation un levier de performance (académie interne, dispositifs structurés, montée en compétences) et aux organismes de formation qui veulent se structurer, se mettre en conformité ou se développer. Du créateur d'OF au grand groupe, en France et à l'international."],
        ["Comment facturez-vous ?", "Une part fixe couvre la conception et l'exécution. Une part variable, indexée sur des KPI définis avec vous au cadrage, déclenche la rémunération complète. Si les résultats annoncés ne sont pas atteints, nous ne percevons pas l'intégralité de nos honoraires. Notre rentabilité dépend de la vôtre."],
        ["Combien de temps prend une mission ?", "De six semaines pour structurer un organisme de formation complet, à six ou neuf mois pour créer une académie interne ou une école de A à Z. Chaque mission a un périmètre ferme, des jalons et un point d'arrêt clair. Pas de prestations qui s'éternisent."],
        ["Pourquoi ne citez-vous pas vos clients sur le site ?", "Parce qu'ils ne le souhaitent pas. Création de structures concurrentielles, repositionnement stratégique, montage d'académies internes, transformation pédagogique : la grande majorité de nos missions sont confidentielles par nature. La discrétion n'est pas un argument marketing, c'est une condition contractuelle. Les références pertinentes s'échangent en direct, lors du premier rendez-vous."],
        ["Comment se passe un premier contact ?", "Un échange gratuit et sans engagement. Nous analysons votre besoin, validons la pertinence d'une intervention Mentivis et, si nous sommes alignés, formulons une proposition cadrée : périmètre, jalons, KPI, rémunération. Si nous ne sommes pas le bon partenaire pour votre projet, nous vous le disons."],
      ]
    : [
        ["Are you a consulting firm?", "Yes. Mentivis is a specialist firm focused on training and education. The difference shows up after the recommendation: we don't just deliver slides, we actually implement, and we stay until your project is complete. Advice plus execution is what makes us an operator, not a consultancy."],
        ["Who is Mentivis for?", "Companies that want to turn training into a real performance lever (internal academies, structured learning programs, upskilling) and training providers that need to structure, secure compliance, or grow. From founders launching a new training company to large corporations, in the US, France, and internationally."],
        ["How do you charge?", "A fixed portion covers design and execution. A variable portion, tied to KPIs defined with you upfront, unlocks the rest of our compensation. If the agreed results aren't met, we don't collect our full fee. Our profitability depends on yours."],
        ["How long does an engagement take?", "Six weeks to fully structure a training company. Six to nine months to build an internal academy or a school from the ground up. Every engagement has a fixed scope, clear milestones, and a defined endpoint. No projects that drag on."],
        ["Why don't you list your clients on the website?", "Because they don't want us to. Building competing structures, strategic repositioning, internal academy launches, pedagogical transformation: most of our work is confidential by nature. Discretion isn't a marketing line, it's a contractual obligation. Relevant references are shared in person, during the first meeting."],
        ["What does a first contact look like?", "A free, no-obligation conversation. We analyze your need, validate whether a Mentivis engagement makes sense, and, if we're aligned, deliver a clear proposal: scope, milestones, KPIs, fee structure. If we're not the right partner, we tell you."],
      ];
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE.baseUrl}/#organization`,
          name: SITE.name,
          url: SITE.baseUrl,
          logo: {
            "@type": "ImageObject",
            url: "https://mentivis.com/images/mentivis-logo-400x400.png",
            width: 512,
            height: 512,
          },
          sameAs: [SITE.linkedin, SITE.instagram, SITE.bluesky],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: SITE.phone,
            contactType: "customer service",
            email: SITE.email,
            availableLanguage: ["French", "English"],
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: "60 Rue François 1er",
            addressLocality: "Paris",
            postalCode: "75008",
            addressCountry: "FR",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: `${SITE.baseUrl}/fr/`,
          publisher: { "@id": `${SITE.baseUrl}/#organization` },
        },
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${SITE.baseUrl}/#localbusiness`,
          name: SITE.name,
          url: SITE.baseUrl,
          logo: {
            "@type": "ImageObject",
            url: "https://mentivis.com/images/mentivis-logo-400x400.png",
            width: 512,
            height: 512,
          },
          image: {
            "@type": "ImageObject",
            url: "https://mentivis.com/images/mentivis-logo-400x400.png",
            width: 512,
            height: 512,
          },
          telephone: SITE.phone,
          email: SITE.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: "60 Rue François 1er",
            addressLocality: "Paris",
            postalCode: "75008",
            addressCountry: "FR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 48.8698,
            longitude: 2.3070,
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
          sameAs: [SITE.linkedin, SITE.instagram, SITE.bluesky],
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqQa.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: {
              "@type": "Answer",
              text: a,
            },
          })),
        },
      ]} />
      <BreadcrumbJsonLd items={[
        { name: "Accueil", url: "https://mentivis.com/fr/" }
      ]} />
      <HomeClient />
    </>
  );
}
