import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Notices({ currentUser }) {
  const navigate = useNavigate()
  const [notices, setNotices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [caption, setCaption] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    let mounted = true
    fetch("http://localhost:3000/api/notices/")
      .then((r) => r.json())
      .then((data) => { if (mounted) setNotices(Array.isArray(data) ? data : []) })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  const openForm = () => {
    setCaption("")
    setDescription("")
    setShowForm(true)
  }

  const submitForm = async () => {
    if (!caption.trim()) return alert("Caption is required")
    try {
      const headers = { "Content-Type": "application/json" }
      if (currentUser?.token) headers.Authorization = `Bearer ${currentUser.token}`
      const res = await fetch("http://localhost:3000/api/notices/", {
        method: "POST",
        headers,
        body: JSON.stringify({ caption: caption.trim(), description: description.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw data
      setNotices((prev) => [data, ...prev])
      setShowForm(false)
    } catch (e) {
      alert((e && e.error) || "Failed to add notice")
    }
  }

  return (
    <div className="dashboard">
      <button className="dashboard-back" onClick={() => navigate("/") }>
        ← Back to Dashboard
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Notices</h1>
        <button className="add-btn" onClick={openForm}>＋</button>
      </div>

      <div className="cards" style={{ marginTop: 16 }}>
        {notices.map((notice) => (
          <div key={notice.id} className="card">
            <strong>{notice.caption}</strong>
            <div style={{ opacity: 0.9 }}>{notice.description}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#8892b0" }}>By {notice.author || 'Unknown'} · {new Date(notice.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="add-page" style={{ width: 480, margin: 0, padding: 20 }}>
            <h3 style={{ marginTop: 0, color: "#38bdf8" }}>Add Notice</h3>
            <label style={{ display: "block", marginBottom: 8 }}>Caption</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 8, border: "1px solid #1e293b", backgroundColor: "#0f172a", color: "#e5e7eb" }} />
            <label style={{ display: "block", marginBottom: 8 }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: 10, minHeight: 100, borderRadius: 8, border: "1px solid #1e293b", backgroundColor: "#0f172a", color: "#e5e7eb", resize: "none" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button className="add-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="save-btn" onClick={submitForm}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notices;
