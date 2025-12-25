function RequestCard({ request, currentUser, onJoin }) {
  const joined = request.participants?.some(
    (p) => p.user_id === currentUser.id
  );

  return (
    <div className="card">
      <h3>{request.caption}</h3>
      <p>{request.description}</p>
      <p>{request.participants?.length} / {request.max_participants} joined</p>

      {!joined && request.participants?.length < request.max_participants ? (
        <button className="join-btn" onClick={() => onJoin(request.id)}>
          Join
        </button>
      ) : (
        <span className="joined-text">You joined</span>
      )}
    </div>
  );
}

export default RequestCard;