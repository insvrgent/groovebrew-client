import React, { useState } from "react";
import QRCodeWithBackground from "./QR"; // Adjust path as needed

const TableList = ({ tables, onSelectTable, selectedTable }) => {
  const [initialPos, setInitialPos] = useState({ left: 50, top: 50 });
  const [initialSize, setInitialSize] = useState(20);
  const [bgImageUrl, setBgImageUrl] = useState(
    "https://example.com/your-background-image.png"
  );

  const generateQRCodeUrl = (tableCode) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      tableCode
    )}`;

  const handleBackgroundUrlChange = (newUrl) => {
    setBgImageUrl(newUrl);
  };

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
        <li
          style={{
            backgroundColor:
              -1 === selectedTable?.tableId ? "lightblue" : "white",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            cursor: "pointer",
          }}
          onClick={() =>
            onSelectTable({
              tableId: -1,
            })
          }
        >
          <div style={{ marginBottom: "10px" }}>configure</div>
          {-1 == selectedTable?.tableId && (
            <QRCodeWithBackground
              isConfigure={true}
              setInitialPos={setInitialPos}
              setInitialSize={setInitialSize}
              qrCodeUrl={generateQRCodeUrl("sample")}
              backgroundUrl={bgImageUrl}
              initialQrPosition={initialPos}
              initialQrSize={initialSize}
              onBackgroundUrlChange={handleBackgroundUrlChange}
            />
          )}
        </li>
        {tables.map((table) => (
          <li
            key={table.tableId}
            style={{
              backgroundColor:
                table.tableId === selectedTable?.tableId
                  ? "lightblue"
                  : "white",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
            onClick={() => onSelectTable(table)}
          >
            <div style={{ marginBottom: "10px" }}>
              {table.tableNo === 0 ? "Clerk" : `Table ${table.tableNo}`} -
              Position: ({table.xposition}, {table.yposition})
            </div>
            {table.tableId == selectedTable?.tableId && (
              <QRCodeWithBackground
                setInitialPos={setInitialPos}
                setInitialSize={setInitialSize}
                qrCodeUrl={generateQRCodeUrl(table.tableCode)}
                backgroundUrl={bgImageUrl}
                initialQrPosition={initialPos}
                initialQrSize={initialSize}
                onBackgroundUrlChange={handleBackgroundUrlChange}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableList;
