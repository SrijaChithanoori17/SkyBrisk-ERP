
import { useEffect, useState } from "react";
import api from "./api";
import "./Suppliers.css";

function Suppliers({ onBack }) {

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);

  const [supplier, setSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstin: ""
  });


  // =========================================
  // LOAD SUPPLIERS
  // =========================================

  useEffect(() => {
    loadSuppliers();
  }, []);


  const loadSuppliers = async () => {

    try {

      const response = await api.get("/api/suppliers");

      setSuppliers(response.data);

    } catch (error) {

      console.error(
        "Failed to load suppliers:",
        error
      );

      alert("Failed to load suppliers.");

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {

    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value
    });

  };


  // =========================================
  // SAVE SUPPLIER
  // =========================================

  const saveSupplier = async (e) => {

    e.preventDefault();

    try {

      if (editingSupplierId) {

        await api.put(
          `/api/suppliers/${editingSupplierId}`,
          supplier
        );

        alert(
          "Supplier updated successfully! 🎉"
        );

      } else {

        await api.post(
          "/api/suppliers",
          supplier
        );

        alert(
          "Supplier added successfully! 🎉"
        );
      }


      setSupplier({
        name: "",
        email: "",
        phone: "",
        address: "",
        gstin: ""
      });

      setEditingSupplierId(null);

      setShowForm(false);

      loadSuppliers();

    } catch (error) {

      console.error(
        "Failed to save supplier:",
        error
      );

      alert("Failed to save supplier.");

    }
  };


  // =========================================
  // EDIT SUPPLIER
  // =========================================

  const editSupplier = (supplierData) => {

    setEditingSupplierId(
      supplierData.id
    );

    setSupplier({

      name: supplierData.name || "",

      email: supplierData.email || "",

      phone: supplierData.phone || "",

      address: supplierData.address || "",

      gstin: supplierData.gstin || ""

    });

    setShowForm(true);
  };


  // =========================================
  // DELETE SUPPLIER
  // =========================================

  const deleteSupplier = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this supplier?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/api/suppliers/${id}`
      );

      alert(
        "Supplier deleted successfully! 🗑️"
      );

      loadSuppliers();

    } catch (error) {

      console.error(
        "Failed to delete supplier:",
        error
      );

      alert("Failed to delete supplier.");

    }
  };


  // =========================================
  // ADD SUPPLIER
  // =========================================

  const handleAddSupplier = () => {

    setEditingSupplierId(null);

    setSupplier({
      name: "",
      email: "",
      phone: "",
      address: "",
      gstin: ""
    });

    setShowForm(!showForm);
  };


  // =========================================
  // CANCEL FORM
  // =========================================

  const cancelForm = () => {

    setShowForm(false);

    setEditingSupplierId(null);

    setSupplier({
      name: "",
      email: "",
      phone: "",
      address: "",
      gstin: ""
    });

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="suppliers-page">

        <h2>
          Loading Suppliers...
        </h2>

      </div>
    );

  }


  return (

    <div className="suppliers-page">


      {/* =====================================
          TOP HEADER
      ===================================== */}

      <div className="suppliers-header">


        {/* LEFT SIDE */}

        <div className="supplier-header-left">

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>


          <div className="supplier-title-row">

            <div className="supplier-main-icon">
              🏭
            </div>


            <div className="supplier-title-content">

              <h1>
                Suppliers
              </h1>

              <p>
                Manage your suppliers and vendor information
              </p>

            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <button
          className="add-supplier-button"
          onClick={handleAddSupplier}
        >
          + Add Supplier
        </button>

      </div>


      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div className="supplier-summary-cards">


        {/* TOTAL SUPPLIERS */}

        <div className="supplier-summary-card">

          <div className="supplier-summary-icon">
            🏭
          </div>

          <div className="supplier-summary-content">

            <span>
              Total Suppliers
            </span>

            <h2>
              {suppliers.length}
            </h2>

          </div>

        </div>


        {/* REGISTERED VENDORS */}

        <div className="supplier-summary-card">

          <div className="supplier-summary-icon">
            📧
          </div>

          <div className="supplier-summary-content">

            <span>
              Registered Vendors
            </span>

            <h2>
              {suppliers.length}
            </h2>

          </div>

        </div>


        {/* ACTIVE SUPPLIERS */}

        <div className="supplier-summary-card">

          <div className="supplier-summary-icon">
            🤝
          </div>

          <div className="supplier-summary-content">

            <span>
              Active Suppliers
            </span>

            <h2>
              {suppliers.length}
            </h2>

          </div>

        </div>

      </div>


      {/* =====================================
          ADD / EDIT FORM
      ===================================== */}

      {showForm && (

        <form
          className="supplier-form"
          onSubmit={saveSupplier}
        >

          <h2>
            {editingSupplierId
              ? "Edit Supplier"
              : "Add New Supplier"}
          </h2>


          <input
            type="text"
            name="name"
            placeholder="Supplier Name"
            value={supplier.name}
            onChange={handleChange}
            required
          />


          <input
            type="email"
            name="email"
            placeholder="Email"
            value={supplier.email}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={supplier.phone}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="address"
            placeholder="Address"
            value={supplier.address}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="gstin"
            placeholder="GSTIN"
            value={supplier.gstin}
            onChange={handleChange}
            required
          />


          <div className="form-buttons">

            <button type="submit">

              {editingSupplierId
                ? "✏️ Update Supplier"
                : "💾 Save Supplier"}

            </button>


            <button
              type="button"
              onClick={cancelForm}
            >
              Cancel
            </button>

          </div>

        </form>

      )}


      {/* =====================================
          SUPPLIER DIRECTORY
      ===================================== */}

      <div className="suppliers-table-container">


        {/* DIRECTORY HEADER */}

        <div className="supplier-directory-header">

          <h2>
            Supplier Directory
          </h2>

          <p>
            {suppliers.length} suppliers registered
          </p>

        </div>


        {/* TABLE */}

        {suppliers.length === 0 ? (

          <div className="no-suppliers">

            <p>
              No suppliers found.
            </p>

          </div>

        ) : (

          <table className="suppliers-table">

            <thead>

              <tr>

                <th>ID</th>

                <th>SUPPLIER</th>

                <th>EMAIL</th>

                <th>PHONE</th>

                <th>ADDRESS</th>

                <th>GSTIN</th>

                <th>ACTIONS</th>

              </tr>

            </thead>


            <tbody>

              {suppliers.map(
                (supplierData) => (

                  <tr
                    key={supplierData.id}
                  >


                    {/* ID */}

                    <td>

                      <strong>
                        #{supplierData.id}
                      </strong>

                    </td>


                    {/* SUPPLIER */}

                    <td>

                      <div className="supplier-name-cell">

                        <div className="supplier-avatar">

                          {supplierData.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>

                        <strong>
                          {supplierData.name}
                        </strong>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td className="supplier-email">

                      {supplierData.email}

                    </td>


                    {/* PHONE */}

                    <td>
                      {supplierData.phone}
                    </td>


                    {/* ADDRESS */}

                    <td>
                      {supplierData.address}
                    </td>


                    {/* GSTIN */}

                    <td>

                      <span className="gstin-badge">

                        {supplierData.gstin}

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="action-buttons">


                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            editSupplier(
                              supplierData
                            )
                          }
                        >
                          ✏️ Edit
                        </button>


                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            deleteSupplier(
                              supplierData.id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>


                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );
}

export default Suppliers;

