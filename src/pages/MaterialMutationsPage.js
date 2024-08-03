// src/pages/MaterialMutationPage.js
import React, { useEffect, useState } from "react";
import { getMaterials } from "../helpers/materialHelpers";
import {
  createMaterialMutation,
  getMaterialMutations,
} from "../helpers/materialMutationHelpers";

const MaterialMutationPage = ({ cafeId }) => {
  const [materials, setMaterials] = useState([]);
  const [materialMutations, setMaterialMutations] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [oldStock, setOldStock] = useState("");
  const [newStock, setNewStock] = useState("");
  const [changeDate, setChangeDate] = useState("");
  const [reason, setReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch materials when the component mounts
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await getMaterials(cafeId);
        setMaterials(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMaterials();
  }, [cafeId]);

  // Fetch material mutations when the component mounts
  useEffect(() => {
    const fetchMaterialMutations = async () => {
      try {
        const data = await getMaterialMutations(cafeId);
        setMaterialMutations(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMaterialMutations();
  }, [cafeId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMaterialId) {
      setError("Please select a material.");
      return;
    }

    try {
      const data = { oldStock, newStock, changeDate, reason };
      await createMaterialMutation(selectedMaterialId, data);
      setSuccessMessage("Material mutation created successfully!");
      setOldStock("");
      setNewStock("");
      setChangeDate("");
      setReason("");
      setSelectedMaterialId("");

      // Refresh material mutations list after creation
      const updatedMutations = await getMaterialMutations(cafeId);
      setMaterialMutations(updatedMutations);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Material Mutations</h1>

      <h2>Create Material Mutation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Select Material:
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              required
            >
              <option value="">Select a material</option>
              {materials.map((material) => (
                <option key={material.materialId} value={material.materialId}>
                  {material.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            Old Stock:
            <input
              type="number"
              value={oldStock}
              onChange={(e) => setOldStock(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            New Stock:
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Change Date:
            <input
              type="datetime-local"
              value={changeDate}
              onChange={(e) => setChangeDate(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Reason:
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
        </div>

        <button type="submit">Create Mutation</button>
      </form>

      {successMessage && <p>{successMessage}</p>}
      {error && <p>Error: {error}</p>}

      <h2>Existing Material Mutations</h2>
      {materialMutations.length > 0 ? (
        <ul>
          {materialMutations.map((mutation) => (
            <li key={mutation.mutationId}>
              <p>
                <strong>Material ID:</strong> {mutation.materialId}
              </p>
              <p>
                <strong>Old Stock:</strong> {mutation.oldStock}
              </p>
              <p>
                <strong>New Stock:</strong> {mutation.newStock}
              </p>
              <p>
                <strong>Change Date:</strong>{" "}
                {new Date(mutation.changeDate).toLocaleString()}
              </p>
              <p>
                <strong>Reason:</strong> {mutation.reason}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No material mutations found.</p>
      )}
    </div>
  );
};

export default MaterialMutationPage;
