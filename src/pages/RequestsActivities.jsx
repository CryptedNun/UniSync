import RequestCard from "../components/RequestCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "app_requests";

function RequestsActivities({ currentUser }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newMax, setNewMax] = useState(2);
  const API = "http://localhost:3000/api"

  useEffect(() => {
    let mounted = true
    const headers = currentUser && currentUser.token ? { Authorization: `Bearer ${currentUser.token}` } : {}
    fetch(`${API}/requests/`, { headers })
      .then(r => { if (!r.ok) throw new Error('no-api') ; return r.json() })
      .then(data => { if (mounted && Array.isArray(data)) setRequests(data) })
      .catch(() => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY)
          if (raw) setRequests(JSON.parse(raw))
        } catch(e){}
      })
    return () => { mounted = false }
  }, [currentUser])

  function persistToLocal(next) {
    setRequests(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
  }

  async function handleJoin(requestId) {
    const headers = { 'Content-Type': 'application/json' }
    if (currentUser && currentUser.token) headers.Authorization = `Bearer ${currentUser.token}`
    try {
      const res = await fetch(`${API}/requests/${requestId}/join`, { method: 'POST', headers })
      if (!res.ok) throw new Error('join-failed')
      const data = await res.json()
      const next = requests.map(r => r.id === data.id ? { ...r, participants: r.participants ? [...r.participants, { user_id: currentUser.username }] : [{ user_id: currentUser.username }] } : r)
      persistToLocal(next)
    } catch (e) {
      // fallback local
      const next = requests.map((r) => {
        if (r.id !== requestId) return r;
        const already = r.participants?.some(p => p.user_id === currentUser.username);
        if (already) return r;
        const count = (r.participants || []).length;
        if (count >= r.max_participants) return r;
        const participants = [...(r.participants || []), { user_id: currentUser.username }];
        return { ...r, participants };
      });
      persistToLocal(next)
    }
  }

  async function handleLeave(requestId) {
    const headers = { 'Content-Type': 'application/json' }
    if (currentUser && currentUser.token) headers.Authorization = `Bearer ${currentUser.token}`
    try {
      const res = await fetch(`${API}/requests/${requestId}/leave`, { method: 'POST', headers })
      if (!res.ok) throw new Error('leave-failed')
      const data = await res.json()
      const next = requests.map(r => r.id === data.id ? { ...r, participants: (r.participants || []).filter(p => p.user_id !== currentUser.username) } : r)
      persistToLocal(next)
    } catch (e) {
      const next = requests.map((r) => {
        if (r.id !== requestId) return r;
        const participants = (r.participants || []).filter(p => p.user_id !== currentUser.username);
        return { ...r, participants };
      });
      persistToLocal(next)
    }
  }

  async function handleDelete(requestId) {
    const headers = {}
    if (currentUser && currentUser.token) headers.Authorization = `Bearer ${currentUser.token}`
    // optimistic
    const nextLocal = requests.filter(r => r.id !== requestId)
    persistToLocal(nextLocal)
    try {
      await fetch(`${API}/requests/${requestId}`, { method: 'DELETE', headers })
    } catch (e) {
      // ignore
    }
  }

  async function handleComplete(requestId) {
    const headers = { 'Content-Type': 'application/json' }
    if (currentUser && currentUser.token) headers.Authorization = `Bearer ${currentUser.token}`
    // optimistic
    const nextLocal = requests.map(r => r.id === requestId ? { ...r, completed: true } : r)
    persistToLocal(nextLocal)
    try {
      const res = await fetch(`${API}/requests/${requestId}/complete`, { method: 'POST', headers })
      if (!res.ok) throw new Error('complete-failed')
      const data = await res.json()
      // Optionally redirect to teams
      // navigate('/myteams')
    } catch (e) {
      // ignore
    }
  }

  async function handleAdd() {
    if (!newCaption.trim()) return;
    const payload = { caption: newCaption.trim(), description: newDescription.trim(), max_participants: Number(newMax) || 1 }
    const headers = { 'Content-Type': 'application/json' }
    if (currentUser && currentUser.token) headers.Authorization = `Bearer ${currentUser.token}`
    try {
      const res = await fetch(`${API}/requests/`, { method: 'POST', headers, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('create-failed')
      const data = await res.json()
      const next = [data, ...requests]
      persistToLocal(next)
    } catch (e) {
      const id = Date.now();
      const req = { id, owner: currentUser.username, caption: newCaption.trim(), description: newDescription.trim(), max_participants: Number(newMax) || 1, participants: [], completed: false };
      const next = [req, ...requests];
      persistToLocal(next)
    }
    setNewCaption(""); setNewDescription(""); setNewMax(2); setShowAdd(false);
  }

  const myRequests = requests.filter(r => r.owner === currentUser?.username && !r.completed);
  const otherRequests = requests.filter(r => r.owner !== currentUser?.username && !r.completed);

  return (
    <div className="dashboard">
      <button className="dashboard-back" onClick={() => navigate("/")}>
        ← Back to Dashboard
      </button>

      <h1>Requests / Activities</h1>

      <div style={{ marginBottom: 20 }}>
        <button className="add-btn" onClick={() => setShowAdd(s => !s)}>Add</button>
      </div>

      {showAdd && (
        <div className="add-page" style={{ maxWidth: 700, marginBottom: 24 }}>
          <h2>Add Request</h2>
          <label>Caption</label>
          <input type="text" value={newCaption} onChange={(e) => setNewCaption(e.target.value)} />
          <label>Description</label>
          <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
          <label>Max Participants</label>
          <input type="number" value={newMax} min={1} onChange={(e) => setNewMax(e.target.value)} />
          <div style={{ marginTop: 12 }}>
            <button className="save-btn" onClick={handleAdd}>Save</button>
            <button className="add-btn" onClick={() => setShowAdd(false)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </div>
      )}

      <h2>My Requests</h2>
      <div className="cards">
        {myRequests.length ? myRequests.map(r => (
          <RequestCard key={r.id} request={r} currentUser={currentUser} onJoin={handleJoin} onLeave={handleLeave} onDelete={handleDelete} onComplete={handleComplete} />
        )) : <p>No requests yet.</p>}
      </div>

      <h2 style={{ marginTop: 28 }}>Requests / Activities</h2>
      <div className="cards">
        {otherRequests.length ? otherRequests.map(r => (
          <RequestCard key={r.id} request={r} currentUser={currentUser} onJoin={handleJoin} onLeave={handleLeave} onDelete={handleDelete} onComplete={handleComplete} />
        )) : <p>No other requests.</p>}
      </div>
    </div>
  )
}

export default RequestsActivities;
