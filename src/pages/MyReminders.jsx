import { useNavigate } from "react-router-dom";

function MyReminders({ reminders = [], removeReminder }) {
  const navigate = useNavigate()
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Reminders</h1>
        <button className="add-btn" onClick={() => navigate("/add-reminder")}>+ Add</button>
      </div>
      <div className="cards">
        {reminders.length === 0 ? (
          <div className="card empty">No reminders yet. Click Add to create one.</div>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.id} className="card">
              <button
                className="delete-btn"
                title="Delete reminder"
                onClick={() => {
                  if (typeof removeReminder === "function") removeReminder(reminder.id)
                }}
              >
                -
              </button>
              <h3>{reminder.title}</h3>
              {reminder.description && <p className="desc">{reminder.description}</p>}
              <p>Time: {reminder.time}</p>
              <p>Repeat: {reminder.repeat}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyReminders;
