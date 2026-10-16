
import React, { useRef, useState } from "react";
import "./Profile.css";
import BackToDashboard from "../components/BackToDashboard";

const initialProfile = {
  fullName: "Ramesh",
  storeName: "Ramesh Stores",
  email: "rameshstore@gmail.com",
  phone: "+91 98765 43210",
  location: "Nellore, Andhra Pradesh",
  storeType: "Retail Store",
  role: "Shopkeeper",
};

const tabs = [
  { id: "personal", icon: "♟", label: "Personal Information" },
  { id: "store", icon: "▣", label: "Store Details" },
  { id: "security", icon: "🔒", label: "Security" },
  { id: "preferences", icon: "⚙", label: "Preferences" },
  { id: "notifications", icon: "♟", label: "Notifications" },
];

function ProfileField({ label, icon, value, onChange, type = "text" }) {
  return (
    <label className="profile-field">
      <span className="profile-field-label">{label}</span>
      <span className="profile-input-wrap">
        <span className="profile-input-icon">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
      </span>
    </label>
  );
}

function PasswordField({ label, value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="profile-field">
      <span className="profile-field-label">{label}</span>
      <span className="profile-input-wrap password-input-wrap">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="profile-eye-button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "◉" : "◎"}
        </button>
      </span>
    </label>
  );
}

function MetricCard({ icon, label, value, subtext, type }) {
  return (
    <div className={`profile-metric ${type}`}>
      <div className="profile-metric-icon">{icon}</div>
      <div className="profile-metric-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{subtext}</small>
      </div>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [activeTab, setActiveTab] = useState("personal");
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState("");
  const [message, setMessage] = useState("");
  const [preferences, setPreferences] = useState({
    language: "English",
    lowStock: true,
    expiryAlerts: true,
    orderUpdates: true,
    salesReports: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const photoInput = useRef(null);

  const updateProfile = (field, value) => {
    setProfile(previous => ({ ...previous, [field]: value }));
  };

  const updatePassword = (field, value) => {
    setPasswords(previous => ({ ...previous, [field]: value }));
  };

  const showMessage = text => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3500);
  };

  const saveProfile = event => {
    event.preventDefault();

    if (!profile.fullName.trim() || !profile.storeName.trim()) {
      showMessage("Please enter your name and store name.");
      return;
    }

    setEditing(false);
    showMessage("Profile details saved for this session.");
  };

  const handlePhoto = event => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      showMessage("Please select a JPG or PNG image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage("Photo must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
      showMessage("Profile photo updated for this session.");
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto("");
    if (photoInput.current) photoInput.current.value = "";
    showMessage("Profile photo removed.");
  };

  const changePassword = event => {
    event.preventDefault();

    if (!passwords.current || !passwords.next || !passwords.confirm) {
      showMessage("Please complete all password fields.");
      return;
    }

    if (passwords.next.length < 8) {
      showMessage("New password must contain at least 8 characters.");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      showMessage("New password and confirmation do not match.");
      return;
    }

    showMessage(
      "Password form validated. Connect your backend to change the password securely."
    );

    setPasswords({ current: "", next: "", confirm: "" });
  };

  const togglePreference = key => {
    setPreferences(previous => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const renderPersonal = () => (
    <div className="profile-content-grid">
      <section className="profile-card profile-personal-card">
        <h3><span>♟</span> Personal Information</h3>

        <form onSubmit={saveProfile}>
          <ProfileField
            label="Full Name"
            icon="♟"
            value={profile.fullName}
            onChange={e => updateProfile("fullName", e.target.value)}
          />

          <ProfileField
            label="Email Address"
            icon="✉"
            type="email"
            value={profile.email}
            onChange={e => updateProfile("email", e.target.value)}
          />

          <ProfileField
            label="Phone Number"
            icon="☎"
            value={profile.phone}
            onChange={e => updateProfile("phone", e.target.value)}
          />

          <ProfileField
            label="Location"
            icon="●"
            value={profile.location}
            onChange={e => updateProfile("location", e.target.value)}
          />

          <button className="profile-primary-button" type="submit">
            Save Changes
          </button>
        </form>
      </section>

      <div className="profile-right-column">
        <section className="profile-card profile-photo-card">
          <h3><span>⬟</span> Profile Photo</h3>

          <div className="profile-photo-content">
            <div className="profile-avatar profile-avatar-small">
              {photo ? (
                <img src={photo} alt="Shopkeeper profile" />
              ) : (
                <span className="profile-avatar-person">●</span>
              )}
            </div>

            <div className="profile-upload-info">
              <strong>Upload Profile Photo</strong>
              <small>JPG, PNG (Max 2MB)</small>

              <div className="profile-photo-actions">
                <button
                  className="profile-primary-button"
                  type="button"
                  onClick={() => photoInput.current?.click()}
                >
                  ↑ Upload Photo
                </button>

                <button
                  className="profile-danger-button"
                  type="button"
                  onClick={removePhoto}
                >
                  ▤ Remove
                </button>
              </div>

              <input
                ref={photoInput}
                type="file"
                accept="image/png,image/jpeg"
                hidden
                onChange={handlePhoto}
              />
            </div>
          </div>
        </section>

        <section className="profile-card profile-password-card">
          <h3><span>🔒</span> Change Password</h3>

          <form onSubmit={changePassword}>
            <div className="profile-password-grid">
              <PasswordField
                label="Current Password"
                value={passwords.current}
                onChange={e => updatePassword("current", e.target.value)}
                placeholder="Enter current password"
              />

              <PasswordField
                label="New Password"
                value={passwords.next}
                onChange={e => updatePassword("next", e.target.value)}
                placeholder="Enter new password"
              />

              <PasswordField
                label="Confirm New Password"
                value={passwords.confirm}
                onChange={e => updatePassword("confirm", e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <button className="profile-primary-button" type="submit">
              Update Password
            </button>
          </form>
        </section>
      </div>
    </div>
  );

  const renderStore = () => (
    <section className="profile-card profile-settings-card">
      <h3>▣ Store Details</h3>
      <form onSubmit={saveProfile}>
        <ProfileField
          label="Store Name"
          icon="▣"
          value={profile.storeName}
          onChange={e => updateProfile("storeName", e.target.value)}
        />

        <ProfileField
          label="Store Type"
          icon="▤"
          value={profile.storeType}
          onChange={e => updateProfile("storeType", e.target.value)}
        />

        <ProfileField
          label="Store Location"
          icon="●"
          value={profile.location}
          onChange={e => updateProfile("location", e.target.value)}
        />

        <ProfileField
          label="Contact Number"
          icon="☎"
          value={profile.phone}
          onChange={e => updateProfile("phone", e.target.value)}
        />

        <button className="profile-primary-button" type="submit">
          Save Store Details
        </button>
      </form>
    </section>
  );

  const renderSecurity = () => (
    <section className="profile-card profile-settings-card">
      <h3>🔒 Security Settings</h3>
      <p className="profile-settings-description">
        Protect your shopkeeper account and keep your information secure.
      </p>

      <div className="profile-setting-row">
        <div>
          <strong>Account Status</strong>
          <small>Your account is currently active.</small>
        </div>
        <span className="profile-status-active">Active</span>
      </div>

      <div className="profile-setting-row">
        <div>
          <strong>Password security</strong>
          <small>Use a strong password with at least 8 characters.</small>
        </div>
        <button
          className="profile-outline-button"
          type="button"
          onClick={() => setActiveTab("personal")}
        >
          Change Password
        </button>
      </div>

      <div className="profile-setting-row">
        <div>
          <strong>Login verification</strong>
          <small>Additional verification can be enabled through your backend.</small>
        </div>
        <span className="profile-status-neutral">Not configured</span>
      </div>
    </section>
  );

  const renderPreferences = () => (
    <section className="profile-card profile-settings-card">
      <h3>⚙ Preferences</h3>
      <p className="profile-settings-description">
        Customize the dashboard to suit your shop.
      </p>

      <label className="profile-field profile-language-field">
        <span className="profile-field-label">Display Language</span>
        <select
          value={preferences.language}
          onChange={e => setPreferences(previous => ({
            ...previous,
            language: e.target.value,
          }))}
        >
          <option>English</option>
          <option>తెలుగు (Telugu)</option>
          <option>हिन्दी (Hindi)</option>
        </select>
      </label>

      {[
        ["lowStock", "Low-stock alerts", "Get notified when products run low."],
        ["expiryAlerts", "Expiry alerts", "Track products nearing expiry."],
        ["orderUpdates", "Order updates", "Receive updates on customer orders."],
        ["salesReports", "Sales reports", "Receive periodic sales summaries."],
      ].map(([key, title, description]) => (
        <label className="profile-setting-row" key={key}>
          <div>
            <strong>{title}</strong>
            <small>{description}</small>
          </div>
          <input
            type="checkbox"
            checked={preferences[key]}
            onChange={() => togglePreference(key)}
          />
        </label>
      ))}

      <button
        className="profile-primary-button"
        type="button"
        onClick={() => showMessage("Preferences saved for this session.")}
      >
        Save Preferences
      </button>
    </section>
  );

  const renderNotifications = () => (
    <section className="profile-card profile-settings-card">
      <h3>♟ Notifications</h3>
      <p className="profile-settings-description">
        Choose which store notifications you want to receive.
      </p>

      {[
        ["lowStock", "Low-stock notifications", "Know when stock needs reordering."],
        ["expiryAlerts", "Expiry notifications", "Reduce waste from expired products."],
        ["orderUpdates", "Order notifications", "Track pending, shipped and delivered orders."],
        ["salesReports", "Sales summaries", "Review daily and monthly performance."],
      ].map(([key, title, description]) => (
        <label className="profile-setting-row" key={key}>
          <div>
            <strong>{title}</strong>
            <small>{description}</small>
          </div>
          <input
            type="checkbox"
            checked={preferences[key]}
            onChange={() => togglePreference(key)}
          />
        </label>
      ))}

      <button
        className="profile-primary-button"
        type="button"
        onClick={() => showMessage("Notification preferences saved for this session.")}
      >
        Save Notification Settings
      </button>
    </section>
  );

  const tabContent = {
    personal: renderPersonal,
    store: renderStore,
    security: renderSecurity,
    preferences: renderPreferences,
    notifications: renderNotifications,
  };

  return (
    <main className="profile-page">
      <header className="profile-page-heading">
        <div>
          <h1>Profile</h1>
          <p>Manage your account and store settings.</p>
        </div>
      </header>

      {message && (
        <div className="profile-toast" role="status">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <section className="profile-overview-card">
        <div className="profile-overview-top">
          <div className="profile-avatar profile-avatar-large">
            {photo ? (
              <img src={photo} alt="Shopkeeper profile" />
            ) : (
              <span className="profile-avatar-person">●</span>
            )}
            <button
              type="button"
              className="profile-camera-button"
              onClick={() => photoInput.current?.click()}
              aria-label="Change profile photo"
            >
              📷
            </button>
          </div>

          <div className="profile-overview-details">
            <div className="profile-name-line">
              <h2>{profile.storeName}</h2>
              <span className="profile-role-badge">{profile.role}</span>
            </div>

            <p>✉ &nbsp; {profile.email}</p>
            <p>☎ &nbsp; {profile.phone}</p>
            <p>● &nbsp; {profile.location}</p>
            <p>▦ &nbsp; Joined on 12 Jan 2026</p>
          </div>

          <button
            className="profile-outline-button profile-edit-button"
            type="button"
            onClick={() => {
              setActiveTab("personal");
              setEditing(!editing);
              showMessage(
                editing
                  ? "Editing mode disabled."
                  : "You can now edit your profile information."
              );
            }}
          >
            ✎ {editing ? "Done Editing" : "Edit Profile"}
          </button>
        </div>

        <div className="profile-overview-metrics">
          <MetricCard
            icon="▣"
            label="Store Name"
            value={profile.storeName}
            subtext={profile.storeType}
            type="overview-blue"
          />
          <MetricCard
            icon="●"
            label="Store Location"
            value="Nellore, AP"
            subtext="Andhra Pradesh"
            type="overview-green"
          />
          <MetricCard
            icon="▦"
            label="Member Since"
            value="12 Jan 2026"
            subtext="Member account"
            type="overview-orange"
          />
          <MetricCard
            icon="⬟"
            label="Account Status"
            value="Active"
            subtext="Account features enabled"
            type="overview-purple"
          />
        </div>
      </section>

      <nav className="profile-tabs" aria-label="Profile settings">
        {tabs.map(tab => (
          <button
            type="button"
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {tabContent[activeTab]()}
    </main>
  );
}
