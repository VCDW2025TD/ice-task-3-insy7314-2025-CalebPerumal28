import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const role = (localStorage.getItem("role") || "reader").toLowerCase();
    if (role === "admin")      navigate("/dashboard/admin",  { replace: true });
    else if (role === "editor") navigate("/dashboard/editor", { replace: true });
    else if (role === "author") navigate("/dashboard/author", { replace: true });
    else                       navigate("/dashboard/reader", { replace: true });
  }, [navigate]);
  return <div style={{ padding: 16 }}>Checking your role…</div>;
}
