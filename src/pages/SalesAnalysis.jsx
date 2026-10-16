
import React, { useMemo, useState } from "react";
import "./SalesAnalysis.css";

const salesTrend = [
  800, 1300, 950, 1550, 1320, 1720, 2080, 2450,
  2010, 2260, 2380, 1690, 2240, 1900, 2620, 2340,
];

const categories = [
  { name: "Dairy", amount: 8540, percent: 30, color: "#3787f8" },
  { name: "Snacks", amount: 6080, percent: 21, color: "#8755ec" },
  { name: "Beverages", amount: 4270, percent: 15, color: "#fa536a" },
  { name: "Fruits & Vegetables", amount: 3980, percent: 14, color: "#10b981" },
  { name: "Bakery", amount: 2850, percent: 10, color: "#ffa51f" },
  { name: "Others", amount: 2730, percent: 10, color: "#aebbd0" },
];

const paymentMethods = [
  { name: "UPI", amount: 12350, percent: 43, color: "#8755ec" },
  { name: "Card", amount: 8540, percent: 30, color: "#2782f6" },
  { name: "Cash", amount: 5980, percent: 21, color: "#10b981" },
  { name: "COD", amount: 1580, percent: 6, color: "#ffa51f" },
];

const products = [
  { name: "Milk Packet (1L)", emoji: "🥛", units: 320, percent: 24, category: "Dairy" },
  { name: "Bread (400g)", emoji: "🍞", units: 240, percent: 18, category: "Bakery" },
  { name: "Potato Chips", emoji: "🍟", units: 180, percent: 13, category: "Snacks" },
  { name: "Soft Drink (500ml)", emoji: "🥤", units: 160, percent: 12, category: "Beverages" },
  { name: "Yogurt (500g)", emoji: "🥣", units: 140, percent: 10, category: "Dairy" },
];

const initialTransactions = [
  { id: "SAL-101", date: "15 Oct 2026", time: "10:30 AM", product: "Milk Packet (1L)", emoji: "🥛", category: "Dairy", qty: 2, price: 60, payment: "UPI" },
  { id: "SAL-102", date: "15 Oct 2026", time: "09:15 AM", product: "Banana (1kg)", emoji: "🍌", category: "Fruits", qty: 1, price: 40, payment: "Cash" },
  { id: "SAL-103", date: "14 Oct 2026", time: "06:20 PM", product: "Potato Chips", emoji: "🍟", category: "Snacks", qty: 3, price: 20, payment: "Card" },
  { id: "SAL-104", date: "14 Oct 2026", time: "05:10 PM", product: "Bread (400g)", emoji: "🍞", category: "Bakery", qty: 1, price: 35, payment: "UPI" },
  { id: "SAL-105", date: "14 Oct 2026", time: "02:45 PM", product: "Soft Drink (500ml)", emoji: "🥤", category: "Beverages", qty: 2, price: 40, payment: "Cash" },
  { id: "SAL-106", date: "13 Oct 2026", time: "11:20 AM", product: "Yogurt (500g)", emoji: "🥣", category: "Dairy", qty: 2, price: 35, payment: "COD" },
  { id: "SAL-107", date: "12 Oct 2026", time: "04:30 PM", product: "Apple (1kg)", emoji: "🍎", category: "Fruits", qty: 1, price: 140, payment: "UPI" },
];

const formatMoney = (value) =>
  "₹" + Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

function getPeriodData(period) {
  if (period === "7D") {
    return {
      sales: 7450,
      orders: 36,
      average: 207,
      units: 358,
      margin: 21,
      trend: [650, 900, 720, 1300, 1050, 1450, 1380],
      labels: ["9 Oct", "10 Oct", "11 Oct", "12 Oct", "13 Oct", "14 Oct", "15 Oct"],
    };
  }

  if (period === "3M") {
    return {
      sales: 84200,
      orders: 365,
      average: 231,
      units: 3860,
      margin: 23,
      trend: [24000, 26500, 23800, 29500, 32000, 28400, 35000, 39000, 36000, 42000, 45000, 48000],
      labels: ["Jul", "Aug", "Sep", "Oct"],
    };
  }

  if (period === "1Y") {
    return {
      sales: 425600,
      orders: 1820,
      average: 234,
      units: 18950,
      margin: 24,
      trend: [18000, 22000, 25000, 23000, 31000, 35000, 32000, 38000, 41000, 45000, 49000, 56000],
      labels: ["Nov", "Jan", "Mar", "May", "Jul", "Sep", "Oct"],
    };
  }

  return {
    sales: 28450,
    orders: 120,
    average: 237,
    units: 1342,
    margin: 22,
    trend: salesTrend,
    labels: ["1 Oct", "3 Oct", "5 Oct", "7 Oct", "9 Oct", "11 Oct", "13 Oct", "15 Oct"],
  };
}

function TrendChart({ data, labels }) {
  const width = 560;
  const height = 220;
  const left = 35;
  const right = 12;
  const top = 12;
  const bottom = 32;
  const max = Math.ceil(Math.max(...data) / 1000) * 1000 || 1000;

  const points = data.map((value, index) => ({
    x: left + (index / Math.max(data.length - 1, 1)) * (width - left - right),
    y: top + (1 - value / max) * (height - top - bottom),
    value,
  }));

  const line = points.map((point, index) =>
    `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
  ).join(" ");

  const area = `${line} L ${points[points.length - 1].x} ${height - bottom} L ${points[0].x} ${height - bottom} Z`;

  return (
    <div className="sa-chart-wrap">
      <svg
        className="sa-trend-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Sales trend line chart"
      >
        <defs>
          <linearGradient id="saAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2782f6" stopOpacity=".25" />
            <stop offset="100%" stopColor="#2782f6" stopOpacity=".02" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4].map((tick) => {
          const y = top + (tick / 4) * (height - top - bottom);
          return (
            <g key={tick}>
              <line
                x1={left}
                x2={width - right}
                y1={y}
                y2={y}
                stroke="#e7edf5"
                strokeDasharray="3 4"
              />
              <text
                x={left - 7}
                y={y + 4}
                fontSize="12"
                textAnchor="end"
                fill="#74869f"
              >
                {Math.round(max * (1 - tick / 4) / 1000)}K
              </text>
            </g>
          );
        })}

        {points.map((point, index) => (
          <line
            key={index}
            x1={point.x}
            x2={point.x}
            y1={top}
            y2={height - bottom}
            stroke="#edf1f7"
          />
        ))}

        <path d={area} fill="url(#saAreaFill)" />
        <path
          d={line}
          fill="none"
          stroke="#1678f9"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3.3"
            fill="#1678f9"
            stroke="white"
            strokeWidth="1"
          >
            <title>{`${labels[index] || `Day ${index + 1}`}: ${formatMoney(point.value)}`}</title>
          </circle>
        ))}

        {(labels.length === 8
          ? points.filter((_, i) => i % 2 === 0 || i === points.length - 1)
          : points.filter((_, i) => i % Math.max(1, Math.ceil(points.length / labels.length)) === 0)
        ).map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={height - 9}
            fontSize="11"
            textAnchor="middle"
            fill="#74869f"
          >
            {labels[index] || ""}
          </text>
        ))}
      </svg>
    </div>
  );
}

function DonutChart({ items, totalLabel }) {
  let current = 0;
  const gradient = items.map((item) => {
    const start = current;
    current += item.percent;
    return `${item.color} ${start}% ${current}%`;
  }).join(", ");

  return (
    <div
      className="sa-donut"
      style={{ background: `conic-gradient(${gradient})` }}
      role="img"
      aria-label={`${totalLabel} category breakdown`}
    >
      <div className="sa-donut-hole">
        <strong>{totalLabel}</strong>
        <span>Total Sales</span>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, change, color }) {
  return (
    <article className={`sa-metric ${color}`}>
      <div className="sa-metric-icon">{icon}</div>
      <div className="sa-metric-info">
        <p>{title}</p>
        <div className="sa-metric-value">
          <strong>{value}</strong>
          <span>↑ {change}</span>
        </div>
        <small>vs last month</small>
      </div>
    </article>
  );
}

export default function SalesAnalysis() {
  const [period, setPeriod] = useState("30D");
  const [trendMode, setTrendMode] = useState("Daily");
  const [topMode, setTopMode] = useState("Units Sold");
  const [paymentPeriod, setPaymentPeriod] = useState("This Month");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [showAll, setShowAll] = useState(false);

  const periodData = getPeriodData(period);

  const transactions = useMemo(() => {
    return initialTransactions.filter((item) => {
      const matchesSearch = [
        item.product,
        item.category,
        item.payment,
        item.id,
      ].some((value) => value.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        categoryFilter === "All Categories" ||
        item.category === categoryFilter;

      const matchesPayment =
        paymentFilter === "All Payments" ||
        item.payment === paymentFilter;

      return matchesSearch && matchesCategory && matchesPayment;
    });
  }, [search, categoryFilter, paymentFilter]);

  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, 5);

  const sortedProducts = [...products].sort((a, b) =>
    topMode === "Units Sold"
      ? b.units - a.units
      : b.units * (b.percent || 1) - a.units * (a.percent || 1)
  );

  const exportCSV = () => {
    const header = [
      "Transaction ID",
      "Date",
      "Time",
      "Product",
      "Category",
      "Quantity",
      "Unit Price",
      "Total Amount",
      "Payment",
    ];

    const rows = transactions.map((item) => [
      item.id,
      item.date,
      item.time,
      item.product,
      item.category,
      item.qty,
      item.price,
      item.qty * item.price,
      item.payment,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row.map((value) =>
          `"${String(value).replaceAll('"', '""')}"`
        ).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "stockwise-sales-analysis.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="sales-analysis">
      <header className="sa-header">
        <div className="sa-title-group">
          <div className="sa-title-icon">▥</div>
          <div>
            <h1>Sales Analysis</h1>
            <p>
              Track sales performance, identify top products and make better
              business decisions.
            </p>
          </div>
        </div>

        <div className="sa-header-actions">
          <div className="sa-date-display">
            <span>▦</span> 01 Oct 2026 - 15 Oct 2026
          </div>

          <div className="sa-period-switch">
            {["7D", "30D", "3M", "1Y"].map((value) => (
              <button
                key={value}
                type="button"
                className={period === value ? "active" : ""}
                onClick={() => setPeriod(value)}
              >
                {value}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="sa-export-button"
            onClick={exportCSV}
          >
            ↓ Export
          </button>
        </div>
      </header>

      <section className="sa-metrics">
        <MetricCard
          icon="🛒"
          title="Total Sales"
          value={formatMoney(periodData.sales)}
          change="12%"
          color="sa-blue"
        />
        <MetricCard
          icon="⬡"
          title="Total Orders"
          value={periodData.orders.toLocaleString("en-IN")}
          change="8%"
          color="sa-green"
        />
        <MetricCard
          icon="◆"
          title="Average Order Value"
          value={formatMoney(periodData.average)}
          change="5%"
          color="sa-orange"
        />
        <MetricCard
          icon="▥"
          title="Units Sold"
          value={periodData.units.toLocaleString("en-IN")}
          change="15%"
          color="sa-red"
        />
        <MetricCard
          icon="%"
          title="Profit Margin"
          value={`${periodData.margin}%`}
          change="3%"
          color="sa-purple"
        />
      </section>

      <section className="sa-main-grid">
        <article className="sa-panel sa-trend-panel">
          <div className="sa-panel-heading">
            <h2>Sales Trend</h2>
            <select
              value={trendMode}
              onChange={(e) => setTrendMode(e.target.value)}
              aria-label="Sales trend grouping"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          <TrendChart
            data={
              trendMode === "Daily"
                ? periodData.trend
                : trendMode === "Weekly"
                  ? [4200, 5100, 4800, 6500, 5900, 7200, 6800]
                  : [18500, 22000, 19800, 24500, 28450]
            }
            labels={
              trendMode === "Daily"
                ? periodData.labels
                : trendMode === "Weekly"
                  ? ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"]
                  : ["May", "Jun", "Jul", "Aug", "Sep"]
            }
          />
        </article>

        <article className="sa-panel sa-category-panel">
          <div className="sa-panel-heading">
            <h2>Category Wise Sales</h2>
          </div>

          <div className="sa-category-content">
            <DonutChart
              items={categories}
              totalLabel={formatMoney(periodData.sales)}
            />

            <div className="sa-legend">
              {categories.map((item) => (
                <div className="sa-legend-row" key={item.name}>
                  <span
                    className="sa-legend-dot"
                    style={{ background: item.color }}
                  />
                  <span className="sa-legend-name">{item.name}</span>
                  <strong>{formatMoney(item.amount)}</strong>
                  <span className="sa-legend-percent">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="sa-panel sa-top-panel">
          <div className="sa-panel-heading">
            <h2>Top Selling Products</h2>
            <select
              value={topMode}
              onChange={(e) => setTopMode(e.target.value)}
              aria-label="Sort top selling products"
            >
              <option>Units Sold</option>
              <option>Sales Value</option>
            </select>
          </div>

          <div className="sa-top-products">
            {sortedProducts.map((product, index) => (
              <div className="sa-top-product" key={product.name}>
                <span className="sa-rank">{index + 1}</span>
                <span className="sa-product-emoji">{product.emoji}</span>
                <strong className="sa-product-name">{product.name}</strong>
                <span className="sa-units">{product.units} units</span>
                <div className="sa-progress">
                  <span style={{ width: `${product.percent * 3.5}%` }} />
                </div>
                <span className="sa-product-percent">{product.percent}%</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="sa-bottom-grid">
        <article className="sa-panel sa-transactions-panel">
          <div className="sa-panel-heading sa-transactions-heading">
            <h2>Recent Sales Transactions</h2>
            <button
              type="button"
              className="sa-view-all"
              onClick={() => setShowAll((previous) => !previous)}
            >
              {showAll ? "Show Less ↑" : "View All →"}
            </button>
          </div>

          <div className="sa-transaction-filters">
            <input
              type="search"
              placeholder="Search product or transaction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter sales by category"
            >
              <option>All Categories</option>
              <option>Dairy</option>
              <option>Fruits</option>
              <option>Snacks</option>
              <option>Bakery</option>
              <option>Beverages</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              aria-label="Filter sales by payment"
            >
              <option>All Payments</option>
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
              <option>COD</option>
            </select>
          </div>

          <div className="sa-table-scroll">
            <table className="sa-transactions-table">
              <thead>
                <tr>
                  <th>Date &amp; Time</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {displayedTransactions.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="sa-date-cell">
                        <strong>{item.date}</strong>
                        <span>{item.time}</span>
                      </div>
                    </td>
                    <td>
                      <div className="sa-table-product">
                        <span>{item.emoji}</span>
                        <strong>{item.product}</strong>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`sa-category-tag ${item.category
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td>{item.qty}</td>
                    <td>{formatMoney(item.price)}</td>
                    <td className="sa-total-cell">
                      {formatMoney(item.qty * item.price)}
                    </td>
                    <td>
                      <span className={`sa-payment-tag ${item.payment.toLowerCase()}`}>
                        {item.payment === "UPI" ? "◉ " : item.payment === "Cash" ? "✓ " : "▣ "}
                        {item.payment}
                      </span>
                    </td>
                  </tr>
                ))}

                {displayedTransactions.length === 0 && (
                  <tr>
                    <td colSpan="7" className="sa-empty-row">
                      No sales transactions match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="sa-transaction-count">
            Showing {displayedTransactions.length} of {transactions.length} transactions
          </p>
        </article>

        <article className="sa-panel sa-payment-panel">
          <div className="sa-panel-heading">
            <h2>Sales by Payment Method</h2>
            <select
              value={paymentPeriod}
              onChange={(e) => setPaymentPeriod(e.target.value)}
              aria-label="Payment report period"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="sa-payment-content">
            <DonutChart
              items={paymentMethods}
              totalLabel={formatMoney(periodData.sales)}
            />

            <div className="sa-legend sa-payment-legend">
              {paymentMethods.map((item) => (
                <div className="sa-legend-row" key={item.name}>
                  <span
                    className="sa-legend-dot"
                    style={{ background: item.color }}
                  />
                  <span className="sa-legend-name">{item.name}</span>
                  <strong>
                    {formatMoney(
                      paymentPeriod === "Last Month"
                        ? Math.round(item.amount * 0.86)
                        : paymentPeriod === "This Year"
                          ? item.amount * 10
                          : item.amount
                    )}
                  </strong>
                  <span className="sa-legend-percent">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
