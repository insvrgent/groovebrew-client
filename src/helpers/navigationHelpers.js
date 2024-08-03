import { useNavigate } from "react-router-dom";

/**
 * Custom hook to provide navigation functions.
 * @param {string} shopId - The shop ID for constructing URLs.
 * @returns {Object} - Navigation functions.
 */
export const useNavigationHelpers = (shopId, tableId) => {
  const navigate = useNavigate();

  const goToLogin = () => {
    // Construct the base URL
    let url = "/login";

    // Append query parameters conditionally
    const queryParams = new URLSearchParams();
    if (shopId) queryParams.append("next", shopId);
    if (tableId) queryParams.append("table", tableId);

    // Set the URL with query parameters
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    // Perform the navigation
    navigate(url);
  };
  const goToScan = () => {
    // Construct the base URL for the shop
    let url = `/scan`;

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

    // Append the tableId if it's provided
    if (tableId) {
      url += `/${tableId}`;
    }

    // Perform the navigation
    navigate(url);
  };

  const goToSearch = () => {
    let url = `/${shopId}`;
    if (tableId) {
      url += `/${tableId}`;
    }
    url += "/search";
    navigate(url);
  };

  const goToCart = () => {
    let url = `/${shopId}`;
    if (tableId) {
      url += `/${tableId}`;
    }
    url += "/cart";
    navigate(url);
  };

  const goToInvoice = (orderType, tableNumber, email) => {
    let url = `/${shopId}`;
    if (tableId) {
      url += `/${tableId}`;
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
    if (tableId) {
      url += `/${tableId}`;
    }
    url += "/transactions";
    navigate(url);
  };

  const goToGuestSideLogin = () => {
    let url = `/${shopId}`;
    if (tableId) {
      url += `/${tableId}`;
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
