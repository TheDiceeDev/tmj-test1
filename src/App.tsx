import { useState, useEffect } from 'react'
import Login from "./components/Login";
import Forgot from "./components/Forgot";
import Dashboard from "./components/Dashboard";
import './App.css'

function App() {
  const [route, setRoute] = useState<"login" | "forgot" | "dashboard">("login")
  // Fix: Explicitly declare the state can be a string or null
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // If a session cookie exists the server would validate it on API calls
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>Pixelytics</h1>
        <nav>
          <button onClick={() => setRoute("login")}>Login</button>
          <button onClick={() => setRoute("forgot")}>Forgot</button>
          <button onClick={() => setRoute("dashboard")}>Dashboard</button>
        </nav>
      </header>

      <main>
        {route === "login" && <Login onLogin={(email) => { setUserEmail(email); setRoute("dashboard"); }} />}
        {route === "forgot" && <Forgot />}
        {route === "dashboard" && <Dashboard email={userEmail} />}
      </main>
    </div>
  )
}

export default App
