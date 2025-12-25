function Navbar({ activePage, setActivePage }) {
  const menu = [
    { name: "Dashboard", key: "dashboard" },
    { name: "My Reminders", key: "reminders" },
    { name: "My Teams", key: "teams" },
  ];

  return (
    <nav className="navbar">
      <h2 className="logo">UniSync</h2>
      <ul className="nav-links">
        {menu.map((item) => (
          <li
            key={item.key}
            className={activePage === item.key ? "active" : ""}
            onClick={() => setActivePage(item.key)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;

