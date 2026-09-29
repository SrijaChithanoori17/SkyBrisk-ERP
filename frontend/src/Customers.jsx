
import { useEffect, useState } from "react";
import api from "./api";
import "./Customers.css";

function Customers({ onBack }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstin: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await api.get("/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Failed to load customers:", error);
      alert("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const saveCustomer = async (e) => {
    e.preventDefault();

    try {
      if (editingCustomerId) {
        await api.put(
          `/api/customers/${editingCustomerId}`,
          customer
        );

        alert("Customer updated successfully! 🎉");
      } else {
        await api.post("/api/customers", customer);

        alert("Customer added successfully! 🎉");
      }

      resetForm();
      await loadCustomers();
    } catch (error) {
      console.error("Failed to save customer:", error);
      alert("Failed to save customer.");
    }
  };

  const editCustomer = (customerData) => {
    setEditingCustomerId(customerData.id);

    setCustomer({
      name: customerData.name || "",
      email: customerData.email || "",
      phone: customerData.phone || "",
      address: customerData.address || "",
      gstin: customerData.gstin || "",
    });

    setShowForm(true);
  };

  const deleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/api/customers/${id}`);

      alert("Customer deleted successfully! 🗑️");

      await loadCustomers();
    } catch (error) {
      console.error("Failed to delete customer:", error);
      alert("Failed to delete customer.");
    }
  };

  const handleAddCustomer = () => {
    if (showForm && !editingCustomerId) {
      resetForm();
      return;
    }

    setEditingCustomerId(null);

    setCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      gstin: "",
    });

    setShowForm(true);
  };

  const resetForm = () => {
    setCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      gstin: "",
    });

    setEditingCustomerId(null);
    setShowForm(false);
  };

  const filteredCustomers = customers.filter((customerData) => {
    const search = searchTerm.toLowerCase();

    return (
      customerData.name?.toLowerCase().includes(search) ||
      customerData.email?.toLowerCase().includes(search) ||
      customerData.phone?.toLowerCase().includes(search) ||
      customerData.gstin?.toLowerCase().includes(search)
    );
  });

  const totalCustomers = customers.length;

  const gstCustomers = customers.filter(
    (customerData) => customerData.gstin
  ).length;

  const customersWithEmail = customers.filter(
    (customerData) => customerData.email
  ).length;

  if (loading) {
    return (
      <div className="customers-page loading-page">
        <div className="loading-card">
          <div className="loading-icon">👥</div>
          <h2>Loading Customers...</h2>
          <p>Please wait while we load your customer directory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-page">

      {/* ================= HEADER ================= */}

      <div className="customers-header">

        <div className="customer-header-left">

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <div className="customer-title-row">

            <div className="customer-main-icon">
              👥
            </div>

            <div className="customer-title-content">
              <h1>Customers</h1>
              <p>Manage and track your customers</p>
            </div>

          </div>

        </div>

        <button
          className="add-customer-button"
          onClick={handleAddCustomer}
        >
          + Add Customer
        </button>

      </div>


      {/* ================= SUMMARY CARDS ================= */}

      <div className="customer-summary-cards">

        <div className="customer-summary-card">

          <div className="customer-summary-icon blue">
            👥
          </div>

          <div className="customer-summary-content">
            <span>Total Customers</span>
            <strong>{totalCustomers}</strong>
            <small>All registered customers</small>
          </div>

        </div>


        <div className="customer-summary-card">

          <div className="customer-summary-icon green">
            ✉️
          </div>

          <div className="customer-summary-content">
            <span>Email Contacts</span>
            <strong>{customersWithEmail}</strong>
            <small>Customers with email</small>
          </div>

        </div>


        <div className="customer-summary-card">

          <div className="customer-summary-icon yellow">
            🧾
          </div>

          <div className="customer-summary-content">
            <span>GST Customers</span>
            <strong>{gstCustomers}</strong>
            <small>GST registered customers</small>
          </div>

        </div>

      </div>


      {/* ================= ADD / EDIT FORM ================= */}

      {showForm && (

        <form
          className="customer-form"
          onSubmit={saveCustomer}
        >

          <div className="form-header">

            <div>
              <h2>
                {editingCustomerId
                  ? "Edit Customer"
                  : "Add New Customer"}
              </h2>

              <p>
                Enter customer information below
              </p>
            </div>

            <button
              type="button"
              className="close-form-button"
              onClick={resetForm}
            >
              ✕
            </button>

          </div>


          <div className="form-grid">

            <div className="form-field">
              <label>Customer Name *</label>

              <input
                type="text"
                name="name"
                placeholder="Enter customer name"
                value={customer.name}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-field">
              <label>Email *</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={customer.email}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-field">
              <label>Phone *</label>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={customer.phone}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-field">
              <label>GSTIN *</label>

              <input
                type="text"
                name="gstin"
                placeholder="Enter GSTIN"
                value={customer.gstin}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-field full-width">
              <label>Address *</label>

              <input
                type="text"
                name="address"
                placeholder="Enter customer address"
                value={customer.address}
                onChange={handleChange}
                required
              />
            </div>

          </div>


          <div className="form-buttons">

            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
            >
              {editingCustomerId
                ? "✏️ Update Customer"
                : "💾 Save Customer"}
            </button>

          </div>

        </form>
      )}


      {/* ================= CUSTOMER DIRECTORY ================= */}

      <div className="customer-directory">

        <div className="directory-header">

          <div className="directory-title">

            <div className="directory-icon">
              ☷
            </div>

            <div>
              <h2>Customer Directory</h2>
              <p>
                {filteredCustomers.length} customer
                {filteredCustomers.length !== 1 ? "s" : ""}
                {" "}found
              </p>
            </div>

          </div>


          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>


        {filteredCustomers.length === 0 ? (

          <div className="empty-customers">

            <div className="empty-icon">
              👥
            </div>

            <h2>
              {searchTerm
                ? "No Customers Found"
                : "No Customers Yet"}
            </h2>

            <p>
              {searchTerm
                ? "Try a different search term."
                : "Add your first customer to get started."}
            </p>

          </div>

        ) : (

          <div className="customers-table-container">

            <table className="customers-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>GSTIN</th>
                  <th>Actions</th>
                </tr>
              </thead>


              <tbody>

                {filteredCustomers.map(
                  (customerData) => (

                    <tr key={customerData.id}>

                      <td>
                        <span className="customer-id">
                          #{customerData.id}
                        </span>
                      </td>


                      <td>
                        <div className="customer-name-cell">

                          <div className="customer-avatar">
                            {customerData.name
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </div>

                          <strong>
                            {customerData.name}
                          </strong>

                        </div>
                      </td>


                      <td>
                        <span className="customer-email">
                          {customerData.email}
                        </span>
                      </td>


                      <td>
                        {customerData.phone}
                      </td>


                      <td>
                        <span className="customer-address">
                          {customerData.address}
                        </span>
                      </td>


                      <td>

                        {customerData.gstin ? (
                          <span className="gstin-badge">
                            {customerData.gstin}
                          </span>
                        ) : (
                          <span className="no-gstin">
                            Not Available
                          </span>
                        )}

                      </td>


                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            onClick={() =>
                              editCustomer(customerData)
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              deleteCustomer(
                                customerData.id
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

          </div>

        )}

      </div>

    </div>
  );
}

export default Customers;

