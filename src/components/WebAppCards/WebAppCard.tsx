// AppCard.jsx or AppCard.tsx
import React from "react";
import "./WebAppCard.css";

// @ts-ignore
const AppCard = ({ app }) => {
    return (
        <div className="app-card">
            <div className="app-card-header">
                {app.data.icon ? (
                    <img
                        src={app.data.icon}
                        alt={`${app.data.name} icon`}
                        className="app-icon"
                    />
                ) : (
                    <div className="app-icon-placeholder">
                        {app.data.name.charAt(0)}
                    </div>
                )}
            </div>
            <div className="app-card-body">
                <h3 className="app-name">{app.data.name}</h3>
                <p className="app-description">{app.data.description}</p>

                <div className="app-tags">
                    {app.data.tags.map((tag: string, index: number) => (
                        <span key={index} className="app-tag">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="app-meta">
                    <span className="app-version">v{app.data.version}</span>
                    <span className="app-author">by {app.data.author}</span>
                </div>

                <a href={app.path} className="app-link">
                    Open App
                </a>
            </div>
        </div>
    );
};

export default AppCard;
