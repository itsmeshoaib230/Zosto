
import React, { useMemo, useState } from "react";
import "./AiSuggestions.css";
import BackToDashboard from "../components/BackToDashboard";

const initialRestockItems = [
  { id: 1, name: "Milk Packet (1L)", emoji: "🥛", stock: 10, demand: 60, order: 50, reason: "High demand, low stock", color: "red" },
  { id: 2, name: "Bread (400g)", emoji: "🍞", stock: 15, demand: 40, order: 30, reason: "Demand increasing", color: "" },
  { id: 3, name: "Potato Chips", emoji: "🍟", stock: 20, demand: 80, order: 60, reason: "Weekend spike expected", color: "" },
  { id: 4, name: "Soft Drink (500ml)", emoji: "🥤", stock: 30, demand: 100, order: 70, reason: "High seasonal demand", color: "" },
  { id: 5, name: "Yogurt (500g)", emoji: "🥣", stock: 8, demand: 35, order: 40, reason: "Likely to run out", color: "red" },
];

const insights = [
  {
    icon: "⚠",
    type: "danger",
    title: "Milk Packet (1L) is likely to run out in 5 days.",
    detail: "Current stock: 10 | Predicted demand: 60",
  },
  {
    icon: "↑",
    type: "success",
    title: "Potato Chips demand may increase by 35%",
    detail: "in the next 2 weeks (based on past trends).",
  },
  {
    icon: "🛒",
    type: "info",
    title: "Consider increasing stock of Soft Drink (500ml)",
    detail: "Weekend demand is usually 40% higher.",
  },
  {
    icon: "♟",
    type: "warning",
    title: "Festive season (Nov) may increase sales for",
    detail: "Snacks and Beverages by 50–70%.",
  },
];

const suggestions = [
  {
    icon: "◆",
    type: "purple",
    title: "Introduce Combo Offers",
    detail: "Bundle Snacks + Soft Drink to increase sales by ~20%.",
  },
  {
    icon: "⬡",
    type: "green",
    title: "Optimize Storage",
    detail: "Move fast-moving items to easily accessible shelves.",
  },
  {
    icon: "◷",
    type: "orange",
    title: "Reduce Slow-Moving Stock",
    detail: "Offer discounts on items with low sales (e.g., old stock).",
  },
  {
    icon: "●",
    type: "blue",
    title: "Targeted Promotions",
    detail: "Run weekend offers on high-demand categories (Beverages, Snacks).",
  },
];

const seasonalData = [
  { month: "Oct", dairy: 100, snacks: 135, beverages: 90, fruits: 75 },
  { month: "Nov", dairy: 225, snacks: 300, beverages: 220, fruits: 175 },
  { month: "Dec", dairy: 180, snacks: 255, beverages: 210, fruits: 150 },
];

function DemandChart({ horizon }) {
  const data = horizon === "8 Weeks"
    ? [90, 110, 125, 150, 170, 190, 205, 225]
    : horizon === "12 Weeks"
      ? [90, 120, 145, 180, 200, 230, 250, 280]
      : [100, 120, 160, 190];

  const width = 560;
  const height = 190;
  const left = 40;
  const right = 12;
  const top = 12;
  const bottom = 28;
  const max = Math.ceil(Math.max(...data) / 50) * 50;

  const makePoints = (values, multiplier, offset = 0) =>
    values.map((value, i) => ({
      x: left + (i / Math.max(values.length - 1, 1)) * (width - left - right),
      y: height - bottom - ((value * multiplier + offset) / max) * (height - top - bottom),
    }));

  const series = [
    { name: "Milk Packet (1L)", color: "#1680ff", values: data },
    { name: "Potato Chips", color: "#10ae7c", values: data.map(v => v * 0.72) },
    { name: "Soft Drink (500ml)", color: "#8545fa", values: data.map(v => v * 0.40) },
  ];

  return (
    <div className="ai-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="ai-demand-svg" role="img" aria-label="Predicted product demand line chart">
        {[0, 1, 2, 3, 4].map(tick => {
          const y = top + tick * (height - top - bottom) / 4;
          return (
            <g key={tick}>
              <line x1={left} x2={width - right} y1={y} y2={y} stroke="#e6edf6" />
              <text x={left - 8} y={y + 4} fontSize="12" textAnchor="end" fill="#71839e">
                {Math.round(max * (1 - tick / 4))}
              </text>
            </g>
          );
        })}

        {data.map((_, i) => {
          const x = left + (i / Math.max(data.length - 1, 1)) * (width - left - right);
          return <line key={i} x1={x} x2={x} y1={top} y2={height - bottom} stroke="#eef2f8" />;
        })}

        {series.map((item) => {
          const points = makePoints(item.values, 1);
          const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
          return (
            <g key={item.name}>
              <path d={path} fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.3" fill={item.color}>
                  <title>{`${item.name}: ${Math.round(item.values[i])} units`}</title>
                </circle>
              ))}
            </g>
          );
        })}

        {data.map((_, i) => {
          const x = left + (i / Math.max(data.length - 1, 1)) * (width - left - right);
          const label = data.length === 4 ? `Week ${i + 1}` : `Week ${i + 1}`;
          return (
            <text key={i} x={x} y={height - 6} fontSize="11" textAnchor="middle" fill="#536b8b">
              {label}
            </text>
          );
        })}
      </svg>

      <div className="ai-chart-legend">
        {series.map(item => (
          <span key={item.name}>
            <i style={{ background: item.color }} />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function SeasonalChart({ period }) {
  const data = period === "6 Months"
    ? [
        { month: "Jul", dairy: 100, snacks: 130, beverages: 180, fruits: 95 },
        { month: "Aug", dairy: 130, snacks: 160, beverages: 210, fruits: 120 },
        { month: "Sep", dairy: 150, snacks: 185, beverages: 190, fruits: 135 },
      ]
    : seasonalData;

  const series = [
    { key: "dairy", color: "#4092ff" },
    { key: "snacks", color: "#24b98a" },
    { key: "beverages", color: "#ffa62b" },
    { key: "fruits", color: "#9060ee" },
  ];

  const max = 400;
  const chartHeight = 155;

  return (
    <div className="ai-seasonal-chart">
      <div className="ai-bar-plot">
        {[0, 100, 200, 300, 400].map(value => (
          <div className="ai-bar-gridline" key={value} style={{ bottom: `${(value / max) * chartHeight}px` }}>
            <span>{value}</span>
          </div>
        ))}

        <div className="ai-bar-groups">
          {data.map(item => (
            <div className="ai-bar-group" key={item.month}>
              <div className="ai-bars">
                {series.map(s => (
                  <div
                    className="ai-bar"
                    key={s.key}
                    style={{
                      height: `${(item[s.key] / max) * chartHeight}px`,
                      background: s.color,
                    }}
                    title={`${item.month} ${s.key}: ${item[s.key]} units`}
                  />
                ))}
              </div>
              <span>{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-seasonal-legend">
        {series.map(s => (
          <span key={s.key}>
            <i style={{ background: s.color }} />
            {s.key.charAt(0).toUpperCase() + s.key.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon, title, value, note, type }) {
  return (
    <article className={`ai-metric ${type}`}>
      <div className="ai-metric-icon">{icon}</div>
      <div className="ai-metric-text">
        <p>{title}</p>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </article>
  );
}

export default function AiSuggestions() {
  const [horizon, setHorizon] = useState("4 Weeks");
  const [seasonPeriod, setSeasonPeriod] = useState("Next 3 Months");
  const [items, setItems] = useState(initialRestockItems);
  const [addedItems, setAddedItems] = useState([]);
  const [message, setMessage] = useState("");

  const totalReorder = items.length;
  const totalDemand = useMemo(
    () => items.filter(item => item.demand > item.stock * 2).length + 1,
    [items]
  );
  const stockoutCount = items.filter(item => item.stock <= 10).length;

  const addToOrder = (item) => {
    setAddedItems(previous =>
      previous.includes(item.id) ? previous : [...previous, item.id]
    );
    setMessage(`${item.name} added to your reorder list.`);
  };

  const applyRecommendations = () => {
    setAddedItems(items.map(item => item.id));
    setMessage("All recommended items have been added to your reorder list.");
  };

  return (
    <main className="ai-suggestions">
      <header className="ai-header">
        <div className="ai-heading-left">
          <div className="ai-heading-icon">♟</div>
          <div>
            <div className="ai-title-line">
              <h1>AI Suggestions</h1>
              <span className="ai-powered">AI Powered</span>
            </div>
            <p>Smart insights and recommendations to help you manage your inventory better.</p>
          </div>
        </div>

        <button className="ai-date-button" type="button">
          ▦ &nbsp; Mon, 15 Oct 2026 &nbsp;⌄
        </button>
      </header>

      <section className="ai-metrics">
        <Metric icon="⬡" title="Products to Reorder" value={totalReorder} note="based on stock levels & demand" type="ai-blue" />
        <Metric icon="↗" title="Expected High Demand" value={totalDemand} note="products in next 30 days" type="ai-green" />
        <Metric icon="⚠" title="Possible Stockouts" value={stockoutCount} note="if not restocked soon" type="ai-orange" />
        <Metric icon="▥" title="Potential Revenue Increase" value="₹12,450" note="with recommended actions" type="ai-purple" />
      </section>

      {message && (
        <div className="ai-notice" role="status">
          {message}
          <button type="button" onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <section className="ai-top-grid">
        <article className="ai-panel ai-demand-panel">
          <div className="ai-panel-heading">
            <div>
              <h2>Demand Forecast</h2>
              <p>AI predicted demand for the next few weeks based on past sales.</p>
            </div>
            <select value={horizon} onChange={e => setHorizon(e.target.value)} aria-label="Demand forecast period">
              <option>4 Weeks</option>
              <option>8 Weeks</option>
              <option>12 Weeks</option>
            </select>
          </div>

          <DemandChart horizon={horizon} />

          <div className="ai-prediction">
            <span>↟</span>
            <div>
              <strong>{horizon === "4 Weeks" ? "190" : horizon === "8 Weeks" ? "225" : "280"} units</strong>
              <small>(Predicted)</small>
            </div>
          </div>
        </article>

        <article className="ai-panel ai-insights-panel">
          <div className="ai-panel-heading">
            <div>
              <h2>AI Insights</h2>
              <p>Key takeaways from your inventory and sales data.</p>
            </div>
          </div>

          <div className="ai-insights-list">
            {insights.map((item, index) => (
              <div className={`ai-insight ${item.type}`} key={index}>
                <div className="ai-insight-icon">{item.icon}</div>
                <div className="ai-insight-copy">
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
                <span className="ai-chevron">›</span>
              </div>
            ))}
          </div>
        </article>

        <article className="ai-panel ai-seasonal-panel">
          <div className="ai-panel-heading">
            <div>
              <h2>Seasonal Trends</h2>
              <p>Products with seasonal demand patterns.</p>
            </div>
            <select value={seasonPeriod} onChange={e => setSeasonPeriod(e.target.value)} aria-label="Seasonal trend period">
              <option>Next 3 Months</option>
              <option>Next 6 Months</option>
            </select>
          </div>
          <SeasonalChart period={seasonPeriod} />
        </article>
      </section>

      <section className="ai-bottom-grid">
        <article className="ai-panel ai-restock-panel">
          <div className="ai-panel-heading">
            <div>
              <h2>Recommended Restock Items</h2>
              <p>AI recommends optimal reorder quantity based on current stock and predicted demand.</p>
            </div>
            <button type="button" className="ai-primary-button" onClick={applyRecommendations}>
              ✦ Apply Recommendations
            </button>
          </div>

          <div className="ai-restock-table-wrap">
            <table className="ai-restock-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Predicted Demand<br />(Next 4 Weeks)</th>
                  <th>Recommended Order</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="ai-table-product">
                        <span>{item.emoji}</span>
                        <strong>{item.name}</strong>
                      </div>
                    </td>
                    <td className={item.color}>{item.stock}</td>
                    <td>{item.demand}</td>
                    <td><span className="ai-order-quantity">{item.order}</span></td>
                    <td className="ai-reason">{item.reason}</td>
                    <td>
                      <button
                        type="button"
                        className={`ai-add-order ${addedItems.includes(item.id) ? "added" : ""}`}
                        onClick={() => addToOrder(item)}
                        disabled={addedItems.includes(item.id)}
                      >
                        {addedItems.includes(item.id) ? "✓ Added" : "🛒 Add to Order"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ai-demo-note">Sample recommendations — connect your inventory API for live stock and demand predictions.</p>
        </article>

        <article className="ai-panel ai-other-panel">
          <div className="ai-panel-heading">
            <div>
              <h2>Other AI Suggestions</h2>
              <p>Additional actions to improve your business.</p>
            </div>
          </div>

          <div className="ai-other-list">
            {suggestions.map(item => (
              <button
                className={`ai-other-item ${item.type}`}
                key={item.title}
                type="button"
                onClick={() => setMessage(`${item.title}: ${item.detail}`)}
              >
                <span className="ai-other-icon">{item.icon}</span>
                <span className="ai-other-copy">
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
                <span className="ai-chevron">›</span>
              </button>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
