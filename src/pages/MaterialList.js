import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config.js";
import {
  getMaterials,
  createMaterial,
  deleteMaterial,
} from "../helpers/materialHelpers"; // Update import

const MaterialList = ({ cafeId }) => {
  const [materials, setMaterials] = useState([]);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialUnit, setNewMaterialUnit] = useState("kilogram");
  const [newMaterialImage, setNewMaterialImage] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // For form visibility

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const data = await getMaterials(cafeId);
        setMaterials(data);
        setError(null); // Clear any previous error
      } catch (error) {
        console.error("Error fetching materials:", error);
        setError("Failed to fetch materials.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [cafeId]);

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
      setShowForm(false); // Hide the form after successful creation
      const data = await getMaterials(cafeId);
      setMaterials(data);
      setError(null); // Clear any previous error
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
      setMaterials(
        materials.filter((material) => material.materialId !== materialId)
      );
      setError(null); // Clear any previous error
    } catch (error) {
      console.error("Error deleting material:", error);
      setError("Failed to delete material.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Materials List</h2>

      {/* Display error message if any */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Button to toggle the form */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={styles.toggleButton}
        disabled={loading}
      >
        {showForm ? "Hide Form" : "Add New Material"}
      </button>

      {/* Create Material Form */}
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
              <option value="kilogram">Kilogram</option>
              <option value="liter">Liter</option>
              <option value="piece">Piece</option>
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
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating..." : "Create Material"}
          </button>
        </form>
      </div>

      {/* Materials List */}
      {loading ? (
        <p>Loading materials...</p>
      ) : (
        <ul style={styles.list}>
          {materials.map((material) => (
            <li key={material.materialId} style={styles.listItem}>
              {material.name} - {material.unit}
              {material.image && (
                <img
                  src={`${API_BASE_URL}/uploads/${material.image}`}
                  alt={material.name}
                  style={styles.image}
                />
              )}
              <button
                onClick={() => handleDeleteMaterial(material.materialId)}
                disabled={deleting === material.materialId || loading}
                style={styles.deleteButton}
              >
                {deleting === material.materialId ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  toggleButton: {
    marginBottom: "20px",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  formContainer: {
    transition: "height 0.5s ease-in-out",
    overflow: "hidden",
  },
  form: {
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "10px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
  deleteButton: {
    marginLeft: "10px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  },
  listItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    marginLeft: "10px",
    height: "50px",
    width: "50px",
    objectFit: "cover",
  },
  error: {
    color: "#dc3545",
    marginBottom: "15px",
  },
};

export default MaterialList;
