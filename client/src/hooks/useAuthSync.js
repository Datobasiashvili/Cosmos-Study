import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { apiFetch } from "../lib/helper";
import { getToken } from "../lib/getToken";

export const useAuthSync = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    const sync = async () => {
      try {
        const token = await getToken(getAccessTokenSilently, loginWithRedirect);
        await apiFetch(`${import.meta.env.VITE_API_URL}/api/auth/sync`, token, {
          method: "POST",
          body: {
            email: user.email,
            username: user.nickname,
            sub: user.sub,
          },
        });
      } catch (err) {
        console.error("Auth sync failed:", err.message);
      }
    };

    sync();
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently, loginWithRedirect]);
};