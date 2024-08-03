import API_BASE_URL from "../config.js";

// Function to retrieve the authentication token from localStorage
function getAuthToken() {
  return localStorage.getItem("auth");
}

// Helper function to get headers with authentication token
const getHeaders = (method = "GET", body = null) => {
  const headers = {
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  };

  return {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };
};

// Create a new material mutation
export const createMaterialMutation = async (materialId, data) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/mutation/create/${materialId}`,
      getHeaders("POST", data)
    );
    if (!response.ok) throw new Error("Failed to create material mutation.");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get all material mutations for a specific cafe
export const getMaterialMutations = async (cafeId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/mutation/get-material-mutations/${cafeId}`,
      getHeaders()
    );
    if (!response.ok) throw new Error("Failed to retrieve material mutations.");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get a single material mutation by its ID
export const getMaterialMutationById = async (mutationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/mutation/get-material-mutation/${mutationId}`,
      getHeaders()
    );
    if (!response.ok) throw new Error("Failed to retrieve material mutation.");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
