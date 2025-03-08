// components/Notification.tsx
import React from "react";

type NotificationProps = {
    message: string | null;
    onClose: () => void;
};

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div
            className="notification is-success is-light"
            style={{
                position: "fixed",
                top: "1rem",
                right: "1rem",
                zIndex: 50,
                maxWidth: "300px",
            }}
        >
            <button className="delete" onClick={onClose}></button>
            {message}
        </div>
    );
};

export default Notification;
