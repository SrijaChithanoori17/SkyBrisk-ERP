
import { useEffect, useState } from "react";
import api from "./api";

import Products from "./Products";
import Suppliers from "./Suppliers";
import PurchaseOrders from "./PurchaseOrders";
import GRNs from "./GRNs";
import Customers from "./Customers";
import SalesOrders from "./SalesOrders";
import Invoices from "./Invoices";
import Reports from "./Reports";



import "./Dashboard.css";

function Dashboard({ onLogout }) {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const [salesSummary, setSalesSummary] = useState(null);
  const [purchaseSummary, setPurchaseSummary] = useState(null);
  const [stockAlerts, setStockAlerts] = useState([]);

  const [recentSalesOrders, setRecentSalesOrders] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);

  const [currentPage, setCurrentPage] = useState("dashboard");

  /* =========================================
     ROLE PERMISSIONS
  ========================================= */

  const isAdmin = role === "ADMIN";
  const isSalesExecutive = role === "SALES_EXECUTIVE";
  const isPurchaseManager = role === "PURCHASE_MANAGER";
  const isInventoryManager = role === "INVENTORY_MANAGER";
  const isAccountant = role === "ACCOUNTANT";

  const canAccessProducts =
    isAdmin || isInventoryManager;

  const canAccessSuppliers =
    isAdmin || isPurchaseManager;

  const canAccessPurchaseOrders =
    isAdmin || isPurchaseManager;

  const canAccessGRNs =
    isAdmin ||
    isPurchaseManager ||
    isInventoryManager;

  const canAccessCustomers =
    isAdmin || isSalesExecutive;

  const canAccessSalesOrders =
    isAdmin || isSalesExecutive;

  const canAccessInvoices =
    isAdmin ||
    isSalesExecutive ||
    isAccountant;

  
  const canAccessReports =
  isAdmin || isAccountant;


  /* =========================================
     LOAD DASHBOARD DATA
  ========================================= */

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const requests = [];

      /* =====================================
         SALES SUMMARY
      ===================================== */

      if (
        isAdmin ||
        isSalesExecutive ||
        isAccountant
      ) {
        requests.push(
          api
            .get(
              `/api/dashboard/sales-summary?month=${currentMonth}&year=${currentYear}`
            )
            .then((response) =>
              setSalesSummary(response.data)
            )
            .catch((error) =>
              console.error(
                "Failed to load sales summary:",
                error
              )
            )
        );
      }


      /* =====================================
         PURCHASE SUMMARY
      ===================================== */

      if (
        isAdmin ||
        isPurchaseManager
      ) {
        requests.push(
          api
            .get(
              `/api/dashboard/purchase-summary?month=${currentMonth}&year=${currentYear}`
            )
            .then((response) =>
              setPurchaseSummary(response.data)
            )
            .catch((error) =>
              console.error(
                "Failed to load purchase summary:",
                error
              )
            )
        );
      }


      /* =====================================
         STOCK ALERTS
      ===================================== */

      if (
        isAdmin ||
        isInventoryManager
      ) {
        requests.push(
          api
            .get("/api/dashboard/stock-alerts")
            .then((response) =>
              setStockAlerts(response.data || [])
            )
            .catch((error) =>
              console.error(
                "Failed to load stock alerts:",
                error
              )
            )
        );
      }


      /* =====================================
         RECENT SALES ORDERS
      ===================================== */

      if (
        isAdmin ||
        isSalesExecutive
      ) {
        requests.push(
          api
            .get("/api/sales-orders")
            .then((response) => {
              const salesOrders =
                response.data || [];

              setRecentSalesOrders(
                [...salesOrders]
                  .sort(
                    (a, b) =>
                      Number(b.id) - Number(a.id)
                  )
                  .slice(0, 4)
              );
            })
            .catch((error) =>
              console.error(
                "Failed to load sales orders:",
                error
              )
            )
        );
      }


      /* =====================================
         RECENT + PENDING INVOICES
      ===================================== */

      if (
        isAdmin ||
        isSalesExecutive ||
        isAccountant
      ) {
        requests.push(
          api
            .get("/api/invoices")
            .then((response) => {
              const invoices =
                response.data || [];

              const sortedInvoices =
                [...invoices].sort(
                  (a, b) =>
                    Number(b.id) - Number(a.id)
                );

              /* Recent invoices */

              setRecentInvoices(
                sortedInvoices.slice(0, 4)
              );


              /* Pending / Unpaid invoices */

              setPendingInvoices(
                sortedInvoices.filter(
                  (invoice) =>
                    String(
                      invoice.status || "UNPAID"
                    ).toUpperCase() ===
                    "UNPAID"
                )
              );
            })
            .catch((error) =>
              console.error(
                "Failed to load invoices:",
                error
              )
            )
        );
      }


      /* =====================================
         TOP SELLING PRODUCTS
      ===================================== */

      if (
        isAdmin ||
        isSalesExecutive
      ) {
        requests.push(
          api
            .get("/api/sales-orders/top-selling")
            .then((response) => {
              setTopSellingProducts(
                response.data || []
              );
            })
            .catch((error) =>
              console.error(
                "Failed to load top-selling products:",
                error
              )
            )
        );
      }


      await Promise.all(requests);

    } catch (error) {
      console.error(
        "Failed to load dashboard data:",
        error
      );
    }
  };


  /* =========================================
     NAVIGATION
  ========================================= */

  if (currentPage === "products") {
    return (
      <Products
        onBack={() =>
          setCurrentPage("dashboard")
        }
      />
    );
  }

  if (currentPage === "suppliers") {
    return (
      <Suppliers
        onBack={() =>
          setCurrentPage("dashboard")
        }
      />
    );
  }

  if (currentPage === "purchase-orders") {
    return (
      <PurchaseOrders
        onBack={() =>
          setCurrentPage("dashboard")
        }
      />
    );
  }

  if (currentPage === "grns") {
    return (
      <GRNs
        onBack={() =>
          setCurrentPage("dashboard")
        }
      />
    );
  }

  if (currentPage === "customers") {
    return (
      <Customers
        onBack={() =>
          setCurrentPage("dashboard")
        }
      />
    );
  }

  if (currentPage === "sales-orders") {
    return (
      <SalesOrders
        onBack={() =>
          setCurrentPage("dashboard")
        }
      />
    );
  }

  if (currentPage === "invoices") {
    return (
      <Invoices
        onBack={() =>
          setCurrentPage("dashboard")
        }
      />
    );
  }

  
if (currentPage === "reports") {
  return (
    <Reports
      onBack={() =>
        setCurrentPage("dashboard")
      }
    />
  );
}


  /* =========================================
     DASHBOARD
  ========================================= */

  return (
    <div className="dashboard">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-icon-wrapper">
            <span className="brand-icon">
              ⚡
            </span>
          </div>

          <div className="brand-text">
            <h2>SkyBrisk</h2>
            <span>ERP Management</span>
          </div>

        </div>

        <div className="sidebar-label">
          MAIN MENU
        </div>

        <nav className="sidebar-menu">

          {/* Dashboard */}

          <button
            className={
              currentPage === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setCurrentPage("dashboard")
            }
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>


          {/* Products */}

          {canAccessProducts && (
            <button
              onClick={() =>
                setCurrentPage("products")
              }
            >
              <span>📦</span>
              <span>Products</span>
            </button>
          )}


          {/* Suppliers */}

          {canAccessSuppliers && (
            <button
              onClick={() =>
                setCurrentPage("suppliers")
              }
            >
              <span>🏭</span>
              <span>Suppliers</span>
            </button>
          )}


          {/* Purchase Orders */}

          {canAccessPurchaseOrders && (
            <button
              onClick={() =>
                setCurrentPage(
                  "purchase-orders"
                )
              }
            >
              <span>🛒</span>
              <span>Purchase Orders</span>
            </button>
          )}


          {/* GRNs */}

          {canAccessGRNs && (
            <button
              onClick={() =>
                setCurrentPage("grns")
              }
            >
              <span>📥</span>
              <span>GRNs</span>
            </button>
          )}


          {/* Customers */}

          {canAccessCustomers && (
            <button
              onClick={() =>
                setCurrentPage("customers")
              }
            >
              <span>👥</span>
              <span>Customers</span>
            </button>
          )}


          {/* Sales Orders */}

          {canAccessSalesOrders && (
            <button
              onClick={() =>
                setCurrentPage(
                  "sales-orders"
                )
              }
            >
              <span>💰</span>
              <span>Sales Orders</span>
            </button>
          )}


          {/* Invoices */}

          {canAccessInvoices && (
            <button
              onClick={() =>
                setCurrentPage("invoices")
              }
            >
              <span>🧾</span>
              <span>Invoices</span>
            </button>
          )}


          
{/* Reports */}

{canAccessReports && (
  <button
    onClick={() =>
      setCurrentPage("reports")
    }
  >
    <span>📈</span>
    <span>Reports</span>
  </button>
)}


        </nav>


        <div className="sidebar-footer">

          <div className="sidebar-footer-icon">
            ⚡
          </div>

          <div>
            <strong>SkyBrisk ERP</strong>

            <small>
              Business Management System
            </small>
          </div>

        </div>

      </aside>


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="main-content">

        {/* =====================================
            HEADER
        ===================================== */}

        <header className="dashboard-header">

          <div className="page-title">

            <div className="welcome-text">
              Welcome back 👋
            </div>

            <h1>
              Dashboard
            </h1>

            <p>
              Here's what's happening with your
              business today.
            </p>

          </div>


          {/* USER INFO + LOGOUT */}

          <div className="user-info">

            <div className="user-avatar">
              {name
                ? name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="user-details">

              <strong>
                {name || "User"}
              </strong>

              <p>
                {role || "USER"}
              </p>

            </div>

            <span className="user-online-dot"></span>

            <button
              className="logout-button"
              onClick={onLogout}
              title="Logout"
            >
              ↪
              <span>Logout</span>
            </button>

          </div>

        </header>


        {/* =====================================
            SUMMARY CARDS
        ===================================== */}

        <section className="summary-cards">

          {/* SALES SUMMARY */}

          {(isAdmin ||
            isSalesExecutive ||
            isAccountant) && (
            <>

              <div className="summary-card">

                <div className="summary-icon sales-icon">
                  💰
                </div>

                <div className="summary-content">

                  <span>
                    Total Sales
                  </span>

                  <h2>
                    ₹
                    {Number(
                      salesSummary?.totalSales || 0
                    ).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </h2>

                  <small>
                    This month
                  </small>

                </div>

              </div>


              <div className="summary-card">

                <div className="summary-icon orders-icon">
                  🛒
                </div>

                <div className="summary-content">

                  <span>
                    Total Orders
                  </span>

                  <h2>
                    {salesSummary?.totalOrders ?? 0}
                  </h2>

                  <small>
                    Sales orders
                  </small>

                </div>

              </div>


              <div className="summary-card">

                <div className="summary-icon pending-icon">
                  ⏳
                </div>

                <div className="summary-content">

                  <span>
                    Pending Orders
                  </span>

                  <h2>
                    {salesSummary?.pendingOrders ?? 0}
                  </h2>

                  <small>
                    Need attention
                  </small>

                </div>

              </div>

            </>
          )}


          {/* PURCHASE SUMMARY */}

          {(isAdmin ||
            isPurchaseManager) && (
            <>

              <div className="summary-card">

                <div className="summary-icon purchase-icon">
                  📋
                </div>

                <div className="summary-content">

                  <span>
                    Purchase Orders
                  </span>

                  <h2>
                    {purchaseSummary?.totalOrders ?? 0}
                  </h2>

                  <small>
                    Supplier orders
                  </small>

                </div>

              </div>


              <div className="summary-card">

                <div className="summary-icon received-icon">
                  📥
                </div>

                <div className="summary-content">

                  <span>
                    Received Orders
                  </span>

                  <h2>
                    {purchaseSummary?.receivedOrders ?? 0}
                  </h2>

                  <small>
                    Goods received
                  </small>

                </div>

              </div>


              <div className="summary-card">

                <div className="summary-icon money-icon">
                  💵
                </div>

                <div className="summary-content">

                  <span>
                    Total Purchases
                  </span>

                  <h2>
                    ₹
                    {Number(
                      purchaseSummary?.totalPurchases || 0
                    ).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </h2>

                  <small>
                    This month
                  </small>

                </div>

              </div>

            </>
          )}


          {/* STOCK SUMMARY */}

          {(isAdmin ||
            isInventoryManager) && (
            <div
              className={`summary-card stock-summary ${
                stockAlerts.length > 0
                  ? "warning"
                  : "success"
              }`}
            >

              <div className="summary-icon alert-icon">
                ⚠️
              </div>

              <div className="summary-content">

                <span>
                  Stock Alerts
                </span>

                <h2>
                  {stockAlerts.length}
                </h2>

                <small>
                  {stockAlerts.length === 0
                    ? "Inventory looks good"
                    : "Products need attention"}
                </small>

              </div>

            </div>
          )}

        </section>


        {/* =====================================
            MANAGEMENT MODULES
        ===================================== */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <div className="section-eyebrow">
                ERP MODULES
              </div>

              <h2>
                Management Modules
              </h2>

              <p>
                Quickly access your ERP modules
              </p>

            </div>

          </div>


          <div className="dashboard-cards">

            {/* PRODUCTS */}

            {canAccessProducts && (
              <div className="dashboard-card">

                <div className="card-top">

                  <div className="card-icon">
                    📦
                  </div>

                  <span className="card-number">
                    01
                  </span>

                </div>

                <h3>
                  Products
                </h3>

                <p>
                  Manage products, pricing,
                  categories and inventory stock.
                </p>

                <button
                  onClick={() =>
                    setCurrentPage("products")
                  }
                >
                  Open Products
                  <span>→</span>
                </button>

              </div>
            )}


            {/* SUPPLIERS */}

            {canAccessSuppliers && (
              <div className="dashboard-card">

                <div className="card-top">

                  <div className="card-icon">
                    🏭
                  </div>

                  <span className="card-number">
                    02
                  </span>

                </div>

                <h3>
                  Suppliers
                </h3>

                <p>
                  Manage supplier details and
                  supplier relationships.
                </p>

                <button
                  onClick={() =>
                    setCurrentPage("suppliers")
                  }
                >
                  Open Suppliers
                  <span>→</span>
                </button>

              </div>
            )}


            {/* PURCHASE ORDERS */}

            {canAccessPurchaseOrders && (
              <div className="dashboard-card">

                <div className="card-top">

                  <div className="card-icon">
                    🛒
                  </div>

                  <span className="card-number">
                    03
                  </span>

                </div>

                <h3>
                  Purchase Orders
                </h3>

                <p>
                  Create and manage purchase
                  orders from suppliers.
                </p>

                <button
                  onClick={() =>
                    setCurrentPage(
                      "purchase-orders"
                    )
                  }
                >
                  Open Purchases
                  <span>→</span>
                </button>

              </div>
            )}


            {/* GRNs */}

            {canAccessGRNs && (
              <div className="dashboard-card">

                <div className="card-top">

                  <div className="card-icon">
                    📥
                  </div>

                  <span className="card-number">
                    04
                  </span>

                </div>

                <h3>
                  GRNs
                </h3>

                <p>
                  Record received goods and
                  update inventory stock.
                </p>

                <button
                  onClick={() =>
                    setCurrentPage("grns")
                  }
                >
                  Open GRNs
                  <span>→</span>
                </button>

              </div>
            )}


            {/* CUSTOMERS */}

            {canAccessCustomers && (
              <div className="dashboard-card">

                <div className="card-top">

                  <div className="card-icon">
                    👥
                  </div>

                  <span className="card-number">
                    05
                  </span>

                </div>

                <h3>
                  Customers
                </h3>

                <p>
                  Manage customer information,
                  contacts and GST details.
                </p>

                <button
                  onClick={() =>
                    setCurrentPage("customers")
                  }
                >
                  Open Customers
                  <span>→</span>
                </button>

              </div>
            )}


            {/* SALES ORDERS */}

            {canAccessSalesOrders && (
              <div className="dashboard-card">

                <div className="card-top">

                  <div className="card-icon">
                    💰
                  </div>

                  <span className="card-number">
                    06
                  </span>

                </div>

                <h3>
                  Sales Orders
                </h3>

                <p>
                  Manage customer orders and
                  sales processing workflow.
                </p>

                <button
                  onClick={() =>
                    setCurrentPage(
                      "sales-orders"
                    )
                  }
                >
                  Open Sales
                  <span>→</span>
                </button>

              </div>
            )}


            {/* INVOICES */}

            {canAccessInvoices && (
              <div className="dashboard-card">

                <div className="card-top">

                  <div className="card-icon">
                    🧾
                  </div>

                  <span className="card-number">
                    07
                  </span>

                </div>

                <h3>
                  Invoices
                </h3>

                <p>
                  Generate invoices, manage
                  payments and download PDFs.
                </p>

                <button
                  onClick={() =>
                    setCurrentPage("invoices")
                  }
                >
                  Open Invoices
                  <span>→</span>
                </button>

              </div>
            )}

          </div>

        </section>


        {/* =====================================
            QUICK ACTIONS
        ===================================== */}

        <section className="quick-actions-section">

          <div className="section-heading">

            <div>

              <div className="section-eyebrow">
                SHORTCUTS
              </div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Common tasks at your fingertips
              </p>

            </div>

          </div>


          <div className="quick-actions">

            {/* ADD PRODUCT */}

            {canAccessProducts && (
              <button
                onClick={() =>
                  setCurrentPage("products")
                }
              >
                <span>➕</span>

                <div>

                  <strong>
                    Add Product
                  </strong>

                  <small>
                    Create inventory item
                  </small>

                </div>

                <b>→</b>

              </button>
            )}


            {/* NEW PURCHASE */}

            {canAccessPurchaseOrders && (
              <button
                onClick={() =>
                  setCurrentPage(
                    "purchase-orders"
                  )
                }
              >
                <span>🛒</span>

                <div>

                  <strong>
                    New Purchase
                  </strong>

                  <small>
                    Create purchase order
                  </small>

                </div>

                <b>→</b>

              </button>
            )}


            {/* NEW SALE */}

            {canAccessSalesOrders && (
              <button
                onClick={() =>
                  setCurrentPage(
                    "sales-orders"
                  )
                }
              >
                <span>💰</span>

                <div>

                  <strong>
                    New Sale
                  </strong>

                  <small>
                    Create sales order
                  </small>

                </div>

                <b>→</b>

              </button>
            )}


            {/* ADD CUSTOMER */}

            {canAccessCustomers && (
              <button
                onClick={() =>
                  setCurrentPage(
                    "customers"
                  )
                }
              >
                <span>👤</span>

                <div>

                  <strong>
                    Add Customer
                  </strong>

                  <small>
                    Create customer
                  </small>

                </div>

                <b>→</b>

              </button>
            )}

          </div>

        </section>


        {/* =====================================
            RECENT ACTIVITY
        ===================================== */}

        <section className="activity-grid">

          {/* RECENT SALES */}

          {(isAdmin ||
            isSalesExecutive) && (
            <div className="activity-card">

              <div className="activity-header">

                <div>

                  <div className="activity-eyebrow">
                    SALES
                  </div>

                  <h2>
                    Recent Sales Orders
                  </h2>

                  <p>
                    Latest customer orders
                  </p>

                </div>

                <button
                  onClick={() =>
                    setCurrentPage(
                      "sales-orders"
                    )
                  }
                >
                  View All →
                </button>

              </div>


              {recentSalesOrders.length === 0 ? (

                <div className="empty-activity">

                  <span>
                    💰
                  </span>

                  <p>
                    No sales orders available.
                  </p>

                </div>

              ) : (

                <div className="activity-list">

                  {recentSalesOrders.map(
                    (order) => (

                      <div
                        className="activity-item"
                        key={order.id}
                      >

                        <div className="activity-icon">
                          💰
                        </div>

                        <div className="activity-info">

                          <strong>
                            Order #{order.id}
                          </strong>

                          <span>
                            {order.customer?.name ||
                              "Unknown Customer"}
                          </span>

                        </div>

                        <div className="activity-value">

                          <strong>
                            ₹
                            {Number(
                              order.totalAmount || 0
                            ).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          </strong>

                          <span
                            className={`mini-status ${
                              String(
                                order.status ||
                                  "PENDING"
                              ).toLowerCase()
                            }`}
                          >
                            {order.status ||
                              "PENDING"}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>
          )}


          {/* RECENT INVOICES */}

          {(isAdmin ||
            isSalesExecutive ||
            isAccountant) && (
            <div className="activity-card">

              <div className="activity-header">

                <div>

                  <div className="activity-eyebrow">
                    BILLING
                  </div>

                  <h2>
                    Recent Invoices
                  </h2>

                  <p>
                    Latest generated invoices
                  </p>

                </div>

                <button
                  onClick={() =>
                    setCurrentPage("invoices")
                  }
                >
                  View All →
                </button>

              </div>


              {recentInvoices.length === 0 ? (

                <div className="empty-activity">

                  <span>
                    🧾
                  </span>

                  <p>
                    No invoices available.
                  </p>

                </div>

              ) : (

                <div className="activity-list">

                  {recentInvoices.map(
                    (invoice) => (

                      <div
                        className="activity-item"
                        key={invoice.id}
                      >

                        <div className="activity-icon invoice-activity">
                          🧾
                        </div>

                        <div className="activity-info">

                          <strong>
                            Invoice #{invoice.id}
                          </strong>

                          <span>
                            {invoice.customer?.name ||
                              "Unknown Customer"}
                          </span>

                        </div>

                        <div className="activity-value">

                          <strong>
                            ₹
                            {Number(
                              invoice.totalPayable ||
                                0
                            ).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          </strong>

                          <span
                            className={`mini-status ${
                              String(
                                invoice.status ||
                                  "UNPAID"
                              ).toLowerCase()
                            }`}
                          >
                            {invoice.status ||
                              "UNPAID"}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>
          )}

        </section>


        {/* =====================================
            TOP SELLING PRODUCTS
        ===================================== */}

        {(isAdmin ||
          isSalesExecutive) && (
          <section className="top-selling-section">

            <div className="activity-card top-selling-panel">

              <div className="activity-header">

                <div>

                  <div className="activity-eyebrow">
                    SALES ANALYTICS
                  </div>

                  <h2>
                    🏆 Top-Selling Products
                  </h2>

                  <p>
                    Products with the highest
                    quantities sold
                  </p>

                </div>

                <button
                  onClick={() =>
                    setCurrentPage("sales-orders")
                  }
                >
                  View Sales →
                </button>

              </div>


              {topSellingProducts.length === 0 ? (

                <div className="empty-activity">

                  <span>
                    📊
                  </span>

                  <p>
                    No sales data available yet.
                  </p>

                </div>

              ) : (

                <div className="top-selling-list">

                  {topSellingProducts
                    .slice(0, 5)
                    .map((item, index) => {

                      const productName =
                        item[1] || "Product";

                      const quantitySold =
                        Number(item[2] || 0);

                      return (
                        <div
                          className="top-selling-item"
                          key={item[0] || index}
                        >

                          <div className="top-selling-rank">
                            {index + 1}
                          </div>

                          <div className="top-selling-icon">
                            📦
                          </div>

                          <div className="top-selling-info">

                            <strong>
                              {productName}
                            </strong>

                            <span>
                              Total quantity sold
                            </span>

                          </div>

                          <div className="top-selling-quantity">

                            <strong>
                              {quantitySold}
                            </strong>

                            <span>
                              units
                            </span>

                          </div>

                        </div>
                      );
                    })}

                </div>

              )}

            </div>

          </section>
        )}


        {/* =====================================
            PENDING / UNPAID INVOICES
        ===================================== */}

        {(isAdmin ||
          isSalesExecutive ||
          isAccountant) && (
          <section className="pending-invoices-section">

            <div className="activity-card pending-invoices-panel">

              <div className="activity-header">

                <div>

                  <div className="activity-eyebrow">
                    BILLING
                  </div>

                  <h2>
                    💰 Pending Invoices
                  </h2>

                  <p>
                    Invoices that are waiting for payment
                  </p>

                </div>

                <button
                  onClick={() =>
                    setCurrentPage("invoices")
                  }
                >
                  Manage Invoices →
                </button>

              </div>


              {pendingInvoices.length === 0 ? (

                <div className="stock-clear">

                  <div className="stock-clear-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      All invoices are paid
                    </strong>

                    <p>
                      There are no unpaid invoices currently.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="pending-invoice-list">

                  {pendingInvoices
                    .slice(0, 5)
                    .map((invoice) => (

                      <div
                        className="pending-invoice-item"
                        key={invoice.id}
                      >

                        <div className="pending-invoice-icon">
                          🧾
                        </div>

                        <div className="pending-invoice-info">

                          <strong>
                            Invoice #{invoice.id}
                          </strong>

                          <span>
                            {invoice.customer?.name ||
                              "Unknown Customer"}
                          </span>

                        </div>

                        <div className="pending-invoice-value">

                          <strong>
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

                          <span className="pending-invoice-badge">
                            UNPAID
                          </span>

                        </div>

                      </div>

                    ))}

                </div>

              )}

            </div>

          </section>
        )}


        {/* =====================================
            INVENTORY ALERTS
        ===================================== */}

        {(isAdmin ||
          isInventoryManager) && (
          <section className="stock-alert-section">

            <div className="activity-card stock-alert-panel">

              <div className="activity-header">

                <div>

                  <div className="activity-eyebrow">
                    INVENTORY
                  </div>

                  <h2>
                    ⚠️ Inventory Alerts
                  </h2>

                  <p>
                    Products that may need restocking
                  </p>

                </div>

                <button
                  onClick={() =>
                    setCurrentPage("products")
                  }
                >
                  Manage Products →
                </button>

              </div>


              {stockAlerts.length === 0 ? (

                <div className="stock-clear">

                  <div className="stock-clear-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Inventory looks healthy
                    </strong>

                    <p>
                      All products are currently
                      above their reorder levels.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="stock-alert-list">

                  {stockAlerts.map(
                    (product, index) => (

                      <div
                        className="stock-alert-item"
                        key={
                          product.id || index
                        }
                      >

                        <div className="stock-product-icon">
                          📦
                        </div>

                        <div className="stock-product-info">

                          <strong>
                            {product.productName ||
                              product.name ||
                              "Product"}
                          </strong>

                          <span>
                            Current Stock:{" "}
                            {product.currentStock ??
                              product.stock ??
                              0}
                          </span>

                        </div>

                        <span className="low-stock-badge">
                          LOW STOCK
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default Dashboard;

