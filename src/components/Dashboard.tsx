import { useEffect, useState } from "react";

// Define an interface for the shape of the data returned from the API
interface DashboardData {
  user: string;
  metrics: {
    visitors: number;
    bounce: string;
    sessions: number;
  };
}

// Define the props for the Dashboard component
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
        </div>
      ) : (
        <p>Dashboard content not available.</p>
      )}
    </div>
  );
}
