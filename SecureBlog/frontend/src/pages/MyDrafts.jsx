import { useEffect, useState } from "react";
import axios from "axios";

export default function MyDrafts() {
  const token = localStorage.getItem("token");
  const [drafts, setDrafts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody]   = useState("");

  const load = async () => {
    const res = await axios.get("https://localhost:5000/api/posts/mine", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDrafts(res.data || []);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (p) => {
    setEditing(p._id);
    setTitle(p.title); setBody(p.body);
  };

  const save = async () => {
    await axios.put(`https://localhost:5000/api/posts/${editing}`, { title, body }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditing(null); setTitle(""); setBody("");
    load();
  };

  return (
    <div className="tech-glass-card" style={{ padding: 16 }}>
      <h2 className="glow-text">📝 My Drafts</h2>
      {drafts.map(d => (
        <div key={d._id} className="mz-card" style={{ marginTop: 12, padding: 12 }}>
          {editing === d._id ? (
            <>
              <input className="tech-input" value={title} onChange={e => setTitle(e.target.value)} />
              <textarea className="tech-input" rows={6} value={body} onChange={e => setBody(e.target.value)} />
              <button className="glow-button" onClick={save}>Save</button>
              <button className="glow-button" onClick={() => setEditing(null)} style={{ marginLeft: 8 }}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{d.title}</h3>
              <p>{(d.body || "").slice(0,140)}...</p>
              <button className="glow-button" onClick={() => startEdit(d)}>Edit</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
