"use client";

export function useSearchParamsClient() {
  const params = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

  return {
    get: (key: string) => params.get(key) || "",
  };
}
