"use client";

import { useCallback, useState } from "react";
import { HUBSPOT_PORTAL_ID, HUBSPOT_FORM_ID } from "@/lib/config";

type FieldMap = Record<string, string | number>;

const HUBSPOT_ENDPOINT = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

export function useHubSpotSubmit() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (fields: FieldMap, context?: { pageUri?: string; pageName?: string }) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const payload: any = {
        fields: Object.entries(fields).map(([name, value]) => ({ name, value: String(value) })),
      };

      if (context?.pageUri) {
        payload.context = { pageUri: context.pageUri, pageName: context.pageName || "" };
      }

      const response = await fetch(HUBSPOT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || `Erreur ${response.status}`);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, success, error };
}
