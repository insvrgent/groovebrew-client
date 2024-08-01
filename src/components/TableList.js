import React from "react";

const TableList = ({ tables, onSelectTable, selectedTable }) => {
  return (
    <div
      style={{
        width: "100%",
        marginTop: "20px",
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        {tables.map((table) => (
          <li
            key={table.tableId}
            style={{
              backgroundColor: "white",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: "pointer",
              backgroundColor:
                table.tableId === selectedTable?.tableId
                  ? "lightblue"
                  : "white",
            }}
            onClick={() => onSelectTable(table)}
          >
            {table.tableNo === 0 ? "Clerk" : `Table ${table.tableNo}`} -
            Position: ({table.xposition}, {table.yposition})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableList;
