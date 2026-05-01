export const SITE = {
  name: "Mentivis",
  baseUrl: "https://www.mentivis.com",
  email: "contact@mentivis.com",
  phone: "+33 1 89 48 10 02",
  address: "60 Rue François 1er, 75008 Paris",
  mapsUrl: "https://maps.app.goo.gl/MbLN5V5JHMpLtqWz8",
  linkedin: "https://www.linkedin.com/company/mentivis/",
  instagram: "https://www.instagram.com/menti.vis/",
} as const;

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PM93CCQL";

export const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID || "49558612";
export const HUBSPOT_FORM_ID = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID || "71a2e6a5-1ebe-46ea-9cdf-fe793b95e935";
export const HUBSPOT_CAREERS_FORM_ID = process.env.NEXT_PUBLIC_HUBSPOT_CAREERS_FORM_ID || "78954872-9038-4a85-8420-ae295c46f90b";

export const LOCALES = ["fr", "en"] as const;
export const DEFAULT_LOCALE = "fr" as const;
