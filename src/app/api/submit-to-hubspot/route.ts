import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "http://sc4bovu7233.universe.wf",
  "https://sc4bovu7233.universe.wf",
  "http://sc3bovu7233.universe.wf",
  "https://sc3bovu7233.universe.wf",
  "http://mentivis.com",
  "https://mentivis.com",
  "http://www.mentivis.com",
  "https://www.mentivis.com",
];

const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;

// In-memory rate limiter
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS) return false;
  record.count++;
  return true;
}

function getCorsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }
  return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin") || "";

  // CORS
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  // Auth
  const auth = request.headers.get("authorization");
  const token = process.env.INTERNAL_TOKEN;
  if (!token || auth !== `Bearer ${token}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Rate limit
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { formId, fields, context, honeypot } = body as {
    formId?: string;
    fields?: Record<string, unknown>;
    context?: { pageUri?: string; pageName?: string };
    honeypot?: string;
  };

  // Honeypot check
  if (honeypot) {
    return NextResponse.json(
      { success: true },
      { status: 200, headers: getCorsHeaders(origin) }
    );
  }

  if (!formId || !fields || typeof fields !== "object") {
    return new Response("Missing fields: formId, fields", { status: 400 });
  }

  if (!HUBSPOT_PORTAL_ID) {
    return NextResponse.json(
      { success: false, error: "HubSpot portal ID not configured" },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }

  // Relay to HubSpot
  const hsEndpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${formId}`;

  const hsPayload: any = {
    fields: Object.entries(fields).map(([name, value]) => ({
      name,
      value: String(value),
    })),
  };

  if (context?.pageUri) {
    hsPayload.context = {
      pageUri: context.pageUri,
      pageName: context.pageName || "",
    };
  }

  try {
    const hsResponse = await fetch(hsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hsPayload),
    });

    const hsData = await hsResponse.json().catch(() => ({}));

    if (!hsResponse.ok) {
      return NextResponse.json(
        { success: false, error: hsData.message || hsData.error || `HubSpot error ${hsResponse.status}` },
        { status: 502, headers: getCorsHeaders(origin) }
      );
    }

    return NextResponse.json(
      { success: true, hubspot: hsData },
      { status: 200, headers: getCorsHeaders(origin) }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "HubSpot request failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 502, headers: getCorsHeaders(origin) }
    );
  }
}
