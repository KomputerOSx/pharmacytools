"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminContacts from "./AdminContacts";

const SESSION_KEY = "admin_session";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = () => {
            try {
                const sessionData = localStorage.getItem(SESSION_KEY);
                if (!sessionData) {
                    router.push("/webApps/contacts/admin/login");
                    return;
                }

                const session = JSON.parse(sessionData);
                if (Date.now() > session.expiry) {
                    // Session expired
                    localStorage.removeItem(SESSION_KEY);
                    router.push("/webApps/contacts/admin/login");
                    return;
                }

                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem(SESSION_KEY);
                router.push("/webApps/contacts/admin/login");
            } finally {
                setChecking(false);
            }
        };

        checkSession();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem(SESSION_KEY);
        router.push("/webApps/contacts/admin/login");
    };

    if (checking) {
        return (
            <div className="container" style={{ marginTop: "100px", textAlign: "center" }}>
                <button className="button is-loading is-large is-ghost">Loading</button>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div>
            <div className="container" style={{ padding: "20px" }}>
                <div className="is-flex is-justify-content-flex-end mb-4">
                    <button className="button is-light" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <AdminContacts />
        </div>
    );
}
