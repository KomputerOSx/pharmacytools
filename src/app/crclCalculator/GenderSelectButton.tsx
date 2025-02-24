import React, { useState } from "react";

interface GenderButtonGroupProps {
    onSelect: (gender: string) => void;
}

function GenderSelectButton({ onSelect }: GenderButtonGroupProps) {
    const [selected, setSelected] = useState("Male");

    const handleSelection = (buttonName: string) => {
        setSelected(buttonName);
        onSelect(buttonName);
    };

    return (
        <div className="buttons has-addons">
            <button
                className={`button ${selected === "Male" ? "is-link is-selected" : ""}`}
                onClick={() => handleSelection("Male")}
            >
                Male
            </button>

            <button
                className={`button ${selected === "Female" ? "is-danger is-selected" : ""}`}
                onClick={() => handleSelection("Female")}
            >
                Female
            </button>
        </div>
    );
}

export default GenderSelectButton;
