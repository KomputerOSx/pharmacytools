"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "admin_session";
const SESSION_EXPIRY_HOURS = 24;

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password, type: "admin" }),
            });

            const data = await response.json();

            if (data.success) {
                // Store session with expiry and PIN for Firestore operations
                const session = {
                    token: data.token,
                    pin: password,
                    expiry: Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000,
                };
                localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                router.push("/webApps/contacts/admin");
            } else {
                setError(data.error || "Invalid PIN");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: "400px", marginTop: "100px" }}>
            <div className="box">
                <h1 className="title is-3 has-text-centered">Admin Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label">Admin PIN</label>
                        <div className="control">
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin PIN"
                                autoFocus
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="notification is-danger is-light">
                            {error}
                        </div>
                    )}

                    <div className="field">
                        <div className="control">
                            <button
                                type="submit"
                                className={`button is-primary is-fullwidth ${loading ? "is-loading" : ""}`}
                                disabled={loading || !password}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
