import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";
import "../App.css";

export default function Home() {
  const navigate = useNavigate();

  const particlesInit = useCallback(async (main) => {
    await loadFull(main);
  }, []);

  return (
    <div className="home">
      {/* Background Particles (subtle) */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="particles"
        options={{
          fullScreen: { enable: false },
          background: { color: "#0b1020" },
          style: { position: "absolute", inset: 0, zIndex: 0 },
          particles: {
            number: { value: 40 },
            size: { value: 1.8 },
            move: { enable: true, speed: 0.4 },
            opacity: { value: 0.3 },
            links: { enable: true, color: "#6ee7f9", distance: 110, opacity: 0.2 },
          },
        }}
      />

      {/* Top Bar */}
      <header className="topbar container">
        <div className="brand">Secure<span>Blog</span></div>
        <nav className="nav">
          <button className="link" onClick={() => navigate("/features")}>Features</button>
          <button className="link" onClick={() => navigate("/pricing")}>Pricing</button>
          <button className="link" onClick={() => navigate("/docs")}>Docs</button>
        </nav>
        <div className="actions">
          <button className="btn ghost" onClick={() => navigate("/login")}>Log in</button>
          <button className="btn primary" onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </header>

      {/* Hero */}
      <main className="hero container">
        <motion.h1
          className="hero-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Write freely. Share safely.
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          A private, encrypted, and optionally anonymous space to publish your thoughts.
          Own your voice without sacrificing your security.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <button className="btn primary lg" onClick={() => navigate("/register")}>Create your account</button>
          <button className="btn ghost lg" onClick={() => navigate("/login")}>I already have one</button>
        </motion.div>

        {/* Trust badges */}
        <motion.ul
          className="badges"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <li>End-to-End Encryption</li>
          <li>Role-based Access</li>
          <li>Anonymous Mode</li>
          <li>Gamified Progress</li>
        </motion.ul>
      </main>

      {/* Feature Cards */}
      <section className="features container">
        <FeatureCard
          title="Private by default"
          desc="Your content is encrypted at rest and in transit. You control who sees what."
        />
        <FeatureCard
          title="Identity optional"
          desc="Post as you, your handle, or fully anonymous — switch per post."
        />
        <FeatureCard
          title="Clean editor"
          desc="A frictionless writing experience with markdown and media embeds."
        />
      </section>

      {/* Showcase / Preview */}
      <section className="showcase container">
        <motion.div
          className="showcase-card"
          initial={{ scale: 0.98, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="showcase-title">A focused place to think</div>
          <div className="showcase-sub">Zero clutter. Zero noise. Just your words, beautifully presented.</div>
          <div className="showcase-window">
            <div className="window-dots">
              <span></span><span></span><span></span>
            </div>
            <div className="window-body">
              <h3>Why privacy matters in public writing</h3>
              <p>
                Privacy isn’t about hiding — it’s about choosing how you show up.
                With SecureBlog, you decide the audience for every post, from fully public to invite-only.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA block */}
      <section className="cta container">
        <div className="cta-inner">
          <h2>Ready to publish on your terms?</h2>
          <p>Join creators who value safety, control, and great writing UX.</p>
          <div className="cta-actions">
            <button className="btn primary" onClick={() => navigate("/register")}>Get Started Free</button>
            <button className="btn ghost" onClick={() => navigate("/docs")}>Read the Docs</button>
          </div>
        </div>
      </section>
<hr className="section-sep" />

      {/* Footer */}
      <footer className="footer container">
        <div className="brand">Secure<span>Blog</span></div>
        <div className="foot-links">
          <button className="link" onClick={() => navigate("/privacy")}>Privacy</button>
          <button className="link" onClick={() => navigate("/terms")}>Terms</button>
          <button className="link" onClick={() => navigate("/contact")}>Contact</button>
        </div>
        <div className="copy">© {new Date().getFullYear()} SecureBlog. All rights reserved.</div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <motion.article
      className="feature-card"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.article>
  );
}
