const BASE_URL = "http://localhost:5000"; 

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
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API Error");
  }

  return res.json();
};
