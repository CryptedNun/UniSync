import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Notifications({ notifications = [], setNotifications, markRead, deleteNotification }) {
  const navigate = useNavigate();

  // Optional polling: only run if a setter is provided by the parent
  useEffect(() => {
    if (!setNotifications) return;
    let mounted = true;
    const fetchNotifications = async () => {
      try {
        const rawAuth = localStorage.getItem("auth");
        const token = rawAuth ? (JSON.parse(rawAuth).token || null) : localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/notifications", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (mounted) setNotifications(data);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [setNotifications]);

  return (
    <div className="dashboard">
      {/* Back Button */}
      <button className="dashboard-back" onClick={() => navigate("/")}>← Back to Dashboard</button>
      <div className="dashboard-header"><h1>Notifications</h1></div>

      <section>
        {(!notifications || notifications.length === 0) && (
          <p style={{ color: "#94a3b8" }}>No notifications</p>
        )}

        {notifications.map((note) => (
          <div
            key={note.id}
            className="card"
            style={{
              width: "100%",
              opacity: note.read ? 0.6 : 1,
              borderLeft: note.read ? "4px solid #94a3b8" : "4px solid #3b82f6",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3>{note.title}</h3>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{note.time}</span>
            </div>

            <p>{note.message}</p>

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              {!note.read && markRead && (
                <button className="add-btn" onClick={() => markRead(note.id)}>
                  Mark as read
                </button>
              )}
              {deleteNotification && (
                <button className="add-btn" onClick={() => deleteNotification(note.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Notifications;
