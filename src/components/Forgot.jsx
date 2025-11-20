import React, { useState } from "react";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [hint, setHint] = useState("");

  async function submit(e) {
    e.preventDefault();
    setHint("Requesting reset...");
    const res = await fetch("/api/forgot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email })
    });
    const j = await res.json();
    if (res.ok) {
      // NOTE: forgot endpoint returns a "reset token" in JSON for demo
      // In a real app tokens are emailed; here we intentionally store it in localStorage
      localStorage.setItem("pixelytics_reset_token", j.resetToken);
      setHint("Reset requested. Check email (simulated). Token stored in localStorage.");
    } else {
      setHint(j.error || "Error");
    }
  }

  return (
    <div>
      <h2>Forgot password</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <button>Request reset</button>
      </form>
      <p>{hint}</p>
      <p>Tip: tokens are stored locally in this demo (for learning purposes).</p>
    </div>
  );
}

