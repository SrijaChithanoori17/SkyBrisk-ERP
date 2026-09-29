
import { useEffect, useState } from "react";
import api from "./api";
import "./GRNs.css";

function GRNs({ onBack }) {
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState("");

  const [receivedDate, setReceivedDate] = useState("");

  const [receivedItems, setReceivedItems] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadGRNs();
    loadPurchaseOrders();
  }, []);

  /* =====================================================
     LOAD ALL GRNs
  ===================================================== */

  const loadGRNs = async () => {
    try {
      const response = await api.get("/api/grns");

      setGrns(response.data);
    } catch (error) {
      console.error("Error loading GRNs:", error);

      alert("Failed to load GRNs.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD ONLY ORDERED PURCHASE ORDERS
  ===================================================== */

  const loadPurchaseOrders = async () => {
    try {
      // GRN-specific endpoint
      // Accessible by ADMIN, PURCHASE_MANAGER,
      // and INVENTORY_MANAGER
      const response = await api.get(
        "/api/purchase-orders/for-grn"
      );

      const orderedPOs = response.data.filter(
        (po) => po.status === "ORDERED"
      );

      setPurchaseOrders(orderedPOs);
    } catch (error) {
      console.error(
        "Error loading purchase orders:",
        error
      );

      alert("Failed to load Purchase Orders.");
    }
  };

  /* =====================================================
     OPEN GRN FORM
  ===================================================== */

  const openCreateForm = () => {
    setSelectedPO("");
    setReceivedDate("");
    setReceivedItems([]);

    setShowForm(true);
  };

  /* =====================================================
     CLOSE GRN FORM
  ===================================================== */

  const closeForm = () => {
    setShowForm(false);

    setSelectedPO("");
    setReceivedDate("");
    setReceivedItems([]);
  };

  /* =====================================================
     PURCHASE ORDER CHANGE
  ===================================================== */

  const handlePOChange = async (poId) => {
    setSelectedPO(poId);

    if (!poId) {
      setReceivedItems([]);
      return;
    }

    try {
      const response = await api.get(
        `/api/purchase-orders/${poId}`
      );

      const items = response.data.items.map(
        (item) => ({
          productId: item.product.id,

          productName:
            item.product.productName,

          orderedQuantity:
            item.quantity,

          quantityReceived: ""
        })
      );

      setReceivedItems(items);
    } catch (error) {
      console.error(
        "Error loading purchase order:",
        error
      );

      alert(
        "Failed to load Purchase Order details."
      );
    }
  };

  /* =====================================================
     UPDATE RECEIVED QUANTITY
  ===================================================== */

  const handleQuantityChange = (
    index,
    value
  ) => {
    const updatedItems = [
      ...receivedItems
    ];

    if (
      value !== "" &&
      Number(value) >
        updatedItems[index].orderedQuantity
    ) {
      alert(
        `Received quantity cannot be greater than ordered quantity (${updatedItems[index].orderedQuantity}).`
      );

      return;
    }

    updatedItems[index].quantityReceived =
      value;

    setReceivedItems(updatedItems);
  };

  /* =====================================================
     CREATE GRN
  ===================================================== */

  const createGRN = async () => {
    if (!selectedPO) {
      alert(
        "Please select a Purchase Order."
      );

      return;
    }

    if (!receivedDate) {
      alert(
        "Please select the received date."
      );

      return;
    }

    const hasInvalidQuantity =
      receivedItems.some(
        (item) =>
          !item.quantityReceived ||
          Number(item.quantityReceived) <= 0 ||
          Number(item.quantityReceived) >
            item.orderedQuantity
      );

    if (hasInvalidQuantity) {
      alert(
        "Please enter valid received quantities."
      );

      return;
    }

    try {
      const grnData = {
        purchaseOrder: {
          id: Number(selectedPO)
        },

        receivedDate: receivedDate,

        items: receivedItems.map(
          (item) => ({
            product: {
              id: item.productId
            },

            quantityReceived:
              Number(
                item.quantityReceived
              )
          })
        )
      };

      await api.post(
        "/api/grns",
        grnData
      );

      alert(
        "GRN created successfully! 🎉"
      );

      closeForm();

      await loadGRNs();
      await loadPurchaseOrders();
    } catch (error) {
      console.error(
        "Error creating GRN:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to create GRN."
      );
    }
  };

  /* =====================================================
     SEARCH GRNs
  ===================================================== */

  const filteredGRNs = grns.filter(
    (grn) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      const grnId =
        String(grn.id || "");

      const poId =
        String(
          grn.purchaseOrder?.id || ""
        );

      const supplierName =
        grn.purchaseOrder
          ?.supplier?.name || "";

      const productNames =
        grn.items
          ?.map(
            (item) =>
              item.product
                ?.productName || ""
          )
          .join(" ") || "";

      return (
        grnId.includes(search) ||
        poId.includes(search) ||
        supplierName
          .toLowerCase()
          .includes(search) ||
        productNames
          .toLowerCase()
          .includes(search)
      );
    }
  );

  /* =====================================================
     SUMMARY DATA
  ===================================================== */

  const totalGRNs =
    grns.length;

  const totalItemsReceived =
    grns.reduce(
      (total, grn) =>
        total +
        (grn.items || []).reduce(
          (sum, item) =>
            sum +
            Number(
              item.quantityReceived || 0
            ),
          0
        ),
      0
    );

  const uniqueSuppliers =
    new Set(
      grns
        .map(
          (grn) =>
            grn.purchaseOrder
              ?.supplier?.id
        )
        .filter(Boolean)
    ).size;

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="grns-page loading-page">

        <div className="loading-spinner"></div>

        <h2>
          Loading Goods Receipt Notes...
        </h2>

      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="grns-page">

      {/* ================= HEADER ================= */}

      <div className="grns-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <div className="grn-title-row">

          <div className="grn-main-icon">
            📥
          </div>

          <div className="grn-title-content">

            <h1>
              Goods Receipt Notes
            </h1>

            <p>
              Receive and manage incoming inventory
            </p>

          </div>

        </div>

        <button
          className="add-grn-button"
          onClick={openCreateForm}
        >
          + Create GRN
        </button>

      </div>


      {/* ================= SUMMARY CARDS ================= */}

      <div className="grn-summary-cards">

        <div className="grn-summary-card">

          <div className="grn-summary-icon blue">
            📋
          </div>

          <div className="grn-summary-content">

            <span>
              Total GRNs
            </span>

            <strong>
              {totalGRNs}
            </strong>

            <small>
              All receipt notes
            </small>

          </div>

          <div className="summary-arrow">
            →
          </div>

        </div>


        <div className="grn-summary-card">

          <div className="grn-summary-icon green">
            📦
          </div>

          <div className="grn-summary-content">

            <span>
              Items Received
            </span>

            <strong>
              {totalItemsReceived}
            </strong>

            <small>
              Total quantity received
            </small>

          </div>

          <div className="summary-arrow">
            →
          </div>

        </div>


        <div className="grn-summary-card">

          <div className="grn-summary-icon yellow">
            🏭
          </div>

          <div className="grn-summary-content">

            <span>
              Suppliers
            </span>

            <strong>
              {uniqueSuppliers}
            </strong>

            <small>
              Suppliers with receipts
            </small>

          </div>

          <div className="summary-arrow">
            →
          </div>

        </div>

      </div>


      {/* ================= CREATE GRN FORM ================= */}

      {showForm && (
        <div className="grn-form">

          <div className="form-header">

            <div className="form-title">

              <div className="form-icon">
                📥
              </div>

              <div>

                <h2>
                  Create Goods Receipt Note
                </h2>

                <p>
                  Record received inventory against a purchase order
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


          {/* FORM TOP */}

          <div className="grn-form-grid">

            <div className="form-field">

              <label>
                Purchase Order *
              </label>

              <select
                value={selectedPO}
                onChange={(e) =>
                  handlePOChange(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Purchase Order
                </option>

                {purchaseOrders.map(
                  (po) => (

                    <option
                      key={po.id}
                      value={po.id}
                    >
                      PO #{po.id} -{" "}
                      {po.supplier?.name ||
                        "Supplier"}
                    </option>

                  )
                )}

              </select>

            </div>


            <div className="form-field">

              <label>
                Received Date *
              </label>

              <input
                type="date"
                value={receivedDate}
                onChange={(e) =>
                  setReceivedDate(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* RECEIVED ITEMS */}

          {receivedItems.length > 0 && (

            <div className="received-items-section">

              <div className="received-items-header">

                <div>

                  <h3>
                    Received Items
                  </h3>

                  <p>
                    Enter the actual quantity received
                  </p>

                </div>

                <span className="items-count">
                  {receivedItems.length} item
                  {receivedItems.length !== 1
                    ? "s"
                    : ""}
                </span>

              </div>


              <div className="received-items-table">

                <div className="received-items-row received-items-heading">

                  <span>
                    Product
                  </span>

                  <span>
                    Ordered Qty
                  </span>

                  <span>
                    Received Qty
                  </span>

                </div>


                {receivedItems.map(
                  (item, index) => (

                    <div
                      className="received-items-row"
                      key={item.productId}
                    >

                      <div className="received-product">

                        <div className="product-icon">
                          ◈
                        </div>

                        <strong>
                          {item.productName}
                        </strong>

                      </div>


                      <div className="ordered-quantity">
                        {item.orderedQuantity}
                      </div>


                      <div>

                        <input
                          className="received-quantity-input"
                          type="number"
                          min="1"
                          max={
                            item.orderedQuantity
                          }
                          placeholder="Enter quantity"
                          value={
                            item.quantityReceived
                          }
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              e.target.value
                            )
                          }
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* FORM ACTIONS */}

          <div className="form-actions">

            <button
              className="cancel-button"
              onClick={closeForm}
            >
              Cancel
            </button>

            <button
              className="create-button"
              onClick={createGRN}
            >
              📦 Create GRN
            </button>

          </div>

        </div>
      )}


      {/* ================= GRN DIRECTORY ================= */}

      <div className="grn-directory">

        <div className="directory-header">

          <div className="directory-title">

            <div className="directory-icon">
              ☷
            </div>

            <div>

              <h2>
                GRN Directory
              </h2>

              <p>
                {filteredGRNs.length} GRN
                {filteredGRNs.length !== 1
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
              placeholder="Search GRNs..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

        </div>


        {filteredGRNs.length === 0 ? (

          <div className="empty-grns">

            <div className="empty-icon">
              📥
            </div>

            <h2>
              No GRNs Found
            </h2>

            <p>
              {searchTerm
                ? "Try a different search."
                : "Create your first Goods Receipt Note."}
            </p>

          </div>

        ) : (

          <div className="grn-table-wrapper">

            <table className="grn-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Purchase Order</th>
                  <th>Supplier</th>
                  <th>Received Date</th>
                  <th>Received Items</th>
                </tr>

              </thead>


              <tbody>

                {filteredGRNs.map(
                  (grn) => (

                    <tr key={grn.id}>

                      <td>

                        <span className="grn-id">
                          #{grn.id}
                        </span>

                      </td>


                      <td>

                        <span className="po-badge">
                          PO #
                          {grn.purchaseOrder?.id}
                        </span>

                      </td>


                      <td>

                        <div className="supplier-cell">

                          <div className="supplier-avatar">
                            {(
                              grn.purchaseOrder
                                ?.supplier
                                ?.name ||
                              "S"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span>
                            {grn.purchaseOrder
                              ?.supplier
                              ?.name ||
                              "N/A"}
                          </span>

                        </div>

                      </td>


                      <td>

                        <div className="date-cell">

                          <span>
                            ▣
                          </span>

                          {grn.receivedDate ||
                            "N/A"}

                        </div>

                      </td>


                      <td>

                        <div className="grn-items-list">

                          {grn.items?.map(
                            (item) => (

                              <div
                                className="grn-item"
                                key={item.id}
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
                                  ×{" "}
                                  {
                                    item.quantityReceived
                                  }
                                </strong>

                              </div>

                            )
                          )}

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

export default GRNs;

