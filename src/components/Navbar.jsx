import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ currentUser, onSignOut }) {
  const navigate = useNavigate()
  const location = useLocation()
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
        {currentUser ? (
          <>
            <span style={{ fontWeight: 600 }}>{currentUser}</span>
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

