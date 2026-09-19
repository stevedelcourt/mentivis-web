"use client";
import { useState, useEffect, useCallback, useMemo } from "react";

export function useSearchParamsClient() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick(1);
    const handler = () => setTick((n) => n + 1);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const ready = tick > 0;

  const stableParams = useMemo(() => {
    if (!ready || typeof window === "undefined") return new URLSearchParams();
    const p = new URLSearchParams(window.location.search);
    p.delete("__nc");
    return p;
  }, [ready, tick]);

  const get = useCallback((key: string) => stableParams.get(key) || "", [stableParams]);

  return { get };
}
