import { useEffect, useState } from "react";

export default function NotificationToast({ notifications = [], markRead = () => {}, deleteNotification = () => {} }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    // Show unread or recent notifications as toasts
    const toShow = notifications.filter(n => !visible.includes(n.id)).slice(0, 5);
    if (toShow.length === 0) return;

    const ids = toShow.map(n => n.id);
    setVisible(prev => [...prev, ...ids]);

    // Auto-dismiss each toast after 6s
    const timers = ids.map(id =>
      setTimeout(() => {
        // mark as read when auto-dismissed
        markRead(id);
        setVisible(prev => prev.filter(x => x !== id));
      }, 6000)
    );

    return () => timers.forEach(clearTimeout);
  }, [notifications]);

  if (!visible.length) return null;

  return (
    <div className="notification-toast-container">
      {visible.map((id) => {
        const n = notifications.find(x => x.id === id);
        if (!n) return null;
        return (
          <div key={n.id} className="notification-toast" role="status">
            <div className="nt-title">{n.title}</div>
            <div className="nt-message">{n.message}</div>
            <div className="nt-actions">
              <button onClick={() => { markRead(n.id); setVisible(prev => prev.filter(x => x !== n.id)); }} className="nt-btn">Mark read</button>
              <button onClick={() => { deleteNotification(n.id); setVisible(prev => prev.filter(x => x !== n.id)); }} className="nt-btn nt-delete">Dismiss</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
