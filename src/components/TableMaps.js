import React, { useRef, useState, useEffect } from "react";
import { getTables, updateTable, createTable } from "../helpers/tableHelper";

const TableCanvas = ({ shopId }) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [newTable, setNewTable] = useState(null);
  const [originalTables, setOriginalTables] = useState([]);
  const [tableNo, setTableNo] = useState(""); // State for table name
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const padding = 50;
  const rectWidth = 40;
  const rectHeight = 30;

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
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setCanvasSize({ width: clientWidth, height: clientHeight });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      tables.length === 0 ||
      canvasSize.width === 0 ||
      canvasSize.height === 0
    )
      return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const allTables = newTable ? [...tables, newTable] : tables;
    const hasMultipleTables = allTables.length > 1;
    const minX = hasMultipleTables
      ? Math.min(...allTables.map((table) => table.xposition))
      : 0;
    const minY = hasMultipleTables
      ? Math.min(...allTables.map((table) => table.yposition))
      : 0;
    const maxX = hasMultipleTables
      ? Math.max(...allTables.map((table) => table.xposition))
      : 1;
    const maxY = hasMultipleTables
      ? Math.max(...allTables.map((table) => table.yposition))
      : 1;

    const patternWidth = maxX - minX;
    const patternHeight = maxY - minY;
    const scaleX =
      patternWidth > 0 ? (canvas.width - 2 * padding) / patternWidth : 1;
    const scaleY =
      patternHeight > 0 ? (canvas.height - 2 * padding) / patternHeight : 1;
    const scale = Math.min(scaleX, scaleY);

    const scaledTables = allTables.map((table) => ({
      ...table,
      xposition: (table.xposition - minX) * scale + padding,
      yposition: (table.yposition - minY) * scale + padding,
    }));

    scaledTables.forEach((table) => {
      context.beginPath();
      context.rect(table.xposition, table.yposition, rectWidth, rectHeight);
      context.fillStyle =
        table.tableId === (selectedTable?.tableId || newTable?.tableId)
          ? "red"
          : "blue";
      context.fill();
      context.stroke();
      context.font = "12px Arial";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        table.tableId === (selectedTable?.tableId || newTable?.tableId)
          ? tableNo === 0
            ? "clerk"
            : tableNo
          : table.tableNo === 0
          ? "clerk"
          : table.tableNo,
        table.xposition + rectWidth / 2,
        table.yposition + rectHeight / 2
      );
    });
  }, [tables, canvasSize, newTable, selectedTable, tableNo]);

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
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedTable = tables.find(
      (table) =>
        x >= table.xposition &&
        x <= table.xposition + rectWidth &&
        y >= table.yposition &&
        y <= table.yposition + rectHeight
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

  const handleCancel = () => {
    setSelectedTable(null);
    setNewTable(null);
    setTables(originalTables);
    setTableNo(""); // Reset table name
  };

  const handleSave = async () => {
    if (newTable) {
      try {
        const createdTable = await createTable(shopId, {
          ...newTable,
          tableNo,
        });
        setTables([...tables, createdTable]);
        setOriginalTables([...tables, createdTable]);
        setNewTable(null);
        setTableNo(""); // Reset table name
      } catch (error) {
        console.error("Error creating table:", error);
      }
    } else if (selectedTable) {
      try {
        const updatedTable = await updateTable(shopId, {
          ...selectedTable,
          tableNo,
        });
        setTables(
          tables.map((table) =>
            table.tableId === updatedTable.tableId ? updatedTable : table
          )
        );
        setOriginalTables(
          tables.map((table) =>
            table.tableId === updatedTable.tableId ? updatedTable : table
          )
        );
        setSelectedTable(null);
        setTableNo(""); // Reset table name
      } catch (error) {
        console.error("Error updating table:", error);
      }
    }
  };

  const handleSetTableNo = (event) => {
    const newValue = event.target.value;
    // Prevent setting value to '0' or starting with '0'
    if (newValue === "" || /^[1-9][0-9]*$/.test(newValue)) {
      setTableNo(newValue);
    }
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "50%" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          borderRadius: "5px",
          backgroundColor: "#e9e9e9",
        }}
        onClick={handleSelectTable}
      />
      <div style={{ marginTop: "20px" }}>
        {!selectedTable && !newTable && (
          <button
            onClick={handleAddTable}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
              marginBottom: "10px",
              transition: "background-color 0.3s ease",
            }}
          >
            Add Table
          </button>
        )}
        {(selectedTable || newTable) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              <button onClick={() => moveTable("left")} style={buttonStyle}>
                {"◄"}
              </button>
              <button onClick={() => moveTable("up")} style={buttonStyle}>
                {"▲"}
              </button>
              <button onClick={() => moveTable("down")} style={buttonStyle}>
                {"▼"}
              </button>
              <button onClick={() => moveTable("right")} style={buttonStyle}>
                {"►"}
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Table No"
                value={tableNo}
                disabled={tableNo === 0 ? "disabled" : ""}
                onChange={handleSetTableNo}
                style={{
                  marginRight: "10px",
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  width: "100px",
                }}
              />
              <button onClick={handleCancel} style={actionButtonStyle}>
                Cancel
              </button>
              {(newTable || selectedTable) && (
                <button onClick={handleSave} style={actionButtonStyle}>
                  Save
                </button>
              )}
            </div>
          </div>
        )}
        <div
          style={{
            width: "100%",
            marginTop: "20px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {tables &&
              tables.map((table) => (
                <li
                  key={table.tableId}
                  style={{
                    backgroundColor: "white",
                    marginBottom: "10px",
                    padding: "10px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  onClick={() => handleSelect(table)}
                >
                  {
                    table.tableNo === 0
                      ? "Clerk" // Display "Clerk" if tableNo is 0
                      : `Table ${table.tableNo}` // Display "Table {tableNo}" otherwise
                  }{" "}
                  - Position: ({table.xposition}, {table.yposition})
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "10px",
  fontSize: "20px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "0 5px",
};

const actionButtonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "0 5px",
  transition: "background-color 0.3s ease, color 0.3s ease",
};

export default TableCanvas;
