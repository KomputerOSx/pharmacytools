"use client";
import React, { useState } from "react";
import Dropdown from "@/app/webApps/taperCalculator/Dropdown";
import PrednisoloneTaper from "@/app/webApps/taperCalculator/PrednisoloneTaper";
import DexamethasoneTaper from "@/app/webApps/taperCalculator/DexamethasoneTaper";
import EyeDropTaper from "@/app/webApps/taperCalculator/EyeDropTaper";

function HelpContent({ selectedTaper }: { selectedTaper: string }) {
    if (selectedTaper === "Prednisolone Taper") {
        return (
            <>
                <h4 className="title is-5">Prednisolone Taper</h4>
                <p>
                    Create tapering schedules for Prednisolone tablets using 5mg
                    and 1mg strengths. Once daily dosing only.
                </p>
                <ul>
                    <li>
                        <strong>Dose:</strong> Starting dose in mg (e.g., 30mg)
                    </li>
                    <li>
                        <strong>Taper Amount:</strong> Reduce dose by this
                        amount each step (e.g., 5mg)
                    </li>
                    <li>
                        <strong>Interval:</strong> Days at each dose level
                        (e.g., 7 days)
                    </li>
                </ul>
                <p>
                    <strong>Example:</strong> Dose: 30mg, Taper: 5mg, Interval:
                    7 days
                </p>
                <p>
                    Output: Take SIX 5mg tablets (a 30mg dose) for 7 days, then
                    FIVE 5mg tablets (a 25mg dose) for 7 days, etc.
                </p>
                <p>
                    <strong>Add Taper:</strong> Use to change taper rate
                    mid-schedule (e.g., taper by 5mg then by 2.5mg at lower
                    doses).
                </p>
                <h4 className="title is-5 mt-4">Copy Options</h4>
                <ul>
                    <li>
                        <strong>Copy Label:</strong> Copies just the dosing
                        instructions.
                    </li>
                    <li>
                        <strong>Document Copy:</strong> Copies instructions with
                        steroid warning card info.
                    </li>
                </ul>
            </>
        );
    }

    if (selectedTaper === "Dexamethasone Taper") {
        return (
            <>
                <h4 className="title is-5">Dexamethasone Taper</h4>
                <p>
                    Create tapering schedules for Dexamethasone tablets. Supports
                    OD (once daily) or BD (twice daily) dosing.
                </p>
                <ul>
                    <li>
                        <strong>Tablet Strengths:</strong> Select available
                        strengths (4mg, 2mg, 0.5mg). Deselect any that are out
                        of stock.
                    </li>
                    <li>
                        <strong>Dose:</strong> Per-dose amount in mg (e.g., 4mg)
                    </li>
                    <li>
                        <strong>Frequency:</strong> OD (once daily) or BD (twice
                        daily)
                    </li>
                    <li>
                        <strong>Taper Amount:</strong> Reduce{" "}
                        <em>total daily dose</em> by this amount each step
                    </li>
                    <li>
                        <strong>Interval:</strong> Days at each dose level
                    </li>
                </ul>
                <p>
                    <strong>Example:</strong> 4mg BD, Taper: 4mg, Interval: 7
                    days, then add line for 2mg OD
                </p>
                <p>
                    Output: 4mg BD (8mg daily) for 7 days, then 2mg BD (4mg
                    daily) for 7 days, then 2mg OD for 7 days
                </p>
                <p>
                    <strong>Note:</strong> Use &quot;Add Taper&quot; to change
                    frequency mid-taper (e.g., BD to OD).
                </p>
                <p>
                    <strong>Warning:</strong> If a dose cannot be made exactly
                    with the selected tablet strengths, a warning will be shown
                    in red.
                </p>
                <h4 className="title is-5 mt-4">Copy Options</h4>
                <ul>
                    <li>
                        <strong>Copy Label:</strong> Copies just the dosing
                        instructions.
                    </li>
                    <li>
                        <strong>Document Copy:</strong> Copies instructions with
                        steroid warning card info.
                    </li>
                </ul>
            </>
        );
    }

    // Eye Drop Taper
    return (
        <>
            <h4 className="title is-5">Eye Drop Taper</h4>
            <p>Create post-operative eye drop tapering schedules.</p>
            <ul>
                <li>
                    <strong>Select Eye(s):</strong> Left, Right, or Both eyes.
                </li>
                <li>
                    <strong>Drop(s):</strong> Number of drops per dose.
                </li>
                <li>
                    <strong>Frequency / Day:</strong> Times per day to apply
                    drops.
                </li>
                <li>
                    <strong>Taper Interval:</strong> Days at each frequency
                    before reducing.
                </li>
            </ul>
            <p>
                <strong>Example:</strong> 1 drop, Frequency: 4, Interval: 7
                days
            </p>
            <p>
                Output: 1 drop FOUR times a day for 7 days, then THREE times a
                day for 7 days, etc.
            </p>
            <p>
                <strong>Note:</strong> Total mls are estimated automatically.
                &quot;Both&quot; eyes doubles the total.
            </p>
        </>
    );
}

function TaperCalculator() {
    const [selectedTaper, setSelectedTaper] =
        useState<string>("Prednisolone Taper");
    const [showHelp, setShowHelp] = useState(false);

    const handleTaperSelect = (item: string) => {
        setSelectedTaper(item);
    };

    return (
        <>
            <div
                className={"container"}
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
                <div>
                    <h1 className={"title is-1"}>Taper Calculator</h1>

                    <Dropdown
                        selectedItem={selectedTaper}
                        onItemSelect={handleTaperSelect}
                        onHelpClick={() => setShowHelp(true)}
                    />

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
                                    <p className="modal-card-title">
                                        {selectedTaper} - How to Use
                                    </p>
                                    <button
                                        className="delete"
                                        aria-label="close"
                                        onClick={() => setShowHelp(false)}
                                    ></button>
                                </header>
                                <section className="modal-card-body">
                                    <HelpContent
                                        selectedTaper={selectedTaper}
                                    />
                                </section>
                            </div>
                        </div>
                    )}

                    {selectedTaper === "Prednisolone Taper" && (
                        <PrednisoloneTaper />
                    )}
                    {selectedTaper === "Dexamethasone Taper" && (
                        <DexamethasoneTaper />
                    )}
                    {selectedTaper === "Eye Drop Taper" && <EyeDropTaper />}
                </div>
            </div>
        </>
    );
}

export default TaperCalculator;
