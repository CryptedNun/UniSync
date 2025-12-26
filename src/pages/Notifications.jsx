<<<<<<< Updated upstream
function Notifications({ notifications, markRead, deleteNotification }) {
  return (
    <div className="dashboard">
=======
import { useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: "Reminder Created",
      message: "Your reminder 'Drink Water' was added successfully.",
      time: "Just now",
    },
    {
      id: 2,
      title: "Upcoming Reminder",
      message: "You have a reminder scheduled in 30 minutes.",
      time: "30 min left",
    },
    {
      id: 3,
      title: "System Update",
      message: "A new dashboard update is now live.",
      time: "Yesterday",
    },
    {
      id: 4,
      title: "Weekly Summary",
      message: "You completed 5 reminders this week. Great job!",
      time: "2 days ago",
    },
  ];

  return (
    <div className="dashboard">
      {/* Back Button */}
      <button className="dashboard-back" onClick={() => navigate("/")}>
        ← Back to Dashboard
      </button>

      {/* Header */}
>>>>>>> Stashed changes
      <div className="dashboard-header">
        <h1>Notifications</h1>
      </div>

<<<<<<< Updated upstream
      <section>
        {notifications.length === 0 && (
          <p style={{ color: "#94a3b8" }}>No notifications</p>
        )}

        {notifications.map((note) => (
          <div
            key={note.id}
            className="card"
            style={{
              width: "100%",
              opacity: note.read ? 0.6 : 1,
              borderLeft: note.read
                ? "4px solid #94a3b8"
                : "4px solid #3b82f6",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{note.title}</h3>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>
=======
      {/* Notifications List */}
      <section>
        {notifications.map((note) => (
          <div key={note.id} className="card" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <h3>{note.title}</h3>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>
>>>>>>> Stashed changes
                {note.time}
              </span>
            </div>

            <p>{note.message}</p>
<<<<<<< Updated upstream

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              {!note.read && (
                <button className="add-btn" onClick={() => markRead(note.id)}>
                  Mark as read
                </button>
              )}
              <button className="add-btn" onClick={() => deleteNotification(note.id)}>
                Delete
              </button>
            </div>
=======
>>>>>>> Stashed changes
          </div>
        ))}
      </section>
    </div>
<<<<<<< Updated upstream
  )
}

export default Notifications
=======
  );
};

export default Notifications;
>>>>>>> Stashed changes
