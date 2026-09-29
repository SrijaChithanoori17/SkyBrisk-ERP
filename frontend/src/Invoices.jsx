
import { useEffect, useState } from "react";
import api from "./api";
import "./Invoices.css";

function Invoices({ onBack }) {

  /* =====================================================
     USER ROLE
  ===================================================== */

  const role = localStorage.getItem("role");

  const isAdmin =
    role === "ADMIN";

  const isSalesExecutive =
    role === "SALES_EXECUTIVE";

  const isAccountant =
    role === "ACCOUNTANT";

  const canAccessInvoices =
    isAdmin ||
    isSalesExecutive ||
    isAccountant;

  const canCreateInvoice =
    isAdmin ||
    isSalesExecutive;


  /* =====================================================
     STATE
  ===================================================== */

  const [invoices, setInvoices] = useState([]);

  const [salesOrders, setSalesOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [selectedSalesOrder, setSelectedSalesOrder] =
    useState("");

  const [tax, setTax] =
    useState(0);


  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {

    /*
     * If the logged-in user does not have
     * invoice access, don't call the API.
     */

    if (!canAccessInvoices) {
      setLoading(false);
      return;
    }

    try {

      /* -----------------------------------------------
         LOAD INVOICES
         ADMIN + SALES_EXECUTIVE + ACCOUNTANT
      ------------------------------------------------ */

      const invoiceResponse =
        await api.get("/api/invoices");

      setInvoices(
        invoiceResponse.data || []
      );


      /*
       * Sales Orders are needed only when
       * creating an invoice.
       *
       * Accountant does NOT have Sales Order access,
       * so we must not call this API for Accountant.
       */

      if (canCreateInvoice) {

        const salesOrderResponse =
          await api.get("/api/sales-orders");

        setSalesOrders(
          salesOrderResponse.data || []
        );

      } else {

        /*
         * Accountant does not need sales orders
         * for viewing/managing existing invoices.
         */

        setSalesOrders([]);

      }

    } catch (error) {

      console.error(
        "Error loading invoice data:",
        error
      );

      /*
       * Don't show the popup for a permission
       * problem. Give a useful message instead.
       */

      if (error.response?.status === 403) {

        console.error(
          "You do not have permission to access invoice data."
        );

        alert(
          "You do not have permission to access invoice data."
        );

      } else {

        alert(
          "Failed to load invoice data."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  /* =====================================================
     AVAILABLE SALES ORDERS
     Only used by Admin / Sales Executive
  ===================================================== */

  const availableSalesOrders =
    salesOrders.filter(
      (order) =>

        order.status === "APPROVED" &&

        !invoices.some(
          (invoice) =>
            invoice.salesOrder?.id ===
            order.id
        )
    );


  /* =====================================================
     CREATE INVOICE
  ===================================================== */

  const createInvoice = async () => {

    if (!canCreateInvoice) {

      alert(
        "You do not have permission to create invoices."
      );

      return;

    }


    if (!selectedSalesOrder) {

      alert(
        "Please select a sales order."
      );

      return;

    }


    if (tax < 0) {

      alert(
        "Tax cannot be negative."
      );

      return;

    }


    try {

      await api.post(
        `/api/invoices?salesOrderId=${selectedSalesOrder}&tax=${tax}`
      );


      alert(
        "Invoice created successfully! 🎉"
      );


      setSelectedSalesOrder("");

      setTax(0);

      setShowForm(false);


      await loadData();

    } catch (error) {

      console.error(
        "Error creating invoice:",
        error
      );


      alert(
        error.response?.data?.message ||
          "Failed to create invoice."
      );

    }

  };


  /* =====================================================
     UPDATE INVOICE STATUS
  ===================================================== */

  const updateStatus = async (
    invoiceId,
    status
  ) => {

    try {

      await api.put(
        `/api/invoices/${invoiceId}/status?status=${status}`
      );


      alert(
        `Invoice marked as ${status}! ✅`
      );


      await loadData();

    } catch (error) {

      console.error(
        "Error updating invoice status:",
        error
      );


      alert(
        error.response?.data?.message ||
          "Failed to update invoice status."
      );

    }

  };


  /* =====================================================
     VIEW PDF
  ===================================================== */

  const viewPdf = async (
    invoiceId
  ) => {

    try {

      const response =
        await api.get(
          `/api/invoices/${invoiceId}/pdf`,
          {
            responseType: "blob",
          }
        );


      const pdfBlob =
        new Blob(
          [response.data],
          {
            type: "application/pdf",
          }
        );


      const pdfUrl =
        window.URL.createObjectURL(
          pdfBlob
        );


      window.open(
        pdfUrl,
        "_blank"
      );

    } catch (error) {

      console.error(
        "Error opening invoice PDF:",
        error
      );


      alert(
        "Failed to open invoice PDF."
      );

    }

  };


  /* =====================================================
     SUMMARY CALCULATIONS
  ===================================================== */

  const totalInvoices =
    invoices.length;


  const paidInvoices =
    invoices.filter(
      (invoice) =>
        invoice.status === "PAID"
    ).length;


  const unpaidInvoices =
    invoices.filter(
      (invoice) =>
        invoice.status === "UNPAID"
    ).length;


  const totalPayable =
    invoices.reduce(
      (sum, invoice) =>
        sum +
        Number(
          invoice.totalPayable || 0
        ),
      0
    );


  /* =====================================================
     UNAUTHORIZED ROLE
  ===================================================== */

  if (!canAccessInvoices) {

    return (

      <div className="invoices-page">

        <div className="invoice-loading-page">

          <div className="invoice-loading-card">

            <div className="invoice-main-icon">
              🔒
            </div>

            <h2>
              Access Restricted
            </h2>

            <p>
              You do not have permission to access
              the Invoice Management module.
            </p>

            <button
              className="back-button"
              onClick={onBack}
            >
              ← Back to Dashboard
            </button>

          </div>

        </div>

      </div>

    );

  }


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="invoice-loading-page">

        <div className="invoice-loading-card">

          <div className="loading-spinner"></div>

          <h2>
            Loading Invoices...
          </h2>

          <p>
            Please wait while we fetch your invoices.
          </p>

        </div>

      </div>

    );

  }


  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="invoices-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="invoices-header">

        <div className="invoice-header-left">

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>


          <div className="invoice-title-row">

            <div className="invoice-main-icon">
              🧾
            </div>


            <div className="invoice-title-content">

              <h1>
                Invoices
              </h1>

              <p>
                Manage invoices, payments and billing
              </p>

            </div>

          </div>

        </div>


        {/* -----------------------------------------------
            CREATE BUTTON
            Only Admin + Sales Executive
        ------------------------------------------------ */}

        {canCreateInvoice && (

          <button
            className="add-invoice-button"
            onClick={() =>
              setShowForm(!showForm)
            }
          >

            {showForm
              ? "✕ Close Form"
              : "+ Create Invoice"}

          </button>

        )}

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="invoice-summary-cards">


        {/* TOTAL */}

        <div className="invoice-summary-card">

          <div className="invoice-summary-icon total">
            🧾
          </div>


          <div className="invoice-summary-content">

            <span>
              Total Invoices
            </span>

            <strong>
              {totalInvoices}
            </strong>

          </div>

        </div>


        {/* PAID */}

        <div className="invoice-summary-card">

          <div className="invoice-summary-icon paid">
            ✓
          </div>


          <div className="invoice-summary-content">

            <span>
              Paid
            </span>

            <strong>
              {paidInvoices}
            </strong>

          </div>

        </div>


        {/* UNPAID */}

        <div className="invoice-summary-card">

          <div className="invoice-summary-icon unpaid">
            ⏳
          </div>


          <div className="invoice-summary-content">

            <span>
              Unpaid
            </span>

            <strong>
              {unpaidInvoices}
            </strong>

          </div>

        </div>


        {/* TOTAL PAYABLE */}

        <div className="invoice-summary-card invoice-value-card">

          <div className="invoice-summary-icon value">
            ₹
          </div>


          <div className="invoice-summary-content">

            <span>
              Total Payable
            </span>

            <strong>

              ₹
              {totalPayable.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}

            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          CREATE INVOICE FORM
      ================================================= */}

      {showForm && canCreateInvoice && (

        <div className="invoice-form">


          <div className="invoice-form-header">

            <div>

              <h2>
                Create New Invoice
              </h2>

              <p>
                Generate an invoice from an approved sales order
              </p>

            </div>


            <button
              className="close-form-button"
              onClick={() =>
                setShowForm(false)
              }
            >
              ✕
            </button>

          </div>


          {availableSalesOrders.length === 0 ? (

            <div className="no-orders-message">

              <div className="no-orders-icon">
                ✓
              </div>


              <div>

                <h3>
                  No Sales Orders Available
                </h3>

                <p>
                  There are currently no approved sales
                  orders available for invoicing.
                </p>

              </div>

            </div>

          ) : (

            <div className="invoice-form-body">


              <div className="invoice-form-grid">


                {/* SALES ORDER */}

                <div className="invoice-form-field">

                  <label>
                    Sales Order
                  </label>


                  <select
                    value={selectedSalesOrder}
                    onChange={(e) =>
                      setSelectedSalesOrder(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Sales Order
                    </option>


                    {availableSalesOrders.map(
                      (order) => (

                        <option
                          key={order.id}
                          value={order.id}
                        >

                          Order #{order.id} —{" "}

                          {order.customer?.name ||
                            "Customer"}

                          {" "}— ₹

                          {Number(
                            order.totalAmount || 0
                          ).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}

                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* TAX */}

                <div className="invoice-form-field">

                  <label>
                    Tax Percentage
                  </label>


                  <div className="tax-input-wrapper">

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={tax}
                      onChange={(e) =>
                        setTax(
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />

                    <span>
                      %
                    </span>

                  </div>

                </div>

              </div>


              {/* SELECTED ORDER PREVIEW */}

              {selectedSalesOrder && (

                <div className="selected-order-preview">

                  <div className="preview-icon">
                    🛒
                  </div>


                  <div className="preview-content">

                    <span>
                      Selected Sales Order
                    </span>


                    <strong>
                      Order #
                      {selectedSalesOrder}
                    </strong>

                  </div>


                  <div className="preview-status">
                    APPROVED
                  </div>

                </div>

              )}


              {/* FORM BUTTONS */}

              <div className="invoice-form-buttons">


                <button
                  className="cancel-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>


                <button
                  className="create-button"
                  onClick={createInvoice}
                >
                  🧾 Generate Invoice
                </button>


              </div>

            </div>

          )}

        </div>

      )}


      {/* =================================================
          INVOICE DIRECTORY
      ================================================= */}

      <div className="invoice-directory">


        <div className="directory-header">


          <div className="directory-title">

            <div className="directory-icon">
              📋
            </div>


            <div>

              <h2>
                Invoice Directory
              </h2>

              <p>
                View and manage all generated invoices
              </p>

            </div>

          </div>


          <div className="invoice-count">

            {totalInvoices}{" "}

            {totalInvoices === 1
              ? "Invoice"
              : "Invoices"}

          </div>

        </div>


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {invoices.length === 0 ? (

          <div className="empty-invoices">


            <div className="empty-invoice-icon">
              🧾
            </div>


            <h2>
              No Invoices Found
            </h2>


            <p>

              {canCreateInvoice
                ? "Generate your first invoice from an approved sales order."
                : "There are currently no invoices available."}

            </p>


            {canCreateInvoice && (

              <button
                className="empty-create-button"
                onClick={() =>
                  setShowForm(true)
                }
              >
                + Create Invoice
              </button>

            )}

          </div>

        ) : (


          <div className="invoices-table-container">


            <table className="invoices-table">


              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Sales Order
                  </th>

                  <th>
                    Invoice Date
                  </th>

                  <th>
                    Subtotal
                  </th>

                  <th>
                    Tax
                  </th>

                  <th>
                    Total Payable
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Items
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>


                {invoices.map(
                  (invoice) => {

                    const subtotal =
                      invoice.items?.reduce(
                        (sum, item) =>
                          sum +
                          Number(
                            item.totalPrice || 0
                          ),
                        0
                      ) || 0;


                    return (

                      <tr
                        key={invoice.id}
                      >


                        {/* ID */}

                        <td>

                          <span className="invoice-id">

                            #{invoice.id}

                          </span>

                        </td>


                        {/* CUSTOMER */}

                        <td>

                          <div className="invoice-customer-cell">


                            <div className="customer-avatar">

                              {(
                                invoice.customer?.name ||
                                "C"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>


                            <div className="customer-info">

                              <strong>

                                {invoice.customer?.name ||
                                  "N/A"}

                              </strong>


                              <span>
                                Customer
                              </span>

                            </div>


                          </div>

                        </td>


                        {/* SALES ORDER */}

                        <td>

                          <span className="sales-order-badge">

                            #
                            {invoice.salesOrder?.id ||
                              "N/A"}

                          </span>

                        </td>


                        {/* DATE */}

                        <td>

                          <span className="invoice-date">

                            {invoice.invoiceDate ||
                              "N/A"}

                          </span>

                        </td>


                        {/* SUBTOTAL */}

                        <td>

                          <span className="invoice-amount">

                            ₹
                            {subtotal.toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}

                          </span>

                        </td>


                        {/* TAX */}

                        <td>

                          <span className="tax-badge">

                            {invoice.tax || 0}%

                          </span>

                        </td>


                        {/* TOTAL */}

                        <td>

                          <strong className="total-payable">

                            ₹
                            {Number(
                              invoice.totalPayable || 0
                            ).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}

                          </strong>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`invoice-status ${String(
                              invoice.status ||
                                "UNPAID"
                            ).toLowerCase()}`}
                          >

                            <span className="status-dot"></span>

                            {invoice.status ||
                              "UNPAID"}

                          </span>

                        </td>


                        {/* ITEMS */}

                        <td>

                          <div className="invoice-items-cell">

                            {invoice.items?.map(
                              (item) => (

                                <div
                                  key={item.id}
                                  className="invoice-item"
                                >

                                  <span>

                                    {item.product
                                      ?.productName ||
                                      "Product"}

                                  </span>


                                  <strong>

                                    ×{" "}
                                    {item.quantity}

                                  </strong>

                                </div>

                              )
                            )}

                          </div>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="invoice-actions">


                            {/* PDF */}

                            <button
                              className="pdf-button"
                              onClick={() =>
                                viewPdf(
                                  invoice.id
                                )
                              }
                            >
                              📄 PDF
                            </button>


                            {/* PAYMENT STATUS */}

                            {invoice.status ===
                            "PAID" ? (

                              <button
                                className="unpaid-button"
                                onClick={() =>
                                  updateStatus(
                                    invoice.id,
                                    "UNPAID"
                                  )
                                }
                              >
                                Mark Unpaid
                              </button>

                            ) : (

                              <button
                                className="paid-button"
                                onClick={() =>
                                  updateStatus(
                                    invoice.id,
                                    "PAID"
                                  )
                                }
                              >
                                ✓ Mark Paid
                              </button>

                            )}

                          </div>

                        </td>


                      </tr>

                    );

                  }
                )}

              </tbody>


            </table>

          </div>

        )}

      </div>


    </div>

  );

}

export default Invoices;

