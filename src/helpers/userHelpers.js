import {
  getLocalStorage,
  updateLocalStorage,
  removeLocalStorage,
} from "./localStorageHelpers";
import API_BASE_URL from "../config.js";

export async function checkToken(socketId) {
  console.log(socketId);
  const token = getLocalStorage("auth");
  if (token) {
    try {
      const response = await fetch(API_BASE_URL + "/user/check-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          socketId,
        }),
      });
      if (response.status === 200) {
        const responseData = await response.json();

        return { ok: true, user: responseData };
      } else {
        removeLocalStorage("auth");
        return { ok: false };
      }
    } catch (error) {
      console.error("Error occurred while verifying token:", error.message);
      return { ok: false };
    }
  }
  return { ok: false };
}

export async function getConnectedGuestSides() {
  const token = getLocalStorage("auth");
  if (token) {
    try {
      const response = await fetch(API_BASE_URL + "/getConnectedGuestsSides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const { message, sessionDatas } = await response.json();
        console.log(message);
        return { ok: true, sessionDatas };
      } else {
        updateLocalStorage("authGuestSide", "");
        return { ok: false };
      }
    } catch (error) {
      console.error("Error occurred while verifying token:", error.message);
      return { ok: false };
    }
  }
  return { ok: false };
}

export async function removeConnectedGuestSides(guestSideSessionId) {
  const token = getLocalStorage("auth");
  if (token) {
    try {
      const response = await fetch(
        API_BASE_URL + "/removeConnectedGuestsSides",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            guestSideSessionId,
          }),
        },
      );
      if (response.status === 200) {
        const { message, guestSideList } = await response.json();
        console.log(message);
        return { ok: true, guestSideList };
      } else {
        return { ok: false };
      }
    } catch (error) {
      console.error("Error occurred while verifying token:", error.message);
      return { ok: false };
    }
  }
  return { ok: false };
}

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(API_BASE_URL + `/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    console.log(username, password);
    const responseData = await response.json();

    if (response.ok) {
      return {
        success: true,
        token: responseData.token,
        cafeId: responseData.cafeId,
      };
    } else {
      return { success: false, token: null };
    }
  } catch (error) {
    console.error("Error occurred while logging in:", error.message);
    return { success: false, token: null };
  }
};

export const updateUser = async (formData) => {
  const token = getLocalStorage("auth");
  if (token) {
    try {
      const response = await fetch(API_BASE_URL + "/user/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
};

//for super
export const getAllCafeOwner = async (formData) => {
  const token = getLocalStorage("auth");
  if (token) {
    try {
      const response = await fetch(API_BASE_URL + "/user/get-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
};

export const createClerks = async (shopId, email, username, password) => {
  const token = getLocalStorage("auth");
  if (token) {
    try {
      const response = await fetch(
        API_BASE_URL + "/user/create-clerk/" + shopId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: email,
            username: username,
            password: password,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting clerk:", error);
    }
  }
};

export const getClerks = async (shopId) => {
  const token = getLocalStorage("auth");
  if (token) {
    try {
      const response = await fetch(API_BASE_URL + "/user/get-clerk/" + shopId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting clerk:", error);
    }
  }
};
