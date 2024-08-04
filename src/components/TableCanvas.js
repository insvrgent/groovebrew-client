import React, { useRef, useState, useEffect } from "react";

const TableCanvas = ({
  tables,
  selectedTable,
  newTable,
  isAdmin,
  handleSelectTable,
  handleAddTable,
  moveTable,
  handleSave,
  handleCancel,
  handleSetTableNo,
  tableNo,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const padding = 50;
  const rectWidth = 40;
  const rectHeight = 30;

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
      !tables ||
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
      console.log(selectedTable);
      context.fillText(
        table.tableId === (selectedTable?.tableId || newTable?.tableId)
          ? tableNo === 0
            ? "clerk"
            : tableNo || (isAdmin ? "" : table.tableNo)
          : table.tableNo === 0
          ? "clerk"
          : table.tableNo,
        table.xposition + rectWidth / 2,
        table.yposition + rectHeight / 2
      );
    });
  }, [tables, canvasSize, newTable, selectedTable, tableNo]);

  return (
    <div ref={containerRef} style={{ height: "20%" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          borderRadius: "5px",
          backgroundColor: "#e9e9e9",
        }}
        onClick={handleSelectTable}
      />
      <div style={{ visibility: isAdmin ? "" : "hidden" }}>
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
              fontSize: "16px",
              cursor: "pointer",
              marginBottom: "10px",
              transition: "background-color 0.3s ease",
              visibility: isAdmin ? "" : "hidden",
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
              display: isAdmin ? "visible" : "hidden",
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
