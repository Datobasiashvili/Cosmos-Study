import { useState, useCallback, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export function useCourse() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently, loginWithRedirect, isAuthenticated } =
    useAuth0();

  const fetchCourses = useCallback(async () => {
    if (!isAuthenticated) return;

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
        `${import.meta.env.VITE_API_URL}/api/courses`,
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
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
      setError(err.message);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = useCallback(
    async ({ title, color }) => {
      if (!isAuthenticated) return;

      setError(null);
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/courses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, color }),
          },
        );

        if (!response.ok)
          throw new Error(`Server responded with status: ${response.status}`);

        const data = await response.json();
        setCourses((prev) => [data.course, ...prev]);
      } catch (err) {
        console.error("Error adding course:", err.message);
        setError(err.message);
      }
    },
    [isAuthenticated, getAccessTokenSilently],
  );

  const archiveCourse = useCallback(
    async (courseId) => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/archive`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok)
          throw new Error(`Server responded with status: ${response.status}`);

        setCourses((prev) =>
          prev.map((c) => (c._id === courseId ? { ...c, archived: true } : c)),
        );
      } catch (err) {
        console.error("Error archiving course:", err.message);
        setError(err.message);
      }
    },
    [getAccessTokenSilently],
  );

  return {
    courses,
    fetchCourses,
    isLoading,
    createCourse,
    error,
    archiveCourse,
  };
}
