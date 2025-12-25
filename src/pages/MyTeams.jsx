function MyTeams() {
  const dummyTeams = [
    { id: 1, name: "Hackathon Team Alpha", role: "Member" },
    { id: 2, name: "Weekend Hike Crew", role: "Organizer" },
  ];

  return (
    <div className="dashboard">
      <h1>My Teams</h1>
      <div className="cards">
        {dummyTeams.map((team) => (
          <div key={team.id} className="card">
            <h3>{team.name}</h3>
            <p>Role: {team.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTeams;
