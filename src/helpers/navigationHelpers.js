import { useNavigate } from "react-router-dom";

/**
 * Custom hook to provide navigation functions.
 * @param {string} shopId - The shop ID for constructing URLs.
 * @returns {Object} - Navigation functions.
 */
export const useNavigationHelpers = (shopId, tableCode) => {
  const navigate = useNavigate();

  const goToLogin = () => {
    // Construct the base URL
    let url = "/login";

    // Append query parameters conditionally
    const queryParams = new URLSearchParams();
    if (shopId) queryParams.append("next", shopId);
    if (tableCode) queryParams.append("table", tableCode);

    // Set the URL with query parameters
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    // Perform the navigation
    navigate(url);
  };
  const goToScan = () => {
    // Construct the base URL
    let url = "/scan";

    // Append query parameters conditionally
    const queryParams = new URLSearchParams();
    if (shopId) queryParams.append("next", shopId);

    // Set the URL with query parameters
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    // Perform the navigation
    navigate(url);
  };

  const goToNonTable = () => {
    // Construct the base URL for the shop
    let url = `/${shopId}`;

    // Perform the navigation
    navigate(url);
  };
  const goToShop = () => {
    // Construct the base URL for the shop
    let url = `/${shopId}`;

    // Append the tableCode if it's provided
    if (tableCode) {
      url += `/${tableCode}`;
    }

    // Perform the navigation
    navigate(url);
  };

  const goToSearch = () => {
    let url = `/${shopId}`;
    if (tableCode) {
      url += `/${tableCode}`;
    }
    url += "/search";
    navigate(url);
  };

  const goToCart = () => {
    let url = `/${shopId}`;
    if (tableCode) {
      url += `/${tableCode}`;
    }
    url += "/cart";
    navigate(url);
  };

  const goToInvoice = (orderType, tableNumber, email) => {
    let url = `/${shopId}`;
    if (tableCode) {
      url += `/${tableCode}`;
    }
    url += `/invoice?orderType=${orderType}`;
    if (tableNumber) {
      url += `&tableNumber=${tableNumber}`;
    }
    if (email) {
      url += `&email=${email}`;
    }
    navigate(url);
  };

  const goToTransactions = () => {
    let url = `/${shopId}`;
    if (tableCode) {
      url += `/${tableCode}`;
    }
    url += "/transactions";
    navigate(url);
  };

  const goToGuestSideLogin = () => {
    let url = `/${shopId}`;
    if (tableCode) {
      url += `/${tableCode}`;
    }
    url += "/guest-side-login";
    navigate(url);
  };

  const goToAdminCafes = () => {
    navigate(`/`);
  };

  return {
    goToLogin,
    goToShop,
    goToSearch,
    goToCart,
    goToInvoice,
    goToTransactions,
    goToGuestSideLogin,
    goToAdminCafes,
    goToScan,
    goToNonTable,
  };
};
