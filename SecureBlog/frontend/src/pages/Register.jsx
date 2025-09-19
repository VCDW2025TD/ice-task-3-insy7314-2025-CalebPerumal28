import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../auth.css";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("https://localhost:5000/api/auth/register", {
        email,
        password,
      });

      alert("✅ Registered successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="tech-glass-card">
        <h1 className="tech-title">Create your SecureBlog account</h1>
        <p className="tech-subtext">Join the encrypted community today.</p>

        <form className="tech-form" onSubmit={handleRegister}>
          <div className="input-row">
            <label className="input-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
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
            <label className="input-label" htmlFor="reg-pass">Password</label>
            <input
              id="reg-pass"
              type="password"
              className="tech-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button className="tech-button" type="submit">
            Create account
          </button>

          <div className="auth-links">
            <button
              type="button"
              className="auth-link muted"
              onClick={() => navigate("/login")}
            >
              Already have an account? Log in
            </button>
            <span className="auth-link muted">
              By continuing, you agree to our terms.
            </span>
          </div>
        </form>

        {error && <p className="tech-error">{error}</p>}

        <hr className="auth-divider" />
        <div className="auth-footnote">
          © {new Date().getFullYear()} SecureBlog
        </div>
      </div>
    </div>
  );
}

export default Register;
