
import { useEffect, useState } from "react";
import { onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import BackToDashboard from "../components/BackToDashboard";

import {
  LocationOn,
  Save,
  ArrowBack,
  Lock,
} from "@mui/icons-material";

export default function ChangeLocation() {
  const navigate = useNavigate();

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setError("");
      setSuccess("");

      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `${apiUrl}/api/users/${user.uid}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load your store profile."
          );
        }

        if (data.user.role !== "shopkeeper") {
          throw new Error(
            "Only shopkeepers can change store location."
          );
        }

        setLocation(data.user.storeLocation || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [apiUrl]);

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!firebaseUser) {
      setError("Please log in before changing your location.");
      return;
    }

    if (!location.trim() || !password) {
      setError("Enter your location and password.");
      return;
    }

    if (!firebaseUser.email) {
      setError("Your account does not have an email address.");
      return;
    }

    setSaving(true);

    try {
      // Verify the current user's password with Firebase.
      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        password
      );

      await reauthenticateWithCredential(
        firebaseUser,
        credential
      );

      // Update the location in the backend.
      const response = await fetch(
        `${apiUrl}/api/users/${firebaseUser.uid}/location`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeLocation: location.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update store location."
        );
      }

      setLocation(data.storeLocation || location.trim());
      setPassword("");
      setSuccess("Store location updated successfully!");
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-login-credentials"
      ) {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "24px",
      background: "#f3f6fb",
      fontFamily: "Arial, sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "480px",
      boxSizing: "border-box",
      padding: "30px",
      border: "1px solid #e5eaf2",
      borderRadius: "18px",
      background: "#fff",
      boxShadow: "0 12px 35px rgba(15,23,42,0.08)",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      color: "#334155",
      fontSize: "14px",
      fontWeight: 600,
    },
    input: {
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 14px",
      border: "1px solid #cbd5e1",
      borderRadius: "10px",
      background: "#fff",
      color: "#14213d",
      fontSize: "15px",
      outlineColor: "#2563eb",
    },
    primaryButton: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "9px",
      marginTop: "22px",
      padding: "14px",
      border: "none",
      borderRadius: "10px",
      background: "#2563eb",
      color: "#fff",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
    },
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: 0,
            marginBottom: "26px",
            border: "none",
            background: "transparent",
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          <ArrowBack fontSize="small" />
          Back
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "13px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "grid",
              placeItems: "center",
              width: "50px",
              height: "50px",
              flexShrink: 0,
              borderRadius: "13px",
              background: "#eff6ff",
              color: "#2563eb",
            }}
          >
            <LocationOn fontSize="large" />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                color: "#14213d",
                fontSize: "24px",
              }}
            >
              Change Store Location
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Update your shop address securely.
            </p>
          </div>
        </div>

        <div
          style={{
            height: "1px",
            background: "#e9edf4",
            margin: "24px 0",
          }}
        />

        {loading ? (
          <p style={{ color: "#64748b" }}>
            Loading your store details...
          </p>
        ) : (
          <>
            {!firebaseUser && (
              <p
                style={{
                  padding: "12px",
                  borderRadius: "9px",
                  background: "#fff7ed",
                  color: "#9a3412",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                Please log in to your account before saving a
                location change.
              </p>
            )}

            <form onSubmit={handleSave}>
              <label
                htmlFor="storeLocation"
                style={styles.label}
              >
                <LocationOn
                  fontSize="small"
                  style={{ verticalAlign: "middle" }}
                />{" "}
                Store location / address
              </label>

              <input
                id="storeLocation"
                type="text"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter your store address"
                required
                disabled={!firebaseUser}
                style={styles.input}
              />

              <label
                htmlFor="password"
                style={{ ...styles.label, marginTop: "20px" }}
              >
                <Lock
                  fontSize="small"
                  style={{ verticalAlign: "middle" }}
                />{" "}
                Confirm your password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Enter your account password"
                autoComplete="current-password"
                required
                disabled={!firebaseUser}
                style={styles.input}
              />

              <p
                style={{
                  margin: "9px 0 0",
                  color: "#64748b",
                  fontSize: "12px",
                  lineHeight: 1.5,
                }}
              >
                Your password is verified by Firebase and is not
                saved in your database.
              </p>

              {error && (
                <p
                  role="alert"
                  style={{
                    color: "#dc2626",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </p>
              )}

              {success && (
                <p
                  role="status"
                  style={{
                    color: "#15803d",
                    fontSize: "14px",
                  }}
                >
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={!firebaseUser || saving || Boolean(error)}
                style={{
                  ...styles.primaryButton,
                  opacity:
                    !firebaseUser || saving || error ? 0.6 : 1,
                  cursor:
                    !firebaseUser || saving || error
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <Save />
                {saving ? "Saving..." : "Save Location"}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
