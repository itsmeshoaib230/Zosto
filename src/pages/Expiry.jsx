
import React, { useMemo, useState } from "react";
import "./Expiry.css";
import BackToDashboard from "../components/BackToDashboard";

const initialItems = [
  {
    id: 1,
    name: "Milk Packet (1L)",
    batch: "MIL-2026-01",
    category: "Dairy",
    expiryDate: "2026-10-12",
    quantity: 10,
    image: "🥛",
  },
  {
    id: 2,
    name: "Yogurt (500g)",
    batch: "YGT-2026-02",
    category: "Dairy",
    expiryDate: "2026-10-17",
    quantity: 25,
    image: "🥣",
  },
  {
    id: 3,
    name: "Bread (400g)",
    batch: "BRD-2026-11",
    category: "Bakery",
    expiryDate: "2026-10-19",
    quantity: 40,
    image: "🍞",
  },
  {
    id: 4,
    name: "Cheese Slices",
    batch: "CHS-2026-08",
    category: "Dairy",
    expiryDate: "2026-10-21",
    quantity: 15,
    image: "🧀",
  },
  {
    id: 5,
    name: "Apple (1kg)",
    batch: "APL-2026-15",
    category: "Fruits",
    expiryDate: "2026-10-29",
    quantity: 30,
    image: "🍎",
  },
  {
    id: 6,
    name: "Potato Chips",
    batch: "CHP-2026-22",
    category: "Snacks",
    expiryDate: "2026-11-05",
    quantity: 50,
    image: "🍟",
  },
  {
    id: 7,
    name: "Soft Drink (500ml)",
    batch: "DRK-2026-30",
    category: "Beverages",
    expiryDate: "2026-11-18",
    quantity: 60,
    image: "🥤",
  },
];

const today = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const daysUntil = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  return Math.round((date - today()) / 86400000);
};

const getStatus = (item) => {
  if (item.sold) return "Sold";

  const days = daysUntil(item.expiryDate);

  if (days < 0) return "Expired";
  if (days <= 7) return "Expiring Soon";

  return "Good";
};

const formatDate = (dateString) =>
  new Date(`${dateString}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const emptyForm = {
  name: "",
  batch: "",
  category: "Dairy",
  expiryDate: "",
  quantity: "",
};

export default function Expiry() {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const summary = useMemo(() => {
    const active = items.filter((item) => !item.sold);

    return {
      expired: active.filter((item) => getStatus(item) === "Expired").length,
      soon: active.filter(
        (item) =>
          !item.sold &&
          daysUntil(item.expiryDate) >= 0 &&
          daysUntil(item.expiryDate) <= 7
      ).length,
      month: active.filter(
        (item) =>
          daysUntil(item.expiryDate) >= 0 &&
          daysUntil(item.expiryDate) <= 30
      ).length,
      tracked: items.filter((item) => item.expiryDate).length,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();

    return items
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(term) ||
          item.batch.toLowerCase().includes(term);

        const matchesCategory =
          category === "All Categories" || item.category === category;

        const matchesStatus =
          status === "All Status" || getStatus(item) === status;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        const comparison = a.expiryDate.localeCompare(b.expiryDate);
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [items, search, category, status, sortOrder]);

  const displayedItems = filteredItems;

  const updateForm = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const addExpiryItem = (event) => {
    event.preventDefault();

    const quantity = Number(form.quantity);

    if (
      !form.name.trim() ||
      !form.batch.trim() ||
      !form.expiryDate ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      alert("Please enter valid product details.");
      return;
    }

    const duplicate = items.some(
      (item) => item.batch.toLowerCase() === form.batch.trim().toLowerCase()
    );

    if (duplicate) {
      alert("This batch number already exists.");
      return;
    }

    setItems((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: form.name.trim(),
        batch: form.batch.trim(),
        category: form.category,
        expiryDate: form.expiryDate,
        quantity,
        image: "📦",
      },
    ]);

    setForm(emptyForm);
    setShowForm(false);
  };

  const removeItem = (id) => {
    const item = items.find((product) => product.id === id);

    if (!item) return;

    if (getStatus(item) !== "Expired") {
      alert("Only expired items can be removed from this alert list.");
      return;
    }

    if (window.confirm(`Remove ${item.name} from the expiry list?`)) {
      setItems((previous) =>
        previous.filter((product) => product.id !== id)
      );
    }
  };

  const markSold = (id) => {
    const item = items.find((product) => product.id === id);

    if (!item || item.sold) return;

    if (getStatus(item) === "Expired") {
      alert("Expired products cannot be marked as sold.");
      return;
    }

    if (window.confirm(`Mark ${item.name} as sold?`)) {
      setItems((previous) =>
        previous.map((product) =>
          product.id === id ? { ...product, sold: true } : product
        )
      );
    }
  };

  const viewItem = (item) => {
    alert(
      `Product: ${item.name}\nBatch: ${item.batch}\nQuantity: ${item.quantity}\nExpiry: ${formatDate(item.expiryDate)}\nStatus: ${getStatus(item)}`
    );
  };

  return (
    <main className="expiry-page">
      <header className="expiry-header">
        <div className="expiry-heading">
          <div className="expiry-heading-icon">◷</div>

          <div>
            <h1>Expiry Alerts</h1>
            <p>Track products nearing expiry and take action to reduce waste.</p>
          </div>
        </div>

      </header>

      <section className="expiry-summary">
        <article className="expiry-stat expired-stat">
          <div className="stat-icon">⚠</div>
          <div>
            <p>Expired Items</p>
            <h2>{summary.expired}</h2>
            <span>Remove or dispose</span>
          </div>
        </article>

        <article className="expiry-stat soon-stat">
          <div className="stat-icon">◷</div>
          <div>
            <p>Expiring Soon</p>
            <h2>{summary.soon}</h2>
            <span>Within 7 days</span>
          </div>
        </article>

        <article className="expiry-stat month-stat">
          <div className="stat-icon">▦</div>
          <div>
            <p>Expiring This Month</p>
            <h2>{summary.month}</h2>
            <span>Within 30 days</span>
          </div>
        </article>

        <article className="expiry-stat tracked-stat">
          <div className="stat-icon">▣</div>
          <div>
            <p>Total Items Tracked</p>
            <h2>{summary.tracked}</h2>
            <span>With expiry dates</span>
          </div>
        </article>
      </section>

      <section className="expiry-filters">
        <label className="expiry-search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search by product name or batch number..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          <option>All Categories</option>
          <option>Dairy</option>
          <option>Bakery</option>
          <option>Fruits</option>
          <option>Snacks</option>
          <option>Beverages</option>
        </select>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by status"
        >
          <option>All Status</option>
          <option>Expired</option>
          <option>Expiring Soon</option>
          <option>Good</option>
          <option>Sold</option>
        </select>

        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          aria-label="Sort by expiry date"
        >
          <option value="asc">Expiry Date ↑</option>
          <option value="desc">Expiry Date ↓</option>
        </select>

        <button
          type="button"
          className="expiry-add-button"
          onClick={() => setShowForm((previous) => !previous)}
        >
          + Add Expiry Item
        </button>
      </section>

      {showForm && (
        <form className="expiry-add-form" onSubmit={addExpiryItem}>
          <h2>Add Product Expiry Details</h2>

          <div className="expiry-form-grid">
            <label>
              Product Name
              <input
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                required
              />
            </label>

            <label>
              Batch Number
              <input
                value={form.batch}
                onChange={(event) => updateForm("batch", event.target.value)}
                required
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(event) =>
                  updateForm("category", event.target.value)
                }
              >
                <option>Dairy</option>
                <option>Bakery</option>
                <option>Fruits</option>
                <option>Snacks</option>
                <option>Beverages</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Expiry Date
              <input
                type="date"
                value={form.expiryDate}
                onChange={(event) =>
                  updateForm("expiryDate", event.target.value)
                }
                required
              />
            </label>

            <label>
              Stock Quantity
              <input
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={(event) =>
                  updateForm("quantity", event.target.value)
                }
                required
              />
            </label>
          </div>

          <div className="expiry-form-actions">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="expiry-cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="expiry-add-button">
              Save Item
            </button>
          </div>
        </form>
      )}

      <section className="expiry-table-container">
        <table className="expiry-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Batch No.</th>
              <th>Category</th>
              <th>Expiry Date</th>
              <th>Days Left</th>
              <th>Status</th>
              <th>Stock Qty</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {displayedItems.map((item) => {
              const days = daysUntil(item.expiryDate);
              const itemStatus = getStatus(item);

              return (
                <tr
                  key={item.id}
                  className={
                    itemStatus === "Expired"
                      ? "expired-row"
                      : itemStatus === "Expiring Soon"
                        ? "soon-row"
                        : ""
                  }
                >
                  <td>
                    <div className="expiry-product">
                      <span className="expiry-product-image">{item.image}</span>
                      <strong>{item.name}</strong>
                    </div>
                  </td>

                  <td>{item.batch}</td>

                  <td>
                    <span className={`expiry-category ${item.category.toLowerCase()}`}>
                      {item.category}
                    </span>
                  </td>

                  <td
                    className={
                      itemStatus === "Expired" ? "expiry-date-danger" : ""
                    }
                  >
                    {formatDate(item.expiryDate)}
                  </td>

                  <td
                    className={`expiry-days ${
                      days < 0
                        ? "days-danger"
                        : days <= 7
                          ? "days-warning"
                          : "days-good"
                    }`}
                  >
                    {itemStatus === "Sold"
                      ? "—"
                      : days < 0
                        ? `${days} days`
                        : days === 0
                          ? "Today"
                          : `${days} days`}
                  </td>

                  <td>
                    <span
                      className={`expiry-status ${itemStatus
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      <span className="status-dot" />
                      {itemStatus}
                    </span>
                  </td>

                  <td>{item.quantity}</td>

                  <td>
                    <div className="expiry-actions">
                      {itemStatus === "Expired" ? (
                        <button
                          type="button"
                          className="expiry-remove"
                          onClick={() => removeItem(item.id)}
                        >
                          ▣ Remove
                        </button>
                      ) : itemStatus === "Sold" ? (
                        <button
                          type="button"
                          className="expiry-view"
                          onClick={() => viewItem(item)}
                        >
                          View
                        </button>
                      ) : days <= 7 ? (
                        <button
                          type="button"
                          className="expiry-mark-sold"
                          onClick={() => markSold(item.id)}
                        >
                          ✓ Mark Sold
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="expiry-view"
                          onClick={() => viewItem(item)}
                        >
                          ◉ View
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {displayedItems.length === 0 && (
              <tr>
                <td colSpan="8" className="expiry-empty">
                  No matching expiry records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <footer className="expiry-footer">
        Showing {displayedItems.length} items
      </footer>
    </main>
  );
}
