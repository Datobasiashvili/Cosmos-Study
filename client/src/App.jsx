import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/analytics"
          element={<div className="p-10">Analytics Content</div>}
        />
        <Route
          path="/cosmos"
          element={<div className="p-10">Cosmos Content</div>}
        />
        <Route
          path="/settings"
          element={<div className="p-10">Settings Content</div>}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}