
import React, { useState } from "react";
import "./Settings.css";

const initialSettings = {
  storeName: "Ramesh Stores",
  ownerName: "Ramesh Kumar",
  phone: "+91 98765 43210",
  email: "rameshstore@gmail.com",
  address: "D.No 12-4-56, Main Road, Nellore, Andhra Pradesh - 524001",
  currency: "INR",
  timezone: "Asia/Kolkata",
  dateFormat: "DD MMM YYYY",
  language: "English",
  tax: "5",
  lowStock: "10",
};

const initialNotifications = {
  lowStock: true,
  expiry: true,
  orders: true,
  delivery: true,
  ai: true,
  marketing: false,
};

const notificationItems = [
  { key: "lowStock", icon: "⬡", color: "blue", title: "Low Stock Alerts", description: "Get notified when products are low in stock" },
  { key: "expiry", icon: "◷", color: "orange", title: "Expiry Alerts", description: "Get notified before products expire" },
  { key: "orders", icon: "🛒", color: "green", title: "New Order Notifications", description: "Get notified when new orders are placed" },
  { key: "delivery", icon: "🚚", color: "purple", title: "Delivery Updates", description: "Get notified about order delivery status" },
  { key: "ai", icon: "♙", color: "purple", title: "AI Suggestions", description: "Get smart recommendations and insights" },
  { key: "marketing", icon: "♧", color: "pink", title: "Marketing Offers", description: "Get updates about new features and offers" },
];

const tabs = [
  { id: "General", icon: "⚙" },
  { id: "Store", icon: "▣" },
  { id: "Notifications", icon: "♟" },
  { id: "Integrations", icon: "↗" },
  { id: "Data & Backup", icon: "▤" },
  { id: "Account", icon: "♙" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("General");
  const [settings, setSettings] = useState(initialSettings);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [logo, setLogo] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const updateSetting = (event) => {
    const { name, value } = event.target;
    setSettings((previous) => ({ ...previous, [name]: value }));
  };

  const saveSettings = () => {
    // Demo persistence in this browser.
    try {
      localStorage.setItem("zostoSettings", JSON.stringify(settings));
      localStorage.setItem("zostoNotifications", JSON.stringify(notifications));
      setNotice("Settings saved successfully.");
    } catch {
      setNotice("Settings updated for this session.");
    }
  };

  const toggleNotification = (key) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const handleLogo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setNotice("Please upload a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setNotice("Logo must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result);
      setNotice("Logo preview updated. Save your changes to finish.");
    };
    reader.readAsDataURL(file);
  };

  const downloadBackup = () => {
    const backup = {
      storeSettings: settings,
      notifications,
      exportedAt: new Date().toISOString(),
      note: "This demo backup contains settings only, not inventory or order records.",
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zosto-settings-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Settings backup downloaded.");
  };

  const exportReports = () => {
    const rows = [
      ["Setting", "Value"],
      ...Object.entries(settings),
      ...Object.entries(notifications).map(([key, value]) => [
        `notification_${key}`,
        value ? "Enabled" : "Disabled",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zosto-settings-export.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Settings export downloaded.");
  };

  const clearCache = () => {
    // Deliberately does not clear authentication or application data.
    setNotice("Demo cache action completed. Your account and store data were not deleted.");
  };

  const updatePassword = (event) => {
    event.preventDefault();

    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setNotice("Please complete all password fields.");
      return;
    }

    if (passwords.next.length < 8) {
      setNotice("New password must contain at least 8 characters.");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setNotice("New password and confirmation do not match.");
      return;
    }

    setNotice("Password form validated. Connect your authentication API to update the password securely.");
    setPasswords({ current: "", next: "", confirm: "" });
  };

  return (
    <main className="zsettings">
      <header className="zs-page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your store settings and preferences.</p>
        </div>
      </header>

      {notice && (
        <div className="zs-notice" role="status">
          <span>✓ &nbsp;{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}

      <nav className="zs-tabs" aria-label="Settings sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`zs-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="zs-tab-icon">{tab.icon}</span>
            {tab.id}
          </button>
        ))}
      </nav>

      {activeTab === "General" && (
        <div className="zs-grid">
          <div className="zs-left-column">
            <section className="zs-card zs-store-card">
              <div className="zs-card-heading">
                <div className="zs-heading-icon blue">▣</div>
                <div>
                  <h2>Store Information</h2>
                  <p>Update your store details and basic information.</p>
                </div>
                <button className="zs-primary zs-save-top" onClick={saveSettings}>
                  Save Changes
                </button>
              </div>

              <div className="zs-store-form">
                <div className="zs-logo-upload">
                  <div className="zs-logo-preview">
                    {logo ? (
                      <img src={logo} alt="Store logo preview" />
                    ) : (
                      <span>▣</span>
                    )}
                  </div>
                  <label className="zs-upload-label">
                    Upload Logo
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogo}
                    />
                  </label>
                  <small>JPG, PNG (Max 2MB)</small>
                </div>

                <div className="zs-fields">
                  <label className="zs-field">
                    Store Name <b>*</b>
                    <input
                      name="storeName"
                      value={settings.storeName}
                      onChange={updateSetting}
                      required
                    />
                  </label>

                  <label className="zs-field">
                    Owner Name <b>*</b>
                    <input
                      name="ownerName"
                      value={settings.ownerName}
                      onChange={updateSetting}
                      required
                    />
                  </label>

                  <label className="zs-field">
                    Phone Number <b>*</b>
                    <input
                      name="phone"
                      value={settings.phone}
                      onChange={updateSetting}
                      required
                    />
                  </label>

                  <label className="zs-field">
                    Email Address
                    <input
                      type="email"
                      name="email"
                      value={settings.email}
                      onChange={updateSetting}
                    />
                  </label>

                  <label className="zs-field zs-full-field">
                    Store Address
                    <input
                      name="address"
                      value={settings.address}
                      onChange={updateSetting}
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="zs-card">
              <div className="zs-card-heading">
                <div className="zs-heading-icon blue">☷</div>
                <div>
                  <h2>Business Preferences</h2>
                  <p>Configure your business settings.</p>
                </div>
              </div>

              <div className="zs-fields zs-preference-fields">
                <label className="zs-field">
                  Currency
                  <select name="currency" value={settings.currency} onChange={updateSetting}>
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </label>

                <label className="zs-field">
                  Time Zone
                  <select name="timezone" value={settings.timezone} onChange={updateSetting}>
                    <option value="Asia/Kolkata">(GMT+5:30) India Standard Time</option>
                    <option value="UTC">(GMT+0:00) UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                  </select>
                </label>

                <label className="zs-field">
                  Date Format
                  <select name="dateFormat" value={settings.dateFormat} onChange={updateSetting}>
                    <option>DD MMM YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </label>

                <label className="zs-field">
                  Language
                  <select name="language" value={settings.language} onChange={updateSetting}>
                    <option>English</option>
                    <option>Telugu</option>
                    <option>Hindi</option>
                  </select>
                </label>

                <label className="zs-field zs-input-suffix">
                  Default Tax Rate (%)
                  <div>
                    <input
                      type="number"
                      name="tax"
                      min="0"
                      max="100"
                      value={settings.tax}
                      onChange={updateSetting}
                    />
                    <span>%</span>
                  </div>
                </label>

                <label className="zs-field zs-input-suffix">
                  Low Stock Alert Threshold
                  <div>
                    <input
                      type="number"
                      name="lowStock"
                      min="0"
                      value={settings.lowStock}
                      onChange={updateSetting}
                    />
                    <span>units</span>
                  </div>
                </label>
              </div>

              <div className="zs-card-footer">
                <button className="zs-primary" onClick={saveSettings}>
                  Save Preferences
                </button>
              </div>
            </section>
          </div>

          <div className="zs-right-column">
            <NotificationCard
              notifications={notifications}
              onToggle={toggleNotification}
            />
            <QuickActions
              onBackup={downloadBackup}
              onExport={exportReports}
              onClear={clearCache}
            />
          </div>
        </div>
      )}

      {activeTab === "Store" && (
        <section className="zs-card zs-secondary-page">
          <div className="zs-card-heading">
            <div className="zs-heading-icon blue">▣</div>
            <div>
              <h2>Store Settings</h2>
              <p>Manage your store information and business preferences.</p>
            </div>
          </div>
          <p className="zs-help-text">
            Update your store details in General settings. These settings control
            your store profile, currency, language, tax rate and low-stock threshold.
          </p>
          <button className="zs-primary" onClick={() => setActiveTab("General")}>
            Edit Store Information
          </button>
        </section>
      )}

      {activeTab === "Notifications" && (
        <section className="zs-card zs-secondary-page">
          <NotificationCard
            notifications={notifications}
            onToggle={toggleNotification}
          />
          <button className="zs-primary zs-secondary-save" onClick={saveSettings}>
            Save Notification Preferences
          </button>
        </section>
      )}

      {activeTab === "Integrations" && (
        <section className="zs-card zs-secondary-page">
          <div className="zs-card-heading">
            <div className="zs-heading-icon blue">↗</div>
            <div>
              <h2>Integrations</h2>
              <p>Connect services to extend your store capabilities.</p>
            </div>
          </div>
          <div className="zs-integration-list">
            {[
              ["WhatsApp", "Order notifications and customer communication", "Connect API"],
              ["Google Maps", "Location-based stock exchange", "Configure"],
              ["OpenAI", "Inventory insights and demand recommendations", "Configure"],
              ["Cloudinary", "Product and store image storage", "Configure"],
            ].map(([name, description, action]) => (
              <div className="zs-integration" key={name}>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <small>Not connected</small>
                </div>
                <button
                  className="zs-outline"
                  onClick={() => setNotice(`${name}: add your API credentials and backend integration to enable this service.`)}
                >
                  {action}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "Data & Backup" && (
        <section className="zs-card zs-secondary-page">
          <div className="zs-card-heading">
            <div className="zs-heading-icon blue">▤</div>
            <div>
              <h2>Data & Backup</h2>
              <p>Download settings and export configuration data.</p>
            </div>
          </div>
          <QuickActions
            onBackup={downloadBackup}
            onExport={exportReports}
            onClear={clearCache}
          />
          <p className="zs-help-text">
            The demo backup includes settings only. Connect your backend to
            back up inventory, customers, suppliers and orders.
          </p>
        </section>
      )}

      {activeTab === "Account" && (
        <div className="zs-card zs-secondary-page">
          <div className="zs-card-heading">
            <div className="zs-heading-icon blue">♙</div>
            <div>
              <h2>Account Security</h2>
              <p>Update your password and protect your account.</p>
            </div>
          </div>

          <form className="zs-password-form" onSubmit={updatePassword}>
            <label className="zs-field">
              Current Password
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                required
              />
            </label>

            <label className="zs-field">
              New Password
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                minLength={8}
                required
              />
            </label>

            <label className="zs-field">
              Confirm New Password
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                required
              />
            </label>

            <label className="zs-show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show passwords
            </label>

            <button type="submit" className="zs-primary">Update Password</button>
          </form>
          <p className="zs-help-text">
            Password changes require backend authentication to take effect securely.
          </p>
        </div>
      )}
    </main>
  );
}

function NotificationCard({ notifications, onToggle }) {
  return (
    <section className="zs-card zs-notification-card">
      <div className="zs-card-heading">
        <div className="zs-heading-icon blue">♟</div>
        <div>
          <h2>Notification Settings</h2>
          <p>Choose what notifications you want to receive.</p>
        </div>
      </div>

      <div className="zs-notification-list">
        {notificationItems.map((item) => (
          <div className="zs-notification-row" key={item.key}>
            <div className={`zs-notification-icon ${item.color}`}>
              {item.icon}
            </div>
            <div className="zs-notification-copy">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications[item.key]}
              aria-label={item.title}
              className={`zs-switch ${notifications[item.key] ? "on" : ""}`}
              onClick={() => onToggle(item.key)}
            >
              <span />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickActions({ onBackup, onExport, onClear }) {
  return (
    <section className="zs-card zs-quick-card">
      <div className="zs-card-heading">
        <div className="zs-heading-icon blue">▤</div>
        <div>
          <h2>Quick Actions</h2>
          <p>Manage your data and reports.</p>
        </div>
      </div>

      <div className="zs-quick-actions">
        <div className="zs-quick-item">
          <div className="zs-quick-icon blue">↓</div>
          <strong>Backup Data</strong>
          <span>Download your data</span>
          <button className="zs-quick-button blue" onClick={onBackup}>
            Download
          </button>
        </div>

        <div className="zs-quick-item">
          <div className="zs-quick-icon green">▤</div>
          <strong>Export Reports</strong>
          <span>Export settings data</span>
          <button className="zs-quick-button green" onClick={onExport}>
            Export
          </button>
        </div>

        <div className="zs-quick-item">
          <div className="zs-quick-icon orange">▣</div>
          <strong>Clear Cache</strong>
          <span>Free up storage space</span>
          <button className="zs-quick-button orange" onClick={onClear}>
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}
