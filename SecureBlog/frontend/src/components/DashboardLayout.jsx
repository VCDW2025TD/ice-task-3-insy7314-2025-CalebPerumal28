import { useNavigate, NavLink } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "reader").toUpperCase();
  const email = localStorage.getItem("email") || "";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="container" style={{ padding: 16 }}>
      <header className="topbar" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="brand">Secure<span>Blog</span></div>
        <nav style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
          <NavLink to="/features" className="link">Features</NavLink>
          <NavLink to="/docs" className="link">Docs</NavLink>
          <button className="btn ghost" onClick={() => navigate("/posts")}>Public Posts</button>
        </nav>
        <div className="chip" style={{ marginLeft: 12 }}>{role}</div>
        <div className="muted" style={{ marginLeft: 6 }}>{email}</div>
        <button className="btn" style={{ marginLeft: 12 }} onClick={logout}>Log out</button>
      </header>

      <main style={{ marginTop: 16 }}>{children}</main>
    </div>
  );
}
