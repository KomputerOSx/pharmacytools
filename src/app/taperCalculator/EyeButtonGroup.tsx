
import React, { useState } from 'react';

interface EyeButtonGroupProps {
    onSelect: (eye: string) => void;
}

const EyeButtonGroup: React.FC<EyeButtonGroupProps> = ({ onSelect }) => {
    const [selected, setSelected] = useState('Left');

    const handleSelection = (buttonName: string) => {
        setSelected(buttonName);
        // Call the onSelect prop with the selected eye
        onSelect(buttonName);
    };

    return (
        <div className="buttons has-addons field">
            <button
                className={`button ${selected === 'Left' ? 'is-primary is-selected' : ''}`}
                onClick={() => handleSelection('Left')}
            >
                Left
            </button>
            <button
                className={`button ${selected === 'Both' ? 'is-primary is-selected' : ''}`}
                onClick={() => handleSelection('Both')}
            >
                Both
            </button>
            <button
                className={`button ${selected === 'Right' ? 'is-primary is-selected' : ''}`}
                onClick={() => handleSelection('Right')}
            >
                Right
            </button>
        </div>
    );
};

export default EyeButtonGroup;