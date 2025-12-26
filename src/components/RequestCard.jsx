function RequestCard({ request, currentUser, onJoin, onLeave, onDelete, onComplete }) {
  const username = currentUser?.username || null;
  const joined = request.participants?.some((p) => p.user_id === username);
  const isOwner = request.owner === username;

  if (request.completed) return null;

  return (
    <div className="card">
      <h3>{request.caption}</h3>
      <p>{request.description}</p>
      <p>{(request.participants?.length || 0)} / {request.max_participants} joined</p>

      {!joined && (request.participants?.length || 0) < request.max_participants ? (
        <button className="join-btn" onClick={() => onJoin && onJoin(request.id)}>
          Join
        </button>
      ) : joined ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="joined-text">You joined</span>
          <button className="join-btn" onClick={() => onLeave && onLeave(request.id)}>Leave</button>
        </div>
      ) : (
        <span className="joined-text">Full</span>
      )}

      {isOwner && (
        <div style={{ marginTop: 12 }}>
          <button className="add-btn" onClick={() => onComplete && onComplete(request.id)} style={{ marginRight: 8 }}>Complete</button>
          <button className="delete-btn" aria-label="Delete request" onClick={() => onDelete && onDelete(request.id)}>−</button>
        </div>
      )}
    </div>
  );
}

export default RequestCard;