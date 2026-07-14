import { useState, useCallback, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getToken } from "../lib/getToken";

export function useCosmosCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();

  const fetchCosmosCourses = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken(getAccessTokenSilently, loginWithRedirect);
      if (!token) {
        throw new Error("Authentication token could not be retrieved");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/cosmos`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Error fetching cosmos courses:", err.message);
      setError(err.message);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchCosmosCourses, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchCosmosCourses]);

  return { courses, isLoading, error, fetchCosmosCourses };
}
