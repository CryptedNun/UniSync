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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setRequests(JSON.parse(raw));
      } else {
        const seed = [
          { id: 1, owner: "CryptedNun", caption: "Tuition Offer", description: "Need 1 student to tutor Math 10", max_participants: 2, participants: [{ user_id: "CryptedNun" }], completed: false },
          { id: 2, owner: "Cacodyl", caption: "Weekend Trip", description: "Looking for 3 friends for hiking", max_participants: 4, participants: [{ user_id: "Cacodyl" }], completed: false },
        ];
        setRequests(seed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      }
    } catch (e) {}
  }, []);

  function persist(next) {
    setRequests(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
  }

  function handleJoin(requestId) {
    const next = requests.map((r) => {
      if (r.id !== requestId) return r;
      const already = r.participants?.some(p => p.user_id === currentUser.username);
      if (already) return r;
      const count = (r.participants || []).length;
      if (count >= r.max_participants) return r;
      const participants = [...(r.participants || []), { user_id: currentUser.username }];
      return { ...r, participants };
    });
    persist(next);
  }

  function handleLeave(requestId) {
    const next = requests.map((r) => {
      if (r.id !== requestId) return r;
      const participants = (r.participants || []).filter(p => p.user_id !== currentUser.username);
      return { ...r, participants };
    });
    persist(next);
  }

  function handleDelete(requestId) {
    const next = requests.filter(r => r.id !== requestId);
    persist(next);
  }

  function handleComplete(requestId) {
    const next = requests.map(r => r.id === requestId ? { ...r, completed: true } : r);
    persist(next);
  }

  function handleAdd() {
    if (!newCaption.trim()) return;
    const id = Date.now();
    const req = { id, owner: currentUser.username, caption: newCaption.trim(), description: newDescription.trim(), max_participants: Number(newMax) || 1, participants: [], completed: false };
    const next = [req, ...requests];
    persist(next);
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
