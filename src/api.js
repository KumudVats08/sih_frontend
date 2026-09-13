const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TOKEN_KEY = "skillsync_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function handleResponse(response) {
  if (!response.ok) {
    let detail = "Request failed";
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // ignore parse errors, use default message
    }
    throw new Error(detail);
  }
  return response.json();
}

export async function getDemand(district = "", sector = "") {
  const params = new URLSearchParams({ district, sector });
  const response = await fetch(`${API_BASE_URL}/demand?${params}`);
  return handleResponse(response);
}

export async function getGaps(district = "") {
  const params = new URLSearchParams({ district });
  const response = await fetch(`${API_BASE_URL}/gaps?${params}`);
  return handleResponse(response);
}

export async function getFlaggedCourses(district = "") {
  const params = new URLSearchParams({ district });
  const response = await fetch(`${API_BASE_URL}/courses/flagged?${params}`);
  return handleResponse(response);
}

export async function getDistrictPlan(districtId) {
  const response = await fetch(`${API_BASE_URL}/districts/${districtId}/plan`);
  return handleResponse(response);
}

export async function registerEmployer(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

export async function loginEmployer(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);
  setToken(data.access_token);
  return data;
}

export async function getMyProfile() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
}
