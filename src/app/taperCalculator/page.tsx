"use client";

import React, { useState } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';



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
    const handleDeleteTaper = (index: number) => {
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
            let textToCopy = ''; // Initialize the textToCopy variable
            let currentDose = taperLines[0].dose; // Start with the highest dose

            let startDateInput = document.getElementById('date-selector');
            let startDate = startDateInput.value ? new Date(startDateInput.value) : null;

            for (let i = 0; i < taperLines.length; i++) {
                let nextDose = i < taperLines.length - 1 ? taperLines[i + 1].dose : 0;

                while (currentDose > nextDose) {
                    console.log(`Take ${currentDose}mg for ${taperLines[i].interval} days`);
                    const paragraph = document.createElement('p');
                    paragraph.className = "field";
                    let fiveMilligramTablets = Math.floor(currentDose / 5);
                    let oneMilligramTablets = currentDose % 5;
                    let text;
                    if (fiveMilligramTablets > 0) {
                        text = `Take ${numberToWords(fiveMilligramTablets)} 5mg tablets`;
                    } else {
                        text = '';
                    }
                    if (oneMilligramTablets > 0) {
                        if (text !== '') {
                            text += ` and ${numberToWords(oneMilligramTablets)} 1mg tablets`;
                        } else {
                            text = `Take ${numberToWords(oneMilligramTablets)} 1mg tablets`;
                        }
                    }
                    text += ` (a ${currentDose}mg dose)`;

                    if (startDate) {
                        let endDate = new Date(startDate.getTime() + taperLines[i].interval * 24 * 60 * 60 * 1000);
                        text += ` from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
                        startDate = endDate;
                    } else {
                        text += ` for ${taperLines[i].interval} days`;
                    }

                    paragraph.textContent = text;
                    taperLabel.appendChild(paragraph);
                    textToCopy += text + '\n'; // Update the textToCopy variable

                    currentDose = Math.max(nextDose, currentDose - taperLines[i].taperAmount);
                }
            }
            setTextToCopy(textToCopy); // Update the textToCopy state
        } else {
            console.error("Element with id 'taperLabel' not found");
        }
    }


    function numberToWords(num) {
        const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
        const teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
        const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

        if (num < 10) {
            return ones[num];
        } else if (num < 20) {
            return teens[num - 10];
        } else if (num < 100) {
            return tens[Math.floor(num / 10)] + (num % 10 === 0 ? '' : ' ' + ones[num % 10]);
        } else {
            // implement hundreds, thousands, etc.
            return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 === 0 ? '' : ' and ' + numberToWords(num % 100));
        }
    }

    const [textToCopy, setTextToCopy] = useState(''); // The text you want to copy
    const [copyStatus, setCopyStatus] = useState(false); // To indicate if the text was copied

    const onCopyText = () => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 5000); // Reset status after 2 seconds
    };

    return (
        <>

            <div>
                <h1 className={"title is-1"}>Taper Calculator</h1>

                <div className="field" style={{maxWidth: '204px'}}>
                    <label className="label">Select a date (Optional)</label>
                    <div className="control">
                        <input className="input is-medium" type="date" id="date-selector" name="date-selector"/>
                    </div>
                </div>


                {/* Render each taper line */}
                {taperLines.map((taperLine, index) => (
                    <span key={index} style={{display: "flex", gap: "1rem"}}>
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
                        <div className="field" style={{marginTop: "1.5rem"}}>
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
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <button
                        className="button is-warning"
                        style={{marginRight: "1rem"}}
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
                    <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
                        <button style={{marginLeft: '10px'}} className={'button is-secodary'}>Copy to Clipboard</button>
                    </CopyToClipboard>
                    {copyStatus && (
                        <div className="notification is-success animated fadeInDown" style={{
                            position: 'fixed',
                            top: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1000,
                            opacity: copyStatus ? 1 : 0,
                            transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                        }}>
                            <button className="delete" onClick={() => setCopyStatus(false)}></button>
                            Text copied to clipboard!
                        </div>
                    )}
                </div>
            </div>

            <div className={"container"} id={"taperLabel"} style={{marginTop: "2rem"}}>
                {/*<h1 className={"title is-3"}>Taper Label</h1>*/}
            </div>

        </>
    );
}

export default TaperCalculator;
