// for useCourses.js
export async function apiFetch(url, token, { method = "GET", body } = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  if (!response.ok)
    throw new Error(`Server responded with status: ${response.status}`);

  return response.status === 204 ? null : response.json();
}
