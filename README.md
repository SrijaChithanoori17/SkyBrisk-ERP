# SkyBrisk ERP – Inventory & Sales Management System

A full-stack **ERP System for Inventory and Sales Management** developed using **Java Spring Boot and React**.

The system helps manage products, customers, suppliers, sales orders, purchase orders, goods received notes (GRN), invoices, inventory, reports, and role-based access.

---

## 🚀 Tech Stack

### Backend

* Java 17
* Spring Boot
* Spring Data JPA / Hibernate
* Spring Security
* JWT Authentication
* MySQL
* REST APIs
* Swagger / OpenAPI
* Maven

### Frontend

* React
* JavaScript
* Axios
* React Router
* HTML5
* CSS3

### Tools

* IntelliJ IDEA
* Visual Studio Code
* MySQL
* Postman
* Git / GitHub
* Swagger UI

---

## 🔐 Authentication & Role-Based Access

The application uses **JWT-based authentication** and role-based authorization.

### Roles

| Role              | Access                            |
| ----------------- | --------------------------------- |
| ADMIN             | Full system access                |
| SALES_EXECUTIVE   | Customers, Sales Orders, Invoices |
| PURCHASE_MANAGER  | Suppliers, Purchase Orders, GRN   |
| INVENTORY_MANAGER | Products, Stock, GRN              |
| ACCOUNTANT        | Invoices and Reports              |

Users receive a JWT token after successful login. The token is automatically attached to protected API requests.

---

## 📦 Main Modules

### 1. Products

* Add products
* View products
* Update products
* Delete products
* Track current stock
* Configure reorder levels
* Identify low-stock and out-of-stock products

### 2. Customers

* Add customers
* View customers
* Update customer information
* Delete customers

### 3. Suppliers

* Add suppliers
* View suppliers
* Update supplier information
* Delete suppliers

### 4. Sales Orders

* Create sales orders
* View sales orders
* Update order status
* Track ordered products and quantities
* Automatically calculate order totals
* Deduct stock when an order is created

### 5. Purchase Orders

* Create purchase orders
* View purchase orders
* Update purchase order status
* Track suppliers and expected delivery dates

### 6. Goods Received Notes (GRN)

* Create GRNs
* Record received products
* Update inventory automatically when goods are received

### 7. Invoices

* Generate invoices from sales orders
* View invoice details
* Track paid/unpaid status
* Calculate tax and total payable amount
* Generate invoice PDFs

### 8. Dashboard

The dashboard provides real-time business information including:

* Total sales
* Total purchases
* Sales orders
* Purchase orders
* Stock information
* Low-stock alerts
* Recent sales orders
* Recent invoices
* Top-selling products
* Pending/unpaid invoices

### 9. Reports

The reports module provides date-based business summaries including:

* Total sales
* Total purchases
* Sales order count
* Purchase order count
* Paid invoices
* Unpaid invoices
* Paid and unpaid amounts
* Total products
* Total stock
* Low-stock products
* Out-of-stock products

---

## 🔄 Main Business Workflow

```text
Product
   ↓
Supplier
   ↓
Purchase Order
   ↓
GRN
   ↓
Stock Increased
   ↓
Customer
   ↓
Sales Order
   ↓
Stock Deducted
   ↓
Invoice
   ↓
Invoice PDF
```

---

## 🗄️ Database

The application uses **MySQL**.

Database name:

```text
erp_management
```

Main tables:

```text
customers
grn_items
grns
invoice_items
invoices
products
purchase_order_items
purchase_orders
sales_order_items
sales_orders
suppliers
users
```

The database schema is included in:

```text
database/erp_management_schema.sql
```

---

## 🌐 API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Products

```text
GET    /api/products
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Customers

```text
GET  /api/customers
POST /api/customers
```

### Suppliers

```text
GET  /api/suppliers
POST /api/suppliers
```

### Sales Orders

```text
GET  /api/sales-orders
POST /api/sales-orders
PUT  /api/sales-orders/{id}/status
GET  /api/sales-orders/top-selling
```

### Purchase Orders

```text
GET  /api/purchase-orders
POST /api/purchase-orders
PUT  /api/purchase-orders/{id}/status
```

### GRN

```text
GET  /api/grns
POST /api/grns
```

### Invoices

```text
GET  /api/invoices
POST /api/invoices
GET  /api/invoices/{id}/pdf
```

### Dashboard

```text
GET /api/dashboard/sales-summary
GET /api/dashboard/purchase-summary
GET /api/dashboard/stock-alerts
```

### Reports

```text
GET /api/reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
```

---

## 📖 Swagger API Documentation

Swagger UI is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

Swagger provides interactive documentation for the backend REST APIs.

---

## 🧪 Testing

The application was tested using:

* Postman API testing
* Swagger API testing
* Manual frontend testing
* JWT authentication testing
* Role-based access testing
* CRUD operation testing
* Inventory stock update testing
* Sales order stock deduction testing
* Invoice generation testing
* Invoice PDF generation testing
* Reports testing
* End-to-end business workflow testing

### End-to-End Workflow Tested

```text
Product
→ Supplier
→ Purchase Order
→ GRN
→ Stock Increase
→ Customer
→ Sales Order
→ Stock Decrease
→ Invoice
→ PDF Invoice
```

Different user roles were also tested to verify access restrictions.

---

## 📁 Project Structure

```text
SkyBrisk-ERP/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   └── erp_management_schema.sql
│
├── postman/
│   └── SkyBrisk-ERP-API.postman_collection.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Running the Backend

Navigate to the backend:

```bash
cd backend
```

Run using Maven Wrapper:

### Windows

```bash
mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

Before running, configure the MySQL database connection in:

```text
backend/src/main/resources/application.properties
```

---

## ⚙️ Running the Frontend

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

The frontend runs using the Vite development server.

---

## 📮 Postman Collection

The Postman collection used for API testing is included in:

```text
postman/SkyBrisk-ERP-API.postman_collection.json
```

It contains authentication and API requests used for testing the ERP system and its role-based access.

**Note:** Passwords and authentication tokens are sanitized before sharing the collection.

---

## 🔒 Security

The project uses:

* JWT authentication
* BCrypt password encryption
* Spring Security
* Role-based authorization
* CORS configuration
* Protected REST APIs

Sensitive credentials are not included in the repository.

---

## 👩‍💻 Project

**SkyBrisk ERP – Inventory & Sales Management System**

Full-stack application developed using:

```text
Java + Spring Boot + MySQL + React
```

Repository:

```text
https://github.com/SrijaChithanoori17/SkyBrisk-ERP
```
