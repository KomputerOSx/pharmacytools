"use client";

import React, { useState } from "react";
import "./TabletTaper.css";

// Medication configurations
const medicationConfig = {
    prednisolone: {
        name: "Prednisolone",
        strengths: [5, 1],
        defaultEnabled: [5, 1],
        supportedFrequencies: [1],
        defaultFrequency: 1,
    },
    dexamethasone: {
        name: "Dexamethasone",
        strengths: [4, 2, 0.5],
        defaultEnabled: [4, 2, 0.5],
        supportedFrequencies: [1, 2],
        defaultFrequency: 1,
    },
};

type MedicationType = keyof typeof medicationConfig;

interface TaperLine {
    dose: number;
    taperAmount: number;
    interval: number;
    frequency: number;
}

function TabletTaper() {
    const [taperLines, setTaperLines] = useState<TaperLine[]>([
        { dose: 0, taperAmount: 0, interval: 0, frequency: 1 },
    ]);
    const [selectedMedication, setSelectedMedication] =
        useState<MedicationType>("prednisolone");
    const [enabledStrengths, setEnabledStrengths] = useState<number[]>([
        ...medicationConfig.prednisolone.defaultEnabled,
    ]);
    const [textToCopy, setTextToCopy] = useState("");
    const [copyStatus, setCopyStatus] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    const config = medicationConfig[selectedMedication];
    const showFrequency = config.supportedFrequencies.length > 1;

    // Handle medication change
    const handleMedicationChange = (medication: MedicationType) => {
        setSelectedMedication(medication);
        setEnabledStrengths([
            ...medicationConfig[medication].defaultEnabled,
        ]);
    };

    // Toggle tablet strength
    const toggleStrength = (strength: number) => {
        if (enabledStrengths.includes(strength)) {
            setEnabledStrengths(enabledStrengths.filter((s) => s !== strength));
        } else {
            const newStrengths = [...enabledStrengths, strength].sort(
                (a, b) => b - a
            );
            setEnabledStrengths(newStrengths);
        }
    };

    // Add a new taper line
    const handleAddTaper = () => {
        setTaperLines([
            ...taperLines,
            { dose: 0, taperAmount: 0, interval: 0, frequency: 1 },
        ]);
    };

    // Delete a specific taper line
    const handleDeleteTaper = (index: number) => {
        const newLines = taperLines.filter((_, i) => i !== index);
        if (newLines.length === 0) {
            setTaperLines([{ dose: 0, taperAmount: 0, interval: 0, frequency: 1 }]);
        } else {
            setTaperLines(newLines);
        }
    };

    // Update a specific field in a specific taper line
    const handleInputChange = (
        index: number,
        field: keyof TaperLine,
        value: number
    ) => {
        const updatedTaperLines = [...taperLines];
        updatedTaperLines[index][field] = value;
        setTaperLines(updatedTaperLines);
    };

    // Calculate tablets needed for a dose using available strengths
    const calculateTabletsForDose = (dose: number, strengths: number[]) => {
        const result: { strength: number; count: number }[] = [];
        let remaining = dose;

        const sortedStrengths = [...strengths].sort((a, b) => b - a);

        for (const strength of sortedStrengths) {
            if (remaining >= strength) {
                const count = Math.floor(remaining / strength);
                if (count > 0) {
                    result.push({ strength, count });
                    remaining = Math.round((remaining - count * strength) * 100) / 100;
                }
            }
        }

        if (remaining > 0.001) {
            return { tablets: result, remainder: remaining, exact: false };
        }

        return { tablets: result, remainder: 0, exact: true };
    };

    // Number to words conversion
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

    // Handle calculations
    const handleCalculate = () => {
        const taperLabel = document.getElementById("taperLabel");
        if (!taperLabel) {
            console.error("Element with id 'taperLabel' not found");
            return;
        }

        taperLabel.innerHTML = "";

        if (enabledStrengths.length === 0) {
            taperLabel.innerHTML =
                '<p style="color: #e74c3c;"><strong>Please select at least one tablet strength.</strong></p>';
            return;
        }

        let textToCopyLocal = `${config.name} Taper:\n`;

        const startDateInput = document.getElementById(
            "date-selector"
        ) as HTMLInputElement;
        let startDate = startDateInput?.value
            ? new Date(startDateInput.value)
            : null;

        // Track totals for each strength
        const tabletTotals: Record<number, number> = {};
        enabledStrengths.forEach((s) => (tabletTotals[s] = 0));

        let hasWarnings = false;

        // Add medication header
        const headerParagraph = document.createElement("p");
        headerParagraph.innerHTML = `<strong>${config.name} Taper</strong>`;
        taperLabel.appendChild(headerParagraph);

        // Work in terms of total daily dose
        const firstFreq = taperLines[0].frequency || 1;
        let currentDailyDose = taperLines[0].dose * firstFreq;

        for (let i = 0; i < taperLines.length; i++) {
            const lineFrequency = taperLines[i].frequency || 1;
            const nextDose =
                i < taperLines.length - 1 ? taperLines[i + 1].dose : 0;
            const nextFrequency =
                i < taperLines.length - 1
                    ? taperLines[i + 1].frequency || 1
                    : 1;
            const nextDailyDose = nextDose * nextFrequency;

            while (currentDailyDose > nextDailyDose) {
                const perDose = currentDailyDose / lineFrequency;
                const calculation = calculateTabletsForDose(
                    perDose,
                    enabledStrengths
                );

                let text = "Take ";
                const tabletParts: string[] = [];

                calculation.tablets.forEach(({ strength, count }) => {
                    const strengthLabel = `${strength}mg`;
                    tabletParts.push(
                        `${numberToWords(count)} ${strengthLabel} tablet${count > 1 ? "s" : ""}`
                    );
                    tabletTotals[strength] +=
                        count * taperLines[i].interval * lineFrequency;
                });

                if (tabletParts.length === 0) {
                    text = `Cannot make ${perDose}mg dose with selected tablets`;
                    hasWarnings = true;
                } else {
                    text += tabletParts.join(" and ");
                    if (lineFrequency === 2) {
                        text += ` TWICE a day (${currentDailyDose}mg daily)`;
                    } else {
                        text += ` (a ${perDose}mg dose)`;
                    }

                    if (!calculation.exact) {
                        text += ` [WARNING: ${calculation.remainder}mg short]`;
                        hasWarnings = true;
                    }
                }

                if (startDate) {
                    const endDate = new Date(
                        startDate.getTime() +
                            (taperLines[i].interval - 1) * 24 * 60 * 60 * 1000
                    );
                    text += ` from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
                    startDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
                } else {
                    text += ` for ${taperLines[i].interval} days`;
                }

                const paragraph = document.createElement("p");
                paragraph.textContent = text;
                if (!calculation.exact || calculation.tablets.length === 0) {
                    paragraph.style.color = "#e74c3c";
                }
                taperLabel.appendChild(paragraph);
                textToCopyLocal += text + "\n";

                currentDailyDose = Math.max(
                    nextDailyDose,
                    currentDailyDose - taperLines[i].taperAmount
                );
            }
        }

        // Build totals summary
        const totalParagraph = document.createElement("p");
        totalParagraph.className = "field subtitle";

        const totalParts: string[] = [];
        enabledStrengths
            .sort((a, b) => b - a)
            .forEach((strength) => {
                if (tabletTotals[strength] > 0) {
                    totalParts.push(
                        `<strong>${tabletTotals[strength]}</strong> x ${strength}mg tablets`
                    );
                }
            });

        totalParagraph.innerHTML = `<strong>Total tablets required:</strong><br>${totalParts.join(" & ")}`;
        taperLabel.appendChild(totalParagraph);

        if (hasWarnings) {
            const warningParagraph = document.createElement("p");
            warningParagraph.style.color = "#e74c3c";
            warningParagraph.innerHTML =
                "<strong>Warning:</strong> Some doses could not be made exactly with the selected tablet strengths.";
            taperLabel.appendChild(warningParagraph);
        }

        setTextToCopy(textToCopyLocal);
    };

    // Clipboard copy function
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
                {/* Help Modal */}
                {showHelp && (
                    <div
                        className="modal is-active"
                        onClick={() => setShowHelp(false)}
                    >
                        <div className="modal-background"></div>
                        <div
                            className="modal-card"
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxWidth: "600px" }}
                        >
                            <header className="modal-card-head">
                                <p className="modal-card-title">How to Use</p>
                                <button
                                    className="delete"
                                    aria-label="close"
                                    onClick={() => setShowHelp(false)}
                                ></button>
                            </header>
                            <section className="modal-card-body">
                                <h4 className="title is-5">Tablet Taper</h4>
                                <p>
                                    Create tapering schedules for steroid tablets.
                                    Select your medication, set the taper parameters,
                                    and click Calculate.
                                </p>

                                <h4 className="title is-5 mt-4">Prednisolone</h4>
                                <p>
                                    Available strengths: 1mg, 5mg tablets. Once daily
                                    dosing only.
                                </p>
                                <ul>
                                    <li>
                                        <strong>Dose:</strong> Starting dose in mg
                                        (e.g., 30mg)
                                    </li>
                                    <li>
                                        <strong>Taper Amount:</strong> Reduce dose by
                                        this amount each step (e.g., 5mg)
                                    </li>
                                    <li>
                                        <strong>Interval:</strong> Days at each dose
                                        level (e.g., 7 days)
                                    </li>
                                </ul>
                                <p>
                                    <strong>Example:</strong> Dose: 30mg, Taper: 5mg,
                                    Interval: 7 days
                                </p>
                                <p>
                                    Output: 30mg for 7 days, then 25mg for 7 days,
                                    then 20mg for 7 days, etc.
                                </p>

                                <h4 className="title is-5 mt-4">Dexamethasone</h4>
                                <p>
                                    Available strengths: 0.5mg, 2mg, 4mg tablets.
                                    Supports OD (once daily) or BD (twice daily)
                                    dosing.
                                </p>
                                <ul>
                                    <li>
                                        <strong>Dose:</strong> Per-dose amount in mg
                                        (e.g., 4mg)
                                    </li>
                                    <li>
                                        <strong>Frequency:</strong> OD (once daily) or
                                        BD (twice daily)
                                    </li>
                                    <li>
                                        <strong>Taper Amount:</strong> Reduce{" "}
                                        <em>total daily dose</em> by this amount each
                                        step
                                    </li>
                                    <li>
                                        <strong>Interval:</strong> Days at each dose
                                        level
                                    </li>
                                </ul>
                                <p>
                                    <strong>Example:</strong> 4mg BD, Taper: 4mg,
                                    Interval: 7 days, then add line for 2mg OD
                                </p>
                                <p>
                                    Output: 4mg BD (8mg daily) for 7 days, then 2mg BD
                                    (4mg daily) for 7 days, then 2mg OD for 7 days
                                </p>
                                <p>
                                    <strong>Note:</strong> Use &quot;Add Taper&quot; to change
                                    frequency mid-taper (e.g., BD to OD).
                                </p>

                                <h4 className="title is-5 mt-4">General Options</h4>
                                <ul>
                                    <li>
                                        <strong>Tablet Strengths:</strong> Deselect
                                        strengths that are out of stock.
                                    </li>
                                    <li>
                                        <strong>Start Date:</strong> Optional. Shows
                                        specific date ranges instead of &quot;for X
                                        days&quot;.
                                    </li>
                                    <li>
                                        <strong>Add Taper:</strong> Add another line
                                        with different settings.
                                    </li>
                                </ul>

                                <h4 className="title is-5 mt-4">Copy Options</h4>
                                <ul>
                                    <li>
                                        <strong>Copy Label:</strong> Copies just the
                                        dosing instructions.
                                    </li>
                                    <li>
                                        <strong>Document Copy:</strong> Copies
                                        instructions with steroid warning card info.
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>
                )}

                {/* Medication Options */}
                <div className="box mb-4" style={{ padding: "1rem", boxShadow: "none" }}>
                    <div className="columns is-multiline is-vcentered">
                        <div className="column is-narrow">
                            <div className="field mb-0">
                                <label className="label">Medication</label>
                                <div className="control">
                                    <div className="select">
                                        <select
                                            value={selectedMedication}
                                            onChange={(e) =>
                                                handleMedicationChange(
                                                    e.target.value as MedicationType
                                                )
                                            }
                                        >
                                            <option value="prednisolone">Prednisolone</option>
                                            <option value="dexamethasone">Dexamethasone</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="column is-narrow">
                            <div className="field mb-0">
                                <label className="label">Tablet Strengths to Use</label>
                                <div className="control">
                                    <div className="buttons has-addons">
                                        {config.strengths.map((strength) => (
                                            <button
                                                key={strength}
                                                type="button"
                                                className={`button ${enabledStrengths.includes(strength) ? "is-primary" : ""}`}
                                                onClick={() => toggleStrength(strength)}
                                            >
                                                {strength}mg
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="column is-narrow">
                            <div className="field mb-0">
                                <label className="label">Start Date (Optional)</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="date"
                                        id="date-selector"
                                        name="date-selector"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="column is-narrow">
                            <div className="field mb-0">
                                <label className="label">&nbsp;</label>
                                <div className="control">
                                    <button
                                        className="button is-info is-light"
                                        onClick={() => setShowHelp(true)}
                                    >
                                        ?
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Render each taper line */}
                {taperLines.map((taperLine, index) => (
                    <span key={index} style={{ display: "flex", gap: "1rem" }}>
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
                                                              Math.floor(
                                                                  Number(
                                                                      e.target.value
                                                                  )
                                                              )
                                                          );
                                                handleInputChange(
                                                    index,
                                                    "dose",
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

                                {/* Frequency Selector (only for medications that support it) */}
                                {showFrequency && (
                                    <div className="field">
                                        <label className="label">Frequency</label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select
                                                    value={taperLine.frequency}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "frequency",
                                                            parseInt(e.target.value)
                                                        )
                                                    }
                                                >
                                                    <option value={1}>OD</option>
                                                    <option value={2}>BD</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                            value={taperLine.taperAmount || ""}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value === ""
                                                        ? 0
                                                        : Math.max(
                                                              0,
                                                              Math.floor(
                                                                  Number(
                                                                      e.target.value
                                                                  )
                                                              )
                                                          );
                                                handleInputChange(
                                                    index,
                                                    "taperAmount",
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

                                {/* Interval Input */}
                                <div className="field">
                                    <label className="label">Interval (days)</label>
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
                                                                      e.target.value
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
                    <button className="button is-warning" onClick={handleAddTaper}>
                        Add Taper
                    </button>
                    <button className="button is-primary" onClick={handleCalculate}>
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
                    id="taperLabel"
                    style={{ marginTop: "2rem" }}
                ></div>
            </div>
        </>
    );
}

export default TabletTaper;
