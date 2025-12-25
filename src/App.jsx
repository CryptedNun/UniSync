import { useState } from "react";
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

  return (
    <div className="app">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {activePage === "dashboard" && <Dashboard setActivePage={setActivePage} />}
      {activePage === "requests" && (
        <RequestsActivities currentUser={currentUser} setActivePage={setActivePage} />
      )}
      {activePage === "notices" && <Notices setActivePage={setActivePage} />}
      {activePage === "reminders" && (<MyReminders setActivePage={setActivePage} />
      )}
      {activePage === "teams" && <MyTeams />}
      {activePage === "add-reminder" && <AddReminder setActivePage={setActivePage} />}
    </div>
  );
}

export default App;
