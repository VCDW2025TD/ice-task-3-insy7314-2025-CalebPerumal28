// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import RequireAuth from "./components/RequireAuth";

/* Lazy routes — these modules won’t be loaded until needed */
const Splash            = lazy(() => import("./pages/Splash"));
const ReaderDashboard   = lazy(() => import("./pages/dashboards/ReaderDashboard"));
const AuthorDashboard   = lazy(() => import("./pages/dashboards/AuthorDashboard"));
const EditorDashboard   = lazy(() => import("./pages/dashboards/EditorDashboard"));
const AdminDashboard    = lazy(() => import("./pages/dashboards/AdminDashboard"));

/* Minimal error boundary so crashes are visible */
function RouteErrorBoundary({ children }) {
  try {
    return children;
  } catch (e) {
    return (
      <div style={{ padding: 16, color: "crimson" }}>
        <h3>⚠️ Route error</h3>
        <pre>{String(e?.stack || e?.message || e)}</pre>
      </div>
    );
  }
}

export default function App() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
      <RouteErrorBoundary>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role-aware landing */}
          <Route
            path="/splash"
            element={
              <RequireAuth>
                <Splash />
              </RequireAuth>
            }
          />

          {/* Dashboards (use one naming convention; these use lowercase/singular) */}
          <Route
            path="/dashboard/reader"
            element={
              <RequireAuth roles={["reader","author","editor","admin"]}>
                <ReaderDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/author"
            element={
              <RequireAuth roles={["author","editor","admin"]}>
                <AuthorDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/editor"
            element={
              <RequireAuth roles={["editor","admin"]}>
                <EditorDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <RequireAuth roles={["admin"]}>
                <AdminDashboard />
              </RequireAuth>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RouteErrorBoundary>
    </Suspense>
  );
}
