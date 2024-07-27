import { getLocalStorage, updateLocalStorage } from './localStorageHelpers';

// Get quantity from localStorage based on cafeId and itemId
export const getItemQtyFromCart = (cafeId, itemId) => {
  const cart = JSON.parse(getLocalStorage('cart')) || [];
  const cafeItem = cart.find(cafeItem => cafeItem.cafeId === cafeId);
  if (cafeItem) {
    const item = cafeItem.items.find(item => item.itemId === itemId);
    return item ? item.qty : 0;
  }
  return 0;
};

export const getItemsByCafeId = (cafeId) => {
  const cart = JSON.parse(getLocalStorage('cart')) || [];
  const cafeItem = cart.find(cafeItem => cafeItem.cafeId === cafeId);
  return cafeItem ? cafeItem.items : [];
};

// Update quantity in localStorage for a specific cafeId and itemId
export const updateItemQtyInCart = (cafeId, itemId, qty) => {
  let cart = JSON.parse(getLocalStorage('cart')) || [];
  const cafeIndex = cart.findIndex(cafeItem => cafeItem.cafeId === cafeId);

  if (cafeIndex > -1) {
    const itemIndex = cart[cafeIndex].items.findIndex(item => item.itemId === itemId);
    if (itemIndex > -1) {
      if (qty > 0) {
        cart[cafeIndex].items[itemIndex].qty = qty; // Update qty if item exists
      } else {
        cart[cafeIndex].items.splice(itemIndex, 1); // Remove item if qty is 0
      }
    } else if (qty > 0) {
      cart[cafeIndex].items.push({ itemId, qty }); // Add new item
    }
  } else if (qty > 0) {
    cart.push({ cafeId, items: [{ itemId, qty }] }); // Add new cafeId and item
  }

  updateLocalStorage('cart', JSON.stringify(cart));
};

// Remove item from localStorage based on cafeId and itemId
export const removeItemFromCart = (cafeId, itemId) => {
  let items = JSON.parse(getLocalStorage('cart')) || [];
  const cafeIndex = items.findIndex(cafeItem => cafeItem.cafeId === cafeId);
  if (cafeIndex > -1) {
    items[cafeIndex].items = items[cafeIndex].items.filter(item => item.itemId !== itemId);
    if (items[cafeIndex].items.length === 0) {
      items.splice(cafeIndex, 1); // Remove cafeId if no items left
    }

    updateLocalStorage('cart', JSON.stringify(items));
  }
};

// Function to calculate total items count for a specific cafeId from localStorage
export const calculateTotals = (cafeId) => {
  // Get cart items from localStorage
  const cart = JSON.parse(getLocalStorage('cart')) || [];
  const cafeCart = cart.find(cafe => cafe.cafeId === cafeId);

  if (!cafeCart) {
    return { totalCount: 0, totalPrice: 0 }; // Return 0 if no items for the specified cafeId
  }

  const totalCount = cafeCart.items.reduce((total, item) => {
    return total + item.qty;
  }, 0);

  // Assuming each item has a `price` property
  const totalPrice = cafeCart.items.reduce((total, item) => {
    return total + (item.qty * item.price);
  }, 0);

  return { totalCount, totalPrice };
};

// Function to calculate total price for a specific cafeId from localStorage
export const calculateTotalPrice = (cafeId) => {
  // Get cart items from localStorage
  const cart = JSON.parse(getLocalStorage('cart')) || [];
  const cafeCart = cart.find(cafe => cafe.cafeId === cafeId);

  const totalPrice = cafeCart.items.reduce((total, cafeItem) => {
    if (cafeItem.cafeId === cafeId) {
      return total + cafeItem.items.reduce((acc, item) => acc + (item.qty * item.price), 0);
    }
    return total;
  }, 0);

  return totalPrice;
};
