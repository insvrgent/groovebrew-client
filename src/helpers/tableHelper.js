import API_BASE_URL from '../config.js';

export async function getTable(shopId, tableNo) {
  try {
    const response = await fetch(`${API_BASE_URL}/table/get-table/${shopId}?tableNo=${tableNo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const tableDetail = await response.json();
    return tableDetail;
  } catch (error) {
    console.error('Error:', error);
  }
}
