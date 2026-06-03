"use client";
import { useState, useEffect, useCallback } from "react";

export function useSearchParamsClient() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick(1);
    const handler = () => setTick((n) => n + 1);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const ready = tick > 0;

  const params = ready && typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

  const get = useCallback((key: string) => params.get(key) || "", [params]);

  return { get };
}
