import DashboardLayout from "../../components/DashboardLayout";
import ReviewDrafts from "../ReviewDrafts";
import ModerateComments from "../ModerateComments";
import NewDraft from "../NewDraft"; // editors can also author posts

export default function EditorDashboard() {
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

      <div style={{ marginTop: 16 }}>
        <h2 className="glow-text">✍️ Optional: Create Draft</h2>
        <NewDraft />
      </div>
    </DashboardLayout>
  );
}
