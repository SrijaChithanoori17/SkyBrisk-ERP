
import { useEffect, useState } from "react";
import api from "./api";
import "./Reports.css";

function Reports({ onBack }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDefaultDates = () => {
    const today = new Date();

    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    return {
      from: formatDate(firstDay),
      to: formatDate(today),
    };
  };

  useEffect(() => {
    const dates = getDefaultDates();

    setFromDate(dates.from);
    setToDate(dates.to);

    loadReport(dates.from, dates.to);
  }, []);

  const loadReport = async (from = fromDate, to = toDate) => {
    if (!from || !to) {
      alert("Please select both dates.");
      return;
    }

    if (from > to) {
      alert("From date cannot be after To date.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/api/reports/summary?from=${from}&to=${to}`
      );

      setReport(response.data);
    } catch (error) {
      console.error("Failed to load report:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load report."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const handleApplyFilter = () => {
    loadReport(fromDate, toDate);
  };

  if (loading && !report) {
    return (
      <div className="reports-page">
        <div className="reports-loading-container">
          <div className="reports-loading-spinner"></div>

          <h2>Loading Reports...</h2>

          <p>
            Please wait while we prepare your report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">

      {/* Header */}
      <div className="reports-header">

        <div className="reports-title-section">

          <button
            className="reports-back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <div className="reports-title-row">

            <div className="reports-page-icon">
              📈
            </div>

            <div>
              <h1>Reports</h1>

              <p>
                Analyze sales, purchases, invoices and inventory
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* Date Filter */}
      <div className="reports-filter-card">

        <div className="reports-filter-heading">

          <div className="reports-filter-icon">
            📅
          </div>

          <div>
            <h2>Report Period</h2>

            <p>
              Select a date range to generate your report.
            </p>
          </div>

        </div>


        <div className="reports-filter-controls">

          <div className="reports-date-group">

            <label>From Date</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
            />

          </div>


          <div className="reports-date-group">

            <label>To Date</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
            />

          </div>


          <button
            className="generate-report-button"
            onClick={handleApplyFilter}
            disabled={loading}
          >
            {loading
              ? "Generating..."
              : "📊 Generate Report"}
          </button>

        </div>

      </div>


      {report && (
        <>

          {/* Report Period */}
          <div className="report-period-text">

            Showing report from{" "}
            <strong>{report.from}</strong>{" "}
            to{" "}
            <strong>{report.to}</strong>

          </div>


          {/* SALES */}
          <section className="report-section">

            <div className="report-section-heading">

              <div>
                <span className="report-eyebrow">
                  SALES PERFORMANCE
                </span>

                <h2>Sales Summary</h2>

                <p>
                  Overview of sales orders and revenue.
                </p>
              </div>

            </div>


            <div className="report-card-grid">

              <div className="report-stat-card">

                <div className="report-stat-icon blue">
                  💰
                </div>

                <div>
                  <span>Total Sales</span>

                  <h3>
                    {formatCurrency(report.totalSales)}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon purple">
                  🛒
                </div>

                <div>
                  <span>Sales Orders</span>

                  <h3>
                    {report.salesOrderCount}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon orange">
                  ⏳
                </div>

                <div>
                  <span>Pending Orders</span>

                  <h3>
                    {report.pendingOrders}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon green">
                  ✓
                </div>

                <div>
                  <span>Dispatched Orders</span>

                  <h3>
                    {report.dispatchedOrders}
                  </h3>
                </div>

              </div>

            </div>

          </section>


          {/* PURCHASES */}
          <section className="report-section">

            <div className="report-section-heading">

              <div>
                <span className="report-eyebrow">
                  PURCHASE MANAGEMENT
                </span>

                <h2>Purchase Summary</h2>

                <p>
                  Overview of purchase orders and procurement.
                </p>
              </div>

            </div>


            <div className="report-card-grid">

              <div className="report-stat-card">

                <div className="report-stat-icon blue">
                  💳
                </div>

                <div>
                  <span>Total Purchases</span>

                  <h3>
                    {formatCurrency(
                      report.totalPurchases
                    )}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon purple">
                  📋
                </div>

                <div>
                  <span>Purchase Orders</span>

                  <h3>
                    {report.purchaseOrderCount}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon orange">
                  📦
                </div>

                <div>
                  <span>Ordered</span>

                  <h3>
                    {report.orderedPurchases}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon green">
                  ✓
                </div>

                <div>
                  <span>Received</span>

                  <h3>
                    {report.receivedPurchases}
                  </h3>
                </div>

              </div>

            </div>

          </section>


          {/* INVOICES */}
          <section className="report-section">

            <div className="report-section-heading">

              <div>
                <span className="report-eyebrow">
                  FINANCIAL REPORT
                </span>

                <h2>Invoice & Financial Summary</h2>

                <p>
                  Track invoice values and payment status.
                </p>
              </div>

            </div>


            <div className="report-card-grid">

              <div className="report-stat-card">

                <div className="report-stat-icon blue">
                  🧾
                </div>

                <div>
                  <span>Total Invoice Amount</span>

                  <h3>
                    {formatCurrency(
                      report.totalInvoiceAmount
                    )}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon green">
                  💵
                </div>

                <div>
                  <span>Paid Amount</span>

                  <h3>
                    {formatCurrency(
                      report.paidAmount
                    )}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon orange">
                  ⏰
                </div>

                <div>
                  <span>Unpaid Amount</span>

                  <h3>
                    {formatCurrency(
                      report.unpaidAmount
                    )}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon purple">
                  🧾
                </div>

                <div>
                  <span>Paid / Unpaid Invoices</span>

                  <h3>
                    {report.paidInvoices} /{" "}
                    {report.unpaidInvoices}
                  </h3>
                </div>

              </div>

            </div>

          </section>


          {/* INVENTORY */}
          <section className="report-section">

            <div className="report-section-heading">

              <div>
                <span className="report-eyebrow">
                  INVENTORY STATUS
                </span>

                <h2>Inventory Summary</h2>

                <p>
                  Current inventory and stock availability.
                </p>
              </div>

            </div>


            <div className="report-card-grid">

              <div className="report-stat-card">

                <div className="report-stat-icon blue">
                  📦
                </div>

                <div>
                  <span>Total Products</span>

                  <h3>
                    {report.totalProducts}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon green">
                  📊
                </div>

                <div>
                  <span>Total Stock</span>

                  <h3>
                    {report.totalStock}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon orange">
                  ⚠️
                </div>

                <div>
                  <span>Low Stock Products</span>

                  <h3>
                    {report.lowStockProducts}
                  </h3>
                </div>

              </div>


              <div className="report-stat-card">

                <div className="report-stat-icon red">
                  🚫
                </div>

                <div>
                  <span>Out of Stock</span>

                  <h3>
                    {report.outOfStockProducts}
                  </h3>
                </div>

              </div>

            </div>

          </section>


          {/* REPORT INSIGHTS */}
          <section className="report-insights-section">

            <div className="report-insight-card">

              <div className="report-insight-icon">
                📊
              </div>

              <div>
                <h3>Sales vs Purchases</h3>

                <p>
                  Sales:{" "}
                  <strong>
                    {formatCurrency(report.totalSales)}
                  </strong>
                  {"  "} | {"  "}
                  Purchases:{" "}
                  <strong>
                    {formatCurrency(
                      report.totalPurchases
                    )}
                  </strong>
                </p>
              </div>

            </div>


            <div className="report-insight-card">

              <div className="report-insight-icon">
                💼
              </div>

              <div>
                <h3>Invoice Collection</h3>

                <p>
                  Paid:{" "}
                  <strong>
                    {formatCurrency(report.paidAmount)}
                  </strong>
                  {"  "} | {"  "}
                  Unpaid:{" "}
                  <strong>
                    {formatCurrency(
                      report.unpaidAmount
                    )}
                  </strong>
                </p>
              </div>

            </div>

          </section>

        </>
      )}

    </div>
  );
}

export default Reports;

