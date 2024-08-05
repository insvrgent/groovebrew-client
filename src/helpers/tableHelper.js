import API_BASE_URL from "../config.js";
import { getLocalStorage } from "./localStorageHelpers";

export async function createTable(shopId, newTable) {
  try {
    const token = getLocalStorage("auth");

    // Construct the URL endpoint for creating a new table
    const response = await fetch(`${API_BASE_URL}/table/create/${shopId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        newTable: newTable,
      }), // Include the new table data in the body
    });

    if (!response.ok) {
      const error = await response.text(); // Get error details from the response
      throw new Error(`Error: ${error}`);
    }

    const table = await response.json(); // Assuming the response is the created table
    return table;
  } catch (error) {
    console.error("Error:", error);
    return false; // or handle the error as needed
  }
}

export async function updateTable(shopId, table) {
  try {
    console.log(table);
    const token = getLocalStorage("auth");
    const response = await fetch(
      `${API_BASE_URL}/table/set-table/${shopId}/${table.tableId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          table: table,
        }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const tables = await response.json();
    return tables;
  } catch (error) {
    console.error("Error:", error);
  }
}
export async function getTables(shopId) {
  try {
    const token = getLocalStorage("auth");
    const response = await fetch(`${API_BASE_URL}/table/get-tables/${shopId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const tables = await response.json();
    return tables;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getTable(shopId, tableNo) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/table/get-table/${shopId}?tableNo=${tableNo}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const tableDetail = await response.json();
    return tableDetail;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getTableByCode(tableCode) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/table/get-table-by-code/${tableCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const table = await response.json();
    return table;
  } catch (error) {
    console.error("Error:", error);
  }
}
