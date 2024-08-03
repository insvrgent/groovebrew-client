import React, { useEffect, useState } from "react";
import { getMaterials } from "../helpers/materialHelpers";
import {
  createMaterialMutation,
  getMaterialMutations,
} from "../helpers/materialMutationHelpers";

// Keyframes for grow animation
const growKeyframes = `
  @keyframes grow {
    0% {
      width: 60px;
      height: 60px;
      border-top-left-radius: 50%;
      border-bottom-left-radius: 50%;
    }
    100% {
      width: 100%;
      height: auto;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }
  }
`;

// Styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  expandingContainer: (expanded) => ({
    overflow: "hidden",
    transition: "all 0.3s ease",
    animation: expanded ? "grow 0.5s forwards" : "none",
    marginBottom: "20px",
  }),
  materialSelection: {
    padding: "10px",
  },
  materialList: {
    display: "flex",
    flexDirection: "row",
    overflowX: "auto", // Enable horizontal scrolling
    overflowY: "hidden", // Prevent vertical scrolling
    whiteSpace: "nowrap", // Prevent wrapping of items
    gap: "10px", // Space between items
    padding: "10px 0", // Padding for better appearance
  },

  materialCard: (selected) => ({
    flex: "0 0 auto", // Prevent growing or shrinking
    minWidth: "100px", // Minimum width of the card
    maxWidth: "150px", // Maximum width of the card
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    backgroundColor: selected ? "#007bff" : "#f9f9f9",
    color: selected ? "white" : "black",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    textAlign: "center", // Center text horizontally
    display: "flex", // Flexbox for vertical centering
    alignItems: "center", // Center text vertically
    justifyContent: "center", // Center text horizontally
  }),
  mutationDetails: {
    padding: "10px",
  },
  detailInput: {
    marginBottom: "15px",
  },
  detailLabel: {
    display: "block",
    marginBottom: "5px",
  },
  detailInputField: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  btnSubmit: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#28a745",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  btnSubmitHover: {
    backgroundColor: "#218838",
  },
  message: {
    textAlign: "center",
    fontSize: "16px",
  },
  successMessage: {
    color: "#28a745",
  },
  errorMessage: {
    color: "#dc3545",
  },
  mutationList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxHeight: "400px", // Set the desired height
    overflowY: "auto", // Enable vertical scrolling
  },
  mutationCard: {
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

const MaterialMutationPage = ({ cafeId }) => {
  const [materials, setMaterials] = useState([]);
  const [mutations, setMutations] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [oldStock, setOldStock] = useState("");
  const [newStock, setNewStock] = useState("");
  const [changeDate, setChangeDate] = useState("");
  const [reason, setReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await getMaterials(cafeId);
        setMaterials(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchMutations = async () => {
      try {
        const data = await getMaterialMutations(cafeId);
        setMutations(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMaterials();
    fetchMutations();
  }, [cafeId]);

  const handleToggle = () => setExpanded(!expanded);
  const handleCancel = () => {
    setSelectedMaterialId(null);
    handleToggle();
  };

  const handleMaterialSelect = (materialId) => {
    setSelectedMaterialId(materialId);
  };

  const handleSubmit = async () => {
    try {
      const data = { oldStock, newStock, changeDate, reason };
      await createMaterialMutation(selectedMaterialId, data);
      setSuccessMessage("Material mutation created successfully!");
      setOldStock("");
      setNewStock("");
      setChangeDate("");
      setReason("");
      setSelectedMaterialId("");
      // Refresh the mutations list
      const updatedMutations = await getMaterialMutations(cafeId);
      setMutations(updatedMutations);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filtered mutations based on selected material
  const filteredMutations = selectedMaterialId
    ? mutations.filter((mutation) => mutation.materialId === selectedMaterialId)
    : mutations;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Material Mutations</h1>

      <button style={styles.button} onClick={handleCancel}>
        {expanded ? "Cancel" : "Create Material Mutation"}
      </button>

      <div style={styles.expandingContainer(expanded)}>
        {!expanded && (
          <div style={styles.materialSelection}>
            <div style={styles.materialList}>
              <div
                style={styles.materialCard(selectedMaterialId === "")}
                onClick={() => handleMaterialSelect("")}
              >
                All
              </div>
              {materials.map((material) => (
                <div
                  key={material.materialId}
                  style={styles.materialCard(
                    selectedMaterialId === material.materialId
                  )}
                  onClick={() => handleMaterialSelect(material.materialId)}
                >
                  {material.name}
                </div>
              ))}
            </div>
          </div>
        )}
        {expanded && !selectedMaterialId && (
          <div style={styles.materialSelection}>
            <div style={styles.materialList}>
              {materials.map((material) => (
                <div
                  key={material.materialId}
                  style={styles.materialCard(
                    selectedMaterialId === material.materialId
                  )}
                  onClick={() => handleMaterialSelect(material.materialId)}
                >
                  {material.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {expanded && selectedMaterialId && (
          <div style={styles.mutationDetails}>
            <div style={styles.detailInput}>
              <label style={styles.detailLabel}>Old Stock:</label>
              <input
                type="number"
                style={styles.detailInputField}
                value={oldStock}
                onChange={(e) => setOldStock(e.target.value)}
              />
            </div>

            <div style={styles.detailInput}>
              <label style={styles.detailLabel}>New Stock:</label>
              <input
                type="number"
                style={styles.detailInputField}
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
              />
            </div>

            <div style={styles.detailInput}>
              <label style={styles.detailLabel}>Change Date:</label>
              <input
                type="datetime-local"
                style={styles.detailInputField}
                value={changeDate}
                onChange={(e) => setChangeDate(e.target.value)}
              />
            </div>

            <div style={styles.detailInput}>
              <label style={styles.detailLabel}>Reason:</label>
              <textarea
                style={styles.detailInputField}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <button style={styles.btnSubmit} onClick={handleSubmit}>
              Create Mutation
            </button>
          </div>
        )}
      </div>

      {successMessage && (
        <p style={{ ...styles.message, ...styles.successMessage }}>
          {successMessage}
        </p>
      )}
      {error && (
        <p style={{ ...styles.message, ...styles.errorMessage }}>
          Error: {error}
        </p>
      )}

      <div style={styles.mutationList}>
        {filteredMutations.map((mutation) => (
          <div key={mutation.mutationId} style={styles.mutationCard}>
            <h3>
              {mutation.Material.name}-{mutation.reason}
            </h3>
            <p>Old Stock: {mutation.oldStock}</p>
            <p>New Stock: {mutation.newStock}</p>
            <p>Change Date: {new Date(mutation.changeDate).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialMutationPage;
