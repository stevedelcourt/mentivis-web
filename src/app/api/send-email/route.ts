import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://sc4bovu7233.universe.wf",
  "https://sc3bovu7233.universe.wf",
  "https://mentivis.com",
  "https://www.mentivis.com",
];

// In-memory rate limiter (per instance — good enough for basic protection)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin") || "";

  // CORS check
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  // Auth check
  const auth = request.headers.get("authorization");
  const token = process.env.INTERNAL_TOKEN;
  if (!token || auth !== `Bearer ${token}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Rate limit (use X-Forwarded-For or fallback to a dummy key)
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

  const { to, subject, text, html } = body;

  if (!to || !subject || (!text && !html)) {
    return new Response("Missing fields: to, subject, text|html", { status: 400 });
  }

  // TODO: Wire up email provider (Resend, AWS SES, SendGrid, etc.)
  // For now, endpoint is ready but does not send actual emails.

  return NextResponse.json(
    {
      success: true,
      message: "Endpoint ready — email provider not yet configured",
      received: { to, subject, hasText: !!text, hasHtml: !!html },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": origin,
      },
    }
  );
}
