import { useState } from "react";
import axios from "axios";

export default function NewDraft() {
  const [title, setTitle] = useState("");
  const [body, setBody]   = useState("");
  const token = localStorage.getItem("token");

  const create = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://localhost:5000/api/posts",
        { title, body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Draft created (id: ${res.data?.post?._id})`);
      setTitle(""); setBody("");
    } catch (e) {
      alert(e.response?.data?.message || "Failed to create draft (are you an author?)");
    }
  };

  return (
    <div className="tech-glass-card" style={{ padding: 16 }}>
      <h2 className="glow-text">✍️ New Draft</h2>
      <form onSubmit={create} className="tech-form">
        <input className="tech-input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea className="tech-input" rows={8} placeholder="Body" value={body} onChange={e => setBody(e.target.value)} required />
        <button className="tech-button" type="submit">Create Draft</button>
      </form>
    </div>
  );
}
