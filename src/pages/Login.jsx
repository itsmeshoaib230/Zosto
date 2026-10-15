
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase/firebase";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential"
          ? "Incorrect email or password."
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/Dashboard");
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setError("");

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setError("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError("Unable to send reset email. Check your email address.");
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>Welcome to Zosto</h1>
        <p>Login to manage your inventory smarter.</p>

        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button
          type="button"
          className="auth-forgot"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </button>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>

        <div className="auth-divider">
          <span />
          <p>OR</p>
          <span />
        </div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continue with Google
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </main>
  );
}
