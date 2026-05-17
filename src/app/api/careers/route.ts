import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "careers");
const TS_FILE = path.join(process.cwd(), "src", "data", "careers.ts");

const TECH_FIELDS = ["slug", "titleFr", "titleEn", "department", "location", "type", "remote", "date"];

function checkDev() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Admin API is disabled in production" },
      { status: 403 }
    );
  }
  return null;
}

function readAllJobs(): any[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json") && !f.endsWith(".tech.json"))
    .sort();
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
    return JSON.parse(raw);
  });
}

function writeJob(job: any) {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  const filePath = path.join(CONTENT_DIR, `${job.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(job, null, 2), "utf-8");
}

function deleteJob(slug: string) {
  const jsonPath = path.join(CONTENT_DIR, `${slug}.json`);
  if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
  const txtPath = path.join(CONTENT_DIR, `${slug}.txt`);
  const techPath = path.join(CONTENT_DIR, `${slug}.tech.json`);
  if (fs.existsSync(txtPath)) fs.unlinkSync(txtPath);
  if (fs.existsSync(techPath)) fs.unlinkSync(techPath);
}

function syncJobToTxt(slug: string) {
  const jsonPath = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(jsonPath)) return;
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  const tech: any = {};
  TECH_FIELDS.forEach((f) => {
    if (f in data) tech[f] = data[f];
  });
  fs.writeFileSync(
    path.join(CONTENT_DIR, `${slug}.tech.json`),
    JSON.stringify(tech, null, 2) + "\n",
    "utf-8"
  );

  const text: string[] = [];
  text.push("# metadata");
  text.push(`titleFr: ${data.titleFr || ""}`);
  text.push(`titleEn: ${data.titleEn || ""}`);
  text.push("");
  text.push("# descriptionFr");
  if (data.descriptionFr) {
    data.descriptionFr.split("\n\n").forEach((p: string, i: number) => {
      if (i > 0) text.push("///");
      text.push(p.trim());
    });
  }
  text.push("");
  text.push("# descriptionEn");
  if (data.descriptionEn) {
    data.descriptionEn.split("\n\n").forEach((p: string, i: number) => {
      if (i > 0) text.push("///");
      text.push(p.trim());
    });
  }
  fs.writeFileSync(path.join(CONTENT_DIR, `${slug}.txt`), text.join("\n"), "utf-8");
}

function updateTsImports(jobs: any[]) {
  const tsContent = fs.readFileSync(TS_FILE, "utf-8");

  if (jobs.length === 0) {
    const newContent = tsContent.replace(
      /export const CAREERS: Job\[\] = \[[\s\S]*?\];/,
      "export const CAREERS: Job[] = [] as Job[];"
    );
    fs.writeFileSync(TS_FILE, newContent, "utf-8");
    return;
  }

  const imports = jobs
    .map((a, i) => `import job${i + 1} from "../content/careers/${a.slug}.json";`)
    .join("\n");

  const names = jobs.map((_, i) => `job${i + 1}`).join(", ");
  const arrayBlock = `export const CAREERS: Job[] = [\n  ${names},\n] as Job[];`;

  const sectionStart = tsContent.indexOf("import type { JobMeta");
  const arrayStart = tsContent.indexOf("export const CAREERS:");

  const newContent =
    tsContent.substring(0, sectionStart) +
    "import type { JobMeta, JobType } from \"./careers-meta\";\n\n" +
    "export type { JobType } from \"./careers-meta\";\n" +
    "export { JOB_TYPE_LABELS } from \"./careers-meta\";\n\n" +
    `export interface Job extends JobMeta {\n  descriptionFr: string;\n  descriptionEn: string;\n}\n\n` +
    imports +
    "\n\n" +
    arrayBlock +
    "\n\n" +
    tsContent.substring(tsContent.indexOf("export function getJobBySlug"));

  fs.writeFileSync(TS_FILE, newContent, "utf-8");
}

export async function GET() {
  const err = checkDev();
  if (err) return err;
  try {
    return NextResponse.json({ jobs: readAllJobs() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const err = checkDev();
  if (err) return err;
  try {
    const body = await req.json();
    const isNew = !fs.existsSync(path.join(CONTENT_DIR, `${body.slug}.json`));
    writeJob(body);
    syncJobToTxt(body.slug);

    if (isNew) {
      const all = readAllJobs();
      updateTsImports(all);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const err = checkDev();
  if (err) return err;
  try {
    const { slug } = await req.json();
    deleteJob(slug);
    const all = readAllJobs();
    updateTsImports(all);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
