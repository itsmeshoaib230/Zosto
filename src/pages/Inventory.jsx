
import { useMemo, useState } from "react";
import BackToDashboard from "../components/BackToDashboard";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Package,
  Save,
} from "lucide-react";
import "./Inventory.css";

const initialProducts = [
  { id: 1, name: "Ergonomic Office Chair", sku: "CHR-001", category: "Furniture", quantity: 25, price: 149.99 },
  { id: 2, name: "Wireless Mechanical Keyboard", sku: "KBD-012", category: "Electronics", quantity: 40, price: 89.50 },
  { id: 3, name: "4K Ultra HD Monitor", sku: "MON-4K-27", category: "Electronics", quantity: 15, price: 320.00 },
  { id: 4, name: "Leather Bound Notebook", sku: "NTB-L01", category: "Office Supplies", quantity: 150, price: 19.99 },
  { id: 5, name: "Standing Desk Converter", sku: "DSK-S02", category: "Furniture", quantity: 8, price: 250.75 },
  { id: 6, name: "USB-C Docking Station", sku: "HUB-C05", category: "Electronics", quantity: 0, price: 75.00 },
  { id: 7, name: "Gel Pens (12-Pack)", sku: "PEN-G12", category: "Office Supplies", quantity: 200, price: 12.25 },
  { id: 8, name: "Noise-Cancelling Headphones", sku: "HDP-NC8", category: "Electronics", quantity: 22, price: 199.99 },
  { id: 9, name: "Adjustable Monitor Stand", sku: "MNT-ADJ1", category: "Accessories", quantity: 3, price: 45.50 },
  { id: 10, name: "Webcam with Ring Light", sku: "CAM-RL01", category: "Electronics", quantity: 30, price: 65.00 },
  { id: 11, name: "Wireless Mouse", sku: "MSE-021", category: "Electronics", quantity: 18, price: 24.99 },
  { id: 12, name: "Office Desk Lamp", sku: "LMP-009", category: "Accessories", quantity: 6, price: 35.00 },
];

const emptyForm = {
  name: "",
  sku: "",
  category: "Electronics",
  quantity: "",
  price: "",
};

function getStockStatus(quantity) {
  if (quantity === 0) {
    return { label: "Out of Stock", type: "out" };
  }

  if (quantity <= 10) {
    return { label: "Low Stock", type: "low" };
  }

  return { label: "In Stock", type: "in" };
}

export default function Inventory() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const pageSize = 10;

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) =>
      [product.name, product.sku, product.category].some((value) =>
        value.toLowerCase().includes(term)
      )
    );
  }, [products, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / pageSize)
  );

  const visibleProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  }

  function openEditForm(product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      quantity: String(product.quantity),
      price: String(product.price),
    });

    setError("");
    setFormOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.sku.trim()) {
      setError("Product name and SKU are required.");
      return;
    }

    const quantity = Number(form.quantity);
    const price = Number(form.price);

    if (
      form.quantity === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      form.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError("Enter a valid quantity and price.");
      return;
    }

    const duplicateSku = products.some(
      (product) =>
        product.sku.toLowerCase() === form.sku.trim().toLowerCase() &&
        product.id !== editingId
    );

    if (duplicateSku) {
      setError("This SKU already exists.");
      return;
    }

    if (editingId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: form.name.trim(),
                sku: form.sku.trim(),
                category: form.category,
                quantity,
                price,
              }
            : product
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category,
        quantity,
        price,
      };

      setProducts((current) => [...current, newProduct]);
      setPage(Math.ceil((filteredProducts.length + 1) / pageSize));
    }

    setFormOpen(false);
    setForm(emptyForm);
  }

  function deleteProduct(product) {
    const confirmed = window.confirm(
      `Delete "${product.name}" from inventory?`
    );

    if (!confirmed) return;

    const updatedProducts = products.filter(
      (item) => item.id !== product.id
    );

    setProducts(updatedProducts);

    const remainingFilteredCount = updatedProducts.filter((item) => {
      const term = search.trim().toLowerCase();

      return [item.name, item.sku, item.category].some((value) =>
        value.toLowerCase().includes(term)
      );
    }).length;

    setPage((current) =>
      Math.min(
        current,
        Math.max(1, Math.ceil(remainingFilteredCount / pageSize))
      )
    );
  }

  return (
    <main className="inventory-page">
      <header className="inventory-heading">
        <div className="inventory-title-icon">
          <Package size={21} />
        </div>

        <div>
          <h1>Inventory Management</h1>
          <p>Manage and track your store products.</p>
        </div>
      </header>

      <section className="inventory-panel">
        <div className="inventory-toolbar">
          <div className="inventory-list-label">
            <span className="inventory-label-dot" />
            <strong>Product List</strong>
            <span className="inventory-count">
              {filteredProducts.length} items
            </span>
          </div>

          <div className="inventory-toolbar-actions">
            <label className="inventory-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </label>

            <button
              type="button"
              className="inventory-add-btn"
              onClick={openAddForm}
            >
              <Plus size={17} />
              Add New Item
            </button>
          </div>
        </div>

        <div className="inventory-table-scroll">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th className="number-cell">Quantity</th>
                <th className="number-cell">Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleProducts.map((product) => {
                const status = getStockStatus(product.quantity);

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="inventory-product-image">
                        <Package size={20} />
                      </div>
                    </td>

                    <td className="inventory-product-name">
                      {product.name}
                    </td>

                    <td>{product.sku}</td>
                    <td>{product.category}</td>

                    <td className="number-cell">
                      {product.quantity}
                    </td>

                    <td className="number-cell">
                      ${product.price.toFixed(2)}
                    </td>

                    <td>
                      <span className={`inventory-status ${status.type}`}>
                        {status.label}
                      </span>
                    </td>

                    <td>
                      <div className="inventory-row-actions">
                        <button
                          type="button"
                          className="inventory-icon-btn edit"
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => openEditForm(product)}
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          type="button"
                          className="inventory-icon-btn delete"
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => deleteProduct(product)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {visibleProducts.length === 0 && (
                <tr>
                  <td colSpan="8" className="inventory-empty">
                    No products found. Try another search or add a new item.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="inventory-footer">
          <span>
            Showing{" "}
            {visibleProducts.length > 0
              ? (page - 1) * pageSize + 1
              : 0}
            {"–"}
            {(page - 1) * pageSize + visibleProducts.length} of{" "}
            {filteredProducts.length} items
          </span>

          <div className="inventory-pagination">
            <button
              type="button"
              title="First page"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              <ChevronsLeft size={17} />
            </button>

            <button
              type="button"
              title="Previous page"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft size={17} />
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              title="Next page"
              disabled={page === totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              <ChevronRight size={17} />
            </button>

            <button
              type="button"
              title="Last page"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              <ChevronsRight size={17} />
            </button>
          </div>
        </footer>
      </section>

      {formOpen && (
        <div
          className="inventory-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setFormOpen(false);
            }
          }}
        >
          <section
            className="inventory-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inventory-form-title"
          >
            <div className="inventory-modal-heading">
              <div>
                <h2 id="inventory-form-title">
                  {editingId !== null ? "Edit Product" : "Add New Item"}
                </h2>

                <p>Enter the product details below.</p>
              </div>

              <button
                type="button"
                className="inventory-modal-close"
                onClick={() => setFormOpen(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Product Name
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter product name"
                  required
                />
              </label>

              <label>
                SKU
                <input
                  value={form.sku}
                  onChange={(event) =>
                    setForm({ ...form, sku: event.target.value })
                  }
                  placeholder="Example: PRD-001"
                  required
                />
              </label>

              <label>
                Category
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                >
                  <option>Electronics</option>
                  <option>Furniture</option>
                  <option>Office Supplies</option>
                  <option>Accessories</option>
                  <option>Groceries</option>
                  <option>Beverages</option>
                  <option>Other</option>
                </select>
              </label>

              <div className="inventory-form-grid">
                <label>
                  Quantity
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.quantity}
                    onChange={(event) =>
                      setForm({ ...form, quantity: event.target.value })
                    }
                    placeholder="0"
                    required
                  />
                </label>

                <label>
                  Price ($)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </label>
              </div>

              {error && (
                <p className="inventory-form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="inventory-form-actions">
                <button
                  type="button"
                  className="inventory-cancel-btn"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="inventory-add-btn">
                  {editingId !== null ? (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
