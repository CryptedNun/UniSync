function Notifications({ notifications, markRead, deleteNotification }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Notifications</h1>
      </div>

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
                {note.time}
              </span>
            </div>

            <p>{note.message}</p>

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
          </div>
        ))}
      </section>
    </div>
  )
}

export default Notifications
