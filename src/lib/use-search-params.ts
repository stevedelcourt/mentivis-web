"use client";
import { useState, useEffect, useCallback } from "react";

export function useSearchParamsClient() {
  const [params, setParams] = useState<URLSearchParams>(new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""));

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
    const handler = () => setParams(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const get = useCallback((key: string) => params.get(key) || "", [params]);

  return { get };
}
