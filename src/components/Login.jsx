import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("Signing in...");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: pw })
    });
    const j = await res.json();
    if (res.ok) {
      setMsg("Welcome!");
      // server sets an HTTP-only cookie session; we just update UI state
      onLogin(email);
    } else {
      setMsg(j.error || "Login failed");
    }
  }

  return (
    <div>
      <h2>Sign in</h2>
      <form onSubmit={submit}>
        <label>Email</label><br />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <br />
        <label>Password</label><br />
        <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" />
        <br />
        <button>Sign in</button>
      </form>
      <p>{msg}</p>
      <p>Or use "Forgot password" to request a reset link.</p>
    </div>
  );
}
