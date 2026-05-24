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
        if (!token) {
          throw new Error("Authentication token could not be retrieved");
        }

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
        if (!token) {
          throw new Error("Authentication token could not be retrieved");
        }

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

  const completeSession = useCallback(
  async (courseId, sessionId, durationSeconds) => {
    setError(null);

    // Convert to minutes, clamp to schema bounds (min 1, max 600)
    const durationMinutes = Math.min(600, Math.max(1, Math.round(durationSeconds / 60)));

    // Optimistic update
    setSessions((prev) =>
      prev.map((s) =>
        s._id === sessionId
          ? {
              ...s,
              duration: durationMinutes,
              endTime: new Date().toISOString(),
              completed: true,
              xpEarned: Math.max(5, Math.round(durationMinutes * 2)),
            }
          : s
      )
    );

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.cosmos.study",
          scope: "openid profile email offline_access",
        },
      });
      if (!token) return;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/sessions/${sessionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ duration: durationMinutes }), // ← only what schema expects
        }
      );

      if (!response.ok)
        throw new Error(`Server responded with status: ${response.status}`);

      const data = await response.json();

      // Replace optimistic entry with real server data
      setSessions((prev) =>
        prev.map((s) => (s._id === sessionId ? data.session : s))
      );

      return data.session;
    } catch (err) {
      console.error("Error completing session:", err.message);
      setError(err.message);

      // Roll back optimistic update
      setSessions((prev) =>
        prev.map((s) =>
          s._id === sessionId
            ? { ...s, completed: false, duration: undefined, endTime: undefined, xpEarned: undefined }
            : s
        )
      );
    }
  },
  [getAccessTokenSilently]
);

  const deleteSession = useCallback(
    async (courseId, sessionId) => {
      setError(null);
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://api.cosmos.study",
            scope: "openid profile email offline_access",
          },
        });

        if (!token) {
          throw new Error("Authentication token could not be retrieved");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/sessions/${sessionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      } catch (err) {
        console.error("Error deleting session:", err.message);
        setError(err.message);
      }
    },
    [getAccessTokenSilently, setSessions],
  );

  return {
    sessions,
    isLoading,
    error,
    fetchSessions,
    createSession,
    completeSession,
    deleteSession,
  };
}
