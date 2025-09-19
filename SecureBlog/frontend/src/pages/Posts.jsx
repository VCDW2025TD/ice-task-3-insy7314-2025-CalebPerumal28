import { useEffect, useState } from "react";
import axios from "axios";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [active, setActive] = useState(null);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "reader").toLowerCase();

  useEffect(() => {
    axios.get("https://localhost:5000/api/posts").then(res => setPosts(res.data || []));
  }, []);

  const canComment = !!token; // reader or higher if logged in

  const submitComment = async (postId) => {
    if (!comment.trim()) return;
    try {
      await axios.post(`https://localhost:5000/api/posts/${postId}/comments`, { text: comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Comment submitted (pending approval)");
      setComment("");
    } catch (e) {
      alert(e.response?.data?.message || "Failed to add comment");
    }
  };

  return (
    <div className="tech-glass-card" style={{ padding: 16 }}>
      <h2 className="glow-text">📰 Published Posts</h2>
      {posts.map(p => (
        <div key={p._id} className="mz-card" style={{ marginTop: 12, padding: 12 }}>
          <h3>{p.title}</h3>
          <p style={{ opacity: .85 }}>by {p.author?.email}</p>
          {active === p._id ? <p>{p.body}</p> : <p>{(p.body || "").slice(0, 160)}...</p>}
          <button className="glow-button" onClick={() => setActive(active === p._id ? null : p._id)}>
            {active === p._id ? "Hide" : "Read"}
          </button>

          {canComment && (
            <div style={{ marginTop: 8 }}>
              <textarea className="tech-input" rows={3} placeholder="Write a comment..."
                        value={comment} onChange={e => setComment(e.target.value)} />
              <button className="glow-button" onClick={() => submitComment(p._id)}>Submit Comment</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
