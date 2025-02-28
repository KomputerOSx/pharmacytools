// AppShowcase.jsx or AppShowcase.tsx
import React, { useState, useEffect } from "react";
import AppCard from "./WebAppCard";
import "./WebAppsShowcase.css";

interface App {
    data: {
        tags: string[];
    };
}

const AppShowcase = () => {
    const [apps, setApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        async function fetchApps() {
            try {
                setLoading(true);
                const response = await fetch("/api/webApps");

                if (!response.ok) {
                    throw new Error("Failed to fetch apps");
                }

                const data = await response.json();
                setApps(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred",
                );
            } finally {
                setLoading(false);
            }
        }

        fetchApps();
    }, []);

    // Get all unique tags from apps
    const getAllTags = () => {
        const tags = new Set();
        tags.add("All");

        apps.forEach((app) => {
            app.data.tags.forEach((tag) => tags.add(tag));
        });

        return Array.from(tags);
    };

    // Filter apps by tag
    const filteredApps =
        activeFilter === "All"
            ? apps
            : apps.filter((app) => app.data.tags.includes(activeFilter));

    if (loading) {
        return <div className="app-loading">Loading applications...</div>;
    }

    if (error) {
        return <div className="app-error">Error: {error}</div>;
    }

    return (
        <div className="app-showcase">
            <h2 className="showcase-title">Web Applications</h2>

            <div className="app-grid">
                {filteredApps.length > 0 ? (
                    filteredApps.map((app) => <AppCard app={app} />)
                ) : (
                    <p className="no-apps">
                        No applications found with the selected filter.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AppShowcase;
