import API_BASE_URL from "../config.js";

function getAuthToken() {
  return localStorage.getItem("auth");
}

export async function getOwnedCafes(userId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cafe/get-cafe-by-ownerId/` + userId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cart details");
    }

    const cafes = await response.json();
    return cafes;
  } catch (error) {
    console.error("Error:", error);
  }
}
