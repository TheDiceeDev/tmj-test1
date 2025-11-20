
import React, { useEffect, useState } from "react";

export default function Dashboard({ email }) {
  const [data, setData] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    async function load() {
      setNote("Loading dashboard...");
      // Normal flow: fetch server-side data (requires session).
      // The serverless endpoint /api/dashboard will check for a valid session.
      const r = await fetch("/api/dashboard");
      if (r.ok) {
        const j = await r.json();
        setData(j);
        setNote("Loaded from server.");
        return;
      }

      // === INTENTIONAL VULNERABILITY ===
      // If the app finds a local reset token (set by the forgot-password flow)
      // it will render "preview" dashboard content locally without server auth.
      // This is the subtle client-side logic bug students should find.
      const token = localStorage.getItem("pixelytics_reset_token");
      if (token) {
        setNote("No server session; found local reset token — rendering local preview.");
        // local preview data (flag included)
        setData({
          user: email || "anon@pixelytics.test",
          metrics: { visitors: 313, bounce: "32%", sessions: 512 },
          flag: "FLAG{pixelytics_dashboard_access}"
        });
      } else {
        setNote("Not authenticated. Please sign in.");
      }
    }

    load();
  }, [email]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{note}</p>
      {data ? (
        <div>
          <h3>Welcome, {data.user}</h3>
          <p>Visitors: {data.metrics.visitors}</p>
          <p>Bounce rate: {data.metrics.bounce}</p>
          <p>Sessions: {data.metrics.sessions}</p>

          {/* The flag is shown after dashboard access */}
          <div style={{marginTop:12}}>
            <strong>Secret:</strong><div className="flag">{data.flag}</div>
          </div>
        </div>
      ) : (
        <p>Dashboard content not available.</p>
      )}
    </div>
  );
}
