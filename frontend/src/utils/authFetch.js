export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
};