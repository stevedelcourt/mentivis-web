"use client";
import { useState, useEffect } from "react";

export function useSearchParamsClient() {
  const [ready, setReady] = useState(false);
  const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
    setReady(true);

    const handler = () => {
      setParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  return {
    ready,
    get: (key: string) => params.get(key) || "",
  };
}
