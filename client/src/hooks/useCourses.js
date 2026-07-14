import { useState, useCallback, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiFetch } from "../lib/helper";
import { getToken } from "../lib/getToken";

export function useCourse() {
  const [courses, setCourses] = useState([]);
  const [isCourseLoading, setIsCourseLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  const fetchCourses = useCallback(async () => {
    if (isLoading || !isAuthenticated) return;
    setIsCourseLoading(true);
    setError(null);
    try {
      const token = await getToken(getAccessTokenSilently, loginWithRedirect);
      const data = await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/courses`,
        token,
      );
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
      setError(err.message);
      setCourses([]);
    } finally {
      setIsCourseLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  // TODO: finish this function:
  // const fetchArchivedCourses = useCallback(async () => {

  // })

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = useCallback(
    async ({ title, color }) => {
      if (!isAuthenticated) return;
      setError(null);
      try {
        const token = await getToken(getAccessTokenSilently, loginWithRedirect);
        const data = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/courses`,
          token,
          { method: "POST", body: { title, color } },
        );
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
      if (!isAuthenticated) return;
      setError(null);
      try {
        const token = await getToken(getAccessTokenSilently, loginWithRedirect);
        await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/archive`,
          token,
          { method: "PATCH" },
        );
        setCourses((prev) =>
          prev.map((c) => (c._id === courseId ? { ...c, archived: true } : c)),
        );
      } catch (err) {
        console.error("Error archiving course:", err.message);
        setError(err.message);
      }
    },
    [isAuthenticated, getAccessTokenSilently],
  );

  const deleteCourse = useCallback(
    async (courseId) => {
      if (!isAuthenticated) return;
      try {
        const token = getToken(getAccessTokenSilently, loginWithRedirect)
        await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/courses/${courseId}`,
          token,
          { method: "DELETE" },
        );
        setCourses((prev) => prev.filter((s) => s._id !== courseId));
      } catch (err) {
        console.error("Error deleting course:", err.message);
        setError(err.message);
      }
    },
    [isAuthenticated, getAccessTokenSilently],
  );

  return {
    courses,
    fetchCourses,
    isCourseLoading,
    createCourse,
    error,
    archiveCourse,
    deleteCourse,
  };
}
