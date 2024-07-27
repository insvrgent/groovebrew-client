import { useNavigate } from "react-router-dom";

/**
 * Custom hook to provide navigation functions.
 * @param {string} params - The shop ID for constructing URLs.
 * @returns {Object} - Navigation functions.
 */
export const useNavigationHelpers = (params) => {
  const navigate = useNavigate();

  const goToLogin = () => {
    if (params) navigate(`/login?next=${params}`);
    else navigate(`/login`);
  };

  const goToShop = () => {
    navigate(`/${params}/`);
  };

  const goToCart = () => {
    navigate(`/${params}/cart`);
  };

  const goToInvoice = (orderType, tableNumber, email) => {
    if (orderType === "serve" && tableNumber) {
      navigate(
        `/${params}/invoice?orderType=${orderType}&tableNumber=${tableNumber}&email=${email}`,
      );
    } else {
      navigate(`/${params}/invoice?orderType=${orderType}}&email=${email}`);
    }
  };

  const goToGuestSideLogin = () => {
    navigate(`/${params}/guest-side-login`);
  };

  const goToAdminCafes = () => {
    navigate(`/`);
  };

  return {
    goToLogin,
    goToShop,
    goToCart,
    goToInvoice,
    goToGuestSideLogin,
    goToAdminCafes,
  };
};
