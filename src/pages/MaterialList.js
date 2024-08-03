import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config.js";
import {
  getMaterials,
  createMaterial,
  deleteMaterial,
} from "../helpers/materialHelpers";

const MaterialList = ({ cafeId }) => {
  const [materials, setMaterials] = useState([]);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialUnit, setNewMaterialUnit] = useState("kilogram");
  const [newMaterialImage, setNewMaterialImage] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const data = await getMaterials(cafeId);
        setMaterials(data);
        setError(null);
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
    console.log(newMaterialImage);
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
      setError(null);
    } catch (error) {
      console.error("Error deleting material:", error);
      setError("Failed to delete material.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Materials List</h1>

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

      {/* Materials List */}
      {loading ? (
        <p>Loading materials...</p>
      ) : (
        <div style={styles.materialList}>
          {materials.map((material) => (
            <div key={material.materialId} style={styles.materialCard}>
              {material.image && (
                <img
                  src={`${API_BASE_URL}/${material.image}`}
                  alt={material.name}
                  style={styles.image}
                />
              )}
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{material.name}</h3>
                <p>{material.unit}</p>
              </div>
              <button
                onClick={() => handleDeleteMaterial(material.materialId)}
                disabled={deleting === material.materialId || loading}
                style={styles.deleteButton}
              >
                {deleting === material.materialId ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
  materialList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
    maxHeight: "500px", // Adjust the height as needed
    overflowY: "auto", // Makes the container scrollable vertically
  },
  materialCard: {
    flex: "1 1 200px",
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
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  error: {
    color: "#dc3545",
    marginBottom: "15px",
  },
};

export default MaterialList;
