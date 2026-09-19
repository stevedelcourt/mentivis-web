"use client";
import { useState, useEffect, useCallback } from "react";

export function useSearchParamsClient() {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Mark mounted after hydration to avoid SSR mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handler = () => setTick((n) => n + 1);
    window.addEventListener("popstate", handler);
    // Also handle pushState/replaceState triggered by our filters
    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.history.pushState as any) = function (...args: Parameters<typeof origPush>) {
      // @ts-expect-error - monkey patch for search params sync
      origPush.apply(this, args);
      setTick((n) => n + 1);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.history.replaceState as any) = function (...args: Parameters<typeof origReplace>) {
      // @ts-expect-error - monkey patch for search params sync
      origReplace.apply(this, args);
      setTick((n) => n + 1);
    };
    return () => {
      window.removeEventListener("popstate", handler);
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
    };
  }, []);

  const get = useCallback((key: string) => {
    if (!mounted || typeof window === "undefined") return "";
    const p = new URLSearchParams(window.location.search);
    p.delete("__nc");
    return p.get(key) || "";
  }, [mounted, tick]);

  return { get };
}
