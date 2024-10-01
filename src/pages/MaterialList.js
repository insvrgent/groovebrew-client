import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config.js";
import {
  getMaterials,
  createMaterial,
  deleteMaterial,
} from "../helpers/materialHelpers";
import {
  createMaterialMutation,
  getMaterialMutations,
} from "../helpers/materialMutationHelpers";

const MaterialList = ({ cafeId }) => {
  const [materials, setMaterials] = useState([]);
  const [mutations, setMutations] = useState([]);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialUnit, setNewMaterialUnit] = useState("kilogram");
  const [newMaterialImage, setNewMaterialImage] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [quantityChange, setQuantityChange] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const data = await getMaterials(cafeId);
        setMaterials(data);
        setError(null);
        if (data.length > 0 && !selectedMaterialId) {
          setSelectedMaterialId(data[0].materialId);
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
        setError("Failed to fetch materials.");
      }
    };

    const fetchMutations = async () => {
      try {
        const data = await getMaterialMutations(cafeId);
        setMutations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
    fetchMutations();
  }, [cafeId]);

  useEffect(() => {
    if (selectedMaterialId) {
      const materialMutations = mutations.filter(
        (mutation) => mutation.materialId === selectedMaterialId
      );
      if (materialMutations.length > 0) {
        const latestMutation = materialMutations.reduce(
          (latest, current) =>
            new Date(current.createdAt) > new Date(latest.createdAt)
              ? current
              : latest,
          materialMutations[0]
        );
        setCurrentQuantity(latestMutation.newStock);
      } else {
        setCurrentQuantity(0); // Default value if no mutations exist
      }
    }
  }, [selectedMaterialId, mutations]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredMutations = selectedMaterialId
    ? mutations.filter((mutation) => mutation.materialId === selectedMaterialId)
    : [];

  const sortedMutations = filteredMutations
    .filter((mutation) => mutation.materialId === selectedMaterialId)
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", newMaterialName);
    formData.append("unit", newMaterialUnit);
    if (newMaterialImage) {
      formData.append("image", newMaterialImage);
    }

    try {
      await createMaterial(cafeId, formData);
      setNewMaterialName("");
      setNewMaterialUnit("kilogram");
      setNewMaterialImage(null);
      setShowForm(false);
      const data = await getMaterials(cafeId);
      setMaterials(data);
      setError(null);
      if (data.length > 0) {
        setSelectedMaterialId(data[0].materialId);
      }
    } catch (error) {
      console.error("Error creating material:", error);
      setError("Failed to create material.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    setDeleting(materialId);
    try {
      await deleteMaterial(materialId);
      const updatedMaterials = materials.filter(
        (material) => material.materialId !== materialId
      );
      setMaterials(updatedMaterials);
      setError(null);
      if (selectedMaterialId === materialId) {
        setSelectedMaterialId(
          updatedMaterials.length > 0 ? updatedMaterials[0].materialId : null
        );
      }
    } catch (error) {
      console.error("Error deleting material:", error);
      setError("Failed to delete material.");
    } finally {
      setDeleting(null);
    }
  };

  const handlePrevious = () => {
    if (selectedMaterialId) {
      setQuantityChange(0);
      const currentIndex = materials.findIndex(
        (material) => material.materialId === selectedMaterialId
      );
      if (currentIndex > 0) {
        setSelectedMaterialId(materials[currentIndex - 1].materialId);
      }
    }
  };

  const handleNext = () => {
    if (selectedMaterialId) {
      setQuantityChange(0);
      const currentIndex = materials.findIndex(
        (material) => material.materialId === selectedMaterialId
      );
      if (currentIndex < materials.length - 1) {
        setSelectedMaterialId(materials[currentIndex + 1].materialId);
      }
    }
  };

  const handleQuantityChange = (change) => {
    setQuantityChange((prev) => prev + change);
  };

  const handleUpdateStock = async () => {
    if (selectedMaterialId) {
      setLoading(true);
      try {
        const newStock = currentQuantity + quantityChange;
        const formData = new FormData();
        formData.append("newStock", newStock);
        formData.append("reason", "Stock update");

        await createMaterialMutation(selectedMaterialId, formData);
        setQuantityChange(0);
        const updatedMutations = await getMaterialMutations(cafeId);
        setMutations(updatedMutations);
        setCurrentQuantity(newStock);
        setError(null);
      } catch (error) {
        console.error("Error updating stock:", error);
        setError("Failed to update stock.");
      } finally {
        setLoading(false);
      }
    }
  };

  const currentMaterial = materials.find(
    (material) => material.materialId === selectedMaterialId
  );
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Materials List</h1>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading materials and mutations...</p>}

      {!loading && (
        <button
          onClick={() => setShowForm(!showForm)}
          style={styles.toggleButton}
          disabled={loading}
        >
          {showForm ? "Hide Form" : "Add New Material"}
        </button>
      )}

      <div
        style={{
          ...styles.formContainer,
          height: showForm ? "auto" : "0",
          overflow: "hidden",
        }}
      >
        <form onSubmit={handleCreateMaterial} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="materialName" style={styles.label}>
              Name:
            </label>
            <input
              id="materialName"
              type="text"
              value={newMaterialName}
              onChange={(e) => setNewMaterialName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="materialUnit" style={styles.label}>
              Unit:
            </label>
            <select
              id="materialUnit"
              value={newMaterialUnit}
              onChange={(e) => setNewMaterialUnit(e.target.value)}
              style={styles.input}
            >
              <option value="gram">Gram</option>
              <option value="ons">Ons</option>
              <option value="kilogram">Kilogram</option>
              <option value="kuintal">Kuintal</option>
              <option value="liter">Liter</option>
              <option value="piece">Piece</option>
              <option value="meter">Meter</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="materialImage" style={styles.label}>
              Image:
            </label>
            <input
              id="materialImage"
              type="file"
              onChange={(e) => setNewMaterialImage(e.target.files[0])}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? "Creating..." : "Create Material"}
          </button>
        </form>
      </div>

      {!loading && (
        <div style={styles.navigationContainer}>
          <button
            onClick={handlePrevious}
            disabled={
              !selectedMaterialId ||
              materials.findIndex(
                (material) => material.materialId === selectedMaterialId
              ) === 0
            }
            style={styles.navigationButton}
          >
            {"<"}
          </button>
          <div style={styles.materialCardContainer}>
            {currentMaterial ? (
              <div style={styles.materialCard}>
                {currentMaterial.image && (
                  <img
                    src={`${API_BASE_URL}/${currentMaterial.image}`}
                    alt={currentMaterial.name}
                    style={styles.image}
                  />
                )}
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{currentMaterial.name}</h3>
                  <p>{currentMaterial.unit}</p>
                </div>
                <div style={styles.buttonContainer}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    style={styles.quantityButton}
                  >
                    -
                  </button>
                  <button style={styles.quantityDisplay}>
                    {currentQuantity + quantityChange}
                  </button>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    style={styles.quantityButton}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleUpdateStock}
                  style={styles.updateMutation}
                >
                  Update Stock
                </button>
                <button
                  onClick={() =>
                    handleDeleteMaterial(currentMaterial.materialId)
                  }
                  disabled={deleting === currentMaterial.materialId || loading}
                  style={styles.deleteButton}
                >
                  {deleting === currentMaterial.materialId
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            ) : (
              <p>No materials available.</p>
            )}
          </div>
          <button
            onClick={handleNext}
            disabled={
              !selectedMaterialId ||
              materials.findIndex(
                (material) => material.materialId === selectedMaterialId
              ) ===
                materials.length - 1
            }
            style={styles.navigationButton}
          >
            {">"}
          </button>
        </div>
      )}

      <div style={styles.sortContainer}>
        <label htmlFor="sortOrder">Sort by : </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortChange}
          style={styles.sortSelect}
        >
          <option value="desc">latest</option>
          <option value="asc">oldest</option>
        </select>
      </div>

      {selectedMaterialId && !loading && (
        <div style={styles.mutationContainer}>
          {sortedMutations.length > 0 ? (
            sortedMutations.map((mutation) => (
              <div key={mutation.id} style={styles.mutationCard}>
                <h4 style={styles.mutationTitle}>
                  {formatDate(mutation.createdAt)}
                </h4>
                <p>Details: {mutation.reason}</p>
                <p>stok {mutation.newStock}</p>
              </div>
            ))
          ) : (
            <p>No mutations available.</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    paddingLeft: "10px",
    paddingRight: "10px",
    maxWidth: "800px",
    margin: "0 auto",
    height: "100%", // Adjust height based on your needs
    overflowY: "auto", // Enables vertical scrolling
    backgroundColor: "white",
  },
  heading: {
    textAlign: "center",
  },
  toggleButton: {
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
  formContainer: {
    transition: "height 0.5s ease-in-out",
    overflow: "hidden",
  },
  form: {
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
  },
  submitButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s, transform 0.3s",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  deleteButton: {
    marginLeft: "10px",
    padding: "8px 15px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s, transform 0.3s",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  navigationContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20px",
    position: "relative",
  },
  navigationButton: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    margin: "0 5px",
    transition: "background-color 0.3s ease",
  },
  materialCardContainer: {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    transition: "opacity 0.5s ease-in-out",
  },
  materialCard: {
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  cardContent: {
    marginBottom: "10px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "5px",
  },
  image: {
    width: "250px",
    height: "150px",
    objectFit: "contain",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  error: {
    color: "#dc3545",
    marginBottom: "15px",
  },
  mutationContainer: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#f8f9fa",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  mutationCard: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    marginBottom: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  mutationTitle: {
    fontSize: "16px",
    fontWeight: "600",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
  },
  quantityButton: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    margin: "0 5px",
    transition: "background-color 0.3s ease",
  },
  quantityDisplay: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#fff",
    color: "#000",
    fontSize: "16px",
    textAlign: "center",
    margin: "0 5px",
  },
  updateMutation: {
    marginTop: "10px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s, transform 0.3s",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default MaterialList;
