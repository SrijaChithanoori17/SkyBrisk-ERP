# SkyBrisk ERP – Testing Report

## 1. Project Information

**Project:** ERP System for Inventory and Sales Management
**Technology:** Java Spring Boot, React.js, MySQL
**Authentication:** JWT
**API Documentation:** Swagger
**API Testing:** Postman
**Database:** MySQL

---

## 2. Testing Scope

The following areas were tested:

* User registration and login
* JWT authentication
* Role-based access control
* Product management
* Customer management
* Supplier management
* Purchase order management
* Goods Received Note (GRN)
* Inventory stock updates
* Sales order management
* Invoice generation
* Invoice PDF generation
* Dashboard data
* Top-selling products
* Pending/unpaid invoices
* Reports
* Swagger API documentation
* Postman API testing
* Logout functionality

---

## 3. Authentication Testing

| Test Case                      | Expected Result                        | Actual Result                    | Status |
| ------------------------------ | -------------------------------------- | -------------------------------- | ------ |
| Register new user              | User should be registered successfully | User registered successfully     | PASS   |
| Login with valid credentials   | JWT token should be generated          | JWT token generated successfully | PASS   |
| Login with invalid credentials | Login should be rejected               | Invalid login rejected           | PASS   |
| Access protected API with JWT  | API should allow authorized request    | Request successful               | PASS   |
| Logout                         | Token/session data should be cleared   | Logout completed successfully    | PASS   |

---

## 4. Role-Based Access Control Testing

The following roles were tested:

* ADMIN
* SALES_EXECUTIVE
* PURCHASE_MANAGER
* INVENTORY_MANAGER
* ACCOUNTANT

| Test Case                  | Expected Result                                      | Actual Result              | Status |
| -------------------------- | ---------------------------------------------------- | -------------------------- | ------ |
| Admin access               | Admin can access all authorized modules              | Verified                   | PASS   |
| Sales Executive access     | Customer, Sales Order and Invoice modules accessible | Verified                   | PASS   |
| Purchase Manager access    | Supplier, Purchase Order and GRN modules accessible  | Verified                   | PASS   |
| Inventory Manager access   | Product and GRN/stock modules accessible             | Verified                   | PASS   |
| Accountant access          | Invoice and Reports modules accessible               | Verified                   | PASS   |
| Unauthorized module access | Access should be restricted                          | Role restrictions verified | PASS   |

---

## 5. Product Testing

| Test Case      | Expected Result                                    | Actual Result                   | Status |
| -------------- | -------------------------------------------------- | ------------------------------- | ------ |
| Create product | Product should be added                            | Product added successfully      | PASS   |
| View products  | Products should be displayed                       | Products displayed successfully | PASS   |
| Update product | Product details should update                      | Update successful               | PASS   |
| Delete product | Product should be removed                          | Delete successful               | PASS   |
| Stock status   | Stock status should reflect quantity/reorder level | Verified                        | PASS   |

---

## 6. Purchase and Inventory Testing

### Purchase Order

| Test Case             | Expected Result                    | Actual Result | Status |
| --------------------- | ---------------------------------- | ------------- | ------ |
| Create purchase order | Purchase order should be created   | Successful    | PASS   |
| Update purchase order | Order details/status should update | Successful    | PASS   |
| Purchase order status | Status should change correctly     | Verified      | PASS   |

### GRN

| Test Case               | Expected Result                     | Actual Result                | Status |
| ----------------------- | ----------------------------------- | ---------------------------- | ------ |
| Create GRN              | GRN should be created               | Successful                   | PASS   |
| Receive purchased stock | Product stock should increase       | Stock increased successfully | PASS   |
| GRN status              | Received status should be reflected | Verified                     | PASS   |

---

## 7. Sales Order Testing

| Test Case             | Expected Result                          | Actual Result                | Status |
| --------------------- | ---------------------------------------- | ---------------------------- | ------ |
| Create sales order    | Sales order should be created            | Successful                   | PASS   |
| Calculate order total | Total should be calculated automatically | Verified                     | PASS   |
| Deduct stock          | Product stock should decrease            | Stock decreased successfully | PASS   |
| Update order status   | Status should update                     | Verified                     | PASS   |
| View sales orders     | Orders should be displayed               | Successful                   | PASS   |

---

## 8. Invoice Testing

| Test Case               | Expected Result                             | Actual Result              | Status |
| ----------------------- | ------------------------------------------- | -------------------------- | ------ |
| Generate invoice        | Invoice should be created from sales order  | Successful                 | PASS   |
| Calculate invoice total | Tax and payable amount should be calculated | Verified                   | PASS   |
| Invoice status          | Paid/Unpaid status should be displayed      | Verified                   | PASS   |
| Generate PDF            | Invoice PDF should be generated             | PDF generated successfully | PASS   |

---

## 9. Dashboard Testing

The dashboard was tested for:

* Sales summary
* Purchase summary
* Stock alerts
* Recent sales orders
* Recent invoices
* Top-selling products
* Pending/unpaid invoices
* Role-based module visibility

**Result:** Dashboard data and role-based visibility were verified successfully.

**Status: PASS**

---

## 10. Reports Testing

The Reports module was tested using date-range filtering.

The following information was verified:

* Total sales
* Sales order count
* Approved/dispatched orders
* Total purchases
* Purchase order count
* Received/ordered purchases
* Invoice amount
* Paid/unpaid invoices
* Inventory count
* Total stock
* Low-stock products
* Out-of-stock products

**Result:** Reports API and frontend report page were verified successfully.

**Status: PASS**

---

## 11. Swagger API Testing

Swagger API documentation was tested.

Verified:

* API endpoints are listed
* Request parameters are displayed
* Request/response formats are available
* JWT authorization works
* Protected endpoints can be tested with an authorized token

**Status: PASS**

---

## 12. Postman API Testing

Postman was used to test the backend REST APIs.

Tested areas include:

* Authentication
* Products
* Customers
* Suppliers
* Purchase Orders
* GRNs
* Sales Orders
* Invoices
* Reports
* Dashboard APIs

**Status: PASS**

---

## 13. End-to-End Workflow Testing

The complete business workflow was tested:

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
Stock Decreased
   ↓
Invoice
   ↓
Invoice PDF
```

**Result:** The complete core workflow was successfully tested.

**Status: PASS**

---

## 14. Final Testing Summary

| Module              | Result |
| ------------------- | ------ |
| Authentication      | PASS   |
| JWT Security        | PASS   |
| Role-Based Access   | PASS   |
| Products            | PASS   |
| Customers           | PASS   |
| Suppliers           | PASS   |
| Purchase Orders     | PASS   |
| GRN                 | PASS   |
| Inventory Updates   | PASS   |
| Sales Orders        | PASS   |
| Invoices            | PASS   |
| Invoice PDF         | PASS   |
| Dashboard           | PASS   |
| Reports             | PASS   |
| Swagger             | PASS   |
| Postman             | PASS   |
| Logout              | PASS   |
| End-to-End Workflow | PASS   |

---

## 15. Testing Conclusion

The core ERP functionality was manually tested through the React frontend, Postman, Swagger, and role-based user flows.

The main business workflow covering purchasing, inventory, sales, invoicing, and reporting was successfully verified.

The application was also tested with different user roles to verify JWT authentication and role-based access restrictions.
