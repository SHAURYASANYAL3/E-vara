import { useState } from "react";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("evara-session"));

  if (!authed) {
    return <AuthPage onAuth={() => setAuthed(true)} />;
  }

  return <Dashboard onLogout={() => setAuthed(false)} />;
};

export default Index;
