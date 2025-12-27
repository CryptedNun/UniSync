import { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import RequestsActivities from "./pages/RequestsActivities";
import Notices from "./pages/Notices";
import MyReminders from "./pages/MyReminders";
import MyTeams from "./pages/MyTeams";
import AddReminder from "./pages/AddReminder";
import Notifications from "./pages/Notifications";
import SignIn from "./pages/SignIn";
import NotificationToast from "./components/NotificationToast";
import "./App.css";

function App() {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem("auth")
      return raw ? JSON.parse(raw) : { username: null, token: null, roll: null, canAddNotices: false }
    } catch (e) {
      return { username: null, token: null, roll: null, canAddNotices: false }
    }
  })

  const [reminders, setReminders] = useState([])
  const [notifications, setNotifications] = useState([])
  const firedRemindersRef = useRef(new Set())

  // Load reminders from backend (fallback to localStorage)
  useEffect(() => {
    let mounted = true
    const headers = auth && auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
    fetch("http://localhost:3000/api/reminders/", { headers })
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
  }, [auth])

  useEffect(() => {
    try {
      localStorage.setItem("reminders", JSON.stringify(reminders))
    } catch (e) {
      console.error("Failed to save reminders", e)
    }
  }, [reminders])

  // Load notifications from backend
  useEffect(() => {
    if (!auth?.token) return

    fetch("http://localhost:3000/api/notifications", {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data)
      })
      .catch(() => {})
  }, [auth])

  // Check reminders every minute and trigger notifications when time matches
  useEffect(() => {
    if (reminders.length === 0) return

    const checkReminders = () => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const today = now.toDateString()
      
      reminders.forEach((reminder) => {
        // Check if reminder time matches current time
        if (reminder.time === currentTime) {
          const key = `${reminder.id}-${today}`
          
          // Only fire if we haven't already fired this reminder today
          if (!firedRemindersRef.current.has(key)) {
            firedRemindersRef.current.add(key)
            addNotification({
              id: Date.now(),
              title: reminder.title,
              message: reminder.description || "Time for your reminder",
              time: "Just now",
            })
          }
        }
      })
    }

    // Check immediately
    checkReminders()

    // Check every minute
    const interval = setInterval(checkReminders, 60000)
    return () => clearInterval(interval)
  }, [reminders])

  useEffect(() => {
    try {
      localStorage.setItem("auth", JSON.stringify(auth))
    } catch (e) {
      console.error("Failed to save auth", e)
    }
  }, [auth])

  const addReminder = (reminder) => {
    setReminders((prev) => [...prev, reminder])

    addNotification({
    id: Date.now(),
    title: "Reminder Created",
    message: `Your reminder '${reminder.title}' was added successfully.`,
    time: "Just now",
  })


    const headers = { "Content-Type": "application/json" }
    if (auth && auth.token) headers.Authorization = `Bearer ${auth.token}`
    fetch("http://localhost:3000/api/reminders/", {
      method: "POST",
      headers,
      body: JSON.stringify(reminder),
    }).catch((err) => console.warn("Failed to save to backend", err))
  }

  const deleteReminder = (id) => {
    // Optimistic UI update
    setReminders((prev) => prev.filter((r) => String(r.id) !== String(id)))
    const headers = {}
    if (auth && auth.token) headers.Authorization = `Bearer ${auth.token}`
    fetch(`http://localhost:3000/api/reminders/${id}`, { method: "DELETE", headers }).catch((err) =>
      console.warn("Failed to delete reminder on backend", err)
    )
  }

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev])

    const headers = { "Content-Type": "application/json" }
    if (auth?.token) headers.Authorization = `Bearer ${auth.token}`

    fetch("http://localhost:3000/api/notifications", {
      method: "POST",
      headers,
      body: JSON.stringify(notification),
    }).catch((err) =>
      console.warn("Failed to save notification", err)
    )
  }

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    )

    fetch(`http://localhost:3000/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }).catch(() => {})
  }

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    )

    fetch(`http://localhost:3000/api/notifications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }).catch(() => {})
  }



  const signUp = async (username, password, roll) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, roll }),
      })
      const data = await res.json()
      if (!res.ok) throw data
      setAuth({ username: data.username, token: data.token, roll: data.roll, canAddNotices: !!data.canAddNotices })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e }
    }
  }

  const signIn = async (username, password, roll) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, roll }),
      })
      const data = await res.json()
      if (!res.ok) throw data
      setAuth({ username: data.username, token: data.token, roll: data.roll, canAddNotices: !!data.canAddNotices })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e }
    }
  }

  const signOut = () => setAuth({ username: null, token: null, roll: null, canAddNotices: false })

  const Protected = ({ children }) => {
    return auth && auth.username ? children : <Navigate to="/signin" replace />
  }

  return (
    <div className="app">
      <Navbar currentUser={auth.username} onSignOut={signOut} />
      <NotificationToast notifications={notifications} markRead={markNotificationRead} deleteNotification={deleteNotification} />
      <Routes>
        <Route path="/" element={<Protected><Dashboard currentUser={auth} /></Protected>} />
        <Route path="/requests" element={<Protected><RequestsActivities currentUser={auth} /></Protected>} />
        <Route path="/notices" element={<Protected><Notices /></Protected>} />
        <Route path="/myreminders" element={<Protected><MyReminders reminders={reminders} removeReminder={deleteReminder} /></Protected>} />
        <Route path="/myteams" element={<Protected><MyTeams currentUser={auth} /></Protected>} />
        <Route path="/add-reminder" element={<Protected><AddReminder addReminder={addReminder} /></Protected>} />
        <Route
          path="/notifications"
          element={
            <Protected>
              <Notifications
                notifications={notifications}
                markRead={markNotificationRead}
                deleteNotification={deleteNotification}/>
            </Protected>}/>

        <Route path="/signin" element={<SignIn signIn={signIn} signUp={signUp} />} />
      </Routes>
    </div>
  )
}

export default App;
