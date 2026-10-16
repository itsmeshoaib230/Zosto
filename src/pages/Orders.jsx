
import React, { useMemo, useState } from "react";
import "./Orders.css";

const initialOrders = [
  {
    id: "ORD-2026-045",
    date: "2026-10-15",
    time: "10:30 AM",
    customer: "Ravi Kumar",
    phone: "+91 98765 43210",
    address: "Main Road, Nellore, AP",
    items: [
      { name: "Milk Packet (1L)", emoji: "🥛", qty: 2, price: 60 },
      { name: "Bread (400g)", emoji: "🍞", qty: 1, price: 35 },
      { name: "Potato Chips", emoji: "🍟", qty: 2, price: 20 },
      { name: "Soft Drink (500ml)", emoji: "🥤", qty: 1, price: 40 },
    ],
    total: 540,
    payment: "UPI",
    status: "Processing",
    delivery: "Home Delivery",
  },
  {
    id: "ORD-2026-044",
    date: "2026-10-14",
    time: "04:15 PM",
    customer: "Priya Sharma",
    phone: "+91 91234 56789",
    address: "Dargamitta, Nellore, AP",
    items: [
      { name: "Banana (1kg)", emoji: "🍌", qty: 1, price: 50 },
      { name: "Apple (1kg)", emoji: "🍎", qty: 1, price: 140 },
      { name: "Biscuits", emoji: "🍪", qty: 1, price: 30 },
    ],
    total: 320,
    payment: "Card",
    status: "Out for Delivery",
    delivery: "Home Delivery",
  },
  {
    id: "ORD-2026-043",
    date: "2026-10-14",
    time: "11:20 AM",
    customer: "Suresh Babu",
    phone: "+91 99887 66554",
    address: "Main Road, Nellore, AP",
    items: [
      { name: "Potato Chips", emoji: "🍟", qty: 2, price: 20 },
      { name: "Juice", emoji: "🧃", qty: 1, price: 45 },
      { name: "Soft Drink", emoji: "🥤", qty: 1, price: 40 },
    ],
    total: 1250,
    payment: "COD",
    status: "Delivered",
    delivery: "Home Delivery",
  },
  {
    id: "ORD-2026-042",
    date: "2026-10-13",
    time: "02:45 PM",
    customer: "Anjali Reddy",
    phone: "+91 78965 43211",
    address: "Buchireddypalem, Nellore, AP",
    items: [
      { name: "Cooking Oil", emoji: "🫒", qty: 1, price: 180 },
      { name: "Flour", emoji: "🌾", qty: 1, price: 30 },
    ],
    total: 210,
    payment: "UPI",
    status: "Cancelled",
    delivery: "Home Delivery",
  },
  {
    id: "ORD-2026-041",
    date: "2026-10-12",
    time: "09:10 AM",
    customer: "Mohammad Ali",
    phone: "+91 93456 78901",
    address: "Stonehousepet, Nellore, AP",
    items: [
      { name: "Milk Packet", emoji: "🥛", qty: 1, price: 30 },
      { name: "Juice", emoji: "🧃", qty: 2, price: 45 },
    ],
    total: 980,
    payment: "Card",
    status: "Delivered",
    delivery: "Store Pickup",
  },
  {
    id: "ORD-2026-040",
    date: "2026-10-11",
    time: "03:30 PM",
    customer: "Lakshmi Devi",
    phone: "+91 91122 33445",
    address: "Vedayapalem, Nellore, AP",
    items: [
      { name: "Apple", emoji: "🍎", qty: 1, price: 140 },
      { name: "Banana", emoji: "🍌", qty: 2, price: 50 },
    ],
    total: 430,
    payment: "COD",
    status: "Processing",
    delivery: "Home Delivery",
  },
  {
    id: "ORD-2026-039",
    date: "2026-10-10",
    time: "01:05 PM",
    customer: "Vijay Prasad",
    phone: "+91 90011 22334",
    address: "Magunta Layout, Nellore, AP",
    items: [
      { name: "Juice", emoji: "🧃", qty: 1, price: 40 },
      { name: "Chips", emoji: "🍟", qty: 1, price: 30 },
    ],
    total: 150,
    payment: "UPI",
    status: "Delivered",
    delivery: "Store Pickup",
  },
  {
    id: "ORD-2026-038",
    date: "2026-10-09",
    time: "06:25 PM",
    customer: "Neha Rani",
    phone: "+91 98777 66543",
    address: "Trunk Road, Nellore, AP",
    items: [
      { name: "Potato Chips", emoji: "🍟", qty: 2, price: 20 },
      { name: "Biscuits", emoji: "🍪", qty: 2, price: 30 },
    ],
    total: 620,
    payment: "Card",
    status: "Out for Delivery",
    delivery: "Home Delivery",
  },
];

const statuses = [
  "All Orders",
  "Processing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const emptyOrder = {
  customer: "",
  phone: "",
  address: "",
  product: "",
  quantity: "1",
  price: "",
  payment: "UPI",
  delivery: "Home Delivery",
};

function getStatusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-");
}

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeStatus, setActiveStatus] = useState("All Orders");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(
    initialOrders[2].id
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyOrder);

  const pageSize = 8;

  const selectedOrder = orders.find(
    (order) => order.id === selectedOrderId
  );

  const summary = useMemo(() => {
    return {
      total: orders.length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
      processing: orders.filter((o) => o.status === "Processing").length,
      pending: orders.filter((o) => o.status === "Out for Delivery").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        activeStatus === "All Orders" ||
        order.status === activeStatus;

      const matchesSearch = [
        order.id,
        order.customer,
        order.phone,
      ].some((value) => value.toLowerCase().includes(term));

      const matchesDate =
        dateFilter === "All Dates" ||
        (dateFilter === "Last 7 Days" &&
          (new Date(`${order.date}T00:00:00`).getTime() -
            (Date.now() - 7 * 86400000) >= 0));

      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [orders, activeStatus, search, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / pageSize)
  );

  const visibleOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const updateForm = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const changeStatus = (orderId, nextStatus) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? { ...order, status: nextStatus }
          : order
      )
    );
  };

  const createOrder = (event) => {
    event.preventDefault();

    const quantity = Number(form.quantity);
    const price = Number(form.price);

    if (
      !form.customer.trim() ||
      !form.phone.trim() ||
      !form.product.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      alert("Please enter valid customer, product, quantity, and price.");
      return;
    }

    const now = new Date();
    const date = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    const id = `ORD-${now.getFullYear()}-${String(
      Date.now()
    ).slice(-5)}`;

    const newOrder = {
      id,
      date,
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      customer: form.customer.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || "Address not provided",
      items: [
        {
          name: form.product.trim(),
          emoji: "📦",
          qty: quantity,
          price,
        },
      ],
      total: quantity * price,
      payment: form.payment,
      status: "Processing",
      delivery: form.delivery,
    };

    setOrders((previous) => [newOrder, ...previous]);
    setSelectedOrderId(id);
    setActiveStatus("All Orders");
    setSearch("");
    setDateFilter("All Dates");
    setPage(1);
    setForm(emptyOrder);
    setShowForm(false);
  };

  const printInvoice = (order) => {
    if (!order) return;

    const invoiceWindow = window.open("", "_blank");

    if (!invoiceWindow) {
      alert("Please allow pop-ups to print the invoice.");
      return;
    }

    const itemRows = order.items
      .map(
        (item) => `
          <tr>
            <td>${item.name.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</td>
            <td>${item.qty}</td>
            <td>${money(item.price)}</td>
            <td>${money(item.qty * item.price)}</td>
          </tr>
        `
      )
      .join("");

    invoiceWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 35px; color: #172b45; }
          h1 { margin-bottom: 5px; }
          p { color: #52657c; }
          table { width: 100%; border-collapse: collapse; margin-top: 25px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          .total { margin-top: 25px; text-align: right; font-size: 21px; font-weight: bold; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h1>StockWise</h1>
        <p>Small Business Inventory & Supply</p>
        <hr>
        <h2>Customer Invoice</h2>
        <p>Order ID: ${order.id}</p>
        <p>Date: ${formatDate(order.date)} | ${order.time}</p>
        <p>Customer: ${order.customer.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>
        <p>Phone: ${order.phone.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>
        <p>Address: ${order.address.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>
        <table>
          <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p>Payment: ${order.payment}</p>
        <p>Status: ${order.status}</p>
        <div class="total">Total: ${money(order.total)}</div>
        <p>Thank you for shopping with us!</p>
        <button onclick="window.print()">Print Invoice</button>
      </body>
      </html>
    `);

    invoiceWindow.document.close();
  };

  return (
    <main className="orders-page">
      <header className="orders-header">
        <div className="orders-heading">
          <div className="orders-heading-icon">🛒</div>
          <div>
            <h1>Orders</h1>
            <p>
              Manage customer orders, track status and fulfill them on time.
            </p>
          </div>
        </div>

        <div className="orders-header-actions">
          <div className="orders-date-label">
            <span>▦</span>
            {formatDate(new Date().toLocaleDateString("en-CA"))}
          </div>

          <button
            type="button"
            className="orders-primary-button"
            onClick={() => setShowForm((previous) => !previous)}
          >
            + New Order
          </button>
        </div>
      </header>

      <section className="orders-summary">
        <article className="orders-stat orders-stat-blue">
          <div className="orders-stat-icon">🛒</div>
          <div>
            <p>Total Orders</p>
            <h2>{summary.total}</h2>
            <span>All recorded orders</span>
          </div>
        </article>

        <article className="orders-stat orders-stat-green">
          <div className="orders-stat-icon">📦</div>
          <div>
            <p>Delivered</p>
            <h2>{summary.delivered}</h2>
            <span>Orders completed</span>
          </div>
        </article>

        <article className="orders-stat orders-stat-orange">
          <div className="orders-stat-icon">◷</div>
          <div>
            <p>Processing</p>
            <h2>{summary.processing}</h2>
            <span>Orders in progress</span>
          </div>
        </article>

        <article className="orders-stat orders-stat-red">
          <div className="orders-stat-icon">🚚</div>
          <div>
            <p>Pending</p>
            <h2>{summary.pending}</h2>
            <span>Out for delivery</span>
          </div>
        </article>

        <article className="orders-stat orders-stat-purple">
          <div className="orders-stat-icon">✕</div>
          <div>
            <p>Cancelled</p>
            <h2>{summary.cancelled}</h2>
            <span>Orders cancelled</span>
          </div>
        </article>
      </section>

      {showForm && (
        <form className="orders-form" onSubmit={createOrder}>
          <h2>Create New Order</h2>

          <div className="orders-form-grid">
            <label>
              Customer Name
              <input
                value={form.customer}
                onChange={(e) => updateForm("customer", e.target.value)}
                required
              />
            </label>

            <label>
              Phone Number
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                required
              />
            </label>

            <label>
              Product
              <input
                value={form.product}
                onChange={(e) => updateForm("product", e.target.value)}
                required
              />
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
              Unit Price (₹)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => updateForm("price", e.target.value)}
                required
              />
            </label>

            <label>
              Payment
              <select
                value={form.payment}
                onChange={(e) => updateForm("payment", e.target.value)}
              >
                <option>UPI</option>
                <option>Card</option>
                <option>COD</option>
                <option>Cash</option>
              </select>
            </label>

            <label>
              Fulfilment
              <select
                value={form.delivery}
                onChange={(e) => updateForm("delivery", e.target.value)}
              >
                <option>Home Delivery</option>
                <option>Store Pickup</option>
              </select>
            </label>

            <label className="orders-address-field">
              Delivery Address
              <input
                value={form.address}
                onChange={(e) => updateForm("address", e.target.value)}
                placeholder="Customer address"
              />
            </label>
          </div>

          <div className="orders-form-actions">
            <button
              type="button"
              className="orders-cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="orders-primary-button">
              Create Order
            </button>
          </div>
        </form>
      )}

      <section className="orders-toolbar">
        <div className="orders-status-tabs">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              className={
                activeStatus === status ? "orders-tab active" : "orders-tab"
              }
              onClick={() => {
                setActiveStatus(status);
                setPage(1);
              }}
            >
              {status}
              <span>
                {status === "All Orders"
                  ? summary.total
                  : orders.filter((o) => o.status === status).length}
              </span>
            </button>
          ))}
        </div>

        <label className="orders-search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search order ID, customer name or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </label>

        <select
          className="orders-date-filter"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter orders by date"
        >
          <option>All Dates</option>
          <option>Last 7 Days</option>
        </select>
      </section>

      <div className="orders-content">
        <section className="orders-table-card">
          <div className="orders-table-scroll">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date &amp; Time</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={
                      selectedOrderId === order.id ? "selected-order-row" : ""
                    }
                  >
                    <td>{order.id}</td>

                    <td>
                      <div className="orders-date-cell">
                        <strong>{formatDate(order.date)}</strong>
                        <span>{order.time}</span>
                      </div>
                    </td>

                    <td>
                      <div className="orders-customer-cell">
                        <strong>{order.customer}</strong>
                        <span>{order.phone}</span>
                      </div>
                    </td>

                    <td>
                      <div className="orders-item-icons">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={`${item.name}-${index}`}>
                            {item.emoji}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="orders-more-items">
                            +{order.items.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="orders-amount">{money(order.total)}</td>

                    <td>
                      <span
                        className={`orders-payment ${order.payment.toLowerCase()}`}
                      >
                        {order.payment}
                      </span>
                    </td>

                    <td>
                      <select
                        aria-label={`Update status for ${order.id}`}
                        className={`orders-status-select ${getStatusClass(
                          order.status
                        )}`}
                        value={order.status}
                        onChange={(e) =>
                          changeStatus(order.id, e.target.value)
                        }
                      >
                        <option>Processing</option>
                        <option>Out for Delivery</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>

                    <td>
                      <span
                        className={`orders-delivery ${order.delivery
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {order.delivery === "Home Delivery" ? "🚚" : "⌂"}
                        {" "}{order.delivery}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="orders-view-button"
                        aria-label={`View ${order.id}`}
                        title="View order details"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        ◉
                      </button>
                    </td>
                  </tr>
                ))}

                {visibleOrders.length === 0 && (
                  <tr>
                    <td colSpan="9" className="orders-empty">
                      No orders found. Try another search or status filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="orders-pagination">
            <span>
              Showing{" "}
              {filteredOrders.length === 0
                ? 0
                : (page - 1) * pageSize + 1}
              {" – "}
              {Math.min(page * pageSize, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </span>

            <div className="orders-page-buttons">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                «
              </button>
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
              >
                »
              </button>
            </div>
          </footer>
        </section>

        <aside className="orders-details-panel">
          {selectedOrder ? (
            <>
              <header className="orders-details-header">
                <h2>Order Details</h2>
                <button
                  type="button"
                  onClick={() => setSelectedOrderId(null)}
                  aria-label="Close order details"
                >
                  ×
                </button>
              </header>

              <div className="orders-detail-id">
                <strong>{selectedOrder.id}</strong>
                <span
                  className={`orders-status-badge ${getStatusClass(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              <p className="orders-detail-date">
                {formatDate(selectedOrder.date)}, {selectedOrder.time}
              </p>

              <div className="orders-customer-info">
                <h3>♟ Customer Information</h3>
                <p>👤 {selectedOrder.customer}</p>
                <p>☎ {selectedOrder.phone}</p>
                <p>📍 {selectedOrder.address}</p>
              </div>

              <div className="orders-detail-items">
                <h3>📦 Items ({selectedOrder.items.length})</h3>

                {selectedOrder.items.map((item, index) => (
                  <div
                    className="orders-detail-item"
                    key={`${item.name}-${index}`}
                  >
                    <span className="orders-detail-emoji">{item.emoji}</span>
                    <div className="orders-detail-item-name">
                      <strong>{item.name}</strong>
                      <span>Qty: {item.qty}</span>
                    </div>
                    <span className="orders-detail-item-price">
                      {money(item.qty * item.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="orders-totals">
                <div>
                  <span>Subtotal</span>
                  <span>{money(selectedOrder.total)}</span>
                </div>
                <div>
                  <span>Delivery Charge</span>
                  <span>{money(0)}</span>
                </div>
                <div className="orders-grand-total">
                  <strong>Total Amount</strong>
                  <strong>{money(selectedOrder.total)}</strong>
                </div>
              </div>

              <button
                type="button"
                className="orders-print-button"
                onClick={() => printInvoice(selectedOrder)}
              >
                ▣ Print Invoice
              </button>
            </>
          ) : (
            <div className="orders-no-selection">
              <span>📋</span>
              <h3>Select an Order</h3>
              <p>Choose an order from the table to see its details.</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
