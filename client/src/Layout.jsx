// Layout.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuthSync } from "./hooks/useAuthSync";

export default function Layout() {
  const { isAuthenticated, isLoading } = useAuth0();
  useAuthSync();

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#03040e]">
      {isAuthenticated && <Navbar />}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-28 lg:pb-8">
        <Outlet />
      </main>
    </div>
  );
}