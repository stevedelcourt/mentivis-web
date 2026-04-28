"use client";

import { useCallback, useRef, useState } from "react";
import { HUBSPOT_PORTAL_ID, HUBSPOT_FORM_ID } from "@/lib/config";

type FieldMap = Record<string, string | number>;

function getHspt(): any {
  if (typeof window === "undefined") return null;
  return (window as any).hbspt;
}

function waitForHbspt(maxMs = 10000): Promise<any> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const h = getHspt();
      if (h) {
        resolve(h);
        return;
      }
      if (Date.now() - start > maxMs) {
        reject(new Error("HubSpot forms script not loaded"));
        return;
      }
      setTimeout(check, 200);
    };
    check();
  });
}

export function useHubSpotSubmit() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const submit = useCallback(async (fields: FieldMap) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const hbspt = await waitForHbspt();

      // Create hidden container if not exists
      let container = containerRef.current;
      if (!container) {
        container = document.createElement("div");
        container.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;z-index:-1;";
        document.body.appendChild(container);
        containerRef.current = container;
      }

      // Clear previous form
      container.innerHTML = "";

      await new Promise<void>((resolve, reject) => {
        hbspt.forms.create({
          portalId: HUBSPOT_PORTAL_ID,
          formId: HUBSPOT_FORM_ID,
          target: container,
          onFormReady: ($form: any) => {
            try {
              // Set field values
              Object.entries(fields).forEach(([key, value]) => {
                const input = $form.querySelector(`[name="${key}"]`);
                if (input) {
                  (input as HTMLInputElement).value = String(value);
                }
              });
              // Submit
              $form.submit();
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          onFormSubmitted: () => {
            resolve();
          },
          onFormSubmitError: () => {
            reject(new Error("HubSpot form submission failed"));
          },
        });
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, success, error };
}
