// localStorageHelpers.js

// Get cart items from localStorage
export const getLocalStorage = (storageName) => {
    return localStorage.getItem(storageName) || null;
};

export const updateLocalStorage = (storageName, value) => {
    localStorage.setItem(storageName, value);
    
    const event = new Event('localStorageUpdated');
    window.dispatchEvent(event);
}

export const removeLocalStorage = (storageName,) => {
    localStorage.removeItem(storageName);
    
    const event = new Event('localStorageUpdated');
    window.dispatchEvent(event);
}
