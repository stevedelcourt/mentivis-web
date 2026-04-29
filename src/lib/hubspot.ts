"use client";

import { useCallback, useState } from "react";
import { HUBSPOT_FORM_ID, HUBSPOT_CAREERS_FORM_ID } from "@/lib/config";

type FieldMap = Record<string, string | number>;

const API_BASE = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : typeof window !== "undefined"
    ? window.location.origin
    : "";

export function useHubSpotSubmit(formId?: string) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetFormId = formId || HUBSPOT_FORM_ID;
  // Token is public by design (client must send it to Vercel API).
  // The API is protected by CORS + rate limiting + hidden Vercel domain.
  const token = "a7f3c9e2d1b80456fe12a89c34d7e50b6f21a9c8e7d34b502a1f6c89d3e7b450";

  const submit = useCallback(
    async (
      fields: FieldMap,
      context?: { pageUri?: string; pageName?: string },
      honeypot?: string
    ) => {
      setLoading(true);
      setSuccess(false);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/api/submit-to-hubspot`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            formId: targetFormId,
            fields,
            context,
            honeypot,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || `Erreur ${response.status}`);
        }

        setSuccess(true);
        return true;
      } catch (err: any) {
        setError(err?.message || "Submission failed");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [targetFormId, token]
  );

  return { submit, loading, success, error };
}

export { HUBSPOT_FORM_ID, HUBSPOT_CAREERS_FORM_ID };
