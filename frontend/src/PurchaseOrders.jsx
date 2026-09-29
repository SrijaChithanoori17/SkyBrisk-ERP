
import { useEffect, useState } from "react";
import api from "./api";
import "./PurchaseOrders.css";

function PurchaseOrders({ onBack }) {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingOrderStatus, setEditingOrderStatus] =
    useState("ORDERED");

  const [supplierId, setSupplierId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] =
    useState("");

  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  useEffect(() => {
    if (showForm) {
      loadSuppliers();
      loadProducts();
    }
  }, [showForm]);

  /* =====================================================
     LOAD PURCHASE ORDERS
  ===================================================== */

  const loadPurchaseOrders = async () => {
    try {
      const response = await api.get("/api/purchase-orders");

      setPurchaseOrders(response.data);
    } catch (error) {
      console.error(
        "Error loading purchase orders:",
        error
      );

      alert("Failed to load purchase orders.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD SUPPLIERS
  ===================================================== */

  const loadSuppliers = async () => {
    try {
      const response = await api.get("/api/suppliers");

      setSuppliers(response.data);
    } catch (error) {
      console.error(
        "Error loading suppliers:",
        error
      );
    }
  };

  /* =====================================================
     LOAD PRODUCTS
  ===================================================== */

  const loadProducts = async () => {
    try {
      const response = await api.get("/api/products");

      setProducts(response.data);
    } catch (error) {
      console.error(
        "Error loading products:",
        error
      );
    }
  };

  /* =====================================================
     OPEN CREATE FORM
  ===================================================== */

  const openCreateForm = () => {
    setEditingOrderId(null);
    setEditingOrderStatus("ORDERED");

    setSupplierId("");
    setProductId("");
    setQuantity("");
    setExpectedDeliveryDate("");

    setShowForm(true);
  };

  /* =====================================================
     OPEN EDIT FORM
  ===================================================== */

  const openEditForm = (order) => {
    setEditingOrderId(order.id);

    // Preserve existing status
    setEditingOrderStatus(
      order.status || "ORDERED"
    );

    setSupplierId(
      order.supplier?.id
        ? String(order.supplier.id)
        : ""
    );

    if (order.items && order.items.length > 0) {
      setProductId(
        order.items[0].product?.id
          ? String(order.items[0].product.id)
          : ""
      );

      setQuantity(
        order.items[0].quantity || ""
      );
    } else {
      setProductId("");
      setQuantity("");
    }

    setExpectedDeliveryDate(
      order.expectedDeliveryDate || ""
    );

    setShowForm(true);
  };

  /* =====================================================
     CLOSE FORM
  ===================================================== */

  const closeForm = () => {
    setShowForm(false);

    setEditingOrderId(null);
    setEditingOrderStatus("ORDERED");

    setSupplierId("");
    setProductId("");
    setQuantity("");
    setExpectedDeliveryDate("");
  };

  /* =====================================================
     CREATE PURCHASE ORDER
  ===================================================== */

  const createPurchaseOrder = async () => {
    if (!supplierId) {
      alert("Please select a supplier.");
      return;
    }

    if (!productId) {
      alert("Please select a product.");
      return;
    }

    if (!quantity || Number(quantity) < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    if (!expectedDeliveryDate) {
      alert("Please select expected delivery date.");
      return;
    }

    try {
      setCreating(true);

      await api.post("/api/purchase-orders", {
        supplier: {
          id: Number(supplierId),
        },

        expectedDeliveryDate,

        status: "ORDERED",

        items: [
          {
            product: {
              id: Number(productId),
            },

            quantity: Number(quantity),
          },
        ],
      });

      alert(
        "Purchase Order created successfully! 🎉"
      );

      closeForm();

      await loadPurchaseOrders();
    } catch (error) {
      console.error(
        "Error creating purchase order:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to create purchase order."
      );
    } finally {
      setCreating(false);
    }
  };

  /* =====================================================
     UPDATE PURCHASE ORDER
  ===================================================== */

  const updatePurchaseOrder = async () => {
    if (!supplierId) {
      alert("Please select a supplier.");
      return;
    }

    if (!productId) {
      alert("Please select a product.");
      return;
    }

    if (!quantity || Number(quantity) < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    if (!expectedDeliveryDate) {
      alert("Please select expected delivery date.");
      return;
    }

    try {
      setCreating(true);

      await api.put(
        `/api/purchase-orders/${editingOrderId}`,
        {
          supplier: {
            id: Number(supplierId),
          },

          expectedDeliveryDate,

          // Preserve current status
          status:
            editingOrderStatus || "ORDERED",

          items: [
            {
              product: {
                id: Number(productId),
              },

              quantity: Number(quantity),
            },
          ],
        }
      );

      alert(
        "Purchase Order updated successfully! ✅"
      );

      closeForm();

      await loadPurchaseOrders();
    } catch (error) {
      console.error(
        "Error updating purchase order:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to update purchase order."
      );
    } finally {
      setCreating(false);
    }
  };

  /* =====================================================
     FORM SUBMIT
  ===================================================== */

  const handleFormSubmit = async () => {
    if (editingOrderId) {
      await updatePurchaseOrder();
    } else {
      await createPurchaseOrder();
    }
  };

  /* =====================================================
     DELETE PURCHASE ORDER
  ===================================================== */

  const deletePurchaseOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Purchase Order?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/api/purchase-orders/${id}`
      );

      alert(
        "Purchase Order deleted successfully! 🗑️"
      );

      await loadPurchaseOrders();
    } catch (error) {
      console.error(
        "Failed to delete purchase order:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to delete purchase order."
      );
    }
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredPurchaseOrders =
    purchaseOrders.filter((order) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      if (!search) {
        return true;
      }

      const supplierName =
        order.supplier?.name || "";

      const status =
        order.status || "";

      const id =
        String(order.id || "");

      const productNames =
        order.items
          ?.map(
            (item) =>
              item.product?.productName || ""
          )
          .join(" ") || "";

      return (
        supplierName
          .toLowerCase()
          .includes(search) ||
        status
          .toLowerCase()
          .includes(search) ||
        id.includes(search) ||
        productNames
          .toLowerCase()
          .includes(search)
      );
    });

  /* =====================================================
     SUMMARY COUNTS
  ===================================================== */

  const totalOrders =
    purchaseOrders.length;

  const receivedOrders =
    purchaseOrders.filter(
      (order) =>
        order.status === "RECEIVED"
    ).length;

  const pendingOrders =
    purchaseOrders.filter(
      (order) =>
        order.status === "ORDERED"
    ).length;

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="purchase-orders-page loading-page">
        <div className="loading-spinner"></div>

        <h2>
          Loading Purchase Orders...
        </h2>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="purchase-orders-page">

      {/* ================= HEADER ================= */}

      <div className="purchase-orders-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <div className="purchase-title-row">

          <div className="purchase-main-icon">
            🛒
          </div>

          <div className="purchase-title-content">

            <h1>
              Purchase Orders
            </h1>

            <p>
              Manage and track your purchase orders
            </p>

          </div>

        </div>

        <button
          className="add-purchase-order-button"
          onClick={openCreateForm}
        >
          + Create Purchase Order
        </button>

      </div>


      {/* ================= SUMMARY CARDS ================= */}

      <div className="purchase-summary-cards">

        <div className="purchase-summary-card">

          <div className="purchase-summary-icon blue">
            📋
          </div>

          <div className="purchase-summary-content">

            <span>
              Total Purchase Orders
            </span>

            <strong>
              {totalOrders}
            </strong>

            <small>
              All purchase orders
            </small>

          </div>

          <div className="summary-arrow">
            →
          </div>

        </div>


        <div className="purchase-summary-card">

          <div className="purchase-summary-icon green">
            🚚
          </div>

          <div className="purchase-summary-content">

            <span>
              Received Orders
            </span>

            <strong>
              {receivedOrders}
            </strong>

            <small>
              Completed deliveries
            </small>

          </div>

          <div className="summary-arrow">
            →
          </div>

        </div>


        <div className="purchase-summary-card">

          <div className="purchase-summary-icon yellow">
            🕐
          </div>

          <div className="purchase-summary-content">

            <span>
              Pending Orders
            </span>

            <strong>
              {pendingOrders}
            </strong>

            <small>
              Awaiting delivery
            </small>

          </div>

          <div className="summary-arrow">
            →
          </div>

        </div>

      </div>


      {/* ================= CREATE / EDIT FORM ================= */}

      {showForm && (
        <div className="purchase-order-form">

          <div className="form-header">

            <div className="form-title">

              <div className="form-icon">
                🛒
              </div>

              <div>
                <h2>
                  {editingOrderId
                    ? "Edit Purchase Order"
                    : "Create Purchase Order"}
                </h2>

                <p>
                  {editingOrderId
                    ? "Update purchase order details"
                    : "Create a new purchase order"}
                </p>
              </div>

            </div>

            <button
              className="form-close-button"
              onClick={closeForm}
            >
              × Close
            </button>

          </div>


          <div className="purchase-form-grid">

            <div className="form-field">

              <label>
                Supplier *
              </label>

              <select
                value={supplierId}
                onChange={(e) =>
                  setSupplierId(e.target.value)
                }
              >

                <option value="">
                  Select Supplier
                </option>

                {suppliers.map(
                  (supplier) => (
                    <option
                      key={supplier.id}
                      value={supplier.id}
                    >
                      {supplier.name}
                    </option>
                  )
                )}

              </select>

            </div>


            <div className="form-field">

              <label>
                Product *
              </label>

              <select
                value={productId}
                onChange={(e) =>
                  setProductId(e.target.value)
                }
              >

                <option value="">
                  Select Product
                </option>

                {products.map(
                  (product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.productName}
                    </option>
                  )
                )}

              </select>

            </div>


            <div className="form-field">

              <label>
                Quantity *
              </label>

              <input
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />

            </div>


            <div className="form-field">

              <label>
                Expected Delivery Date *
              </label>

              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) =>
                  setExpectedDeliveryDate(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          <div className="form-actions">

            <button
              className="cancel-button"
              onClick={closeForm}
              disabled={creating}
            >
              Cancel
            </button>

            <button
              className="create-button"
              onClick={handleFormSubmit}
              disabled={creating}
            >
              {creating
                ? "Saving..."
                : editingOrderId
                ? "Update Purchase Order"
                : "Create Purchase Order"}
            </button>

          </div>

        </div>
      )}


      {/* ================= DIRECTORY ================= */}

      <div className="purchase-directory">

        <div className="directory-header">

          <div className="directory-title">

            <div className="directory-icon">
              ☷
            </div>

            <div>
              <h2>
                Purchase Order Directory
              </h2>

              <p>
                {filteredPurchaseOrders.length} purchase order
                {filteredPurchaseOrders.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

          </div>


          <div className="search-box">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search purchase orders..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>


        {filteredPurchaseOrders.length === 0 ? (

          <div className="empty-purchase-orders">

            <div className="empty-icon">
              📋
            </div>

            <h2>
              No Purchase Orders Found
            </h2>

            <p>
              {searchTerm
                ? "Try a different search."
                : "Create your first purchase order."}
            </p>

          </div>

        ) : (

          <div className="purchase-table-wrapper">

            <table className="purchase-orders-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Supplier</th>
                  <th>Products</th>
                  <th>Expected Delivery</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {filteredPurchaseOrders.map(
                  (order) => (

                    <tr key={order.id}>

                      <td>
                        <span className="order-id">
                          #{order.id}
                        </span>
                      </td>


                      <td>

                        <div className="supplier-cell">

                          <div className="supplier-avatar">
                            {(order.supplier?.name ||
                              "S")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span>
                            {order.supplier?.name ||
                              "N/A"}
                          </span>

                        </div>

                      </td>


                      <td>

                        {order.items?.map(
                          (item) => (

                            <div
                              key={item.id}
                              className="product-cell"
                            >

                              <span className="product-mini-icon">
                                ◈
                              </span>

                              <span>
                                {item.product
                                  ?.productName ||
                                  "Product"}
                              </span>

                              <strong>
                                × {item.quantity}
                              </strong>

                            </div>

                          )
                        )}

                      </td>


                      <td>

                        <div className="date-cell">

                          <span>
                            ▣
                          </span>

                          {order.expectedDeliveryDate ||
                            "N/A"}

                        </div>

                      </td>


                      <td>

                        <span
                          className={`status ${
                            String(
                              order.status ||
                                "ORDERED"
                            ).toLowerCase()
                          }`}
                        >

                          <span className="status-dot"></span>

                          {order.status ||
                            "ORDERED"}

                        </span>

                      </td>


                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            onClick={() =>
                              openEditForm(order)
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              deletePurchaseOrder(
                                order.id
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

export default PurchaseOrders;

