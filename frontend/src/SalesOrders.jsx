
import { useEffect, useState } from "react";
import api from "./api";
import "./SalesOrders.css";

function SalesOrders({ onBack }) {
  const [salesOrders, setSalesOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersResponse, customersResponse, productsResponse] =
        await Promise.all([
          api.get("/api/sales-orders"),
          api.get("/api/customers"),
          api.get("/api/products/for-sales"),
        ]);

      setSalesOrders(ordersResponse.data);
      setCustomers(customersResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error("Error loading sales order data:", error);
      alert("Failed to load sales order data.");
    } finally {
      setLoading(false);
    }
  };

  const selectedProductData = products.find(
    (product) => product.id === Number(selectedProduct)
  );

  const createSalesOrder = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    if (!quantity || quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    if (
      selectedProductData &&
      quantity > selectedProductData.currentStock
    ) {
      alert(
        `Insufficient stock. Available stock: ${selectedProductData.currentStock}`
      );
      return;
    }

    try {
      await api.post("/api/sales-orders", {
        customer: {
          id: Number(selectedCustomer),
        },
        items: [
          {
            product: {
              id: Number(selectedProduct),
            },
            quantity: Number(quantity),
          },
        ],
      });

      alert("Sales Order created successfully! 🎉");

      setSelectedCustomer("");
      setSelectedProduct("");
      setQuantity(1);
      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error("Error creating sales order:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create sales order."
      );
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(
        `/api/sales-orders/${orderId}/status?status=${status}`
      );

      alert("Sales Order status updated successfully! ✅");

      await loadData();
    } catch (error) {
      console.error("Error updating sales order status:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    }
  };

  const pendingOrders = salesOrders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const approvedOrders = salesOrders.filter(
    (order) => order.status === "APPROVED"
  ).length;

  const dispatchedOrders = salesOrders.filter(
    (order) => order.status === "DISPATCHED"
  ).length;

  const totalSales = salesOrders.reduce(
    (sum, order) =>
      sum + Number(order.totalAmount || 0),
    0
  );

  if (loading) {
    return (
      <div className="sales-orders-page loading-page">
        <div className="loading-card">
          <div className="loading-icon">📦</div>
          <h2>Loading Sales Orders...</h2>
          <p>
            Please wait while we load your sales order data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sales-orders-page">

      {/* ================= HEADER ================= */}

      <div className="sales-orders-header">

        <div className="sales-header-left">

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <div className="sales-title-row">

            <div className="sales-main-icon">
              💰
            </div>

            <div className="sales-title-content">
              <h1>Sales Orders</h1>
              <p>
                Manage customer orders and sales
              </p>
            </div>

          </div>

        </div>

        <button
          className="add-sales-order-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm
            ? "Close Form"
            : "+ Create Sales Order"}
        </button>

      </div>


      {/* ================= SUMMARY CARDS ================= */}

      <div className="sales-summary-cards">

        <div className="sales-summary-card">

          <div className="sales-summary-icon blue">
            📦
          </div>

          <div className="sales-summary-content">
            <span>Total Orders</span>
            <strong>{salesOrders.length}</strong>
            <small>All sales orders</small>
          </div>

        </div>


        <div className="sales-summary-card">

          <div className="sales-summary-icon yellow">
            ⏳
          </div>

          <div className="sales-summary-content">
            <span>Pending Orders</span>
            <strong>{pendingOrders}</strong>
            <small>Awaiting approval</small>
          </div>

        </div>


        <div className="sales-summary-card">

          <div className="sales-summary-icon green">
            ✅
          </div>

          <div className="sales-summary-content">
            <span>Approved</span>
            <strong>{approvedOrders}</strong>
            <small>Ready for dispatch</small>
          </div>

        </div>


        <div className="sales-summary-card">

          <div className="sales-summary-icon purple">
            🚚
          </div>

          <div className="sales-summary-content">
            <span>Dispatched</span>
            <strong>{dispatchedOrders}</strong>
            <small>Orders dispatched</small>
          </div>

        </div>

      </div>


      {/* ================= SALES VALUE ================= */}

      <div className="sales-value-card">

        <div>
          <span>Total Sales Value</span>
          <strong>
            ₹{totalSales.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </div>

        <div className="sales-value-icon">
          ₹
        </div>

      </div>


      {/* ================= CREATE FORM ================= */}

      {showForm && (

        <div className="sales-order-form">

          <div className="form-header">

            <div>
              <h2>Create Sales Order</h2>
              <p>
                Create a new order for a customer
              </p>
            </div>

            <button
              className="close-form-button"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

          </div>


          <div className="form-grid">

            <div className="form-field">

              <label>Customer *</label>

              <select
                value={selectedCustomer}
                onChange={(e) =>
                  setSelectedCustomer(e.target.value)
                }
              >
                <option value="">
                  Select Customer
                </option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>
                ))}

              </select>

            </div>


            <div className="form-field">

              <label>Product *</label>

              <select
                value={selectedProduct}
                onChange={(e) =>
                  setSelectedProduct(e.target.value)
                }
              >
                <option value="">
                  Select Product
                </option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.productName} — Stock:{" "}
                    {product.currentStock}
                  </option>
                ))}

              </select>

            </div>


            <div className="form-field">

              <label>Quantity *</label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Number(e.target.value))
                }
              />

            </div>

          </div>


          {/* Product information */}

          {selectedProductData && (

            <div className="product-info">

              <div className="product-info-header">
                <span>Selected Product</span>
                <span className="stock-badge">
                  Stock:{" "}
                  {selectedProductData.currentStock}
                </span>
              </div>

              <div className="product-info-grid">

                <div>
                  <small>Product</small>
                  <strong>
                    {selectedProductData.productName}
                  </strong>
                </div>

                <div>
                  <small>Unit Price</small>
                  <strong>
                    ₹
                    {Number(
                      selectedProductData.unitPrice || 0
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </div>

                <div>
                  <small>Quantity</small>
                  <strong>{quantity}</strong>
                </div>

                <div>
                  <small>Order Total</small>
                  <strong className="order-total">
                    ₹
                    {(
                      selectedProductData.unitPrice *
                      quantity
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>

              </div>

            </div>

          )}


          <div className="form-buttons">

            <button
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              className="create-button"
              onClick={createSalesOrder}
            >
              💰 Create Order
            </button>

          </div>

        </div>
      )}


      {/* ================= SALES ORDER DIRECTORY ================= */}

      <div className="sales-order-directory">

        <div className="directory-header">

          <div className="directory-title">

            <div className="directory-icon">
              ☷
            </div>

            <div>
              <h2>Sales Order Directory</h2>
              <p>
                {salesOrders.length} order
                {salesOrders.length !== 1
                  ? "s"
                  : ""}{" "}
                in the system
              </p>
            </div>

          </div>

        </div>


        {salesOrders.length === 0 ? (

          <div className="empty-sales-orders">

            <div className="empty-icon">
              📦
            </div>

            <h2>No Sales Orders Found</h2>

            <p>
              Create your first sales order to get started.
            </p>

          </div>

        ) : (

          <div className="sales-orders-table-container">

            <table className="sales-orders-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {salesOrders.map((order) => (

                  <tr key={order.id}>

                    <td>
                      <span className="order-id">
                        #{order.id}
                      </span>
                    </td>


                    <td>

                      <div className="customer-cell">

                        <div className="customer-avatar">
                          {order.customer?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "C"}
                        </div>

                        <strong>
                          {order.customer?.name ||
                            "N/A"}
                        </strong>

                      </div>

                    </td>


                    <td>
                      <span className="order-date">
                        {order.orderDate || "N/A"}
                      </span>
                    </td>


                    <td>

                      <strong className="amount">
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </strong>

                    </td>


                    <td>

                      <span
                        className={`status ${String(
                          order.status || "PENDING"
                        ).toLowerCase()}`}
                      >
                        {order.status || "PENDING"}
                      </span>

                    </td>


                    <td>

                      {order.items?.map((item) => (

                        <div
                          key={item.id}
                          className="order-item"
                        >
                          <span>
                            {item.product
                              ?.productName ||
                              "Product"}
                          </span>

                          <small>
                            × {item.quantity}
                          </small>
                        </div>

                      ))}

                    </td>


                    <td>

                      <div className="status-buttons">

                        {order.status === "PENDING" && (

                          <button
                            className="approve-button"
                            onClick={() =>
                              updateStatus(
                                order.id,
                                "APPROVED"
                              )
                            }
                          >
                            ✓ Approve
                          </button>

                        )}

                        {order.status === "APPROVED" && (

                          <button
                            className="dispatch-button"
                            onClick={() =>
                              updateStatus(
                                order.id,
                                "DISPATCHED"
                              )
                            }
                          >
                            🚚 Dispatch
                          </button>

                        )}

                        {order.status === "DISPATCHED" && (

                          <span className="completed-label">
                            ✓ Completed
                          </span>

                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default SalesOrders;

