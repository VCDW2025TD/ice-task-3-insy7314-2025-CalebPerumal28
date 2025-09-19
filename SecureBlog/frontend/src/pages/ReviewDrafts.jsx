import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewDrafts() {
  const token = localStorage.getItem("token");
  const [drafts, setDrafts] = useState([]);

  const load = async () => {
    const res = await axios.get("https://localhost:5000/api/posts/drafts", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDrafts(res.data || []);
  };

  useEffect(() => { load(); }, []);

  const publish = async (id) => {
    await axios.post(`https://localhost:5000/api/posts/${id}/publish`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    load();
  };

  return (
    <div className="tech-glass-card" style={{ padding: 16 }}>
      <h2 className="glow-text">✅ Review & Publish Drafts</h2>
      {drafts.map(d => (
        <div key={d._id} className="mz-card" style={{ marginTop: 12, padding: 12 }}>
          <h3>{d.title}</h3>
          <p>Author: {d.author?.email}</p>
          <p>{(d.body || "").slice(0, 200)}...</p>
          <button className="glow-button" onClick={() => publish(d._id)}>Publish</button>
        </div>
      ))}
    </div>
  );
}
