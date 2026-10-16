
import React, { useMemo, useState } from "react";
import "./Suppliers.css";

const initialSuppliers = [
  { id: "SUP-001", name: "Fresh Foods Co.", contact: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@freshfoods.com", category: "Fruits & Vegetables", purchases: 48320, orders: 24, lastOrder: "14 Oct 2026", status: "Active", location: "12-4-56, Market Road, Nellore, AP", credit: 50000 },
  { id: "SUP-002", name: "Dairy Mart", contact: "Suresh Reddy", phone: "+91 91234 56789", email: "suresh@dairymart.com", category: "Dairy Products", purchases: 32450, orders: 18, lastOrder: "12 Oct 2026", status: "Active", location: "Nellore, AP", credit: 40000 },
  { id: "SUP-003", name: "Grain Baskets", contact: "Anil Verma", phone: "+91 93456 78901", email: "anil@grainbaskets.com", category: "Grains & Pulses", purchases: 18760, orders: 14, lastOrder: "10 Oct 2026", status: "Active", location: "Nellore, AP", credit: 30000 },
  { id: "SUP-004", name: "Snacks Bazaar", contact: "Priya Sharma", phone: "+91 99887 66554", email: "priya@snacksbazaar.com", category: "Snacks", purchases: 12980, orders: 12, lastOrder: "09 Oct 2026", status: "Active", location: "Vedayapalem, AP", credit: 25000 },
  { id: "SUP-005", name: "Beverage Corp", contact: "Vikram Singh", phone: "+91 90011 22334", email: "vikram@beveragecorp.com", category: "Beverages", purchases: 9540, orders: 8, lastOrder: "08 Oct 2026", status: "Pending", location: "Nellore, AP", credit: 20000 },
  { id: "SUP-006", name: "Clean Home Supplies", contact: "Lakshmi Devi", phone: "+91 91122 33445", email: "lakshmi@cleanhome.com", category: "Household Items", purchases: 7850, orders: 7, lastOrder: "05 Oct 2026", status: "Active", location: "Nellore, AP", credit: 15000 },
  { id: "SUP-007", name: "Stationery World", contact: "Mohammad Ali", phone: "+91 78965 43211", email: "ali@stationeryworld.com", category: "Office Supplies", purchases: 6430, orders: 6, lastOrder: "02 Oct 2026", status: "Active", location: "Nellore, AP", credit: 12000 },
  { id: "SUP-008", name: "Electro Mart", contact: "Ravi Teja", phone: "+91 98776 55443", email: "ravi@electromart.com", category: "Electronics", purchases: 5220, orders: 4, lastOrder: "28 Sep 2026", status: "Inactive", location: "Dargamitta, AP", credit: 10000 },
  { id: "SUP-009", name: "Packaging Hub", contact: "Neha Rani", phone: "+91 98877 66543", email: "neha@packaginghub.com", category: "Packaging", purchases: 3980, orders: 3, lastOrder: "22 Sep 2026", status: "Active", location: "Nellore, AP", credit: 10000 },
  { id: "SUP-010", name: "Milk Land Distributors", contact: "Kiran Reddy", phone: "+91 94455 66778", email: "kiran@milkland.com", category: "Dairy Products", purchases: 2760, orders: 2, lastOrder: "18 Sep 2026", status: "Active", location: "Nellore, AP", credit: 8000 },
];

const emptyForm = {
  name: "",
  contact: "",
  phone: "",
  email: "",
  category: "Fruits & Vegetables",
  location: "",
  credit: "10000",
};

const categories = [
  "Fruits & Vegetables",
  "Dairy Products",
  "Grains & Pulses",
  "Snacks",
  "Beverages",
  "Household Items",
  "Office Supplies",
  "Electronics",
  "Packaging",
  "Other",
];

const money = value =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

function SupplierAvatar({ name, large = false }) {
  const colors = ["#e1f8ee", "#e3f0ff", "#fff0df", "#f0e6ff", "#ffe5f0"];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];

  return (
    <div
      className={`supplier-avatar ${large ? "supplier-avatar-large" : ""}`}
      style={{ background: color }}
    >
      {(name || "S")
        .split(" ")
        .map(word => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </div>
  );
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [selectedId, setSelectedId] = useState("SUP-001");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const pageSize = 10;

  const selected = suppliers.find(s => s.id === selectedId) || null;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return suppliers.filter(supplier => {
      const matchesSearch = [
        supplier.name,
        supplier.contact,
        supplier.phone,
        supplier.email,
        supplier.category,
      ].some(value => (value || "").toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || supplier.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        supplier.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [suppliers, search, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleSuppliers = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const activeCount = suppliers.filter(s => s.status === "Active").length;
  const inactiveCount = suppliers.filter(s => s.status === "Inactive").length;
  const totalPurchases = suppliers.reduce((sum, s) => sum + s.purchases, 0);
  const topSupplier = [...suppliers].sort((a, b) => b.purchases - a.purchases)[0];

  function setFilter(value) {
    setStatusFilter(value);
    setPage(1);
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(supplier) {
    setEditingId(supplier.id);
    setForm({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
      email: supplier.email,
      category: supplier.category,
      location: supplier.location,
      credit: String(supplier.credit || 0),
    });
    setShowForm(true);
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
  }

  function saveSupplier(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.contact.trim() || !form.phone.trim()) {
      setNotice("Please enter the supplier name, contact person and phone number.");
      return;
    }

    if (editingId) {
      const updated = {
        ...suppliers.find(s => s.id === editingId),
        ...form,
        credit: Number(form.credit) || 0,
      };

      setSuppliers(previous =>
        previous.map(s => s.id === editingId ? updated : s)
      );
      setSelectedId(editingId);
      setNotice("Supplier updated successfully.");
    } else {
      const newSupplier = {
        ...form,
        id: `SUP-${Date.now().toString().slice(-6)}`,
        credit: Number(form.credit) || 0,
        purchases: 0,
        orders: 0,
        lastOrder: "No orders yet",
        status: "Active",
      };

      setSuppliers(previous => [newSupplier, ...previous]);
      setSelectedId(newSupplier.id);
      setPage(1);
      setNotice("Supplier added successfully.");
    }

    setShowForm(false);
  }

  function deleteSupplier() {
    if (!selected) return;

    const remaining = suppliers.filter(s => s.id !== selected.id);

    setSuppliers(remaining);
    setSelectedId(remaining[0]?.id || null);
    setConfirmDelete(false);
    setNotice("Supplier deleted successfully.");
  }

  function exportCSV() {
    const headers = [
      "Supplier ID", "Supplier Name", "Contact Person", "Phone",
      "Email", "Category", "Location", "Total Purchases", "Orders", "Status",
    ];

    const rows = filtered.map(s => [
      s.id, s.name, s.contact, s.phone, s.email, s.category,
      s.location, s.purchases, s.orders, s.status,
    ]);

    const csv = [headers, ...rows]
      .map(row =>
        row.map(value =>
          `"${String(value ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "zosto-suppliers.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Supplier list exported successfully.");
  }

  function placeOrder() {
    if (!selected) return;

    setNotice(
      `Selected ${selected.name} for a new purchase order. Connect your Orders API to create a real order.`
    );
  }

  return (
    <main className="suppliers-page">
      <header className="suppliers-header">
        <div className="suppliers-heading">
          <div className="suppliers-heading-icon">🚚</div>
          <div>
            <h1>Suppliers</h1>
            <p>Manage your suppliers, track purchases and maintain strong supplier relationships.</p>
          </div>
        </div>

        <div className="suppliers-header-actions">
          <span className="suppliers-date">▦ &nbsp; Mon, 15 Oct 2026 &nbsp;⌄</span>
          <button className="supplier-primary" onClick={openAddForm}>
            + &nbsp; Add Supplier
          </button>
        </div>
      </header>

      {notice && (
        <div className="supplier-notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>✕</button>
        </div>
      )}

      <section className="supplier-stats">
        <div className="supplier-stat supplier-stat-blue">
          <div className="supplier-stat-icon">🚚</div>
          <div>
            <p>Total Suppliers</p>
            <h2>{18 + suppliers.length - initialSuppliers.length} <small>↑ 12%</small></h2>
            <span>vs last month</span>
          </div>
        </div>

        <div className="supplier-stat supplier-stat-green">
          <div className="supplier-stat-icon">◆</div>
          <div>
            <p>Active Suppliers</p>
            <h2>{activeCount} <small>↑ 8%</small></h2>
            <span>currently supplying</span>
          </div>
        </div>

        <div className="supplier-stat supplier-stat-orange">
          <div className="supplier-stat-icon">▤</div>
          <div>
            <p>Total Purchases</p>
            <h2>{money(totalPurchases)} <small>↑ 15%</small></h2>
            <span>across listed suppliers</span>
          </div>
        </div>

        <div className="supplier-stat supplier-stat-pink">
          <div className="supplier-stat-icon">🚚</div>
          <div>
            <p>Pending Deliveries</p>
            <h2>{suppliers.filter(s => s.status === "Pending").length}</h2>
            <span>requiring follow-up</span>
          </div>
        </div>

        <div className="supplier-stat supplier-stat-purple">
          <div className="supplier-stat-icon">★</div>
          <div className="supplier-top-stat">
            <p>Top Supplier</p>
            <h2>{topSupplier?.name || "No suppliers"}</h2>
            <span>{money(topSupplier?.purchases || 0)} purchases</span>
          </div>
        </div>
      </section>

      <section className="supplier-toolbar">
        <div className="supplier-filter-tabs">
          {[
            ["All", "♟", `All Suppliers (${18 + suppliers.length - initialSuppliers.length})`],
            ["Active", "●", `Active (${activeCount})`],
            ["Inactive", "●", `Inactive (${inactiveCount})`],
          ].map(([value, icon, label]) => (
            <button
              key={value}
              className={`supplier-filter-tab ${statusFilter === value ? "selected" : ""}`}
              onClick={() => setFilter(value)}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        <div className="supplier-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={event => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by supplier name, contact person, or category..."
            aria-label="Search suppliers"
          />
        </div>

        <select
          className="supplier-category-select"
          value={categoryFilter}
          onChange={event => {
            setCategoryFilter(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by category"
        >
          <option>All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <button className="supplier-export" onClick={exportCSV}>
          ↓ &nbsp; Export
        </button>
      </section>

      <section className="supplier-layout">
        <div className="supplier-table-card">
          <div className="supplier-table-scroll">
            <table className="supplier-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Supplier Name</th>
                  <th>Contact Person</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>Total Purchases</th>
                  <th>Last Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleSuppliers.map((supplier, index) => (
                  <tr
                    key={supplier.id}
                    className={selectedId === supplier.id ? "supplier-active-row" : ""}
                  >
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>

                    <td>
                      <div className="supplier-name-cell">
                        <SupplierAvatar name={supplier.name} />
                        <strong>{supplier.name}</strong>
                      </div>
                    </td>

                    <td>{supplier.contact}</td>
                    <td>{supplier.phone}</td>
                    <td>{supplier.email || "—"}</td>

                    <td>
                      <span className="supplier-category-badge">
                        {supplier.category}
                      </span>
                    </td>

                    <td><strong>{money(supplier.purchases)}</strong></td>
                    <td>{supplier.lastOrder}</td>

                    <td>
                      <span className={`supplier-status ${supplier.status.toLowerCase()}`}>
                        <span>●</span> {supplier.status}
                      </span>
                    </td>

                    <td>
                      <div className="supplier-row-actions">
                        <button
                          title="View supplier"
                          onClick={() => {
                            setSelectedId(supplier.id);
                            setConfirmDelete(false);
                          }}
                        >◉</button>

                        <button
                          title="Edit supplier"
                          onClick={() => openEditForm(supplier)}
                        >✎</button>

                        <button
                          title="Delete supplier"
                          onClick={() => {
                            setSelectedId(supplier.id);
                            setConfirmDelete(true);
                          }}
                        >⋮</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleSuppliers.length === 0 && (
                  <tr>
                    <td colSpan="10" className="supplier-empty">
                      No suppliers found. Change your filters or add a supplier.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="supplier-pagination">
            <span>
              Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}
              {" – "}
              {Math.min(currentPage * pageSize, filtered.length)}
              {" of "}{filtered.length} suppliers
            </span>

            <div className="supplier-page-buttons">
              <button disabled={currentPage === 1} onClick={() => setPage(1)}>«</button>
              <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  className={currentPage === number ? "active" : ""}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ))}

              <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>›</button>
              <button disabled={currentPage === totalPages} onClick={() => setPage(totalPages)}>»</button>
            </div>
          </footer>
        </div>

        {selected && (
          <aside className="supplier-details">
            <div className="supplier-details-heading">
              <h3>Supplier Details</h3>
              <button
                aria-label="Close supplier details"
                onClick={() => {
                  setSelectedId(null);
                  setConfirmDelete(false);
                }}
              >✕</button>
            </div>

            <div className="supplier-profile">
              <SupplierAvatar name={selected.name} large />
              <div className="supplier-profile-info">
                <h3>{selected.name}</h3>
                <span className="supplier-category-badge">{selected.category}</span>
              </div>
              <span className={`supplier-status ${selected.status.toLowerCase()}`}>
                <span>●</span> {selected.status}
              </span>
            </div>

            <div className="supplier-contact-info">
              <p>♟ &nbsp; {selected.contact} (Contact)</p>
              <p>☎ &nbsp; {selected.phone}</p>
              <p>✉ &nbsp; {selected.email || "No email provided"}</p>
              <p>♦ &nbsp; {selected.location || "Location not provided"}</p>
              <p>▦ &nbsp; Last order: {selected.lastOrder}</p>
            </div>

            <div className="supplier-detail-stats">
              <div>
                <span>Total Purchases</span>
                <strong>{money(selected.purchases)}</strong>
              </div>
              <div>
                <span>Total Orders</span>
                <strong>{selected.orders}</strong>
              </div>
              <div>
                <span>Last Order</span>
                <strong>{selected.lastOrder}</strong>
              </div>
              <div>
                <span>Credit Limit</span>
                <strong>{money(selected.credit)}</strong>
              </div>
            </div>

            <div className="supplier-recent-orders">
              <h4>Recent Orders <button onClick={() => setNotice(`Showing purchase history for ${selected.name}. Connect your backend to load actual purchase orders.`)}>View All →</button></h4>

              {selected.orders > 0 ? (
                <>
                  <div>
                    <span><b>▤</b> PO-2026-021<small>{selected.lastOrder}</small></span>
                    <strong>{money(selected.purchases * 0.18)}</strong>
                    <em>Delivered</em>
                  </div>
                  <div>
                    <span><b>▤</b> PO-2026-018<small>02 Oct 2026</small></span>
                    <strong>{money(selected.purchases * 0.13)}</strong>
                    <em>Delivered</em>
                  </div>
                  <div>
                    <span><b>▤</b> PO-2026-015<small>18 Sep 2026</small></span>
                    <strong>{money(selected.purchases * 0.12)}</strong>
                    <em>Delivered</em>
                  </div>
                </>
              ) : (
                <p>No purchase orders yet.</p>
              )}
            </div>

            {confirmDelete && (
              <div className="supplier-delete-confirm">
                <p>Delete {selected.name}?</p>
                <button onClick={() => setConfirmDelete(false)}>Cancel</button>
                <button onClick={deleteSupplier}>Confirm Delete</button>
              </div>
            )}

            <button className="supplier-primary supplier-place-order" onClick={placeOrder}>
              🚚 &nbsp; Place New Order
            </button>

            <div className="supplier-detail-actions">
              <button className="supplier-outline" onClick={() => openEditForm(selected)}>
                ✎ &nbsp; Edit Supplier
              </button>
              <button className="supplier-danger" onClick={() => setConfirmDelete(true)}>
                ▤ &nbsp; Delete
              </button>
            </div>
          </aside>
        )}
      </section>

      {showForm && (
        <div className="supplier-modal-overlay" onClick={() => setShowForm(false)}>
          <form
            className="supplier-modal"
            onSubmit={saveSupplier}
            onClick={event => event.stopPropagation()}
          >
            <div className="supplier-modal-heading">
              <h2>{editingId ? "Edit Supplier" : "Add New Supplier"}</h2>
              <button type="button" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <label>
              Supplier Name *
              <input name="name" value={form.name} onChange={handleFieldChange} required placeholder="Enter supplier or company name" />
            </label>

            <label>
              Contact Person *
              <input name="contact" value={form.contact} onChange={handleFieldChange} required placeholder="Enter contact person's name" />
            </label>

            <label>
              Phone Number *
              <input name="phone" value={form.phone} onChange={handleFieldChange} required placeholder="+91 XXXXX XXXXX" />
            </label>

            <label>
              Email Address
              <input name="email" type="email" value={form.email} onChange={handleFieldChange} placeholder="supplier@example.com" />
            </label>

            <label>
              Product Category
              <select name="category" value={form.category} onChange={handleFieldChange}>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>

            <label>
              Supplier Location
              <input name="location" value={form.location} onChange={handleFieldChange} placeholder="Area, town or city" />
            </label>

            <label>
              Credit Limit (₹)
              <input name="credit" type="number" min="0" value={form.credit} onChange={handleFieldChange} />
            </label>

            <div className="supplier-modal-actions">
              <button type="button" className="supplier-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="supplier-primary">
                {editingId ? "Save Changes" : "Add Supplier"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
