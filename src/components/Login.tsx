import { useState } from "react";

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("Signing in...");
    
    try {
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
    } catch (e: unknown) {
      // Handle the 'unknown' type for the caught error
      if (e instanceof Error) {
        setMsg(`An error occurred: ${e.message}`);
      } else {
        setMsg("An unknown error occurred.");
      }
    }
  }

  return (
    <div>
      <h2>Sign in</h2>
      <form onSubmit={submit}>
        <label>Email</label><br />
        <input 
          value={email} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
          placeholder="you@example.com"
          required
          type="email"
        />
        <br />
        <label>Password</label><br />
        <input 
          value={pw} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPw(e.target.value)} 
          type="password" 
          required
        />
        <br />
        <button>Sign in</button>
      </form>
      <p>{msg}</p>
      <p>Or use "Forgot password" to request a reset link.</p>
    </div>
  );
}
