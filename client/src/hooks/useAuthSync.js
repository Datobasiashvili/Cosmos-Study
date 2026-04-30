import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export const useAuthSync = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) return;

    const sync = async () => {
      try {
        const token = await getAccessTokenSilently();

        await fetch("/api/auth/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: user.email }),
        });
      } catch (err) {
        console.error("Auth sync failed:", err);
      }
    };

    sync();
  }, [isAuthenticated]);
};