import React, { useState, useEffect } from "react";
import { getTables, updateTable, createTable } from "../helpers/tableHelper";
import { getTransactions } from "../helpers/transactionHelpers";
import TableCanvas from "./TableCanvas";
import TableList from "./TableList";

const TablesPage = ({ shopId }) => {
  const [transactions, setTransactions] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [newTable, setNewTable] = useState(null);
  const [originalTables, setOriginalTables] = useState([]);
  const [tableNo, setTableNo] = useState(""); // State for table name

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTables = await getTables(shopId);
        setTables(fetchedTables);
        setOriginalTables(fetchedTables);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchData();
  }, [shopId]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTransactions = await getTransactions(shopId);
        // setTransactions(fetchedTransactions);
        console.log(fetchedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchData();
  }, [shopId]);

  const handleAddTable = () => {
    const nextId = Math.random().toString(36).substr(2, 11);

    setTables(originalTables);
    setNewTable({
      tableId: nextId,
      xposition: 100,
      yposition: 100,
      tableNo: nextId,
    });
    setSelectedTable(null);
    setTableNo(""); // Reset table name
  };

  const moveTable = (direction) => {
    if (!selectedTable && !newTable) return;

    const moveAmount = 10;
    const { xposition, yposition } = selectedTable || newTable;
    let newX = xposition;
    let newY = yposition;

    switch (direction) {
      case "left":
        newX = xposition - moveAmount;
        break;
      case "right":
        newX = xposition + moveAmount;
        break;
      case "up":
        newY = yposition - moveAmount;
        break;
      case "down":
        newY = yposition + moveAmount;
        break;
      default:
        break;
    }

    if (newTable) {
      setNewTable({
        ...newTable,
        xposition: newX,
        yposition: newY,
      });
    } else if (selectedTable) {
      setTables(
        tables.map((table) =>
          table.tableId === selectedTable.tableId
            ? { ...table, xposition: newX, yposition: newY }
            : table
        )
      );
      setSelectedTable({
        ...selectedTable,
        xposition: newX,
        yposition: newY,
      });
    }
  };

  const handleSelectTable = (event) => {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedTable = tables.find(
      (table) =>
        x >= table.xposition &&
        x <= table.xposition + 40 &&
        y >= table.yposition &&
        y <= table.yposition + 30
    );

    if (clickedTable) {
      setSelectedTable(clickedTable);
      setNewTable(null);
      setTableNo(clickedTable.tableNo || ""); // Set table name if exists
    } else if (newTable) {
      setSelectedTable(newTable);
      setTableNo(newTable.tableNo || ""); // Set table name if exists
    }
  };

  const handleSelect = (table) => {
    setSelectedTable(null);
    setSelectedTable(table);
    setNewTable(null);
    setTables(originalTables);
    if (table.tableNo != 0)
      setTableNo(table.tableNo || ""); // Set table name if exists
    else setTableNo(0);
    console.log(table.tableNo);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <TableCanvas
        tables={tables}
        selectedTable={selectedTable}
        setTableNo={setTableNo}
        handleSelectTable={handleSelectTable}
        handleAddTable={handleAddTable}
        moveTable={moveTable}
      />
      {/* <TableList
        tables={tables}
        onSelectTable={handleSelect}
        selectedTable={selectedTable}
      /> */}
    </div>
  );
};

export default TablesPage;
