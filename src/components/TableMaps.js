import React, { useRef, useState, useEffect } from "react";

// Dummy function to simulate fetching tables
const getTables = async (cafeId) => {
  return [
    { tableId: 1, xposition: 1, yposition: 1, cafeId: 5, tableNo: 1 },
    { tableId: 2, xposition: 30, yposition: 1, cafeId: 5, tableNo: 2 },
    { tableId: 3, xposition: 50, yposition: 70, cafeId: 5, tableNo: 3 },
    { tableId: 4, xposition: 200, yposition: 70, cafeId: 5, tableNo: 4 },
    { tableId: 5, xposition: -200, yposition: 70, cafeId: 5, tableNo: 4 },
  ];
};

const TableCanvas = () => {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const padding = 50; // Padding around the edges
  const rectWidth = 40; // Width of each rectangle
  const rectHeight = 30; // Height of each rectangle

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTables = await getTables(5);
        setTables(fetchedTables);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchData();
  }, []);

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

    // Calculate bounds for all tables
    const minX = Math.min(...allTables.map((table) => table.xposition));
    const minY = Math.min(...allTables.map((table) => table.yposition));
    const maxX = Math.max(...allTables.map((table) => table.xposition));
    const maxY = Math.max(...allTables.map((table) => table.yposition));

    const patternWidth = maxX - minX;
    const patternHeight = maxY - minY;

    // Calculate the scale factor to fit tables within the canvas
    const scaleX = (canvas.width - 2 * padding) / patternWidth;
    const scaleY = (canvas.height - 2 * padding) / patternHeight;
    const scale = Math.min(scaleX, scaleY);

    // Apply the scaling factor and adjust positions to include padding
    const scaledTables = allTables.map((table) => ({
      ...table,
      xposition: (table.xposition - minX) * scale + padding,
      yposition: (table.yposition - minY) * scale + padding,
    }));

    // Draw the tables as rectangles and print table numbers
    scaledTables.forEach((table) => {
      context.beginPath();
      context.rect(table.xposition, table.yposition, rectWidth, rectHeight);
      context.fillStyle = "blue";
      context.fill();
      context.stroke();

      context.font = "12px Arial";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        table.tableNo,
        table.xposition + rectWidth / 2,
        table.yposition + rectHeight / 2
      );
    });
  }, [tables, canvasSize, newTable]);

  const handleAddTable = () => {
    const nextId =
      (tables.length ? Math.max(tables.map((t) => t.tableId)) : 0) + 1;
    setNewTable({
      tableId: nextId,
      xposition: 100, // Initial position
      yposition: 100, // Initial position
      tableNo: nextId,
    });
  };

  const moveTable = (direction) => {
    if (!newTable) return;

    const moveAmount = 10; // Amount to move per step

    const { xposition, yposition } = newTable;
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

    setNewTable({
      ...newTable,
      xposition: newX,
      yposition: newY,
    });
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "50%" }}>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", display: "block" }}
      />
      <div style={{ marginTop: "20px" }}>
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
          }}
        >
          Add Table
        </button>
        {newTable && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={() => moveTable("left")} style={buttonStyle}>
              {"<"}
            </button>
            <button onClick={() => moveTable("up")} style={buttonStyle}>
              {"^"}
            </button>
            <button onClick={() => moveTable("down")} style={buttonStyle}>
              {"v"}
            </button>
            <button onClick={() => moveTable("right")} style={buttonStyle}>
              {">"}
            </button>
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
            {tables.map((table) => (
              <li
                key={table.tableId}
                style={{
                  backgroundColor: "white",
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Table {table.tableNo} - Position: ({table.xposition},{" "}
                {table.yposition})
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

export default TableCanvas;
