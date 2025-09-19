import { useState } from "react";
import { api } from "../../lib/api";
import DashboardLayout from "../../components/DashboardLayout";
import ReviewDrafts from "../ReviewDrafts";
import ModerateComments from "../ModerateComments";
import NewDraft from "../NewDraft";

function AdminCreateUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("reader");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const { data } = await api.post("/api/auth/admin/create-user", { email, password, role });
      setMsg(`✅ user created: ${data?.id} (${data?.role})`);
      setEmail(""); setPassword(""); setRole("reader");
    } catch (e) {
      setMsg(e.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="tech-glass-card" style={{ padding: 16 }}>
      <h3 className="glow-text">👤 Create User (with Role)</h3>
      <form onSubmit={submit} className="tech-form">
        <input className="tech-input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="tech-input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <select className="tech-input" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="reader">reader</option>
          <option value="author">author</option>
          <option value="editor">editor</option>
          <option value="admin">admin</option>
        </select>
        <button className="tech-button" type="submit">Create</button>
      </form>
      {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="grid" style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <h2 className="glow-text">🧾 Review & Publish</h2>
          <ReviewDrafts />
        </div>
        <div>
          <h2 className="glow-text">🧹 Moderate Comments</h2>
          <ModerateComments />
        </div>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <h2 className="glow-text">✍️ Create Draft</h2>
          <NewDraft />
        </div>
        <div>
          <h2 className="glow-text">🔐 User Management</h2>
          <AdminCreateUser />
        </div>
      </div>
    </DashboardLayout>
  );
}
