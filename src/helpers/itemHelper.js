import API_BASE_URL from "../config.js";
import { getItemsByCafeId } from "./cartHelpers.js";

export async function getItemTypesWithItems(shopId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/item/get-cafe-items/` + shopId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return { response, cafe: data.cafe, data: data.data }; // Return an object with response and data
  } catch (error) {
    console.error("Failed to fetch item types with items:", error);
    throw error;
  }
}

export async function getItemType(shopId) {
  try {
    const response = await fetch(`${API_BASE_URL}/item/getItemType/` + shopId);

    const data = await response.json();
    return { response, data: data.data }; // Return an object with response and data
  } catch (error) {
    console.error("Failed to fetch item types with items:", error);
    throw error;
  }
}

export async function getCartDetails(shopId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/item/get-cart-details/` + shopId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getItemsByCafeId(shopId)),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cart details");
    }

    const cartDetails = await response.json();
    console.log(cartDetails);
    return cartDetails;
  } catch (error) {
    console.error("Error:", error);
  }
}

export function getImageUrl(notimageurl) {
  return API_BASE_URL + "/" + notimageurl;
}

function getAuthToken() {
  return localStorage.getItem("auth");
}

export async function createItem(
  shopId,
  name,
  price,
  selectedImage,
  itemTypeId
) {
  try {
    console.log(selectedImage);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", selectedImage);
    formData.append("itemTypeId", itemTypeId);

    const response = await fetch(`${API_BASE_URL}/item/create/${shopId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${errorMessage}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create item type:", error);
    throw error;
  }
}

export async function updateItem(
  itemId,
  name,
  price,
  selectedImage,
  isVisible
) {
  try {
    console.log(selectedImage);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", selectedImage);
    formData.append("isVisible", isVisible);

    const response = await fetch(`${API_BASE_URL}/item/set-item/${itemId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${errorMessage}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create item type:", error);
    throw error;
  }
}

export async function updateItemAvalilability(itemId, isAvailable) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/item/set-availability/` + itemId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ isAvailable: isAvailable }),
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

export async function createItemType(shopId, name, selectedImage) {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", selectedImage);

    const response = await fetch(`${API_BASE_URL}/item/createType/${shopId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${errorMessage}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create item type:", error);
    throw error;
  }
}
export async function updateItemType(
  shopId,
  itemTypeId,
  newName,
  previewUrl,
  selectedImage,
  isVisible
) {
  try {
    const formData = new FormData();
    formData.append("name", newName);
    console.log(selectedImage);
    console.log(previewUrl);
    // Check if selectedImage contains API_BASE_URL
    if (selectedImage == null) {
      // Remove the API_BASE_URL and any leading slashes
      previewUrl = previewUrl.replace(API_BASE_URL, "").replace(/^\/+/, "");
      formData.append("sampleImage", previewUrl);
    } else formData.append("image", selectedImage);
    console.log(selectedImage);
    formData.append("isVisible", isVisible);

    const response = await fetch(
      `${API_BASE_URL}/item/updateType/${shopId}/${itemTypeId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update item type:", error);
    throw error;
  }
}

export async function deleteItemType(shopId, itemTypeId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/item/deleteType/` + shopId + "/" + itemTypeId,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to delete item type:", error);
    throw error;
  }
}
