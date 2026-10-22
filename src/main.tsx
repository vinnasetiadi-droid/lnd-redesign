
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // No login screen in this copy: sign in as the demo L&D admin (same account as the full app)
  if (!localStorage.getItem("lx-auth")) {
    localStorage.setItem("lx-auth", JSON.stringify({ state: { isAuthenticated: true, user: { email: "ld@learnxpert.com", name: "Diana Hartwell", role: "ld_team" } }, version: 0 }));
  }

  createRoot(document.getElementById("root")!).render(<App />);
  