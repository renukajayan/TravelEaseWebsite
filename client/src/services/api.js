const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, options = {}) {
  console.log("Calling API:", `${API_URL}${endpoint}`);
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token && { Authorization: `Bearer ${options.token}` }),
      ...(options.headers || {}),
    },
    body: options.body,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detailedMessage =
      data?.errors?.map((e) => `${e.field}: ${e.message}`).join(", ") ||
      data?.error ||
      data?.message ||
      "Something went wrong";

    throw new Error(detailedMessage);
  }

  return data;
}

export const getDestinations = () => apiRequest("/destinations");

export const getPackages = (query = "") => apiRequest(`/packages${query}`);

export const getPackageById = (id) => apiRequest(`/packages/${id}`);

export const loginUser = (formData) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const registerUser = (formData) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const getMyBookings = (token) =>
  apiRequest("/bookings", { token });

export const createBooking = (formData, token) =>
  apiRequest("/bookings", {
    method: "POST",
    token,
    body: JSON.stringify(formData),
  });

export const updateBooking = (id, formData, token) =>
  apiRequest(`/bookings/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(formData),
  });

export const deleteBooking = (id, token) =>
  apiRequest(`/bookings/${id}`, {
    method: "DELETE",
    token,
  });

export const createDestination = (formData, token) =>
  apiRequest("/destinations", {
    method: "POST",
    token,
    body: JSON.stringify(formData),
  });

export const updateDestination = (id, formData, token) =>
  apiRequest(`/destinations/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(formData),
  });

export const deleteDestination = (id, token) =>
  apiRequest(`/destinations/${id}`, {
    method: "DELETE",
    token,
  });

export const createPackage = (formData, token) =>
  apiRequest("/packages", {
    method: "POST",
    token,
    body: JSON.stringify(formData),
  });

export const updatePackage = (id, formData, token) =>
  apiRequest(`/packages/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(formData),
  });

export const deletePackage = (id, token) =>
  apiRequest(`/packages/${id}`, {
    method: "DELETE",
    token,
  });