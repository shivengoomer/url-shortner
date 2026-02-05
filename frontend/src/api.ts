const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface ApiOptions extends RequestInit {
  auth?: boolean;
}
export const apiRequest = async (
  endpoint: string,
  options: ApiOptions = {}
) => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.auth && token
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...options.headers, // Merge any additional headers from options
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers, // This now properly overrides with merged headers
  });

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = "API Error";

    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.msg || errorJson.error || errorJson.message || errorText;
    } catch {
      errorMessage = errorText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  return res.json();
};
