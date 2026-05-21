import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { getJobBySlug, getJobSlugs } from "@/data/careers";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import JobDetailClient from "./JobDetailClient";
import { SITE } from "@/lib/config";

export function generateStaticParams() {
  const slugs = getJobSlugs();
  if (slugs.length === 0) return [
    { lang: "fr", slug: "_placeholder" },
    { lang: "en", slug: "_placeholder" },
  ];
  return slugs.flatMap((slug) => [
    { lang: "fr", slug },
    { lang: "en", slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Not Found" };
  const isFr = lang === "fr";
  return {
    title: isFr ? job.titleFr : job.titleEn,
    description: `${job.department} - ${job.location}`,
    ...localeAlternates(lang, `/careers/${slug}`),
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();
  const isFr = lang === "fr";
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: isFr ? job.titleFr : job.titleEn,
        description: isFr ? job.descriptionFr : job.descriptionEn,
        datePosted: job.date,
        employmentType: job.type.toUpperCase(),
        hiringOrganization: { "@type": "Organization", name: SITE.name, sameAs: SITE.baseUrl },
        jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: "60 Rue François 1er", addressLocality: "Paris", postalCode: "75008", addressCountry: "FR" } },
      }} />
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: isFr ? "Carrières" : "Careers", url: `https://www.mentivis.com/${lang}/careers/` },
        { name: isFr ? job.titleFr : job.titleEn },
      ]} />
      <JobDetailClient job={job} lang={lang} />
    </>
  );
}
