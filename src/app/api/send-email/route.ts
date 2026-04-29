import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ALLOWED_ORIGINS = [
  "https://sc4bovu7233.universe.wf",
  "https://sc3bovu7233.universe.wf",
  "https://mentivis.com",
  "https://www.mentivis.com",
];

// In-memory rate limiter (per instance)
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

// Create SMTP transporter from env vars
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "noreply@mentivis.com";

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransporter({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    from,
  });
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

  const { to, subject, text, html } = body;
  if (!to || !subject || (!text && !html)) {
    return new Response("Missing fields: to, subject, text|html", { status: 400 });
  }

  // Check SMTP config
  const transporter = createTransporter();
  if (!transporter) {
    return NextResponse.json(
      {
        success: false,
        message: "SMTP not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to Vercel env vars.",
      },
      { headers: { "Access-Control-Allow-Origin": origin } }
    );
  }

  // Send email
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "Mentivis <noreply@mentivis.com>",
      to: to as string,
      subject: subject as string,
      text: text as string | undefined,
      html: html as string | undefined,
    });

    return NextResponse.json(
      {
        success: true,
        messageId: info.messageId,
      },
      { headers: { "Access-Control-Allow-Origin": origin } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: { "Access-Control-Allow-Origin": origin } }
    );
  }
}
