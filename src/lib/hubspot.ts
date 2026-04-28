"use client";

import { useCallback, useState } from "react";
import { HUBSPOT_PORTAL_ID, HUBSPOT_FORM_ID } from "@/lib/config";

type FieldMap = Record<string, string | number>;

function getHspt(): any {
  if (typeof window === "undefined") return null;
  return (window as any).hbspt;
}

function waitForHbspt(maxMs = 15000): Promise<any> {
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

  const submit = useCallback(async (fields: FieldMap) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const hbspt = await waitForHbspt();

      const id = "hs-form-" + Date.now();
      const container = document.createElement("div");
      container.id = id;
      container.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;visibility:hidden;pointer-events:none;z-index:-1;";
      document.body.appendChild(container);

      await new Promise<void>((resolve, reject) => {
        let resolved = false;
        const doResolve = () => {
          if (!resolved) { resolved = true; resolve(); }
        };
        const doReject = (reason?: string) => {
          if (!resolved) { resolved = true; reject(new Error(reason || "HubSpot form submission failed")); }
        };

        const timeout = setTimeout(() => doReject("HubSpot submission timed out"), 15000);

        hbspt.forms.create({
          region: "na1",
          portalId: HUBSPOT_PORTAL_ID,
          formId: HUBSPOT_FORM_ID,
          target: "#" + id,
          onFormReady: ($form: any) => {
            try {
              Object.entries(fields).forEach(([key, value]) => {
                const input = $form.querySelector(`[name="${key}"]`);
                if (input) {
                  (input as HTMLInputElement).value = String(value);
                }
              });

              // Trigger native submit so HubSpot's handler intercepts
              setTimeout(() => {
                try {
                  const submitBtn = $form.querySelector('input[type="submit"], button[type="submit"]');
                  if (submitBtn) {
                    (submitBtn as HTMLElement).click();
                  } else {
                    $form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
                  }
                } catch (err) {
                  clearTimeout(timeout);
                  doReject(String(err));
                }
              }, 200);
            } catch (err) {
              clearTimeout(timeout);
              doReject(String(err));
            }
          },
          onFormSubmitted: () => {
            clearTimeout(timeout);
            doResolve();
          },
          onFormSubmitError: (err: any) => {
            clearTimeout(timeout);
            doReject(err?.message || "HubSpot rejected the submission");
          },
        });
      });

      try { document.body.removeChild(container); } catch { /* ignore */ }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, success, error };
}
