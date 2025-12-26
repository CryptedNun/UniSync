import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import RequestsActivities from "./pages/RequestsActivities";
import Notices from "./pages/Notices";
import MyReminders from "./pages/MyReminders";
import MyTeams from "./pages/MyTeams";
import AddReminder from "./pages/AddReminder";
import "./App.css";

function App() {
  const currentUser = { id: 1, name: "Hasan" };
  const [reminders, setReminders] = useState([]);

  // Load reminders from backend (fallback to localStorage)
  useEffect(() => {
    let mounted = true
    fetch("http://localhost:3000/api/reminders/")
      .then((r) => {
        if (!r.ok) throw new Error("no-api")
        return r.json()
      })
      .then((data) => {
        if (mounted && Array.isArray(data)) setReminders(data)
      })
      .catch(() => {
        const raw = localStorage.getItem("reminders")
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            if (mounted && Array.isArray(parsed)) setReminders(parsed)
          } catch (e) {
            console.error("Failed to parse reminders from localStorage", e)
          }
        }
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("reminders", JSON.stringify(reminders))
    } catch (e) {
      console.error("Failed to save reminders", e)
    }
  }, [reminders])

  const addReminder = (reminder) => {
    setReminders((prev) => [...prev, reminder])
    fetch("http://localhost:3000/api/reminders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reminder),
    }).catch((err) => console.warn("Failed to save to backend", err))
  }

  const deleteReminder = (id) => {
    // Optimistic UI update
    setReminders((prev) => prev.filter((r) => String(r.id) !== String(id)))
    fetch(`http://localhost:3000/api/reminders/${id}`, { method: "DELETE" }).catch((err) =>
      console.warn("Failed to delete reminder on backend", err)
    )
  }

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/requests" element={<RequestsActivities currentUser={currentUser} />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/myreminders" element={<MyReminders reminders={reminders} removeReminder={deleteReminder} />} />
        <Route path="/myteams" element={<MyTeams />} />
        <Route path="/add-reminder" element={<AddReminder addReminder={addReminder} />} />
      </Routes>
    </div>
  )
}

export default App;
