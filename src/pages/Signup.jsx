
import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import "./Auth.css";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("shopkeeper");
    const [storeName, setStoreName] = useState("");
    const [storeLocation, setStoreLocation] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    async function handleSignup(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        let firebaseUser = null;

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            firebaseUser = result.user;

            await updateProfile(firebaseUser, {
                displayName: name.trim(),
            });

            const signupData = {
                name: name.trim(),
                email: email.trim(),
                role,
                firebaseUid: firebaseUser.uid,
            };

            if (role === "shopkeeper") {
                signupData.storeName = storeName.trim();
                signupData.storeLocation = storeLocation.trim();
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(signupData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not save signup details.");
            }

            navigate("/login");
        } catch (err) {
            console.error("Signup error:", err);

            setError(
                err.code === "auth/email-already-in-use"
                    ? "This email is already registered."
                    : err.code === "auth/weak-password"
                        ? "Choose a stronger password."
                        : err.code === "auth/invalid-email"
                            ? "Enter a valid email address."
                            : err.message || "Signup failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }


    return (
        <main className="auth-page">
            <form className="auth-card" onSubmit={handleSignup}>
                <h1>Create Your Zosto Account</h1>
                <p>Start managing your business smarter.</p>

                <label htmlFor="signup-role">Account type</label>
                <select
                    id="signup-role"
                    className="auth-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="shopkeeper">Shopkeeper</option>
                    <option value="deliveryAgent">Delivery Agent</option>
                </select>

                <label htmlFor="signup-name">Full name</label>
                <input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                />

                {role === "shopkeeper" && (
                    <>
                        <label htmlFor="store-name">Store name</label>
                        <input
                            id="store-name"
                            type="text"
                            placeholder="Enter your store name"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            required
                        />

                        <label htmlFor="store-location">
                            Store location / address
                        </label>
                        <input
                            id="store-location"
                            type="text"
                            placeholder="Enter your store address"
                            value={storeLocation}
                            onChange={(e) => setStoreLocation(e.target.value)}
                            required
                        />
                    </>
                )}

                <label htmlFor="signup-email">Email address</label>
                <input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />

                <label htmlFor="signup-password">Password</label>
                <input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    required
                />

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </main>
    );
}
