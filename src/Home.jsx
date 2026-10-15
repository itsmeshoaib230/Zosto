import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "📦",
    title: "Inventory Management",
    description:
      "Manage your products, monitor stock levels, and keep your inventory organized.",
  },
  {
    icon: "🔔",
    title: "Smart Stock Alerts",
    description:
      "Get notified when products run low and avoid unexpected stockouts.",
  },
  {
    icon: "📊",
    title: "Sales Tracking",
    description:
      "Track daily sales, understand business performance, and monitor growth.",
  },
  {
    icon: "🤝",
    title: "Supplier Management",
    description:
      "Connect with suppliers and simplify your ordering process.",
  },
  {
    icon: "📈",
    title: "Reports & Analytics",
    description:
      "Understand your business with clear reports and useful insights.",
  },
  {
    icon: "🏪",
    title: "Business Dashboard",
    description:
      "Access important inventory and sales information from one place.",
  },
];

function Home() {
  return (
    <main className="zosto-home">
      {/* Navbar */}
      <header className="zosto-navbar">
        <a href="#home" className="zosto-logo">
          <span className="zosto-logo-icon">▦</span>
          <span>
            Zos<span className="zosto-logo-highlight">to</span>
          </span>
        </a>

        <nav className="zosto-nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="zosto-nav-actions">
          <select
            className="zosto-language"
            aria-label="Select language"
            defaultValue="English"
          >
            <option value="English">English</option>
            <option value="Telugu">తెలుగు</option>
            <option value="Hindi">हिन्दी</option>
          </select>

          
        <Link to="/login" className="zosto-login-link">
        Login
        </Link>


          <Link to="/signup" className="zosto-nav-cta">
           Get Started
           </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="zosto-hero" id="home">
        <div className="zosto-hero-content">
          <div className="zosto-badge">
            <span className="zosto-badge-dot"></span>
            SMART INVENTORY. SMARTER BUSINESS.
          </div>

          <h1>
            Smart Inventory
            <br />
            for Every <span>Shop.</span>
          </h1>

          <p className="zosto-hero-description">
            Manage stock, track sales, connect with suppliers, and grow your
            business with Zosto.
          </p>

          <div className="zosto-hero-buttons">
            <a href="/signup" className="zosto-btn-primary">
              Get Started <span>→</span>
            </a>

            <a href="#features" className="zosto-btn-secondary">
              Explore Features <span>↗</span>
            </a>
          </div>

          <div className="zosto-hero-trust">
            <div className="zosto-trust-icon">✓</div>
            <span>Simple to use</span>

            <div className="zosto-trust-divider"></div>

            <div className="zosto-trust-icon">✓</div>
            <span>Built for businesses</span>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="zosto-hero-visual">
          <div className="zosto-decoration zosto-decoration-one"></div>
          <div className="zosto-decoration zosto-decoration-two"></div>

          <div className="zosto-dashboard">
            <div className="zosto-dashboard-header">
              <div>
                <div className="zosto-dashboard-brand">
                  <span className="zosto-mini-logo">▦</span>
                  Zosto
                </div>
                <p>Business Overview</p>
              </div>

              <div className="zosto-dashboard-avatar">S</div>
            </div>

            <div className="zosto-dashboard-welcome">
              <div>
                <h3>Good morning! 👋</h3>
                <p>Here is what's happening in your store.</p>
              </div>
            </div>

            <div className="zosto-stats-grid">
              <div className="zosto-stat-card">
                <div className="zosto-stat-top">
                  <span>Total Products</span>
                  <span className="zosto-stat-icon">📦</span>
                </div>
                <h2>1,248</h2>
                <small>Products in inventory</small>
              </div>

              <div className="zosto-stat-card">
                <div className="zosto-stat-top">
                  <span>Today's Sales</span>
                  <span className="zosto-stat-icon">₹</span>
                </div>
                <h2>₹12,450</h2>
                <small className="zosto-positive">Sales overview</small>
              </div>

              <div className="zosto-stat-card">
                <div className="zosto-stat-top">
                  <span>Low Stock</span>
                  <span className="zosto-stat-icon">⚠️</span>
                </div>
                <h2>08</h2>
                <small className="zosto-warning">Needs attention</small>
              </div>

              <div className="zosto-stat-card">
                <div className="zosto-stat-top">
                  <span>Orders</span>
                  <span className="zosto-stat-icon">🛒</span>
                </div>
                <h2>36</h2>
                <small>Orders to manage</small>
              </div>
            </div>

            <div className="zosto-dashboard-bottom">
              <div className="zosto-chart-card">
                <div className="zosto-chart-heading">
                  <div>
                    <h4>Sales Overview</h4>
                    <p>Weekly performance</p>
                  </div>
                  <span className="zosto-chart-period">This week⌄</span>
                </div>

                <div
                  className="zosto-chart"
                  role="img"
                  aria-label="Illustrative weekly sales chart"
                >
                  {[35, 55, 42, 75, 50, 90, 68].map((height, index) => (
                    <div className="zosto-chart-column" key={index}>
                      <div
                        className={`zosto-chart-bar ${
                          index === 5 ? "zosto-chart-bar-highlight" : ""
                        }`}
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>

                <div className="zosto-chart-labels">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <div className="zosto-alert-card">
                <h4>Stock Alerts</h4>

                <div className="zosto-alert-item">
                  <span className="zosto-alert-dot"></span>
                  <div>
                    <strong>Rice Bags</strong>
                    <p>Only 5 units left</p>
                  </div>
                </div>

                <div className="zosto-alert-item">
                  <span className="zosto-alert-dot"></span>
                  <div>
                    <strong>Cooking Oil</strong>
                    <p>Only 3 units left</p>
                  </div>
                </div>

                <a href="/login/shopkeeper">View inventory →</a>
              </div>
            </div>
          </div>

          <div className="zosto-floating-card">
            <span className="zosto-floating-icon">✓</span>
            <div>
              <strong>Stay organized</strong>
              <p>Your business, simplified.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="zosto-about" id="about">
        <div className="zosto-section-label">ABOUT ZOSTO</div>

        <h2>
          Your business deserves
          <br />
          <span>a smarter way.</span>
        </h2>

        <p>
          Zosto brings shopkeepers, suppliers, and businesses together through
          one simple inventory management platform. Spend less time managing
          stock and more time growing your business.
        </p>

        <a href="#features" className="zosto-text-link">
          Discover Zosto <span>→</span>
        </a>
      </section>

      {/* Features Section */}
      <section className="zosto-features" id="features">
        <div className="zosto-section-label">WHAT ZOSTO OFFERS</div>

        <h2>
          Everything you need.
          <br />
          <span>All in one place.</span>
        </h2>

        <p className="zosto-section-description">
          Powerful tools to simplify everyday inventory management.
        </p>

        <div className="zosto-features-grid">
          {features.map((feature, index) => (
            <article className="zosto-feature-card" key={feature.title}>
              <div className="zosto-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="zosto-feature-number">
                0{index + 1}
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="zosto-how-it-works">
        <div className="zosto-section-label">HOW IT WORKS</div>

        <h2>
          Three steps to a
          <br />
          <span>better business.</span>
        </h2>

        <div className="zosto-steps-grid">
          <article className="zosto-step">
            <span className="zosto-step-number">01</span>
            <h3>Create your account</h3>
            <p>
              Register as a shopkeeper, firm, or supplier to get started.
            </p>
          </article>

          <article className="zosto-step">
            <span className="zosto-step-number">02</span>
            <h3>Manage your inventory</h3>
            <p>
              Organize products, monitor stock, and track your business
              activity.
            </p>
          </article>

          <article className="zosto-step">
            <span className="zosto-step-number">03</span>
            <h3>Grow with confidence</h3>
            <p>
              Make informed decisions with inventory insights and sales
              reports.
            </p>
          </article>
        </div>
      </section>

      {/* Contact Section */}
      <section className="zosto-contact" id="contact">
        <div className="zosto-contact-content">
          <div className="zosto-section-label">GET IN TOUCH</div>

          <h2>
            Let's grow your
            <br />
            <span>business together.</span>
          </h2>

          <p>
            Have questions about Zosto? Send us a message and our team can help
            you get started.
          </p>
        </div>

        <form
          className="zosto-contact-form"
          onSubmit={(event) => {
            event.preventDefault();
            alert("Contact form UI is ready. Connect it to your backend to send messages.");
          }}
        >
          <label htmlFor="zosto-name">Your name</label>
          <input
            id="zosto-name"
            type="text"
            placeholder="Enter your name"
            required
          />

          <label htmlFor="zosto-email">Email address</label>
          <input
            id="zosto-email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <label htmlFor="zosto-message">Your message</label>
          <textarea
            id="zosto-message"
            placeholder="How can we help?"
            rows="4"
            required
          ></textarea>

          <button type="submit" className="zosto-btn-primary">
            Send Message <span>→</span>
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="zosto-footer">
        <a href="#home" className="zosto-logo">
          <span className="zosto-logo-icon">▦</span>
          <span>
            Zos<span className="zosto-logo-highlight">to</span>
          </span>
        </a>

        <p>Smarter inventory. Stronger businesses.</p>

        <div className="zosto-footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="zosto-footer-bottom">
          © {new Date().getFullYear()} Zosto. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

export default Home;