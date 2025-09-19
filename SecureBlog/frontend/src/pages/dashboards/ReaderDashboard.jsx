import DashboardLayout from "../../components/DashboardLayout";
import Posts from "../Posts";

export default function ReaderDashboard() {
  return (
    <DashboardLayout>
      <div className="tech-glass-card" style={{ marginBottom: 16 }}>
        <h2 className="glow-text">Reader Dashboard</h2>
        <p>Browse published posts and leave comments (they’ll queue for approval).</p>
      </div>
      <Posts />
    </DashboardLayout>
  );
}
