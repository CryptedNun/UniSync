import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const menu = [
    { name: "Dashboard", to: "/" },
    { name: "My Reminders", to: "/myreminders" },
    { name: "My Teams", to: "/myteams" },
  ];

  return (
    <nav className="navbar">
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
    </nav>
  )
}

export default Navbar;

