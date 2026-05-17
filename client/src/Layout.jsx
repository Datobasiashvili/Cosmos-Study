import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
 
export default function Layout() {
  const { user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
 
  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: "https://api.cosmos.study",
              scope: "openid profile email offline_access",
            },
          });
          await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: user.email,
              username: user.nickname,
              sub: user.sub,
            }),
          });
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      }
    };
    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);
 
  if (isLoading) return null;
 
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#03040e]">
      {isAuthenticated && <Navbar />}
 
      <main className="
        flex-1
        px-4 sm:px-6 lg:px-8
        pt-6 sm:pt-8          
        pb-28 lg:pb-8         
      ">
        <Outlet />
      </main>
    </div>
  );
}
 