import React, { useState, useEffect } from "react";
import QRCodeWithBackground from "./QR"; // Adjust path as needed

const TableList = ({ shopUrl, tables, onSelectTable, selectedTable }) => {
  const [initialPos, setInitialPos] = useState({ left: 50, top: 50 });
  const [initialSize, setInitialSize] = useState(20);
  const [bgImageUrl, setBgImageUrl] = useState(
    "https://example.com/your-background-image.png"
  );

  const generateQRCodeUrl = (tableCode) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      shopUrl + "/" + tableCode
    )}`;

  const handleBackgroundUrlChange = (newUrl) => {
    setBgImageUrl(newUrl);
  };

  const handleQrSave = (qrPosition, qrSize, bgImage) => {
    setInitialPos(qrPosition);
    setInitialSize(qrSize);
    setBgImageUrl(bgImage);
  };

  return (
    <div
      style={{
        width: "100%",
        marginTop: "20px",
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
              handleQrSave={handleQrSave}
              setInitialPos={setInitialPos}
              setInitialSize={setInitialSize}
              qrCodeUrl={generateQRCodeUrl("sample")}
              backgroundUrl={bgImageUrl}
              initialQrPosition={initialPos}
              initialQrSize={initialSize}
            />
          )}
        </li>
        {tables
          .filter((table) => table.tableNo !== 0)
          .map((table) => (
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
                Table {table.tableNo}
              </div>
              {table.tableId === selectedTable?.tableId && (
                <>
                  <QRCodeWithBackground
                    tableNo={table.tableNo}
                    qrCodeUrl={generateQRCodeUrl(table.tableCode)}
                    backgroundUrl={bgImageUrl}
                    initialQrPosition={initialPos}
                    initialQrSize={initialSize}
                  />
                  <h5>{shopUrl + "/" + table.tableCode}</h5>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TableList;
