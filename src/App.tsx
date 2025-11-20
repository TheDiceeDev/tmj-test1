import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [route, setRoute] = useState("login")
  const [userEmail, setUserEmail] = useState(null)

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
