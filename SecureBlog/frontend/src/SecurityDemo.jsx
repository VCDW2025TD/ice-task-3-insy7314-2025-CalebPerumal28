import { useState } from "react";

export default function SecurityDemo() {
  const [events, setEvents] = useState([]);

  const log = (msg) => setEvents((prev) => [...prev, msg]);

  const tryExternalFetch = async () => {
    try {
      const res = await fetch("https://api.github.com/rate_limit");
      log(`External fetch status: ${res.status}`);
    } catch (e) {
      log(`External fetch error: ${e.message}`);
    }
  };

  const tryEval = () => {
    try {
      const fn = new Function("return 42"); // unsafe-eval
      alert(fn());
    } catch (e) {
      log(`Eval error: ${e.message}`);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>CSP Demo</h2>

      {/* External image violation */}
      <img
        src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b"
        alt="Blocked image"
        width={300}
        height={200}
        onError={() => log("🖼️ External image blocked (expected)")}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={tryExternalFetch}>Try external fetch</button>
        <button onClick={tryEval} style={{ marginLeft: 8 }}>
          Try eval()
        </button>
      </div>

      <h3 style={{ marginTop: 16 }}>Events:</h3>
      <ul>
        {events.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>

      <p>
        Open DevTools → Console & Network to observe CSP blocks.
        Also check backend logs for POSTs to <code>/csp-report</code>.
      </p>
    </div>
  );
}
