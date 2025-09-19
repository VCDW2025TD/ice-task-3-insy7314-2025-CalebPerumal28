import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "reader").toLowerCase();

  const items = useMemo(() => {
    const base = [{ label: "Published Posts", path: "/posts" }];

    if (role === "author" || role === "editor" || role === "admin") {
      base.push({ label: "New Draft", path: "/drafts/new" });
      base.push({ label: "My Drafts", path: "/drafts/mine" });
    }
    if (role === "editor" || role === "admin") {
      base.push({ label: "Review Drafts (Publish)", path: "/drafts/review" });
      base.push({ label: "Moderate Comments", path: "/moderation/comments" });
    }
    if (role === "admin") {
      base.push({ label: "Admin: Create Users", path: "/admin/users" }); // optional page later
    }
    return base;
  }, [role]);

  return (
    <aside className="sidebar-panel" style={{ padding: 16 }}>
      <h3 className="glow-text">🗂 Menu</h3>
      {items.map((it) => (
        <button
          key={it.path}
          className="glow-button"
          style={{ display: "block", width: "100%", marginBottom: 8 }}
          onClick={() => navigate(it.path)}
        >
          {it.label}
        </button>
      ))}
    </aside>
  );
}
