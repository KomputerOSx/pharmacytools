// Dropdown.tsx
import React, { useState } from 'react';

interface DropdownProps {
    selectedItem: string;
    onItemSelect: (item: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ selectedItem, onItemSelect }) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    const toggleDropdown = (): void => {
        setIsActive(!isActive);
    };

    const handleItemClick = (item: string): void => {
        onItemSelect(item);
        setIsActive(false);
    };

    return (
        <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
            <div className="dropdown-trigger">
                <button
                    className="button"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                    onClick={toggleDropdown}
                >
                    <span>{selectedItem}</span>
                    <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    <a href="#" className="dropdown-item" onClick={() => handleItemClick('Tablet Taper')}>Tablet Taper</a>
                    <a href="#" className="dropdown-item" onClick={() => handleItemClick('Eye Drop Taper')}>Eye Drop Taper</a>
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
