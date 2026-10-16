
import React, { useMemo, useState } from "react";
import "./StockExchange.css";
import BackToDashboard from "../components/BackToDashboard";

const initialTransactions = [
  {
    id: 1,
    date: "2026-10-15",
    time: "10:30 AM",
    product: "Milk Packet (1L)",
    emoji: "🥛",
    category: "Dairy",
    sku: "MIL-001",
    type: "Stock In",
    quantity: 50,
    reference: "PO-2026-001",
    fromTo: "Supplier",
    notes: "Monthly supply",
  },
  {
    id: 2,
    date: "2026-10-14",
    time: "04:15 PM",
    product: "Banana (1kg)",
    emoji: "🍌",
    category: "Fruits",
    sku: "BAN-002",
    type: "Stock Out",
    quantity: -20,
    reference: "INV-2026-445",
    fromTo: "Customer Sale",
    notes: "Sold at counter",
  },
  {
    id: 3,
    date: "2026-10-14",
    time: "11:20 AM",
    product: "Bread (400g)",
    emoji: "🍞",
    category: "Bakery",
    sku: "BRD-003",
    type: "Stock In",
    quantity: 100,
    reference: "PO-2026-002",
    fromTo: "Supplier",
    notes: "Fresh stock",
  },
  {
    id: 4,
    date: "2026-10-13",
    time: "02:45 PM",
    product: "Potato Chips",
    emoji: "🍟",
    category: "Snacks",
    sku: "CHP-004",
    type: "Transfer",
    quantity: 30,
    reference: "TRF-2026-009",
    fromTo: "Main Store → Branch 1",
    notes: "Store transfer",
  },
  {
    id: 5,
    date: "2026-10-12",
    time: "09:10 AM",
    product: "Soft Drink (500ml)",
    emoji: "🥤",
    category: "Beverages",
    sku: "DRK-005",
    type: "Stock Out",
    quantity: -40,
    reference: "INV-2026-432",
    fromTo: "Customer Sale",
    notes: "Sold at counter",
  },
  {
    id: 6,
    date: "2026-10-11",
    time: "03:30 PM",
    product: "Yogurt (500g)",
    emoji: "🥣",
    category: "Dairy",
    sku: "YGT-006",
    type: "Transfer",
    quantity: 15,
    reference: "TRF-2026-008",
    fromTo: "Branch 2 → Main Store",
    notes: "Reallocation",
  },
];

const emptyForm = {
  product: "",
  sku: "",
  category: "Groceries",
  type: "Stock In",
  quantity: "",
  fromTo: "",
  notes: "",
};

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function StockExchange() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [activeTab, setActiveTab] = useState("All Transactions");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [sortNewest, setSortNewest] = useState(true);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const pageSize = 6;

  const summary = useMemo(() => {
    const stockIn = transactions
      .filter((t) => t.type === "Stock In")
      .reduce((sum, t) => sum + t.quantity, 0);

    const stockOut = transactions
      .filter((t) => t.type === "Stock Out")
      .reduce((sum, t) => sum + Math.abs(t.quantity), 0);

    const transfers = transactions
      .filter((t) => t.type === "Transfer")
      .reduce((sum, t) => sum + Math.abs(t.quantity), 0);

    return {
      stockIn,
      stockOut,
      transfers,
      net: stockIn - stockOut,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return transactions
      .filter((t) => {
        const matchesSearch = [
          t.product,
          t.sku,
          t.reference,
          t.fromTo,
          t.notes,
        ].some((value) => value.toLowerCase().includes(term));

        const matchesTab =
          activeTab === "All Transactions" || t.type === activeTab;

        const matchesType =
          typeFilter === "All Types" || t.type === typeFilter;

        const matchesCategory =
          categoryFilter === "All Categories" ||
          t.category === categoryFilter;

        const matchesDate =
          dateFilter === "All Dates" ||
          (dateFilter === "Last 7 Days" &&
            (new Date(`${t.date}T00:00:00`) - new Date("2026-10-09T00:00:00")) >= 0);

        return (
          matchesSearch &&
          matchesTab &&
          matchesType &&
          matchesCategory &&
          matchesDate
        );
      })
      .sort((a, b) =>
        sortNewest
          ? b.date.localeCompare(a.date) || b.id - a.id
          : a.date.localeCompare(b.date) || a.id - b.id
      );
  }, [
    transactions,
    activeTab,
    search,
    typeFilter,
    categoryFilter,
    dateFilter,
    sortNewest,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );

  const visibleTransactions = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const updateForm = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const resetFilters = () => {
    setSearch("");
    setActiveTab("All Transactions");
    setTypeFilter("All Types");
    setCategoryFilter("All Categories");
    setDateFilter("All Dates");
    setPage(1);
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const addTransaction = (event) => {
    event.preventDefault();

    const quantity = Number(form.quantity);

    if (
      !form.product.trim() ||
      !form.sku.trim() ||
      !form.fromTo.trim() ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      alert("Enter valid product, quantity, and source/destination details.");
      return;
    }

    const now = new Date();
    const date = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newTransaction = {
      id: Date.now(),
      date,
      time,
      product: form.product.trim(),
      emoji: "📦",
      category: form.category,
      sku: form.sku.trim(),
      type: form.type,
      quantity: form.type === "Stock Out" ? -quantity : quantity,
      reference: `${form.type === "Transfer" ? "TRF" : "TXN"}-${Date.now()
        .toString()
        .slice(-6)}`,
      fromTo: form.fromTo.trim(),
      notes: form.notes.trim() || "Manual entry",
    };

    setTransactions((previous) => [newTransaction, ...previous]);
    setForm(emptyForm);
    setShowForm(false);
    setPage(1);
    setActiveTab("All Transactions");
    setTypeFilter("All Types");
    setCategoryFilter("All Categories");
    setDateFilter("All Dates");
  };

  return (
    <main className="stock-exchange-page">
      <header className="se-header">
        <div className="se-title-group">
          <button
            className="se-back-button"
            onClick={() => window.history.back()}
            aria-label="Go back"
            type="button"
          >
            ←
          </button>

          <div className="se-title-icon">⇄</div>

          <div>
            <h1>Stock Exchange</h1>
            <p>
              Track all stock movements (stock in, stock out, and transfers)
              in your store.
            </p>
          </div>
        </div>

        <div className="se-date-label">
          <span>▦</span>
          {formatDate(new Date().toLocaleDateString("en-CA"))}
        </div>
      </header>

      <section className="se-summary">
        <article className="se-stat se-in-stat">
          <div className="se-stat-icon">↓</div>
          <div>
            <p>Total Stock In</p>
            <h2>{summary.stockIn.toLocaleString("en-IN")}</h2>
            <span>Items received</span>
          </div>
        </article>

        <article className="se-stat se-out-stat">
          <div className="se-stat-icon">↑</div>
          <div>
            <p>Total Stock Out</p>
            <h2>{summary.stockOut.toLocaleString("en-IN")}</h2>
            <span>Items sold or used</span>
          </div>
        </article>

        <article className="se-stat se-transfer-stat">
          <div className="se-stat-icon">⇄</div>
          <div>
            <p>Stock Transfers</p>
            <h2>{summary.transfers.toLocaleString("en-IN")}</h2>
            <span>Items moved between locations</span>
          </div>
        </article>

        <article className="se-stat se-net-stat">
          <div className="se-stat-icon">⬡</div>
          <div>
            <p>Net Stock Change</p>
            <h2>
              {summary.net > 0 ? "+" : ""}
              {summary.net.toLocaleString("en-IN")}
            </h2>
            <span>Stock in minus stock out</span>
          </div>
        </article>
      </section>

      <nav className="se-tabs" aria-label="Transaction types">
        {[
          { label: "All Transactions", icon: "☷" },
          { label: "Stock In", icon: "↓" },
          { label: "Stock Out", icon: "↑" },
          { label: "Transfer", icon: "⇄" },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`se-tab ${
              activeTab === tab.label ? "active" : ""
            }`}
            onClick={() => changeTab(tab.label)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}

        <button
          type="button"
          className="se-add-button"
          onClick={() => setShowForm((previous) => !previous)}
        >
          + Add Transaction
        </button>
      </nav>

      {showForm && (
        <form className="se-form" onSubmit={addTransaction}>
          <h2>Add Stock Transaction</h2>

          <div className="se-form-grid">
            <label>
              Product Name
              <input
                value={form.product}
                onChange={(e) => updateForm("product", e.target.value)}
                required
              />
            </label>

            <label>
              SKU
              <input
                value={form.sku}
                onChange={(e) => updateForm("sku", e.target.value)}
                required
              />
            </label>

            <label>
              Transaction Type
              <select
                value={form.type}
                onChange={(e) => updateForm("type", e.target.value)}
              >
                <option>Stock In</option>
                <option>Stock Out</option>
                <option>Transfer</option>
              </select>
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
              >
                <option>Groceries</option>
                <option>Dairy</option>
                <option>Fruits</option>
                <option>Bakery</option>
                <option>Snacks</option>
                <option>Beverages</option>
                <option>Household</option>
              </select>
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="1"
                step="1"
                value={form.quantity}
                onChange={(e) => updateForm("quantity", e.target.value)}
                required
              />
            </label>

            <label>
              Source / Destination
              <input
                placeholder="Supplier or nearby shop"
                value={form.fromTo}
                onChange={(e) => updateForm("fromTo", e.target.value)}
                required
              />
            </label>

            <label className="se-notes-field">
              Notes
              <input
                placeholder="Reason for transaction"
                value={form.notes}
                onChange={(e) => updateForm("notes", e.target.value)}
              />
            </label>
          </div>

          <div className="se-form-actions">
            <button
              type="button"
              className="se-cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button className="se-add-button" type="submit">
              Save Transaction
            </button>
          </div>
        </form>
      )}

      <section className="se-filters">
        <label className="se-search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search by product name, SKU, or reference..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </label>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by transaction type"
        >
          <option>All Types</option>
          <option>Stock In</option>
          <option>Stock Out</option>
          <option>Transfer</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by category"
        >
          <option>All Categories</option>
          <option>Groceries</option>
          <option>Dairy</option>
          <option>Fruits</option>
          <option>Bakery</option>
          <option>Snacks</option>
          <option>Beverages</option>
          <option>Household</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by date"
        >
          <option>All Dates</option>
          <option>Last 7 Days</option>
        </select>

        <button
          type="button"
          className="se-reset-button"
          onClick={resetFilters}
        >
          Reset
        </button>
      </section>

      <section className="se-table-card">
        <div className="se-table-scroll">
          <table className="se-table">
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    className="se-sort-button"
                    onClick={() => setSortNewest((previous) => !previous)}
                  >
                    Date &amp; Time {sortNewest ? "↕" : "↕"}
                  </button>
                </th>
                <th>Product</th>
                <th>SKU</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Reference</th>
                <th>From / To</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleTransactions.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="se-date-cell">
                      <strong>{formatDate(t.date)}</strong>
                      <span>{t.time}</span>
                    </div>
                  </td>

                  <td>
                    <div className="se-product-cell">
                      <span className="se-product-emoji">{t.emoji}</span>
                      <div>
                        <strong>{t.product}</strong>
                        <span>{t.category}</span>
                      </div>
                    </div>
                  </td>

                  <td>{t.sku}</td>

                  <td>
                    <span className={`se-type-pill ${t.type.toLowerCase().replace(" ", "-")}`}>
                      <span>
                        {t.type === "Stock In"
                          ? "↓"
                          : t.type === "Stock Out"
                            ? "↑"
                            : "⇄"}
                      </span>
                      {t.type}
                    </span>
                  </td>

                  <td>
                    <strong
                      className={
                        t.type === "Stock In"
                          ? "se-quantity-in"
                          : t.type === "Stock Out"
                            ? "se-quantity-out"
                            : "se-quantity-transfer"
                      }
                    >
                      {t.quantity > 0 && t.type !== "Stock Out" ? "+" : ""}
                      {t.quantity}
                    </strong>
                  </td>

                  <td>{t.reference}</td>
                  <td>{t.fromTo}</td>
                  <td>{t.notes}</td>

                  <td>
                    <button
                      type="button"
                      className="se-view-button"
                      title="View transaction"
                      aria-label={`View ${t.product}`}
                      onClick={() => setSelectedTransaction(t)}
                    >
                      ◉
                    </button>
                  </td>
                </tr>
              ))}

              {visibleTransactions.length === 0 && (
                <tr>
                  <td colSpan="9" className="se-empty">
                    No transactions found. Try changing your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="se-pagination">
          <span>
            Showing{" "}
            {filteredTransactions.length === 0
              ? 0
              : (page - 1) * pageSize + 1}
            {" – "}
            {Math.min(page * pageSize, filteredTransactions.length)} of{" "}
            {filteredTransactions.length} transactions
          </span>

          <div className="se-page-buttons">
            <button
              disabled={page === 1}
              onClick={() => setPage(1)}
              type="button"
              aria-label="First page"
            >
              «
            </button>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              type="button"
              aria-label="Previous page"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (number) =>
                  number === 1 ||
                  number === totalPages ||
                  Math.abs(number - page) <= 1
              )
              .map((number, index, numbers) => (
                <React.Fragment key={number}>
                  {index > 0 && numbers[index - 1] < number - 1 && (
                    <span className="se-page-ellipsis">…</span>
                  )}
                  <button
                    type="button"
                    className={page === number ? "current" : ""}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                </React.Fragment>
              ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              type="button"
              aria-label="Next page"
            >
              ›
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
              type="button"
              aria-label="Last page"
            >
              »
            </button>
          </div>
        </footer>
      </section>

      {selectedTransaction && (
        <div
          className="se-modal-overlay"
          onClick={() => setSelectedTransaction(null)}
        >
          <section
            className="se-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="se-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="se-modal-header">
              <h2 id="se-detail-title">Transaction Details</h2>
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <div className="se-detail-product">
              <span>{selectedTransaction.emoji}</span>
              <div>
                <strong>{selectedTransaction.product}</strong>
                <p>{selectedTransaction.sku}</p>
              </div>
            </div>

            <dl className="se-detail-list">
              <div><dt>Reference</dt><dd>{selectedTransaction.reference}</dd></div>
              <div><dt>Type</dt><dd>{selectedTransaction.type}</dd></div>
              <div><dt>Quantity</dt><dd>{selectedTransaction.quantity}</dd></div>
              <div><dt>Category</dt><dd>{selectedTransaction.category}</dd></div>
              <div><dt>Date</dt><dd>{formatDate(selectedTransaction.date)}</dd></div>
              <div><dt>From / To</dt><dd>{selectedTransaction.fromTo}</dd></div>
              <div><dt>Notes</dt><dd>{selectedTransaction.notes}</dd></div>
            </dl>

            <button
              type="button"
              className="se-add-button se-modal-close"
              onClick={() => setSelectedTransaction(null)}
            >
              Close
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
