import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import RequestsActivities from "./pages/RequestsActivities";
import Notices from "./pages/Notices";
import MyReminders from "./pages/MyReminders";
import MyTeams from "./pages/MyTeams";
import AddReminder from "./pages/AddReminder";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const currentUser = { id: 1, name: "Hasan" };
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("reminders");
    if (raw) {
      try {
        setReminders(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to parse reminders from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("reminders", JSON.stringify(reminders));
    } catch (e) {
      console.error("Failed to save reminders", e);
    }
  }, [reminders]);

  const addReminder = (reminder) => {
    setReminders((prev) => [...prev, reminder]);
    setActivePage("reminders");
  };

  return (
    <div className="app">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {activePage === "dashboard" && <Dashboard setActivePage={setActivePage} />}
      {activePage === "requests" && (
        <RequestsActivities currentUser={currentUser} setActivePage={setActivePage} />
      )}
      {activePage === "notices" && <Notices setActivePage={setActivePage} />}
      {activePage === "reminders" && (
        <MyReminders setActivePage={setActivePage} reminders={reminders} />
      )}
      {activePage === "teams" && <MyTeams />}
      {activePage === "add-reminder" && (
        <AddReminder setActivePage={setActivePage} addReminder={addReminder} />
      )}
    </div>
  );
}

export default App;
