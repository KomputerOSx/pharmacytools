"use client";

import React, { useState } from "react";
import "./TabletTaper.css";

interface PredTaperLine {
    dose: number;
    taperAmount: number;
    interval: number;
}

function PrednisoloneTaper() {
    const [taperLines, setTaperLines] = useState<PredTaperLine[]>([
        { dose: 0, taperAmount: 0, interval: 0 },
    ]);
    const [textToCopy, setTextToCopy] = useState("");
    const [copyStatus, setCopyStatus] = useState(false);

    const handleAddTaper = () => {
        setTaperLines([
            ...taperLines,
            { dose: 0, taperAmount: 0, interval: 0 },
        ]);
    };

    const handleDeleteTaper = (index: number) => {
        const newLines = taperLines.filter((_, i) => i !== index);
        if (newLines.length === 0) {
            setTaperLines([{ dose: 0, taperAmount: 0, interval: 0 }]);
        } else {
            setTaperLines(newLines);
        }
    };

    const handleInputChange = (
        index: number,
        field: keyof PredTaperLine,
        value: number
    ) => {
        const updatedTaperLines = [...taperLines];
        updatedTaperLines[index][field] = value;
        setTaperLines(updatedTaperLines);
    };

    function numberToWords(num: number): string {
        const ones = [
            "",
            "ONE",
            "TWO",
            "THREE",
            "FOUR",
            "FIVE",
            "SIX",
            "SEVEN",
            "EIGHT",
            "NINE",
        ];
        const teens = [
            "TEN",
            "ELEVEN",
            "TWELVE",
            "THIRTEEN",
            "FOURTEEN",
            "FIFTEEN",
            "SIXTEEN",
            "SEVENTEEN",
            "EIGHTEEN",
            "NINETEEN",
        ];
        const tens = [
            "",
            "",
            "TWENTY",
            "THIRTY",
            "FORTY",
            "FIFTY",
            "SIXTY",
            "SEVENTY",
            "EIGHTY",
            "NINETY",
        ];

        if (num < 10) {
            return ones[num];
        } else if (num < 20) {
            return teens[num - 10];
        } else if (num < 100) {
            return (
                tens[Math.floor(num / 10)] +
                (num % 10 === 0 ? "" : " " + ones[num % 10])
            );
        } else {
            return (
                ones[Math.floor(num / 100)] +
                " hundred" +
                (num % 100 === 0 ? "" : " and " + numberToWords(num % 100))
            );
        }
    }

    const handleCalculate = () => {
        const taperLabel = document.getElementById("predTaperLabel");
        if (!taperLabel) return;

        taperLabel.innerHTML = "";

        let textToCopyLocal = "Prednisolone Taper:\n";

        const startDateInput = document.getElementById(
            "pred-date-selector"
        ) as HTMLInputElement;
        let startDate = startDateInput?.value
            ? new Date(startDateInput.value)
            : null;

        let totalFiveMg = 0;
        let totalOneMg = 0;

        const headerParagraph = document.createElement("p");
        headerParagraph.innerHTML = "<strong>Prednisolone Taper</strong>";
        taperLabel.appendChild(headerParagraph);

        let currentDose = taperLines[0].dose;

        for (let i = 0; i < taperLines.length; i++) {
            const nextDose =
                i < taperLines.length - 1 ? taperLines[i + 1].dose : 0;

            while (currentDose > nextDose) {
                const fiveMilligramTablets = Math.floor(currentDose / 5);
                const oneMilligramTablets = currentDose % 5;

                let text = "Take ";
                const parts: string[] = [];

                if (fiveMilligramTablets > 0) {
                    parts.push(
                        `${numberToWords(fiveMilligramTablets)} 5mg tablet${fiveMilligramTablets > 1 ? "s" : ""}`
                    );
                }
                if (oneMilligramTablets > 0) {
                    parts.push(
                        `${numberToWords(oneMilligramTablets)} 1mg tablet${oneMilligramTablets > 1 ? "s" : ""}`
                    );
                }

                if (parts.length === 0) {
                    text = `Cannot make ${currentDose}mg dose`;
                } else {
                    text += parts.join(" and ");
                    text += ` (a ${currentDose}mg dose)`;
                }

                if (startDate) {
                    const endDate = new Date(
                        startDate.getTime() +
                            (taperLines[i].interval - 1) * 24 * 60 * 60 * 1000
                    );
                    text += ` from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
                    startDate = new Date(
                        endDate.getTime() + 24 * 60 * 60 * 1000
                    );
                } else {
                    text += ` for ${taperLines[i].interval} days`;
                }

                const paragraph = document.createElement("p");
                paragraph.textContent = text;
                taperLabel.appendChild(paragraph);
                textToCopyLocal += text + "\n";

                totalFiveMg += fiveMilligramTablets * taperLines[i].interval;
                totalOneMg += oneMilligramTablets * taperLines[i].interval;

                currentDose = Math.max(
                    nextDose,
                    currentDose - taperLines[i].taperAmount
                );
            }
        }

        // Totals
        const totalParagraph = document.createElement("p");
        totalParagraph.className = "field subtitle";

        const totalParts: string[] = [];
        if (totalFiveMg > 0)
            totalParts.push(
                `<strong>${totalFiveMg}</strong> x 5mg tablets`
            );
        if (totalOneMg > 0)
            totalParts.push(
                `<strong>${totalOneMg}</strong> x 1mg tablets`
            );
        totalParagraph.innerHTML = `<strong>Total tablets required:</strong><br>${totalParts.join(" & ")}`;
        taperLabel.appendChild(totalParagraph);

        setTextToCopy(textToCopyLocal);
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus(true);
            setTimeout(() => setCopyStatus(false), 5000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const patientInfo1 = `ALERT: I TAKE STEROID MEDICATION
I am at risk of adrenal crisis

IN CASE OF EMERGENCY:

I need immediate hydrocortisone
Call 999 or take me to A&E
Show this card to the medical staff

IMPORTANT:

I must not stop taking steroids suddenly
I need extra steroids during illness or injury
I should carry extra medication at all times`;

    const patientInfo2 = `--- Additional Information ---
- Take your medication as prescribed with food.
- Never stop taking steroids suddenly.
- Report any new symptoms or side effects to your healthcare provider promptly.
- Attend regular check-ups and blood tests as recommended by your doctor.

--- End of Document ---`;

    return (
        <>
            <div>
                {/* Options row - just start date */}
                <div
                    className="box mb-4"
                    style={{ padding: "1rem", boxShadow: "none" }}
                >
                    <div className="columns is-multiline is-vcentered">
                        <div className="column is-narrow">
                            <div className="field mb-0">
                                <label className="label">
                                    Start Date (Optional)
                                </label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="date"
                                        id="pred-date-selector"
                                        name="pred-date-selector"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Render each taper line */}
                {taperLines.map((taperLine, index) => (
                    <span
                        key={index}
                        style={{ display: "flex", gap: "1rem" }}
                    >
                        <div className="taper-inputs-container">
                            <div className="taper-input-row">
                                {/* Dose Input */}
                                <div className="field">
                                    <label className="label">Dose (mg)</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="number"
                                            min="0"
                                            step="1"
                                            placeholder="Enter Dose"
                                            value={taperLine.dose || ""}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value === ""
                                                        ? 0
                                                        : Math.max(
                                                              0,
                                                              Number(
                                                                  e.target.value
                                                              )
                                                          );
                                                handleInputChange(
                                                    index,
                                                    "dose",
                                                    value
                                                );
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Taper Amount Input */}
                                <div className="field">
                                    <label className="label">
                                        Taper Amount
                                    </label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="number"
                                            min="0"
                                            step="1"
                                            placeholder="Enter Taper Amount"
                                            value={taperLine.taperAmount || ""}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value === ""
                                                        ? 0
                                                        : Math.max(
                                                              0,
                                                              Number(
                                                                  e.target.value
                                                              )
                                                          );
                                                handleInputChange(
                                                    index,
                                                    "taperAmount",
                                                    value
                                                );
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Interval Input */}
                                <div className="field">
                                    <label className="label">
                                        Interval (days)
                                    </label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="number"
                                            min="0"
                                            step="1"
                                            placeholder="Enter Interval"
                                            value={taperLine.interval || ""}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value === ""
                                                        ? 0
                                                        : Math.max(
                                                              0,
                                                              Math.floor(
                                                                  Number(
                                                                      e.target
                                                                          .value
                                                                  )
                                                              )
                                                          );
                                                handleInputChange(
                                                    index,
                                                    "interval",
                                                    value
                                                );
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
                                            onClick={() =>
                                                handleDeleteTaper(index)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </span>
                ))}

                {/* Buttons */}
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
                    <button
                        className="button is-secondary"
                        onClick={() => handleCopy(textToCopy)}
                    >
                        Copy Label
                    </button>
                    <button
                        className="button is-secondary"
                        onClick={() =>
                            handleCopy(
                                patientInfo1 +
                                    "\n\n" +
                                    textToCopy +
                                    "\n" +
                                    patientInfo2
                            )
                        }
                    >
                        Document Copy
                    </button>
                    {copyStatus && (
                        <div
                            className="notification is-success animated fadeInDown"
                            style={{
                                position: "fixed",
                                top: "10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 1000,
                                opacity: copyStatus ? 1 : 0,
                                transition:
                                    "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                            }}
                        >
                            <button
                                className="delete"
                                onClick={() => setCopyStatus(false)}
                            ></button>
                            Text copied to clipboard!
                        </div>
                    )}
                </div>

                <div
                    className="container"
                    id="predTaperLabel"
                    style={{ marginTop: "2rem" }}
                ></div>
            </div>
        </>
    );
}

export default PrednisoloneTaper;
