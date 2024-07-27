import API_BASE_URL from "../config.js";
import { getLocalStorage } from "./localStorageHelpers";
import { getItemsByCafeId } from "../helpers/cartHelpers.js";

export const handlePaymentFromClerk = async (
  shopId,
  user_email,
  payment_type,
  serving_type,
  tableNo,
) => {
  try {
    const token = getLocalStorage("auth");
    const items = getItemsByCafeId(shopId);

    const structuredItems = {
      items: items.map((item) => ({
        itemId: item.itemId,
        qty: item.qty,
      })),
    };

    console.log(items);
    const response = await fetch(
      API_BASE_URL + "/transaction/fromClerk/" + shopId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_email: user_email,
          payment_type,
          serving_type,
          tableNo,
          transactions: structuredItems,
        }),
      },
    );

    if (response.ok) {
      // Handle success response
      console.log("Transaction successful!");
      // Optionally return response data or handle further actions upon success
      return true;
    } else {
      // Handle error response
      console.error("Transaction failed:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error sending transaction:", error);
    // Handle network or other errors
    return false;
  }
};

export const handlePaymentFromGuestSide = async (
  shopId,
  user_email,
  payment_type,
  serving_type,
  tableNo,
) => {
  try {
    const token = getLocalStorage("authGuestSide");
    const items = getItemsByCafeId(shopId);

    const structuredItems = {
      items: items.map((item) => ({
        itemId: item.itemId,
        qty: item.qty,
      })),
    };

    console.log(items);
    const response = await fetch(
      API_BASE_URL + "/transaction/fromGuestSide/" + shopId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_email: user_email,
          payment_type,
          serving_type,
          tableNo,
          transactions: structuredItems,
        }),
      },
    );

    if (response.ok) {
      // Handle success response
      console.log("Transaction successful!");
      // Optionally return response data or handle further actions upon success
      return true;
    } else {
      // Handle error response
      console.error("Transaction failed:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error sending transaction:", error);
    // Handle network or other errors
    return false;
  }
};

export const handlePaymentFromGuestDevice = async (
  shopId,
  payment_type,
  serving_type,
  tableNo,
) => {
  try {
    const token = getLocalStorage("auth");
    const items = getItemsByCafeId(shopId);

    const structuredItems = {
      items: items.map((item) => ({
        itemId: item.itemId,
        qty: item.qty,
      })),
    };

    console.log(items);
    const response = await fetch(
      API_BASE_URL + "/transaction/fromGuestDevice/" + shopId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_type,
          serving_type,
          tableNo,
          transactions: structuredItems,
        }),
      },
    );

    if (response.ok) {
      // Handle success response
      console.log("Transaction successful!");
      // Optionally return response data or handle further actions upon success
      return true;
    } else {
      // Handle error response
      console.error("Transaction failed:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error sending transaction:", error);
    // Handle network or other errors
    return false;
  }
};
