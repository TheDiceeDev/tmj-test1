import { useState } from "react";

export default function Forgot() {
  // Use a string type for the email and hint states
  const [email, setEmail] = useState<string>("");
  const [hint, setHint] = useState<string>("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHint("Requesting reset...");
    
    try {
      const res = await fetch("/api/forgot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      const j = await res.json();
      
      if (res.ok) {
        // NOTE: forgot endpoint returns a "reset token" in JSON for demo
        // In a real app tokens are emailed; here we intentionally store it in localStorage
        // localStorage.setItem("pixelytics_reset_token", j.resetToken);
        console.log('Your Reset Token is shown below');
        console.log('pixelytics_reset_token: ', j.resetToken);
        setHint("Reset requested. Check email (simulated). Reset tokens need to be stored in localStorage.");
      } else {
        setHint(j.error || "Error");
      }
    } catch (error) {
      setHint("Failed to connect to the server.");
    }
  }

  return (
    <div>
      <h2>Forgot password</h2>
      <form onSubmit={submit}>
        <input 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="you@example.com" 
        />
        <button>Request reset</button>
      </form>
      <p>{hint}</p>
      <p>Tip: tokens are stored locally in this demo (for learning purposes).</p>
    </div>
  );
}
