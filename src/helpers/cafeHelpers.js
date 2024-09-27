import API_BASE_URL from "../config.js";

function getAuthToken() {
  return localStorage.getItem("auth");
}

export async function getCafe(cafeId) {
  try {
    const response = await fetch(`${API_BASE_URL}/cafe/get-cafe/` + cafeId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cafes");
    }

    const cafe = await response.json();
    return cafe;
  } catch (error) {
    console.error("Error:", error);
  }
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
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cafes");
    }

    const cafes = await response.json();
    return cafes;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function createCafe(cafeName) {
  try {
    const response = await fetch(`${API_BASE_URL}/cafe/create-cafe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        name: cafeName,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create cafe");
    }

    const cafe = await response.json();
    return cafe;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function updateCafe(cafeId, cafeDetails) {
  try {
    const response = await fetch(`${API_BASE_URL}/cafe/update-cafe/${cafeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(cafeDetails),
    });

    if (!response.ok) {
      throw new Error("Failed to update cafe");
    }

    const updatedCafe = await response.json();
    return updatedCafe;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function setConfirmationStatus(cafeId, isNeedConfirmation) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cafe/confirmation-status/` + cafeId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ isNeedConfirmation: isNeedConfirmation }),
      }
    );

    if (!response.ok) {
      // throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to update item type:", error);
    throw error;
  }
}

// helpers/cafeHelpers.js
export async function saveCafeDetails(cafeId, details) {
  try {
    const formData = new FormData();

    // Append qrBackground file if it exists
    if (details.qrBackgroundFile) {
      formData.append("qrBackground", details.qrBackgroundFile);
    }

    // Append qrPayment file if it exists
    if (details.qrPaymentFile) {
      formData.append("qrPayment", details.qrPaymentFile);
    }

    // Append other form fields
    if (details.qrPosition) {
      formData.append("xposition", details.qrPosition.left);
      formData.append("yposition", details.qrPosition.top);
    }
    if (details.qrSize) formData.append("scale", details.qrSize);

    const response = await fetch(`${API_BASE_URL}/cafe/set-cafe/${cafeId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to save cafe details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving cafe details:", error);
    return null;
  }
}
