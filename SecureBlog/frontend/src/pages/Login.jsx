import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  // fallback in case backend doesn't return role
  const decodeRoleFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.role || "reader";
    } catch {
      return "reader";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, role } = res.data || {};
      if (!token) throw new Error("No token in response");

      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role || decodeRoleFromToken(token));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/splash");
    } catch (err) {
      console.debug("Login error:", {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      setError(err?.response?.data?.message || err?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="tech-glass-card">
        <h1 className="tech-title">Log in to SecureBlog</h1>
        <p className="tech-subtext">Welcome back. Please enter your details.</p>

        <form className="tech-form" onSubmit={handleLogin}>
          <div className="input-row">
            <label className="input-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="tech-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-row input-with-toggle">
            <label className="input-label" htmlFor="login-pass">Password</label>
            <input
              id="login-pass"
              type={showPass ? "text" : "password"}
              className="tech-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Hide password" : "Show password"}
              title={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          <button className="tech-button" type="submit">Log in</button>

          <div className="auth-links">
            <button
              type="button"
              className="auth-link muted"
              onClick={() => navigate("/register")}
            >
              New here? Create account
            </button>
            <button
              type="button"
              className="auth-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>
        </form>

        {error && <p className="tech-error">{error}</p>}

        <hr className="auth-divider" />
        <div className="auth-footnote">© {new Date().getFullYear()} SecureBlog</div>
      </div>
    </div>
  );
}

export default Login;
