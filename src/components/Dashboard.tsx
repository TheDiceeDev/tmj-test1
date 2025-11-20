import { useEffect, useState } from "react";

// The `any` type is used here specifically to allow for the intentional vulnerability
// where the data structure changes.
interface DashboardData {
  user: string;
  metrics: {
    visitors: number;
    bounce: string;
    sessions: number;
  };
  flag?: string; // The flag is intentionally optional
}

interface DashboardProps {
  email: string | null;
}

export default function Dashboard({ email }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    async function load() {
      setNote("Loading dashboard...");
      
      // Normal flow: fetch server-side data (requires session).
      // The serverless endpoint /api/dashboard will check for a valid session.
      const r = await fetch("/api/dashboard");
      
      if (r.ok) {
        const j: DashboardData = await r.json();
        setData(j);
        setNote("Loaded from server.");
        return;
      }

      // === INTENTIONAL VULNERABILITY ===
      // If the app finds a local reset token (set by the forgot-password flow)
      // it will render "preview" dashboard content locally without server auth.
      // This is the subtle client-side logic bug you should find.
      const token = localStorage.getItem("pixelytics_reset_token");
      if (token) {
        setNote("No server session; found local reset token, rendering local preview.");
        
        console.log("Found insecurely stored reset token in localStorage:", token);
        
        // local preview data (flag included)
        setData({
          user: email || "admin@pixelytics.test",
          metrics: { visitors: 313, bounce: "32%", sessions: 512 },
          flag: "FLAG{tmjustic3_t3st_1_flag}"
        });
      } else {
        setNote("Not authenticated. Please sign in.");
      }
    }

    load();
  }, [email]);

  useEffect(() => {
    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
    }
  }, [data]);

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
        </div>
      ) : (
        <p>Dashboard content not available.</p>
      )}
    </div>
  );
}
