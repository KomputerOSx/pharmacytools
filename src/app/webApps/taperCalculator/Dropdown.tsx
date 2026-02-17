// Dropdown.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

interface DropdownProps {
    selectedItem: string;
    onItemSelect: (item: string) => void;
    onHelpClick?: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ selectedItem, onItemSelect, onHelpClick }) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    const toggleDropdown = (): void => {
        setIsActive(!isActive);
    };

    const handleItemClick = (item: string): void => {
        onItemSelect(item);
        setIsActive(false);
    };

    return (
        <>
            <p style={{ marginBottom: "0.5rem" }}>
                <strong>Select Taper</strong>
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <div
                    className={`dropdown ${isActive ? "is-active" : ""}`}
                >
                    <div className="dropdown-trigger">
                        <button
                            className="button"
                            aria-haspopup="true"
                            aria-controls="dropdown-menu"
                            onClick={toggleDropdown}
                        >
                            <span>{selectedItem}</span>
                            <span className="icon is-small">
                                <FontAwesomeIcon
                                    icon={faAngleDown}
                                    aria-hidden="true"
                                />
                            </span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                        <div className="dropdown-content">
                            <a
                                href="#"
                                className="dropdown-item"
                                onClick={() => handleItemClick("Prednisolone Taper")}
                            >
                                Prednisolone Taper
                            </a>
                            <a
                                href="#"
                                className="dropdown-item"
                                onClick={() => handleItemClick("Dexamethasone Taper")}
                            >
                                Dexamethasone Taper
                            </a>
                            <a
                                href="#"
                                className="dropdown-item"
                                onClick={() => handleItemClick("Eye Drop Taper")}
                            >
                                Eye Drop Taper
                            </a>
                        </div>
                    </div>
                </div>
                {onHelpClick && (
                    <button
                        className="button is-info is-light"
                        onClick={onHelpClick}
                    >
                        ?
                    </button>
                )}
            </div>
        </>
    );
};

export default Dropdown;
