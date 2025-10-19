// src/App.tsx

import { useMemo, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import SignInClassic from "./pages/SignInClassic";
import SignUp from "./pages/SignUp";
import Room from "./pages/Room";
import Whiteboard from "./pages/Whiteboard";
import Meetings from "./pages/Meetings"; // Import the new Meetings page

export default function App() {
  // Initialize auth state from session
  const initial = useMemo(
    () => (typeof window !== "undefined" ? sessionStorage.getItem("name") || "" : ""),
    []
  );
  const [authed, setAuthed] = useState<boolean>(!!initial);

  // We need navigate for the onLogin handler
  const navigate = useNavigate();

  const handleLogin = () => {
    setAuthed(true);
    navigate("/meetings"); // Redirect to the new meetings page after login
  };

  return (
    <Routes>
      {/* Landing first */}
      <Route path="/" element={<Landing />} />

      {/* Auth pages */}
      <Route path="/signin" element={<SignInClassic onLogin={handleLogin} />} />
      <Route path="/signin-classic" element={<SignInClassic onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected application routes */}
      <Route path="/meetings" element={authed ? <Meetings /> : <Navigate to="/signin" replace />} />
      <Route path="/room/:roomId" element={authed ? <Room /> : <Navigate to="/signin" replace />} />
      <Route path="/whiteboard" element={authed ? <Whiteboard /> : <Navigate to="/signin" replace />} />
      <Route path="/whiteboard/:roomId" element={authed ? <Whiteboard /> : <Navigate to="/signin" replace />} />

      {/* Fallback: If logged in, go to meetings, otherwise go to landing */}
      <Route path="*" element={<Navigate to={authed ? "/meetings" : "/"} replace />} />
    </Routes>
  );
}