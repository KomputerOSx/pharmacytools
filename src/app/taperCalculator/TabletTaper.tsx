"use client";

import React, { useState } from "react";
// @ts-expect-error ignore this line
import {CopyToClipboard} from 'react-copy-to-clipboard';
import './TabletTaper.css';


function TabletTaper() {
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
        // @ts-expect-error ignore this line
        updatedTaperLines[index][field] = value;
        setTaperLines(updatedTaperLines);
    };

    // Handle calculations (you can replace this with actual logic)
    const handleCalculate = () => {
        const taperLabel = document.getElementById("taperLabel");
        if (taperLabel) {
            taperLabel.innerHTML = ''; // Clear the existing content
            let textToCopy = ''; // Initialize the textToCopy variable
            let currentDose = taperLines[0].dose; // Start with the highest dose

            const startDateInput = document.getElementById('date-selector') as HTMLInputElement;
            let startDate = startDateInput?.value ? new Date(startDateInput.value) : null;

            let totalFiveMilligramTablets = 0;
            let totalOneMilligramTablets = 0;

            for (let i = 0; i < taperLines.length; i++) {
                const nextDose = i < taperLines.length - 1 ? taperLines[i + 1].dose : 0;

                while (currentDose > nextDose) {
                    const paragraph = document.createElement('p');
                    paragraph.className = "field";
                    const fiveMilligramTablets = Math.floor(currentDose / 5);
                    const oneMilligramTablets = currentDose % 5;
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
                        const endDate = new Date(startDate.getTime() + (taperLines[i].interval - 1) * 24 * 60 * 60 * 1000);
                        text += ` from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
                        startDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000); // Set start date to the next day
                    } else {
                        text += ` for ${taperLines[i].interval} days`;
                    }

                    paragraph.textContent = text;
                    taperLabel.appendChild(paragraph);
                    textToCopy += text + '\n'; // Update the textToCopy variable

                    totalFiveMilligramTablets += fiveMilligramTablets * taperLines[i].interval;
                    totalOneMilligramTablets += oneMilligramTablets * taperLines[i].interval;

                    currentDose = Math.max(nextDose, currentDose - taperLines[i].taperAmount);
                }
            }

            const totalTabletsParagraph = document.createElement('p');
            totalTabletsParagraph.className = "field subtitle";
            totalTabletsParagraph.innerHTML = `<strong>Total tablets required:</strong> <br> <strong>${totalFiveMilligramTablets}</strong> x 5mg tablets & <strong>${totalOneMilligramTablets}</strong> x 1mg tablets`;
            taperLabel.appendChild(totalTabletsParagraph);

            setTextToCopy(textToCopy); // Update the textToCopy state
        } else {
            console.error("Element with id 'taperLabel' not found");
        }
    }



    function numberToWords(num: number): string {
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
        setTimeout(() => setCopyStatus(false), 5000); // Reset status after 5 seconds
    };

    const patientInfo1 = `
      ALERT: I TAKE STEROID MEDICATION
      I am at risk of adrenal crisis

      IN CASE OF EMERGENCY:

      I need immediate hydrocortisone
      Call 999 or take me to A&E
      Show this card to the medical staff

      IMPORTANT:

      I must not stop taking steroids suddenly
      I need extra steroids during illness or injury
      I should carry extra medication at all times
    `;

    const patientInfo2 = `--- Additional Information ---
      - Take your medication as prescribed, usually once a day in the morning with food.
      - Never stop taking steroids suddenly.
      - Report any new symptoms or side effects to your healthcare provider promptly.
      - Attend regular check-ups and blood tests as recommended by your doctor.
      \n\n--- End of Document ---`;

    return (
        <>
            <div style={{padding: '1rem'}}>
                <div>
                    {/*<h1 className={"title is-1"}>Taper Calculator</h1>*/}

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
                        <div className="taper-inputs-container">
                            <div className="taper-input-row">
                                {/* Dose Input */}
                                <div className="field">
                                    <label className="label">Dose</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="number"
                                            min="0"
                                            step="1"
                                            placeholder="Enter Dose"
                                            value={taperLine.dose}
                                            onChange={(e) => {
                                                const value = e.target.value === '' ? '' : Math.max(0, Math.floor(Number(e.target.value)));
                                                handleInputChange(index, "dose", value as number);
                                            }}
                                            onKeyPress={(e) => {
                                                if (!/[0-9]/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
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
                                            min="0"
                                            step="1"
                                            placeholder="Enter Taper Amount"
                                            value={taperLine.taperAmount}
                                            onChange={(e) => {
                                                const value = e.target.value === '' ? '' : Math.max(0, Math.floor(Number(e.target.value)));
                                                handleInputChange(index, "taperAmount", value as number);
                                            }}
                                            onKeyPress={(e) => {
                                                if (!/[0-9]/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
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
                                            min="0"
                                            step="1"
                                            placeholder="Enter Taper Interval"
                                            value={taperLine.interval}
                                            onChange={(e) => {
                                                const value = e.target.value === '' ? '' : Math.max(0, Math.floor(Number(e.target.value)));
                                                handleInputChange(index, "interval", value as number);
                                            }}
                                            onKeyPress={(e) => {
                                                if (!/[0-9]/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <div className="field delete-button-container">
                                    <label className="label">&nbsp;</label>
                                    <div className="control">
                                        <button
                                            className="button is-danger"
                                            onClick={() => handleDeleteTaper(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </span>
                    ))}

                    {/* Buttons for Adding and Calculating */}
                    <div className="action-buttons-container">
                        <button
                            className="button is-warning"
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
                            <button className="button is-secondary">Copy Label</button>
                        </CopyToClipboard>
                        <CopyToClipboard
                            text={patientInfo1 + `\n\n` + textToCopy + '\n\n' + patientInfo2}
                            onCopy={onCopyText}
                        >
                            <button className="button is-secondary">Document Copy</button>
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
            </div>
        </>
    );
}

export default TabletTaper;
