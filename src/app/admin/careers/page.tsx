"use client";

import { useEffect, useState } from "react";
import { JOB_TYPE_LABELS, type JobType } from "@/data/careers-meta";
import type { Job } from "@/data/careers";

const JOB_TYPES: JobType[] = ["cdi", "cdd", "freelance", "stage", "alternance"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CareersAdmin() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Job> | null>(null);
  const [status, setStatus] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/careers");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    const slug = editing.slug || slugify(editing.titleFr || "") || String(Date.now());
    const payload = { ...editing, slug };
    setStatus("Saving...");
    const res = await fetch("/api/careers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.ok) {
      setStatus("Saved ✓");
      setEditing(null);
      fetchJobs();
    } else {
      setStatus("Error: " + (data.error || "unknown"));
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this job?")) return;
    setStatus("Deleting...");
    const res = await fetch("/api/careers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    const data = await res.json();
    if (data.ok) {
      setStatus("Deleted ✓");
      fetchJobs();
    } else {
      setStatus("Error: " + (data.error || "unknown"));
    }
  };

  const startNew = () => {
    setEditing({
      slug: "",
      titleFr: "",
      titleEn: "",
      department: "",
      location: "",
      type: "cdi",
      remote: false,
      date: new Date().toISOString().split("T")[0],
      descriptionFr: "",
      descriptionEn: "",
    });
  };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Careers Admin</h1>
        <button onClick={startNew} style={{
          padding: "10px 20px", fontSize: 14, fontWeight: 600,
          background: "#000776", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
        }}>
          + New Job
        </button>
      </div>

      {status && (
        <div style={{ padding: "10px 16px", background: status.includes("Error") ? "#fef2f2" : "#f0fdf4", borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
          {status}
        </div>
      )}

      {editing && (
        <div style={{ background: "#f8f8f8", borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 20px" }}>{editing.slug ? "Edit Job" : "New Job"}</h2>

          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Title FR" value={editing.titleFr || ""} onChange={v => setEditing({ ...editing, titleFr: v })} />
              <Field label="Title EN" value={editing.titleEn || ""} onChange={v => setEditing({ ...editing, titleEn: v })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Field label="Department" value={editing.department || ""} onChange={v => setEditing({ ...editing, department: v })} />
              <Field label="Location" value={editing.location || ""} onChange={v => setEditing({ ...editing, location: v })} />
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#333" }}>Type</label>
                <select
                  value={editing.type || "cdi"}
                  onChange={e => setEditing({ ...editing, type: e.target.value as JobType })}
                  style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, fontFamily: "inherit" }}
                >
                  {JOB_TYPES.map(t => (
                    <option key={t} value={t}>{JOB_TYPE_LABELS[t]?.fr || t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Date" value={editing.date || ""} onChange={v => setEditing({ ...editing, date: v })} type="date" />
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 20 }}>
                <input
                  type="checkbox"
                  id="remote"
                  checked={editing.remote || false}
                  onChange={e => setEditing({ ...editing, remote: e.target.checked })}
                  style={{ width: 18, height: 18 }}
                />
                <label htmlFor="remote" style={{ fontSize: 14, fontWeight: 500 }}>Remote</label>
              </div>
            </div>
            {editing.slug && <Field label="Slug" value={editing.slug} onChange={v => setEditing({ ...editing, slug: v })} />}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#333" }}>Description FR</label>
                <textarea
                  value={editing.descriptionFr || ""}
                  onChange={e => setEditing({ ...editing, descriptionFr: e.target.value })}
                  rows={6}
                  style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, fontFamily: "inherit", resize: "vertical" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#333" }}>Description EN</label>
                <textarea
                  value={editing.descriptionEn || ""}
                  onChange={e => setEditing({ ...editing, descriptionEn: e.target.value })}
                  rows={6}
                  style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, fontFamily: "inherit", resize: "vertical" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button onClick={handleSave} style={{
              padding: "10px 24px", fontSize: 14, fontWeight: 600,
              background: "#000776", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
            }}>Save</button>
            <button onClick={() => setEditing(null)} style={{
              padding: "10px 24px", fontSize: 14, fontWeight: 500,
              background: "#eee", color: "#333", border: "none", borderRadius: 8, cursor: "pointer",
            }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: "#666", textAlign: "center", padding: 40 }}>Loading...</p>
      ) : jobs.length === 0 ? (
        <p style={{ color: "#666", textAlign: "center", padding: 40 }}>No jobs yet. Click &quot;+ New Job&quot; to create one.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {jobs.map(job => (
            <div key={job.slug} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
              padding: "16px 20px", background: "#fff", border: "1px solid #eee", borderRadius: 10,
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{job.titleFr}</div>
                <div style={{ fontSize: 13, color: "#666" }}>
                  {job.department} · {job.location} · {JOB_TYPE_LABELS[job.type]?.fr || job.type}
                  {job.remote ? " · Remote" : ""}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEditing({ ...job })} style={{
                  padding: "6px 14px", fontSize: 13, fontWeight: 500,
                  background: "#f0f0f0", color: "#333", border: "none", borderRadius: 6, cursor: "pointer",
                }}>Edit</button>
                <button onClick={() => handleDelete(job.slug)} style={{
                  padding: "6px 14px", fontSize: 13, fontWeight: 500,
                  background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 6, cursor: "pointer",
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#333" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, fontFamily: "inherit", boxSizing: "border-box" }}
      />
    </div>
  );
}
