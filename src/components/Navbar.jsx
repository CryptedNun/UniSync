import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ currentUser, onSignOut }) {
  const navigate = useNavigate()
  const location = useLocation()
  const username = currentUser && (typeof currentUser === "string" ? currentUser : currentUser.username)
  const roll = currentUser && typeof currentUser === "object" ? currentUser.roll : null
  const menu = [
    { name: "Dashboard", to: "/" },
    { name: "My Reminders", to: "/myreminders" },
    { name: "My Teams", to: "/myteams" },
    { name: "Notifications", to: "/notifications" },
  ];

  return (
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 className="logo">UniSync</h2>
        <ul className="nav-links">
          {menu.map((item) => (
            <li
              key={item.to}
              className={location.pathname === item.to ? "active" : ""}
              onClick={() => navigate(item.to)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginLeft: "auto", color: "#cbd5f5", display: "flex", alignItems: "center", gap: 8 }}>
        {username ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1 }}>
              <span style={{ fontWeight: 600 }}>{username}</span>
              {roll ? <small style={{ opacity: 0.85, fontSize: 12 }}>{roll}</small> : null}
            </div>
            <button className="add-btn" onClick={() => { if (onSignOut) onSignOut(); navigate("/signin") }}>
              Sign out
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/signin")} className="add-btn">Sign in</button>
        )}
      </div>
    </nav>
  )
}

export default Navbar;

