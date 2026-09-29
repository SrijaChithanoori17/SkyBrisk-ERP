
import { useEffect, useState } from "react";
import api from "./api";
import "./Products.css";

function Products({ onBack }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [product, setProduct] = useState({
    productName: "",
    category: "",
    sku: "",
    unitPrice: "",
    currentStock: "",
    reorderLevel: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products:", error);
      alert("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProduct({
      productName: "",
      category: "",
      sku: "",
      unitPrice: "",
      currentStock: "",
      reorderLevel: "",
    });

    setEditingProductId(null);
    setShowForm(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/products", {
        productName: product.productName,
        category: product.category,
        sku: product.sku,
        unitPrice: Number(product.unitPrice),
        currentStock: Number(product.currentStock),
        reorderLevel: Number(product.reorderLevel),
      });

      alert("Product added successfully! 🎉");

      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product.");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/api/products/${editingProductId}`, {
        productName: product.productName,
        category: product.category,
        sku: product.sku,
        unitPrice: Number(product.unitPrice),
        currentStock: Number(product.currentStock),
        reorderLevel: Number(product.reorderLevel),
      });

      alert("Product updated successfully! 🎉");

      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/api/products/${id}`);

      alert("Product deleted successfully! 🗑️");

      loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product.");
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product.id);

    setProduct({
      productName: product.productName || "",
      category: product.category || "",
      sku: product.sku || "",
      unitPrice: product.unitPrice ?? "",
      currentStock: product.currentStock ?? "",
      reorderLevel: product.reorderLevel ?? "",
    });

    setShowForm(true);
  };

  const getStockStatus = (currentStock, reorderLevel) => {
    if (currentStock <= 0) {
      return {
        text: "Out of Stock",
        className: "out-of-stock",
      };
    }

    if (currentStock <= reorderLevel) {
      return {
        text: "Low Stock",
        className: "low-stock",
      };
    }

    return {
      text: "In Stock",
      className: "in-stock",
    };
  };

  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (item) =>
      item.currentStock > 0 &&
      item.currentStock <= item.reorderLevel
  ).length;

  const outOfStockProducts = products.filter(
    (item) => item.currentStock <= 0
  ).length;

  const totalStock = products.reduce(
    (sum, item) => sum + (item.currentStock || 0),
    0
  );

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Products...</h2>
          <p>Please wait while we fetch your inventory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">

      {/* Header */}
      <div className="products-header">

        <div className="products-title-section">

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <div className="title-row">
            <div className="page-icon">📦</div>

            <div>
              <h1>Products</h1>
              <p>Manage your inventory products</p>
            </div>
          </div>

        </div>

        <button
          className="add-product-button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? "✕ Close Form" : "+ Add Product"}
        </button>

      </div>


      {/* Statistics */}
      <div className="product-stats">

        <div className="product-stat-card">

          <div className="stat-icon blue">
            📦
          </div>

          <div>
            <p>Total Products</p>
            <h2>{totalProducts}</h2>
          </div>

        </div>


        <div className="product-stat-card">

          <div className="stat-icon green">
            📊
          </div>

          <div>
            <p>Total Stock</p>
            <h2>{totalStock}</h2>
          </div>

        </div>


        <div className="product-stat-card">

          <div className="stat-icon orange">
            ⚠️
          </div>

          <div>
            <p>Low Stock</p>
            <h2>{lowStockProducts}</h2>
          </div>

        </div>


        <div className="product-stat-card">

          <div className="stat-icon red">
            🚫
          </div>

          <div>
            <p>Out of Stock</p>
            <h2>{outOfStockProducts}</h2>
          </div>

        </div>

      </div>


      {/* Add / Edit Form */}
      {showForm && (
        <form
          className="product-form"
          onSubmit={
            editingProductId
              ? handleEditProduct
              : handleAddProduct
          }
        >

          <div className="form-header">

            <div>
              <h2>
                {editingProductId
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              <p>
                {editingProductId
                  ? "Update the product information below."
                  : "Enter the details for your new inventory product."}
              </p>
            </div>

            <div className="form-icon">
              {editingProductId ? "✏️" : "➕"}
            </div>

          </div>


          <div className="form-grid">

            <div className="form-group">
              <label>Product Name</label>

              <input
                type="text"
                placeholder="e.g. Dell Laptop"
                value={product.productName}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    productName: e.target.value,
                  })
                }
                required
              />
            </div>


            <div className="form-group">
              <label>Category</label>

              <input
                type="text"
                placeholder="e.g. Electronics"
                value={product.category}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    category: e.target.value,
                  })
                }
                required
              />
            </div>


            <div className="form-group">
              <label>SKU</label>

              <input
                type="text"
                placeholder="e.g. LAP-001"
                value={product.sku}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    sku: e.target.value,
                  })
                }
                required
              />
            </div>


            <div className="form-group">
              <label>Unit Price (₹)</label>

              <input
                type="number"
                min="0"
                placeholder="e.g. 55000"
                value={product.unitPrice}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    unitPrice: e.target.value,
                  })
                }
                required
              />
            </div>


            <div className="form-group">
              <label>Current Stock</label>

              <input
                type="number"
                min="0"
                placeholder="e.g. 100"
                value={product.currentStock}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    currentStock: e.target.value,
                  })
                }
                required
              />
            </div>


            <div className="form-group">
              <label>Reorder Level</label>

              <input
                type="number"
                min="0"
                placeholder="e.g. 20"
                value={product.reorderLevel}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    reorderLevel: e.target.value,
                  })
                }
                required
              />
            </div>

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="save-product-button"
            >
              {editingProductId
                ? "✓ Update Product"
                : "✓ Save Product"}
            </button>

            <button
              type="button"
              className="cancel-product-button"
              onClick={resetForm}
            >
              Cancel
            </button>

          </div>

        </form>
      )}


      {/* Products Table */}
      <div className="products-table-section">

        <div className="table-header">

          <div>
            <h2>Product Inventory</h2>
            <p>
              {products.length} product
              {products.length !== 1 ? "s" : ""} in your inventory
            </p>
          </div>

        </div>


        <div className="products-table-container">

          {products.length === 0 ? (

            <div className="empty-products">

              <div className="empty-icon">
                📦
              </div>

              <h2>No Products Found</h2>

              <p>
                Start by adding your first inventory product.
              </p>

              <button
                onClick={() => setShowForm(true)}
              >
                + Add Product
              </button>

            </div>

          ) : (

            <table className="products-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>SKU</th>
                  <th>Unit Price</th>
                  <th>Stock</th>
                  <th>Reorder Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>


              <tbody>

                {products.map((item) => {

                  const stockStatus = getStockStatus(
                    item.currentStock,
                    item.reorderLevel
                  );

                  return (
                    <tr key={item.id}>

                      <td>
                        <span className="product-id">
                          #{item.id}
                        </span>
                      </td>


                      <td>
                        <div className="product-name-cell">

                          <div className="product-mini-icon">
                            📦
                          </div>

                          <div>
                            <strong>
                              {item.productName}
                            </strong>

                            <span>
                              {item.sku}
                            </span>
                          </div>

                        </div>
                      </td>


                      <td>
                        <span className="category-badge">
                          {item.category}
                        </span>
                      </td>


                      <td>
                        <span className="sku-text">
                          {item.sku}
                        </span>
                      </td>


                      <td>
                        <strong className="price">
                          ₹{Number(item.unitPrice || 0).toLocaleString("en-IN")}
                        </strong>
                      </td>


                      <td>
                        <strong className="stock-number">
                          {item.currentStock}
                        </strong>
                      </td>


                      <td>
                        {item.reorderLevel}
                      </td>


                      <td>
                        <span
                          className={`stock-status ${stockStatus.className}`}
                        >
                          <span className="status-dot"></span>
                          {stockStatus.text}
                        </span>
                      </td>


                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            onClick={() =>
                              startEditProduct(item)
                            }
                          >
                            ✏️
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDeleteProduct(item.id)
                            }
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}

export default Products;

