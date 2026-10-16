import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import BackToDashboard from "../components/BackToDashboard";

import {
    Menu,
    Home,
    Inventory2,
    AccessTime,
    SwapHoriz,
    ShoppingCart,
    BarChart,
    AutoAwesome,
    Groups,
    LocalShipping,
    Person,
    Settings,
    Add,
    Search,
    Notifications,
    LocationOn,
    KeyboardArrowDown,
    CalendarMonth,
    TrendingUp,
    Warning,
    Schedule,
    Store,
    SmartToy,
    ArrowUpward,
    OpenInNew,
    Close,
    ShoppingBasket,
    MoreHoriz,
} from "@mui/icons-material";

const navigationItems = [
    { label: "Dashboard", icon: <Home /> },
    { label: "My Inventory", icon: <Inventory2 /> },
    { label: "Expiry Alerts", icon: <AccessTime /> },
    { label: "Stock Exchange", icon: <SwapHoriz /> },
    { label: "Orders", icon: <ShoppingCart />, badge: 3 },
    { label: "Sales Analytics", icon: <BarChart /> },
    { label: "AI Suggestions", icon: <AutoAwesome /> },
    { label: "Customers", icon: <Groups /> },
    { label: "Suppliers", icon: <LocalShipping /> },
    { label: "Profile", icon: <Person /> },
    { label: "Settings", icon: <Settings /> },
    // {label:"Add Product", icon:<AddProduct/>},
];

const lowStockItems = [
    {
        name: "Maggi Noodles",
        stock: 5,
        minimum: 20,
        emoji: "🍜",
    },
    {
        name: "Coca Cola 500ml",
        stock: 8,
        minimum: 24,
        emoji: "🥤",
    },
    {
        name: "Parle-G Biscuits",
        stock: 10,
        minimum: 30,
        emoji: "🍪",
    },
    {
        name: "Sunflower Oil 1L",
        stock: 6,
        minimum: 20,
        emoji: "🫒",
    },
    {
        name: "Aashirvaad Atta 5kg",
        stock: 4,
        minimum: 15,
        emoji: "🌾",
    },
];

const expiringItems = [
    { name: "Milk (Amul)", date: "20 Oct 2026", days: 5, emoji: "🥛" },
    { name: "Bread", date: "22 Oct 2026", days: 7, emoji: "🍞" },
    { name: "Curd", date: "24 Oct 2026", days: 9, emoji: "🥣" },
    { name: "Yogurt Cup", date: "26 Oct 2026", days: 11, emoji: "🥛" },
    { name: "Paneer", date: "28 Oct 2026", days: 13, emoji: "🧀" },
];

const nearbyProducts = [
    {
        name: "Fresh Milk (Amul)",
        quantity: "10 packs available",
        shop: "Venkatesh Store",
        distance: "2 km",
        emoji: "🥛",
    },
    {
        name: "Parle-G Biscuits",
        quantity: "20 packets available",
        shop: "Sai Kirana",
        distance: "3 km",
        emoji: "🍪",
    },
    {
        name: "Sunflower Oil 1L",
        quantity: "5 bottles available",
        shop: "Laxmi Stores",
        distance: "4 km",
        emoji: "🫒",
    },
];

const recentOrders = [
    {
        id: "#OD1234",
        customer: "Ravi Kumar",
        status: "Delivered",
    },
    {
        id: "#OD1233",
        customer: "Sita",
        status: "Out for Delivery",
    },
    {
        id: "#OD1232",
        customer: "Prakash",
        status: "Processing",
    },
    {
        id: "#OD1231",
        customer: "Local Customer",
        status: "Delivered",
    },
];

const recommendations = [
    {
        title: "Stock more",
        product: "Maggi Noodles",
        description: "High demand in your area",
        emoji: "🍜",
        type: "green",
        icon: <ArrowUpward />,
    },
    {
        title: "Increase stock",
        product: "Coca Cola 500ml",
        description: "Sales increased by 30%",
        emoji: "🥤",
        type: "blue",
        icon: <OpenInNew />,
    },
    {
        title: "Consider exchanging",
        product: "Milk (Amul)",
        description: "High demand nearby",
        emoji: "🥛",
        type: "purple",
        icon: <SwapHoriz />,
    },
];

function SidebarItem({ item, active, onClick }) {
    return (
        <button
            className={`sidebar-item ${active ? "active" : ""}`}
            onClick={onClick}
            type="button"
        >
            <span className="sidebar-icon">{item.icon}</span>

            <span className="sidebar-label">{item.label}</span>

            {item.badge && (
                <span className="sidebar-badge">{item.badge}</span>
            )}
        </button>
    );
}

function StatCard({
    title,
    value,
    subtitle,
    change,
    icon,
    color,
}) {
    return (
        <div className={`stat-card ${color}`}>
            <div className="stat-icon">{icon}</div>

            <div className="stat-content">
                <p className="stat-title">{title}</p>

                <div className="stat-value-row">
                    <h2>{value}</h2>

                    {change && (
                        <span className="stat-change">{change}</span>
                    )}
                </div>

                <p className="stat-subtitle">{subtitle}</p>
            </div>
        </div>
    );
}

function SalesChart() {
    const points = [
        [20, 125],
        [78, 105],
        [136, 106],
        [194, 83],
        [252, 85],
        [310, 48],
        [368, 43],
    ];

    const pointString = points
        .map(([x, y]) => `${x},${y}`)
        .join(" ");

    const areaString = `20,165 ${pointString} 368,165`;

    return (
        <div className="sales-chart">
            <div className="chart-y-labels">
                <span>8K</span>
                <span>6K</span>
                <span>4K</span>
                <span>2K</span>
                <span>0</span>
            </div>

            <div className="chart-plot">
                <svg
                    viewBox="0 0 390 175"
                    className="sales-svg"
                    role="img"
                    aria-label="Sales trend increasing over the last seven days"
                    preserveAspectRatio="none"
                >
                    {[15, 52, 89, 126, 165].map((y) => (
                        <line
                            key={y}
                            x1="20"
                            y1={y}
                            x2="380"
                            y2={y}
                            className="chart-grid"
                        />
                    ))}

                    {[20, 78, 136, 194, 252, 310, 368].map((x) => (
                        <line
                            key={x}
                            x1={x}
                            y1="15"
                            x2={x}
                            y2="165"
                            className="chart-grid vertical"
                        />
                    ))}

                    <polygon
                        points={areaString}
                        className="chart-area"
                    />

                    <polyline
                        points={pointString}
                        className="chart-line"
                    />

                    {points.map(([x, y], index) => (
                        <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="5.5"
                            className="chart-point"
                        />
                    ))}
                </svg>

                <div className="chart-x-labels">
                    {["Oct 9", "Oct 10", "Oct 11", "Oct 12", "Oct 13", "Oct 14", "Oct 15"].map(
                        (day) => (
                            <span key={day}>{day}</span>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

function CategoryChart() {
    return (
        <div className="category-content">
            <div className="donut-chart">
                <div className="donut-center">
                    <strong>120</strong>
                    <span>Products</span>
                </div>
            </div>

            <div className="category-legend">
                <div>
                    <span className="legend-dot groceries" />
                    <span>Groceries</span>
                    <strong>40%</strong>
                </div>

                <div>
                    <span className="legend-dot snacks" />
                    <span>Snacks</span>
                    <strong>25%</strong>
                </div>

                <div>
                    <span className="legend-dot beverages" />
                    <span>Beverages</span>
                    <strong>15%</strong>
                </div>

                <div>
                    <span className="legend-dot dairy" />
                    <span>Dairy</span>
                    <strong>10%</strong>
                </div>

                <div>
                    <span className="legend-dot others" />
                    <span>Others</span>
                    <strong>10%</strong>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title, action = "View All", onClick }) {
    return (
        <div className="section-header">
            <h3>{title}</h3>

            {action && (
                <button
                    className="view-all"
                    type="button"
                    onClick={onClick}
                >
                    {action}
                </button>
            )}
        </div>
    );
}

function LowStockTable({ onRestock }) {
    return (
        <div className="table-scroll">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Current Stock</th>
                        <th>Min. Stock</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {lowStockItems.map((item) => (
                        <tr key={item.name}>
                            <td>
                                <div className="product-cell">
                                    <span className="product-emoji">
                                        {item.emoji}
                                    </span>
                                    <span>{item.name}</span>
                                </div>
                            </td>

                            <td>{item.stock}</td>
                            <td>{item.minimum}</td>

                            <td>
                                <span className="status-pill low">
                                    Low Stock
                                </span>
                            </td>

                            <td>
                                <button
                                    className="small-action restock"
                                    type="button"
                                    onClick={() => onRestock(item)}
                                >
                                    Restock
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ExpiringTable() {
    return (
        <div className="table-scroll">
            <table className="data-table expiry-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Expiry Date</th>
                        <th>Days Left</th>
                    </tr>
                </thead>

                <tbody>
                    {expiringItems.map((item) => (
                        <tr key={item.name}>
                            <td>
                                <div className="product-cell">
                                    <span className="product-emoji">
                                        {item.emoji}
                                    </span>
                                    <span>{item.name}</span>
                                </div>
                            </td>

                            <td>{item.date}</td>

                            <td>
                                <span
                                    className={`status-pill days ${item.days <= 5
                                        ? "urgent"
                                        : item.days <= 9
                                            ? "warning"
                                            : "safe"
                                        }`}
                                >
                                    {item.days} days
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function NearbyExchange({ onRequest }) {
    return (
        <section className="panel nearby-panel">
            <SectionHeader
                title="Nearby Stock Exchange"
                onClick={() => onRequest(null)}
            />

            <div className="nearby-list">
                {nearbyProducts.map((item) => (
                    <div className="nearby-item" key={item.name}>
                        <div className="nearby-product-icon">
                            {item.emoji}
                        </div>

                        <div className="nearby-product-info">
                            <strong>{item.name}</strong>
                            <span>{item.quantity}</span>
                            <small>
                                {item.shop} ({item.distance})
                            </small>
                        </div>

                        <button
                            className="request-btn"
                            type="button"
                            onClick={() => onRequest(item)}
                        >
                            Request
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

function RecentOrders({ onView }) {
    return (
        <section className="panel orders-panel">
            <SectionHeader
                title="Recent Orders"
                onClick={() => onView(null)}
            />

            <div className="table-scroll">
                <table className="data-table order-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recentOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer}</td>

                                <td>
                                    <span
                                        className={`status-pill order-status ${order.status === "Delivered"
                                            ? "delivered"
                                            : order.status === "Processing"
                                                ? "processing"
                                                : "outgoing"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>

                                <td>
                                    <button
                                        className="small-action view-order"
                                        type="button"
                                        onClick={() => onView(order)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function AIAssistant() {
    return (
        <section className="ai-assistant">
            <div className="ai-intro">
                <div className="ai-robot">
                    <SmartToy />
                </div>

                <div>
                    <h3>AI Assistant</h3>
                    <p>Recommendations based on recent sales and local demand</p>
                </div>
            </div>

            <div className="ai-recommendations">
                {recommendations.map((item) => (
                    <div
                        className={`recommendation-card ${item.type}`}
                        key={item.product}
                    >
                        <div className="recommendation-product">
                            {item.emoji}
                        </div>

                        <div className="recommendation-info">
                            <span>{item.title}</span>
                            <strong>{item.product}</strong>
                            <small>{item.description}</small>
                        </div>

                        <div className="recommendation-icon">
                            {item.icon}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState("Dashboard");
    const [searchTerm, setSearchTerm] = useState("");
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);

    const [userProfile, setUserProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUserProfile(null);
                setProfileLoading(false);
                return;
            }

            try {
                const apiUrl =
                    import.meta.env.VITE_API_URL || "http://localhost:5000";

                const response = await fetch(
                    `${apiUrl}/api/users/${firebaseUser.uid}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Could not load user profile.");
                }

                setUserProfile(data.user);
            } catch (error) {
                console.error("Profile fetch error:", error.message);
                setUserProfile(null);
            } finally {
                setProfileLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const [notice, setNotice] = useState(null);

    const closeSidebar = () => setSidebarOpen(false);


    const handleNavigation = (label) => {
        setActivePage(label);
        closeSidebar();
        setNotice(null);

        const routes = {
            Dashboard: "/dashboard",
            "My Inventory": "/inventory",
            "Expiry Alerts": "/expiry",
            "Stock Exchange": "/stock-exchange",
            Orders: "/orders",
            "Sales Analytics": "/sales-analysis",
            "AI Suggestions": "/ai-suggestions",
            Customers: "/customers",
            Suppliers: "/suppliers",
            Profile: "/profile",
            Settings: "/settings",
        };

        const path = routes[label];

        if (path) {
            navigate(path);
        }
    };




    const handleRestock = (item) => {
        setNotice({
            title: "Restock Request",
            message: `Restock ${item.name}. Current stock: ${item.stock}. Minimum stock: ${item.minimum}.`,
        });
    };

    const handleExchangeRequest = (item) => {
        setNotice({
            title: "Stock Exchange",
            message: item
                ? `Review the exchange request for ${item.name} from ${item.shop}.`
                : "View all nearby stock exchange opportunities.",
        });
    };

    const handleOrderView = (order) => {
        setNotice({
            title: "Order Details",
            message: order
                ? `Order ${order.id} for ${order.customer}. Status: ${order.status}.`
                : "View all recent orders.",
        });
    };

    return (
        <div className="stockwise-app">
            {/* SIDEBAR */}

            <aside
                id="stockwise-sidebar"
                className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
                aria-hidden={!sidebarOpen}
            >
                <div className="sidebar-brand">
                    <div className="brand-logo">
                        <Store />
                    </div>

                    <h2>
                        Zos<span>to</span>
                    </h2>

                    <button
                        className="sidebar-close"
                        type="button"
                        onClick={closeSidebar}
                        aria-label="Close navigation"
                    >
                        <Close />
                    </button>
                </div>

                <nav className="sidebar-navigation">
                    {navigationItems.map((item) => (
                        <SidebarItem
                            key={item.label}
                            item={item}
                            active={activePage === item.label}
                            onClick={() => handleNavigation(item.label)}
                        />
                    ))}
                </nav>


                <button
                    className="add-product-btn"
                    type="button"
                    onClick={() => {
                        closeSidebar();
                        navigate("/add-product");
                    }}
                >
                    <Add />
                    <span>Add Product</span>
                </button>

            </aside>

            {/* MOBILE SIDEBAR BACKDROP */}

            {sidebarOpen && (
                <button
                    className="sidebar-backdrop"
                    onClick={closeSidebar}
                    aria-label="Close navigation menu"
                    type="button"
                />
            )}

            {/* MAIN AREA */}

            <div
                className={`dashboard-shell ${sidebarOpen ? "sidebar-is-open" : ""
                    }`}
            >
                {/* TOP NAVBAR */}

                <header className="top-navbar">
                    <button
                        className="hamburger-btn"
                        type="button"
                        onClick={() => setSidebarOpen((previous) => !previous)}
                        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                        aria-expanded={sidebarOpen}
                        aria-controls="stockwise-sidebar"
                    >
                        <Menu />
                    </button>

                    <div className="search-box">
                        <Search />

                        <input
                            type="search"
                            placeholder="Search products, orders, or shopkeepers..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            aria-label="Search dashboard"
                        />
                    </div>

                    <div className="navbar-actions">
                        <div className="dropdown-wrapper location-wrapper">
                            <button
                                className="location-btn"
                                type="button"
                                onClick={() => setLocationOpen(!locationOpen)}
                            >
                                <LocationOn />
                                <span>
                                    {profileLoading
                                        ? "Loading location..."
                                        : userProfile?.role === "shopkeeper"
                                            ? userProfile.storeLocation || "Location not available"
                                            : "Location not available"}
                                </span>



                                <KeyboardArrowDown />
                            </button>

                            {locationOpen && (
                                <div className="header-dropdown">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLocationOpen(false);
                                            navigate("/change-location");
                                        }}
                                    >
                                        change location
                                    </button>

                                </div>
                            )}
                        </div>

                        <div className="dropdown-wrapper">
                            <button
                                className="notification-btn"
                                type="button"
                                aria-label="Notifications"
                                onClick={() => setNotificationOpen(!notificationOpen)}
                            >
                                <Notifications />
                                <span className="notification-count">2</span>
                            </button>

                            {notificationOpen && (
                                <div className="header-dropdown notification-dropdown">
                                    <strong>Notifications</strong>
                                    <p>8 products are running low.</p>
                                    <p>6 products are expiring soon.</p>
                                </div>
                            )}
                        </div>

                        <div className="dropdown-wrapper profile-wrapper">
                            <button
                                className="profile-btn"
                                type="button"
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                <div className="profile-avatar">
                                    <Person />
                                </div>

                                <div className="profile-info">
                                    <strong>
                                        {profileLoading
                                            ? "Loading..."
                                            : userProfile?.storeName || userProfile?.name || "My Store"}
                                    </strong>

                                    <span>
                                        {userProfile?.role === "shopkeeper"
                                            ? "Shopkeeper"
                                            : userProfile?.role === "deliveryAgent"
                                                ? "Delivery Agent"
                                                : "User"}
                                    </span>
                                </div>

                                <KeyboardArrowDown />
                            </button>

                            {profileOpen && (
                                <div className="header-dropdown">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            handleNavigation("Profile");
                                        }}
                                    >
                                        My Profile
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            handleNavigation("Settings");
                                        }}
                                    >
                                        Settings
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        Close Menu
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* DASHBOARD CONTENT */}

                <main className="dashboard-main">
                    <section className="welcome-section">
                        <div>
                            <h1>
                                Welcome Back,{" "}
                                <span>
                                    {profileLoading
                                        ? "..."
                                        : userProfile?.name?.split(" ")[0] || "User"}
                                    !
                                </span>{" "}
                                <span className="wave">👋</span>
                            </h1>

                            <p>Here's what's happening in your shop today.</p>
                        </div>

                        <div className="dashboard-date">
                            <CalendarMonth />
                            <span>Mon, 15 Oct 2026</span>
                        </div>
                    </section>

                    {/* SUMMARY CARDS */}

                    <section className="stats-grid">
                        <StatCard
                            title="Total Products"
                            value="120"
                            change="↑ +12%"
                            subtitle="vs last month"
                            icon={<Inventory2 />}
                            color="stat-blue"
                        />

                        <StatCard
                            title="Total Stock Value"
                            value="₹28,450"
                            change="↑ 8%"
                            subtitle="vs last month"
                            icon={<ShoppingBasket />}
                            color="stat-green"
                        />

                        <StatCard
                            title="Low Stock Items"
                            value="8"
                            change="+ 2"
                            subtitle="items need restock"
                            icon={<Warning />}
                            color="stat-red"
                        />

                        <StatCard
                            title="Expiring Soon"
                            value="6"
                            change=""
                            subtitle="within 30 days"
                            icon={<Schedule />}
                            color="stat-orange"
                        />
                    </section>

                    {/* CHARTS AND NEARBY EXCHANGE */}

                    <section className="dashboard-grid">
                        <section className="panel sales-panel">
                            <SectionHeader
                                title="Sales Overview"
                                action="Last 7 Days⌄"
                                onClick={() =>
                                    setNotice({
                                        title: "Sales Period",
                                        message: "Connect this control to your sales date-range filter.",
                                    })
                                }
                            />

                            <div className="sales-content">
                                <SalesChart />

                                <div className="sales-total">
                                    <span>Total Sales</span>
                                    <strong>₹24,530</strong>

                                    <p>
                                        <TrendingUp /> 18%
                                    </p>

                                    <small>vs last week</small>
                                </div>
                            </div>
                        </section>

                        <section className="panel category-panel">
                            <SectionHeader
                                title="Category Wise Sales"
                                action=""
                            />

                            <CategoryChart />
                        </section>

                        <NearbyExchange onRequest={handleExchangeRequest} />

                        {/* LOW STOCK */}

                        <section className="panel low-stock-panel">
                            <SectionHeader
                                title="Low Stock Items"
                                onClick={() => handleNavigation("My Inventory")}
                            />

                            <LowStockTable onRestock={handleRestock} />
                        </section>

                        {/* EXPIRING ITEMS */}

                        <section className="panel expiring-panel">
                            <SectionHeader
                                title="Expiring Soon"
                                onClick={() => handleNavigation("Expiry Alerts")}
                            />

                            <ExpiringTable />
                        </section>

                        {/* RECENT ORDERS */}

                        <RecentOrders onView={handleOrderView} />
                    </section>

                    {/* AI ASSISTANT: ALWAYS IN MAIN DASHBOARD */}

                    <AIAssistant />

                    {/* SIMPLE FEEDBACK MESSAGE */}

                    {notice && (
                        <div className="notice-overlay">
                            <div className="notice-card">
                                <button
                                    type="button"
                                    className="notice-close"
                                    aria-label="Close message"
                                    onClick={() => setNotice(null)}
                                >
                                    <Close />
                                </button>

                                <div className="notice-icon">
                                    <SmartToy />
                                </div>

                                <h3>{notice.title}</h3>
                                <p>{notice.message}</p>

                                <button
                                    type="button"
                                    className="notice-ok"
                                    onClick={() => setNotice(null)}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}

                    <footer className="dashboard-footer">
                        <span>Zosto Inventory Management</span>
                        <span>Smart inventory. Better business.</span>
                    </footer>
                </main>
            </div>
        </div>
    );
}