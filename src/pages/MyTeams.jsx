import { useEffect, useState } from "react";

function MyTeams({ currentUser }) {
  const [teams, setTeams] = useState([])
  const API = "http://localhost:3000/api"

  useEffect(() => {
    let mounted = true
    const headers = currentUser && currentUser.token ? { Authorization: `Bearer ${currentUser.token}` } : {}
    fetch(`${API}/teams/`, { headers })
      .then(r => { if (!r.ok) throw new Error('no-api') ; return r.json() })
      .then(data => { if (mounted && Array.isArray(data)) setTeams(data) })
      .catch(() => {
        try {
          const raw = localStorage.getItem('teams')
          if (raw) setTeams(JSON.parse(raw))
        } catch(e){}
      })
    return () => { mounted = false }
  }, [currentUser])

  return (
    <div className="dashboard">
      <h1>My Teams</h1>
      <div className="cards">
        {teams.length ? teams.map(team => (
          <div key={team.id} className="card">
            <h3>{team.name}</h3>
            <p>Members: {(team.members || []).join(', ')}</p>
          </div>
        )) : <p>No teams yet.</p>}
      </div>
    </div>
  )
}

export default MyTeams;
