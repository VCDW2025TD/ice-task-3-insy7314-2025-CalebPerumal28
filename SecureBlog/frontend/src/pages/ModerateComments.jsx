import { useState } from "react";
import axios from "axios";

export default function ModerateComments() {
  const token = localStorage.getItem("token");
  const [postId, setPostId] = useState("");
  const [pending, setPending] = useState([]);

  const load = async () => {
    const res = await axios.get(`https://localhost:5000/api/posts/${postId}/comments/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPending(res.data || []);
  };

  const approve = async (commentId) => {
    await axios.post(`https://localhost:5000/api/posts/${postId}/comments/${commentId}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    load();
  };

  return (
    <div className="tech-glass-card" style={{ padding: 16 }}>
      <h2 className="glow-text">🧹 Moderate Comments</h2>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="tech-input" placeholder="Post ID" value={postId} onChange={e => setPostId(e.target.value)} />
        <button className="glow-button" onClick={load} disabled={!postId}>Load Pending</button>
      </div>
      {pending.map(c => (
        <div key={c._id} className="mz-card" style={{ marginTop: 12, padding: 12 }}>
          <p><b>{c.author?.email}</b></p>
          <p>{c.text}</p>
          <button className="glow-button" onClick={() => approve(c._id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}
