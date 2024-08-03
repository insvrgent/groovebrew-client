import API_BASE_URL from "../config.js";

// Function to retrieve the authentication token from localStorage
function getAuthToken() {
  return localStorage.getItem("auth");
}

// Helper function to get headers with authentication token
const getHeaders = (method = "GET") => {
  const headers = {
    Authorization: `Bearer ${getAuthToken()}`,
  };

  // No content-type header needed for FormData; fetch will handle it automatically
  if (method !== "POST" && method !== "PUT") {
    return { method, headers };
  }

  return {
    method,
    headers,
  };
};

// Create a new material
export const createMaterial = async (cafeId, data) => {
  console.log(cafeId);
  const response = await fetch(`${API_BASE_URL}/material/create/${cafeId}`, {
    ...getHeaders("POST"),
    body: data, // Assuming data is FormData with image
  });
  return response.json();
};

// Get all materials for a specific cafe
export const getMaterials = async (cafeId) => {
  const response = await fetch(
    `${API_BASE_URL}/material/get-materials/${cafeId}`,
    getHeaders()
  );
  return response.json();
};

// Get a single material by its ID
export const getMaterialById = async (materialId) => {
  const response = await fetch(
    `${API_BASE_URL}/material/get-material/${materialId}`,
    getHeaders()
  );
  return response.json();
};

// Update a material by its ID
export const updateMaterial = async (materialId, data) => {
  const response = await fetch(
    `${API_BASE_URL}/material/update-material/${materialId}`,
    {
      ...getHeaders("PUT"),
      body: data, // Assuming data is FormData with image
    }
  );
  return response.json();
};

// Delete a material by its ID
export const deleteMaterial = async (materialId) => {
  const response = await fetch(
    `${API_BASE_URL}/material/delete-material/${materialId}`,
    getHeaders("DELETE")
  );
  return response.json();
};
