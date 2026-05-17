import { useState, useCallback, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const fetchSessions = useCallback(
    async (courseId) => {
      if (!isAuthenticated || !courseId) return;

      setIsLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://api.cosmos.study",
            scope: "openid profile email offline_access",
          },
        });
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/sessions`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok)
          throw new Error(`Server responded with status: ${response.status}`);

        const data = await response.json();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error("Error fetching sessions:", err.message);
        setError(err.message);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, getAccessTokenSilently],
  );

  const createSession = useCallback(
    async (courseId, description, pomodoroSettings) => {
      setError(null);
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://api.cosmos.study",
            scope: "openid profile email offline_access",
          },
        });
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/sessions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ description, pomodoroSettings }),
          },
        );

        if (!response.ok)
          throw new Error(`Server responded with status: ${response.status}`);

        const data = await response.json();
        setSessions((prev) => [...prev, data.session]);
        return data.session;
      } catch (err) {
        console.error("Error creating session:", err.message);
        setError(err.message);
      }
    },
    [getAccessTokenSilently],
  );

  const completeSession = useCallback(async () => {
    
  }, [getAccessTokenSilently]);

  return {
    sessions,
    isLoading,
    error,
    fetchSessions,
    createSession,
    completeSession,
  };
}
