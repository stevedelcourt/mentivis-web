"use client";

import { useState } from "react";
import InsightsAdmin from "./insights/page";
import CareersAdmin from "./careers/page";

export default function AdminDashboard() {
  const [tab, setTab] = useState<"insights" | "careers">("insights");

  return (
    <main style={{ minHeight: "100vh", background: "#f8f8f8" }}>
      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e5e5e5", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 56, position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="/admin" style={{ fontSize: 16, fontWeight: 700, color: "#000776", textDecoration: "none", fontFamily: "system-ui" }}>
            Mentivis CMS
          </a>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => setTab("insights")} style={{
              padding: "8px 16px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: "pointer",
              fontFamily: "system-ui",
              background: tab === "insights" ? "#000776" : "transparent",
              color: tab === "insights" ? "#fff" : "#666",
            }}>
              Articles
            </button>
            <button onClick={() => setTab("careers")} style={{
              padding: "8px 16px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: "pointer",
              fontFamily: "system-ui",
              background: tab === "careers" ? "#000776" : "transparent",
              color: tab === "careers" ? "#fff" : "#666",
            }}>
              Postes
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {tab === "insights" && <InsightsAdmin />}
        {tab === "careers" && <CareersAdmin />}
      </div>
    </main>
  );
}
