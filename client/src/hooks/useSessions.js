import { useState, useCallback, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiFetch } from "../lib/helper";
import { getToken } from "../lib/getToken";

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalSessions: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const requestIdRef = useRef(0);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();

  const resetSessions = useCallback(() => {
    requestIdRef.current += 1;
    setSessions([]);
    setIsLoading(false);
    setError(null);
    setPagination({
      page: 1,
      totalPages: 1,
      totalSessions: 0,
      hasNextPage: false,
      hasPrevPage: false,
    });
  }, []);

  const fetchSessions = useCallback(
    async (courseId, page = 1, limit = 20) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      if (!isAuthenticated || !courseId) {
        setSessions([]);
        return;
      }
      if (page === 1) setSessions([]);
      setIsLoading(true);
      setError(null);

      try {
        const token = await getToken(getAccessTokenSilently, loginWithRedirect);
        const data = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/sessions?page=${page}&limit=${limit}`,
          token,
          { method: "GET" },
        );
        
        if (requestIdRef.current === requestId) {
          // Append for load-more, replace for page-based
          setSessions((prev) =>
            page === 1
              ? data.sessions || []
              : [...prev, ...(data.sessions || [])],
          );
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error("Error fetching sessions:", err.message);
        if (requestIdRef.current === requestId) {
          setError(err.message);
          setSessions([]);
        }
      } finally {
        if (requestIdRef.current === requestId) setIsLoading(false);
      }
    },
    [isAuthenticated, getAccessTokenSilently],
  );

  const fetchNextPage = useCallback(
    (courseId) => {
      if (pagination.hasNextPage && !isLoading) {
        fetchSessions(courseId, pagination.page + 1);
      }
    },
    [pagination, isLoading, fetchSessions],
  );

  const createSession = useCallback(
    async (courseId, description, pomodoroSettings) => {
      if (!isAuthenticated) return;
      setError(null);
      try {
        const token = await getToken(getAccessTokenSilently, loginWithRedirect);

        const data = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/sessions`,
          token,
          { method: "POST", body: { description, pomodoroSettings } },
        );

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
      if (!isAuthenticated);
      setError(null);

      const durationMinutes = Math.min(
        600,
        Math.max(1, Math.round(durationSeconds / 60)),
      );

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
            : s,
        ),
      );

      try {
        const token = await getToken(getAccessTokenSilently, loginWithRedirect);

        const data = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/sessions/${sessionId}`,
          token,
          { method: "PATCH", body: { duration: durationMinutes } },
        );
        setSessions((prev) =>
          prev.map((s) => (s._id === sessionId ? data.session : s)),
        );
        return data.session;
      } catch (err) {
        console.error("Error completing session:", err.message);
        setError(err.message);

        setSessions((prev) =>
          prev.map((s) =>
            s._id === sessionId
              ? {
                  ...s,
                  completed: false,
                  duration: undefined,
                  endTime: undefined,
                  xpEarned: undefined,
                }
              : s,
          ),
        );
      }
    },
    [isAuthenticated, getAccessTokenSilently],
  );

  const deleteSession = useCallback(
    async (courseId, sessionId) => {
      if (!isAuthenticated) return;
      setError(null);

      try {
        const token = await getToken(getAccessTokenSilently, loginWithRedirect);
        
        await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/sessions/${sessionId}`,
          token,
          { method: "DELETE" },
        );
        setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      } catch (err) {
        console.error("Error deleting session:", err.message);
        setError(err.message);
      }
    },
    [isAuthenticated, getAccessTokenSilently],
  );

  return {
    sessions,
    isLoading,
    error,
    resetSessions,
    fetchSessions,
    createSession,
    completeSession,
    deleteSession,
  };
}
