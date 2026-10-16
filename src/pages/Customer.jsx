
import React, { useMemo, useState } from "react";
import "./Customer.css";
import BackToDashboard from "../components/BackToDashboard";

const initialCustomers = [
  { id: "CUS-001", name: "Suresh Babu", phone: "+91 99887 66554", email: "suresh@gmail.com", location: "Nellore", orders: 28, spent: 12450, lastOrder: "14 Oct 2026", status: "Active" },
  { id: "CUS-002", name: "Priya Sharma", phone: "+91 91234 56789", email: "priya@gmail.com", location: "Nellore", orders: 18, spent: 8320, lastOrder: "13 Oct 2026", status: "Active" },
  { id: "CUS-003", name: "Ravi Kumar", phone: "+91 98765 43210", email: "ravi@gmail.com", location: "Vedayapalem", orders: 15, spent: 6540, lastOrder: "12 Oct 2026", status: "Active" },
  { id: "CUS-004", name: "Anjali Reddy", phone: "+91 78965 43211", email: "anjali@gmail.com", location: "Stonehousepet", orders: 12, spent: 4230, lastOrder: "10 Oct 2026", status: "Active" },
  { id: "CUS-005", name: "Mohammad Ali", phone: "+91 93456 78901", email: "mohammad@gmail.com", location: "Nellore", orders: 10, spent: 3980, lastOrder: "09 Oct 2026", status: "Active" },
  { id: "CUS-006", name: "Lakshmi Devi", phone: "+91 91122 33445", email: "lakshmi@gmail.com", location: "Magunta Layout", orders: 8, spent: 2760, lastOrder: "08 Oct 2026", status: "Inactive" },
  { id: "CUS-007", name: "Vijay Prasad", phone: "+91 90011 22334", email: "vijay@gmail.com", location: "Nellore", orders: 8, spent: 2450, lastOrder: "07 Oct 2026", status: "Active" },
  { id: "CUS-008", name: "Neha Rani", phone: "+91 98777 66543", email: "neha@gmail.com", location: "Dargamitta", orders: 6, spent: 1980, lastOrder: "06 Oct 2026", status: "Active" },
];

const formatMoney = value =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const emptyCustomer = {
  name: "",
  phone: "",
  email: "",
  location: "",
};

function Customer() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [selected, setSelected] = useState(initialCustomers[0]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCustomer);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const pageSize = 8;

  const filtered = useMemo(() => {
    return customers.filter(customer => {
      const term = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(term) ||
        customer.phone.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Repeat"
          ? customer.orders > 1
          : statusFilter === "New"
            ? customer.orders <= 2
            : customer.status === statusFilter);

      const matchesLocation =
        locationFilter === "All Locations" ||
        customer.location === locationFilter;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [customers, search, statusFilter, locationFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleCustomers = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalSpent = customers.reduce((sum, c) => sum + c.spent, 0);
  const repeatCount = customers.filter(c => c.orders > 1).length;
  const activeCount = customers.filter(c => c.status === "Active").length;
  const newCount = customers.filter(c => c.orders <= 2).length;

  const locations = [...new Set(customers.map(c => c.location))];

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyCustomer);
    setShowForm(true);
  }

  function openEditForm(customer) {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      location: customer.location,
    });
    setShowForm(true);
  }

  function saveCustomer(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setNotice("Customer name and phone number are required.");
      return;
    }

    if (editingId) {
      const updated = { ...customers.find(c => c.id === editingId), ...form };
      setCustomers(prev =>
        prev.map(c => c.id === editingId ? updated : c)
      );
      setSelected(updated);
      setNotice("Customer updated successfully.");
    } else {
      const newCustomer = {
        ...form,
        id: `CUS-${String(Date.now()).slice(-6)}`,
        orders: 0,
        spent: 0,
        lastOrder: "No orders yet",
        status: "Active",
      };
      setCustomers(prev => [newCustomer, ...prev]);
      setSelected(newCustomer);
      setPage(1);
      setNotice("Customer added successfully.");
    }

    setShowForm(false);
  }

  function deleteCustomer() {
    if (!selected) return;

    setCustomers(prev => prev.filter(c => c.id !== selected.id));
    setSelected(null);
    setConfirmDelete(false);
    setNotice("Customer deleted.");
  }

  function selectFilter(filter) {
    setStatusFilter(filter);
    setPage(1);
  }

  function exportCustomers() {
    const headers = ["ID", "Name", "Phone", "Email", "Location", "Orders", "Total Spent", "Status"];
    const rows = filtered.map(c => [
      c.id, c.name, c.phone, c.email, c.location, c.orders, c.spent, c.status,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(value =>
        `"${String(value ?? "").replace(/"/g, '""')}"`
      ).join(","))
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "zosto-customers.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Customer list exported.");
  }

  function changePage(nextPage) {
    setPage(Math.max(1, Math.min(totalPages, nextPage)));
  }

  const topCustomer = customers.length
    ? [...customers].sort((a, b) => b.spent - a.spent)[0]
    : null;

  return (
    <div className="customer-page">
      <header className="customer-header">
        <div className="customer-title">
          <div className="customer-title-icon">♟</div>
          <div>
            <h1>Customers</h1>
            <p>Manage your customers, view purchase history and build stronger relationships.</p>
          </div>
        </div>

        <div className="customer-header-actions">
          <span className="customer-date">▦ &nbsp; Mon, 15 Oct 2026 &nbsp;⌄</span>
          <button className="customer-primary" onClick={openAddForm}>
            + &nbsp; Add Customer
          </button>
        </div>
      </header>

      {notice && (
        <div className="customer-notice" role="status">
          {notice}
          <button onClick={() => setNotice("")}>✕</button>
        </div>
      )}

      <section className="customer-stats">
        <div className="customer-stat stat-blue">
          <div className="stat-icon">♟</div>
          <div>
            <p>Total Customers</p>
            <h2>{245 + customers.length - initialCustomers.length} <small>↑ 12%</small></h2>
            <span>vs last month</span>
          </div>
        </div>

        <div className="customer-stat stat-green">
          <div className="stat-icon">♙</div>
          <div>
            <p>Active Customers</p>
            <h2>{activeCount} <small>↑ 15%</small></h2>
            <span>purchased in last 30 days</span>
          </div>
        </div>

        <div className="customer-stat stat-orange">
          <div className="stat-icon">★</div>
          <div>
            <p>New Customers</p>
            <h2>{newCount} <small>↑ 40%</small></h2>
            <span>joined this month</span>
          </div>
        </div>

        <div className="customer-stat stat-pink">
          <div className="stat-icon">🛒</div>
          <div>
            <p>Repeat Customers</p>
            <h2>{repeatCount} <small>↑ 18%</small></h2>
            <span>purchased more than once</span>
          </div>
        </div>

        <div className="customer-stat stat-purple">
          <div className="stat-icon">♛</div>
          <div>
            <p>Top Customer</p>
            <h2 className="top-customer-name">
              {topCustomer?.name || "No customers"}
            </h2>
            <span>{formatMoney(topCustomer?.spent || 0)} total purchases</span>
          </div>
        </div>
      </section>

      <section className="customer-toolbar">
        <div className="customer-filters">
          {[
            ["All", "♟", "All Customers"],
            ["Active", "●", "Active"],
            ["New", "★", "New"],
            ["Repeat", "⟳", "Repeat"],
            ["Inactive", "●", "Inactive"],
          ].map(([value, icon, label]) => (
            <button
              key={value}
              className={`customer-filter ${statusFilter === value ? "selected" : ""}`}
              onClick={() => selectFilter(value)}
            >
              <span>{icon}</span> {label}
              {value === "All" ? ` (${245 + customers.length - initialCustomers.length})` : ""}
            </button>
          ))}
        </div>

        <div className="customer-search">
          <span>⌕</span>
          <input
            aria-label="Search customers"
            placeholder="Search by name, phone number or email..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="customer-location"
          value={locationFilter}
          onChange={e => {
            setLocationFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by location"
        >
          <option>All Locations</option>
          {locations.map(location => (
            <option key={location}>{location}</option>
          ))}
        </select>

        <button className="customer-export" onClick={exportCustomers}>
          ↓ &nbsp; Export
        </button>
      </section>

      <section className="customer-content">
        <div className="customer-table-card">
          <div className="customer-table-wrap">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Total Orders</th>
                  <th>Total Spend</th>
                  <th>Last Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleCustomers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className={selected?.id === customer.id ? "customer-selected-row" : ""}
                  >
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>
                      <div className="customer-name-cell">
                        <div className="customer-avatar">
                          {customer.name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <strong>{customer.name}</strong>
                        {customer.id === topCustomer?.id && <span className="crown">♛</span>}
                      </div>
                    </td>
                    <td>{customer.phone}</td>
                    <td>{customer.email || "—"}</td>
                    <td>{customer.orders}</td>
                    <td><strong>{formatMoney(customer.spent)}</strong></td>
                    <td>{customer.lastOrder}</td>
                    <td>
                      <span className={`customer-status ${customer.status.toLowerCase()}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td>
                      <div className="customer-row-actions">
                        <button title="View details" onClick={() => { setSelected(customer); setConfirmDelete(false); }}>◉</button>
                        <button title="Edit customer" onClick={() => openEditForm(customer)}>✎</button>
                        <button title="Delete customer" onClick={() => { setSelected(customer); setConfirmDelete(true); }}>⋮</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleCustomers.length === 0 && (
                  <tr>
                    <td colSpan="9" className="customer-empty">
                      No customers found. Try another search or add a customer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="customer-pagination">
            <span>
              Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}
              {" – "}
              {Math.min(currentPage * pageSize, filtered.length)}
              {" of "}{filtered.length} customers
            </span>

            <div className="customer-page-buttons">
              <button disabled={currentPage === 1} onClick={() => changePage(1)}>«</button>
              <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                .map(number => (
                  <button
                    key={number}
                    className={currentPage === number ? "active" : ""}
                    onClick={() => changePage(number)}
                  >
                    {number}
                  </button>
                ))}
              <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>›</button>
              <button disabled={currentPage === totalPages} onClick={() => changePage(totalPages)}>»</button>
            </div>
          </footer>
        </div>

        {selected && (
          <aside className="customer-details">
            <div className="customer-details-heading">
              <h3>Customer Details</h3>
              <button onClick={() => { setSelected(null); setConfirmDelete(false); }}>✕</button>
            </div>

            <div className="customer-detail-profile">
              <div className="customer-avatar large">
                {selected.name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div>
                <h3>{selected.name}</h3>
                <span className="customer-top-badge">
                  {selected.id === topCustomer?.id ? "♛ Top Customer" : selected.status}
                </span>
              </div>
              <span className={`customer-status ${selected.status.toLowerCase()}`}>
                {selected.status}
              </span>
            </div>

            <div className="customer-contact">
              <p>☎ &nbsp; {selected.phone}</p>
              <p>✉ &nbsp; {selected.email || "No email provided"}</p>
              <p>♦ &nbsp; {selected.location || "Location not provided"}</p>
              <p>▦ &nbsp; Customer ID: {selected.id}</p>
              <p>▦ &nbsp; Last order: {selected.lastOrder}</p>
            </div>

            <div className="customer-detail-stats">
              <div>
                <span>Total Orders</span>
                <strong>{selected.orders}</strong>
              </div>
              <div>
                <span>Total Spend</span>
                <strong>{formatMoney(selected.spent)}</strong>
              </div>
              <div>
                <span>Last Order</span>
                <strong className="detail-date">{selected.lastOrder}</strong>
              </div>
              <div>
                <span>Avg. Order Value</span>
                <strong>{formatMoney(selected.orders ? selected.spent / selected.orders : 0)}</strong>
              </div>
            </div>

            <div className="customer-recent-orders">
              <h4>Recent Orders <span>→</span></h4>
              {selected.orders > 0 ? (
                <>
                  <div><span>{selected.lastOrder}</span><strong>{formatMoney(selected.spent * 0.15)}</strong><em>Delivered</em></div>
                  <div><span>Previous order</span><strong>{formatMoney(selected.spent * 0.1)}</strong><em>Delivered</em></div>
                  <div><span>Earlier order</span><strong>{formatMoney(selected.spent * 0.08)}</strong><em>Delivered</em></div>
                </>
              ) : (
                <p>No orders placed yet.</p>
              )}
            </div>

            {confirmDelete && (
              <div className="customer-delete-confirm">
                <p>Delete {selected.name} from your customer list?</p>
                <button onClick={() => setConfirmDelete(false)}>Cancel</button>
                <button onClick={deleteCustomer}>Confirm Delete</button>
              </div>
            )}

            <div className="customer-detail-actions">
              <button className="customer-primary" onClick={() => setNotice(`Showing orders for ${selected.name}. Connect your Orders page to display actual records.`)}>
                ▤ &nbsp; View Orders
              </button>
              <button className="customer-outline" onClick={() => openEditForm(selected)}>
                ✎ &nbsp; Edit
              </button>
              <button className="customer-danger" onClick={() => setConfirmDelete(true)}>
                ♜ &nbsp; Delete
              </button>
            </div>
          </aside>
        )}
      </section>

      {showForm && (
        <div className="customer-modal-overlay" onClick={() => setShowForm(false)}>
          <form
            className="customer-modal"
            onSubmit={saveCustomer}
            onClick={e => e.stopPropagation()}
          >
            <div className="customer-modal-heading">
              <h2>{editingId ? "Edit Customer" : "Add New Customer"}</h2>
              <button type="button" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <label>
              Customer Name *
              <input name="name" value={form.name} onChange={updateField} required placeholder="Enter full name" />
            </label>

            <label>
              Phone Number *
              <input name="phone" value={form.phone} onChange={updateField} required placeholder="+91 XXXXX XXXXX" />
            </label>

            <label>
              Email Address
              <input name="email" type="email" value={form.email} onChange={updateField} placeholder="customer@example.com" />
            </label>

            <label>
              Location
              <input name="location" value={form.location} onChange={updateField} placeholder="Area or town" />
            </label>

            <div className="customer-modal-actions">
              <button type="button" className="customer-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="customer-primary">{editingId ? "Save Changes" : "Add Customer"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Customer;
