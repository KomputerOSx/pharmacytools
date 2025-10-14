"use client";

import React, { useState, useEffect } from "react";
import { SelectedDrug } from "./types";
import { sortedDrugs } from "./data";
import Notification from "./components/Notification";
import DrugCard from "./components/DrugCard";
import LabelCard from "./components/LabelCard";
import "./PalliativeLabelGenerator.css";
const PalliativeLabelGenerator = () => {
    const [selectedDrugs, setSelectedDrugs] = useState<SelectedDrug[]>([]);
    const [activeTab, setActiveTab] = useState("create");
    const [notification, setNotification] = useState<string | null>(null);

    // Initialize with default selected drugs
    useEffect(() => {
        const initialDrugs = sortedDrugs.map((drug) => ({
            drug,
            isRange:
                !!drug.defaultDoseRangeMgMin && !!drug.defaultDoseRangeMgMax,
            doseMg: drug.defaultDoseMg || "",
            doseRangeMgMin: drug.defaultDoseRangeMgMin || "",
            doseRangeMgMax: drug.defaultDoseRangeMgMax || "",
            frequency: drug.frequency,
            indication: drug.indication
        }));
        setSelectedDrugs(initialDrugs);
    }, []);

    const handleCopyDirections = (labelId: string) => {
        const labelElement = document.getElementById(labelId);
        if (labelElement) {
            // Copy to clipboard
            navigator.clipboard
                .writeText(labelElement.textContent || "")
                .then(() => {
                    setNotification("Directions copied to clipboard!");
                    setTimeout(() => setNotification(null), 2000);
                })
                .catch(() => {
                    // Fallback method if clipboard API fails
                    const range = document.createRange();
                    range.selectNode(labelElement);
                    window.getSelection()?.removeAllRanges();
                    window.getSelection()?.addRange(range);
                    document.execCommand("copy");
                    window.getSelection()?.removeAllRanges();

                    setNotification("Directions copied to clipboard!");
                    setTimeout(() => setNotification(null), 2000);
                });
        }
    };

    const updateDrug = (index: number, field: string, value: string) => {
        const updatedDrugs = [...selectedDrugs];
        updatedDrugs[index] = { ...updatedDrugs[index], [field]: value };
        setSelectedDrugs(updatedDrugs);
    };

    const toggleRangeMode = (index: number) => {
        const updatedDrugs = [...selectedDrugs];
        updatedDrugs[index] = {
            ...updatedDrugs[index],
            isRange: !updatedDrugs[index].isRange,
        };
        setSelectedDrugs(updatedDrugs);
    };

    const toggleCrisisDose = (index: number) => {
        const updatedDrugs = [...selectedDrugs];
        updatedDrugs[index] = {
            ...updatedDrugs[index],
            useCrisisDose: !updatedDrugs[index].useCrisisDose,
        };
        setSelectedDrugs(updatedDrugs);
    };

    return (
        <div className="">
            <h1 className="title has-text-centered mb-4">
                Palliative Care Label Generator
            </h1>

            <Notification
                message={notification}
                onClose={() => setNotification(null)}
            />

            <div className="tabs is-centered is-boxed">
                <ul>
                    <li className={activeTab === "create" ? "is-active" : ""}>
                        <a onClick={() => setActiveTab("create")}>
                            Create Labels
                        </a>
                    </li>
                    <li className={activeTab === "preview" ? "is-active" : ""}>
                        <a onClick={() => setActiveTab("preview")}>
                            Preview Labels
                        </a>
                    </li>
                </ul>
            </div>

            <div
                className={"container"}
                style={{
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    marginBottom: "1rem",
                }}
            >
                <div className={activeTab === "create" ? "" : "is-hidden"}>
                    <div className="columns is-multiline">
                        {selectedDrugs.map((selected, index) => (
                            <div key={index} className="column is-half">
                                <DrugCard
                                    selected={selected}
                                    index={index}
                                    updateDrug={updateDrug}
                                    toggleRangeMode={toggleRangeMode}
                                    toggleCrisisDose={toggleCrisisDose}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={activeTab === "preview" ? "" : "is-hidden"}>
                    <div className="columns is-multiline">
                        {selectedDrugs.flatMap((selected, index) => (
                            <LabelCard
                                key={index}
                                selected={selected}
                                index={index}
                                handleCopyDirections={handleCopyDirections}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PalliativeLabelGenerator;
