import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { useState } from "react";

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

    const signupData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        ...(role === "shopkeeper"
            ? {
                storeName: storeName.trim(),
                storeLocation: storeLocation.trim(),
            }
            : {}),
    };

    try {
        let firebaseUser;

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
        } catch (err) {
            if (err.code !== "auth/email-already-in-use") {
                throw err;
            }

            // Account exists from a previous incomplete signup.
            const result = await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            firebaseUser = result.user;
        }

        // const API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");


const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

if (!API_URL) {
    throw new Error("VITE_API_URL is not configured in Netlify.");
}

const response = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        ...signupData,
        firebaseUid: firebaseUser.uid,
    }),
});


        const data = await response.json();

        if (!response.ok && response.status !== 409) {
            throw new Error(
                data.message || "Could not save signup details."
            );
        }

        // Profile saved, or already exists in MongoDB.
        navigate("/login", {
            state: {
                message: "Account is ready. Please log in.",
            },
        });
    } catch (err) {
        console.error("Signup error:", err);

        if (err.code === "auth/invalid-credential") {
            setError(
                "This email already has an account. Enter the correct password or log in."
            );
        } else if (err.code === "auth/weak-password") {
            setError("Choose a stronger password.");
        } else if (err.code === "auth/invalid-email") {
            setError("Enter a valid email address.");
        } else {
            setError(
                err.message ||
                "Unable to complete signup. Please try again."
            );
        }
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
