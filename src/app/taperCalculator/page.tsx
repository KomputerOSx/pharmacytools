"use client";

import React, { useState } from "react";

function TaperCalculator() {
    const [taperLines, setTaperLines] = useState([
        { dose: 0, taperAmount: 0, interval: 0 },
    ]);

    // Add a new taper line
    const handleAddTaper = () => {
        setTaperLines([
            ...taperLines,
            { dose: 0, taperAmount: 0, interval: 0 },
        ]);
    };

    // Delete a specific taper line
    const handleDeleteTaper = (index) => {
        setTaperLines(taperLines.filter((_, i) => i !== index));
    };

    // Update a specific field in a specific taper line
    const handleInputChange = (index: number, field: string, value: number) => {
        const updatedTaperLines = [...taperLines];
        // @ts-ignore
        updatedTaperLines[index][field] = value;
        setTaperLines(updatedTaperLines);
    };

    // Handle calculations (you can replace this with actual logic)
    const handleCalculate = () => {
        let taperLabel = document.getElementById("taperLabel");
        if (taperLabel) {
            taperLabel.innerHTML = ''; // Clear the existing content
            for (let i = 0; i < taperLines.length; i++) {
                let currentDose = taperLines[i].dose;
                while (currentDose >= taperLines[i].taperAmount) {
                    console.log(`Take ${currentDose}mg for ${taperLines[i].interval} days`);
                    // Create a new paragraph element for each taper calculation
                    const paragraph = document.createElement('p');
                    paragraph.textContent = `Take ${currentDose}mg for ${taperLines[i].interval} days`;
                    taperLabel.appendChild(paragraph);
                    currentDose -= taperLines[i].taperAmount;
                }
            }
        } else {
            console.error("Element with id 'taperLabel' not found");
        }
    }
    return (
        <>
            <div>
                <h1 className={"title is-1"}>Taper Calculator</h1>

                {/* Render each taper line */}
                {taperLines.map((taperLine, index) => (
                    <span key={index} style={{ display: "flex", gap: "1rem" }}>
                        {/* Dose Input */}
                        <div className="field">
                            <label className="label">Dose</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="number"
                                    placeholder="Enter Dose"
                                    value={taperLine.dose}
                                    onChange={(e) =>
                                        handleInputChange(index, "dose", parseFloat(e.target.value) || 0)
                                    }
                                />
                            </div>
                        </div>

                        {/* Taper Amount Input */}
                        <div className="field">
                            <label className="label">Taper Amount</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="number"
                                    placeholder="Enter Taper Amount"
                                    value={taperLine.taperAmount}
                                    onChange={(e) =>
                                        handleInputChange(index, "taperAmount", parseFloat(e.target.value) || 0)
                                    }
                                />
                            </div>
                        </div>

                        {/* Interval Input */}
                        <div className="field">
                            <label className="label">Interval</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="number"
                                    placeholder="Enter Interval"
                                    value={taperLine.interval}
                                    onChange={(e) =>
                                        handleInputChange(index, "interval", parseFloat(e.target.value) || 0)
                                    }
                                />
                            </div>
                        </div>

                        {/* Delete Button */}
                        <div className="field" style={{ marginTop: "1.5rem" }}>
                            <button
                                className="button is-danger"
                                onClick={() => handleDeleteTaper(index)}
                            >
                                X
                            </button>
                        </div>
                    </span>
                ))}

                {/* Buttons for Adding and Calculating */}
                <div className="field">
                    <button
                        className="button is-warning"
                        style={{ marginRight: "1rem" }}
                        onClick={handleAddTaper}
                    >
                        Add Taper
                    </button>
                    <button
                        className="button is-primary"
                        onClick={handleCalculate}
                    >
                        Calculate
                    </button>
                </div>
            </div>

            <div className={"container"} id={"taperLabel"}>
                <h1 className={"title is-1"}>Taper Label</h1>

            </div>
        </>
    );
}

export default TaperCalculator;
