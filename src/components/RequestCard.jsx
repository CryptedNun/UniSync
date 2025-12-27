function RequestCard({ request, currentUser, onJoin, onLeave, onDelete, onComplete }) {
  const username = currentUser?.username || null;
  const joined = !!request.joined;
  const isOwner = !!request.isOwner;

  if (request.completed) return null;

  return (
    <div className="card">
      <h3>{request.caption}</h3>
      <div style={{ whiteSpace: 'pre-wrap', opacity: 0.95 }}>{request.description}</div>
      <p>{(request.participants_count || 0)} / {request.max_participants} joined</p>

      {(request.participants || []).length > 0 ? (
        <div style={{ marginTop: 8, fontSize: 13, color: '#cbd5f5' }}>
          <strong>Participants:</strong> {(request.participants || []).map(p => p.user_id).filter(Boolean).join(', ')}
        </div>
      ) : null}

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