import DashboardLayout from "../../components/DashboardLayout";
import NewDraft from "../NewDraft";
import MyDrafts from "../MyDrafts";
import Posts from "../Posts";

export default function AuthorDashboard() {
  return (
    <DashboardLayout>
      <div className="grid" style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <h2 className="glow-text">✍️ Create</h2>
          <NewDraft />
        </div>
        <div>
          <h2 className="glow-text">📝 My Drafts</h2>
          <MyDrafts />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <h2 className="glow-text">📰 Published Posts</h2>
        <Posts />
      </div>
    </DashboardLayout>
  );
}
