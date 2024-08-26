import API_BASE_URL from "../config.js";

// Function to retrieve the authentication token from localStorage
function getAuthToken() {
  return localStorage.getItem("auth") || null;
}

// Helper function to get headers with authentication token
const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
  };
};

// Create a new material mutation
export const createMaterialMutation = async (materialId, data) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/mutation/create/${materialId}`,
      {
        ...getHeaders(),
        method: "POST",
        body: JSON.stringify({
          newStock: data.get("newStock"),
          reason: data.get("reason"),
        }),
      }
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
      {
        ...getHeaders(),
        method: "GET",
      }
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
      {
        ...getHeaders(),
        method: "GET",
      }
    );
    if (!response.ok) throw new Error("Failed to retrieve material mutation.");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get all material mutations by materialId
export const getMaterialMutationsByMaterialId = async (materialId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/mutation/get-material-mutations-by-material/${materialId}`,
      {
        ...getHeaders(),
        method: "GET",
      }
    );
    if (!response.ok)
      throw new Error("Failed to retrieve material mutations by material ID.");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
