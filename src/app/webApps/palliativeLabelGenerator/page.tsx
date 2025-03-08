"use client";

import React, { useState, useEffect } from "react";

// Define types
type Drug = {
    id: string;
    name: string;
    strength: string;
    defaultDoseMg: string | null;
    defaultDoseRangeMgMin?: string;
    defaultDoseRangeMgMax?: string;
    frequency: string;
    route: string;
    category: string;
    ratio?: number; // Ratio of mg per ml for calculation
    hasCrisisDose?: boolean;
    crisisDoseMg?: string;
    crisisInstructions?: string;
};

type SelectedDrug = {
    drug: Drug;
    doseMg?: string;
    doseRangeMgMin?: string;
    doseRangeMgMax?: string;
    frequency?: string;
    isRange: boolean;
    useCrisisDose?: boolean;
};

// Default drug data
const drugs: Drug[] = [
    {
        id: "alfentanil",
        name: "Alfentanil",
        strength: "1mg/2ml",
        defaultDoseMg: null,
        defaultDoseRangeMgMin: "0.1",
        defaultDoseRangeMgMax: "0.25",
        frequency: "up to a maximum of once every hour",
        route: "subcutaneously",
        category: "pain",
        ratio: 0.5, // 1mg/2ml = 0.5mg/ml
    },
    {
        id: "cyclizine",
        name: "Cyclizine",
        strength: "50mg/1ml",
        defaultDoseMg: "50",
        frequency: "up to a maximum of once every EIGHT hours",
        route: "subcutaneously",
        category: "nausea",
        ratio: 50, // 50mg/1ml
    },
    {
        id: "haloperidol",
        name: "Haloperidol",
        strength: "5mg/1ml",
        defaultDoseMg: "0.5",
        frequency: "up to a maximum of once every hour",
        route: "subcutaneously",
        category: "nausea",
        ratio: 5, // 5mg/1ml
    },
    {
        id: "hyoscine",
        name: "Hyoscine Butyl-bromide",
        strength: "20mg/1ml",
        defaultDoseMg: "20",
        frequency: "up to a maximum of once every hour",
        route: "subcutaneously",
        category: "secretions",
        ratio: 20, // 20mg/1ml
    },
    {
        id: "midazolam",
        name: "Midazolam",
        strength: "10mg/2ml",
        defaultDoseMg: "2.5",
        frequency: "up to a maximum of once every hour",
        route: "subcutaneously",
        category: "sedation",
        ratio: 5, // 10mg/2ml = 5mg/ml
        hasCrisisDose: true,
        crisisDoseMg: "10",
        crisisInstructions:
            "in the event of seizures, dose can be repeated after 10 mins if required. CALL DOCTOR IF ANY CRISIS DOSES GIVEN",
    },
    {
        id: "morphine/oxycodone",
        name: "Morphine / Oxycodone",
        strength: "10mg/1ml",
        defaultDoseMg: "2.5",
        frequency: "up to a maximum of once every hour",
        route: "subcutaneously",
        category: "pain",
        ratio: 10, // 10mg/1ml
    },
    {
        id: "water",
        name: "Water for injection",
        strength: "10ml",
        defaultDoseMg: null,
        frequency: "as needed",
        route: "for reconstitution",
        category: "other",
        ratio: 0,
    },
];

// Frequency options
const frequencyOptions = [
    "up to a maximum of once every hour",
    "up to a maximum of once every TWO hours",
    "up to a maximum of once every FOUR hours",
    "up to a maximum of once every SIX hours",
    "up to a maximum of once every EIGHT hours",
    "up to a maximum of once every TWELVE hours",
    "up to a maximum of once daily",
    "up to a maximum of TWICE daily",
];

// Sort drugs alphabetically, keeping water for injection at the bottom
const sortedDrugs = [...drugs].sort((a, b) => {
    if (a.id === "water") return 1;
    if (b.id === "water") return -1;
    return a.name.localeCompare(b.name);
});

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
        }));
        setSelectedDrugs(initialDrugs);
    }, []);

    // Calculate ml based on mg and ratio
    const calculateMl = (mg: string, ratio: number): string => {
        if (!mg || !ratio) return "";
        const calculated = parseFloat(mg) / ratio;
        // If it's a whole number, return without decimal places
        return Number.isInteger(calculated)
            ? calculated.toString()
            : calculated.toFixed(2);
    };

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

    const getDirectionsText = (selected: SelectedDrug): string => {
        if (selected.drug.id === "water") {
            return "Use for reconstitution";
        }

        let doseText;
        let directionsText;

        if (
            selected.isRange &&
            (selected.drug.id === "morphine" ||
                selected.drug.id === "alfentanil")
        ) {
            const minMg =
                selected.doseRangeMgMin ||
                selected.drug.defaultDoseRangeMgMin ||
                "";
            const maxMg =
                selected.doseRangeMgMax ||
                selected.drug.defaultDoseRangeMgMax ||
                "";
            const minMl = selected.drug.ratio
                ? calculateMl(minMg, selected.drug.ratio)
                : "";
            const maxMl = selected.drug.ratio
                ? calculateMl(maxMg, selected.drug.ratio)
                : "";

            doseText = `Inject ${minMl} - ${maxMl}ml (a ${minMg} - ${maxMg}mg dose)`;
        } else if (selected.drug.id === "midazolam" && selected.useCrisisDose) {
            const crisisMg = selected.drug.crisisDoseMg || "";
            const crisisMl = selected.drug.ratio
                ? calculateMl(crisisMg, selected.drug.ratio)
                : "";

            doseText = `Inject ${crisisMl}ml (a ${crisisMg}mg dose)`;
            directionsText = `${selected.drug.route} ${selected.drug.crisisInstructions}`;
            return `${doseText} ${directionsText}`;
        } else {
            const mg = selected.doseMg || selected.drug.defaultDoseMg || "";
            const ml = selected.drug.ratio
                ? calculateMl(mg, selected.drug.ratio)
                : "";

            doseText = `Inject ${ml}ml (a ${mg}mg dose)`;
        }

        directionsText = `${selected.drug.route} when required, ${selected.frequency || selected.drug.frequency}`;
        return `${doseText} ${directionsText}`;
    };

    return (
        <div className="">
            <h1 className="title has-text-centered mb-4">
                Palliative Care Label Generator
            </h1>

            {notification && (
                <div
                    className="notification is-success is-light"
                    style={{
                        position: "fixed",
                        top: "1rem",
                        right: "1rem",
                        zIndex: 50,
                        maxWidth: "300px",
                    }}
                >
                    <button
                        className="delete"
                        onClick={() => setNotification(null)}
                    ></button>
                    {notification}
                </div>
            )}

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
                                <div className="card">
                                    <header className="card-header">
                                        <p className="card-header-title">
                                            {selected.drug.name} -{" "}
                                            {selected.drug.strength}
                                        </p>
                                        <span
                                            className={`tag m-2 is-${
                                                selected.drug.category ===
                                                "pain"
                                                    ? "danger"
                                                    : selected.drug.category ===
                                                        "nausea"
                                                      ? "warning"
                                                      : selected.drug
                                                              .category ===
                                                          "sedation"
                                                        ? "info"
                                                        : selected.drug
                                                                .category ===
                                                            "secretions"
                                                          ? "primary"
                                                          : "light"
                                            }`}
                                        >
                                            {selected.drug.category}
                                        </span>
                                    </header>

                                    <div
                                        className="card-content"
                                        style={{ padding: "0.75rem" }}
                                    >
                                        {selected.drug.id !== "water" && (
                                            <div className="content">
                                                {/* Dose fields - with Range toggle for specific drugs */}
                                                {(selected.drug.id ===
                                                    "morphine" ||
                                                    selected.drug.id ===
                                                        "alfentanil") && (
                                                    <div className="field">
                                                        <div className="field-body">
                                                            <div className="field is-grouped">
                                                                <p className="control">
                                                                    <label className="label mb-1">
                                                                        Dosage:
                                                                    </label>
                                                                </p>
                                                                <p className="control">
                                                                    <button
                                                                        className={`button is-small mb-1 is-outlined ${selected.isRange ? "is-danger" : "is-link"}`}
                                                                        onClick={() =>
                                                                            toggleRangeMode(
                                                                                index,
                                                                            )
                                                                        }
                                                                    >
                                                                        {selected.isRange
                                                                            ? "Change to Single Dose"
                                                                            : "Change to Range Dosing"}
                                                                    </button>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {selected.isRange ? (
                                                            <div
                                                                className="level"
                                                                style={{
                                                                    marginBottom:
                                                                        "0.5rem",
                                                                }}
                                                            >
                                                                <div className="level-left">
                                                                    <div className="level-item">
                                                                        <div className="field has-addons">
                                                                            <p className="control">
                                                                                <input
                                                                                    className="input"
                                                                                    style={{
                                                                                        width: "80px",
                                                                                    }}
                                                                                    type="text"
                                                                                    value={
                                                                                        selected.doseRangeMgMin ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        updateDrug(
                                                                                            index,
                                                                                            "doseRangeMgMin",
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                    placeholder="Min"
                                                                                />
                                                                            </p>
                                                                            <p className="control">
                                                                                <span className="button is-static">
                                                                                    mg
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="level-item">
                                                                        <span>
                                                                            to
                                                                        </span>
                                                                    </div>

                                                                    <div className="level-item">
                                                                        <div className="field has-addons">
                                                                            <p className="control">
                                                                                <input
                                                                                    className="input"
                                                                                    style={{
                                                                                        width: "80px",
                                                                                    }}
                                                                                    type="text"
                                                                                    value={
                                                                                        selected.doseRangeMgMax ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        updateDrug(
                                                                                            index,
                                                                                            "doseRangeMgMax",
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                    placeholder="Max"
                                                                                />
                                                                            </p>
                                                                            <p className="control">
                                                                                <span className="button is-static">
                                                                                    mg
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="field has-addons"
                                                                style={{
                                                                    marginBottom:
                                                                        "0.5rem",
                                                                }}
                                                            >
                                                                <p className="control">
                                                                    <input
                                                                        className="input"
                                                                        style={{
                                                                            width: "80px",
                                                                        }}
                                                                        type="text"
                                                                        value={
                                                                            selected.doseMg ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateDrug(
                                                                                index,
                                                                                "doseMg",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="mg"
                                                                    />
                                                                </p>
                                                                <p className="control">
                                                                    <span className="button is-static">
                                                                        mg
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Show calculated ml values */}
                                                        {selected.isRange ? (
                                                            <p className="help">
                                                                <strong>
                                                                    ML Value:
                                                                </strong>{" "}
                                                                {selected.drug
                                                                    .ratio &&
                                                                selected.doseRangeMgMin
                                                                    ? calculateMl(
                                                                          selected.doseRangeMgMin,
                                                                          selected
                                                                              .drug
                                                                              .ratio,
                                                                      )
                                                                    : "?"}{" "}
                                                                -
                                                                {selected.drug
                                                                    .ratio &&
                                                                selected.doseRangeMgMax
                                                                    ? calculateMl(
                                                                          selected.doseRangeMgMax,
                                                                          selected
                                                                              .drug
                                                                              .ratio,
                                                                      )
                                                                    : "?"}{" "}
                                                                ml
                                                            </p>
                                                        ) : (
                                                            <p className="help">
                                                                <strong>
                                                                    ML Value:
                                                                </strong>{" "}
                                                                {selected.drug
                                                                    .ratio &&
                                                                selected.doseMg
                                                                    ? calculateMl(
                                                                          selected.doseMg,
                                                                          selected
                                                                              .drug
                                                                              .ratio,
                                                                      )
                                                                    : "?"}{" "}
                                                                ml
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Regular dose fields for non-range drugs */}
                                                {selected.drug.id !==
                                                    "morphine" &&
                                                    selected.drug.id !==
                                                        "alfentanil" && (
                                                        <div className="field">
                                                            <label className="label mb-1">
                                                                Dose:
                                                            </label>
                                                            <div
                                                                className="field has-addons"
                                                                style={{
                                                                    marginBottom:
                                                                        "0.5rem",
                                                                }}
                                                            >
                                                                <p className="control">
                                                                    <input
                                                                        className="input"
                                                                        style={{
                                                                            width: "80px",
                                                                        }}
                                                                        type="text"
                                                                        value={
                                                                            selected.doseMg ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateDrug(
                                                                                index,
                                                                                "doseMg",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="mg"
                                                                    />
                                                                </p>
                                                                <p className="control">
                                                                    <span className="button is-static">
                                                                        mg
                                                                    </span>
                                                                </p>
                                                            </div>

                                                            {/* Show calculated ml value */}
                                                            <p className="help">
                                                                <strong>
                                                                    ML Value:
                                                                </strong>{" "}
                                                                {selected.drug
                                                                    .ratio &&
                                                                selected.doseMg
                                                                    ? calculateMl(
                                                                          selected.doseMg,
                                                                          selected
                                                                              .drug
                                                                              .ratio,
                                                                      )
                                                                    : "?"}{" "}
                                                                ml
                                                            </p>
                                                        </div>
                                                    )}

                                                {/* Frequency dropdown */}
                                                <div className="field">
                                                    <label className="label mb-1">
                                                        Frequency:
                                                    </label>
                                                    <div className="control">
                                                        <div
                                                            className="select"
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                        >
                                                            <select
                                                                value={
                                                                    selected.frequency ||
                                                                    selected
                                                                        .drug
                                                                        .frequency
                                                                }
                                                                onChange={(e) =>
                                                                    updateDrug(
                                                                        index,
                                                                        "frequency",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                style={{
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                {frequencyOptions.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                option
                                                                            }
                                                                            value={
                                                                                option
                                                                            }
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Crisis dose toggle for Midazolam */}
                                                {selected.drug.id ===
                                                    "midazolam" && (
                                                    <div className="field mt-2">
                                                        <div className="control">
                                                            <label className="checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        !!selected.useCrisisDose
                                                                    }
                                                                    onChange={() =>
                                                                        toggleCrisisDose(
                                                                            index,
                                                                        )
                                                                    }
                                                                    style={{
                                                                        marginRight:
                                                                            "8px",
                                                                    }}
                                                                />
                                                                <span className="has-text-danger has-text-weight-bold">
                                                                    Crisis dose
                                                                    required
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {selected.drug.id === "water" && (
                                            <p className="italic">
                                                Water for injection - used for
                                                reconstitution
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={activeTab === "preview" ? "" : "is-hidden"}>
                    <div className="columns is-multiline">
                        {selectedDrugs.map((selected, index) => {
                            const directionsText = getDirectionsText(selected);
                            // For Midazolam with crisis dose, we render two separate cards
                            if (
                                selected.drug.id === "midazolam" &&
                                selected.useCrisisDose
                            ) {
                                return (
                                    <React.Fragment key={`midazolam-${index}`}>
                                        {/* Regular dose card */}
                                        <div className="column is-half">
                                            <div className="card">
                                                <div className="card-content">
                                                    <div className="content">
                                                        <h4 className="title is-5 has-text-centered">
                                                            {selected.drug.name}{" "}
                                                            {
                                                                selected.drug
                                                                    .strength
                                                            }
                                                        </h4>
                                                        <div
                                                            id={`label-${index}`}
                                                        >
                                                            <p className="has-text-centered">
                                                                {`Inject ${calculateMl(selected.doseMg || selected.drug.defaultDoseMg || "", selected.drug.ratio || 1)}ml (a ${selected.doseMg || selected.drug.defaultDoseMg}mg dose) ${selected.drug.route} when required, ${selected.frequency || selected.drug.frequency}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <footer className="card-footer">
                                                    <button
                                                        className="card-footer-item button is-primary is-light"
                                                        onClick={() =>
                                                            handleCopyDirections(
                                                                `label-${index}`,
                                                            )
                                                        }
                                                    >
                                                        Copy Directions
                                                    </button>
                                                </footer>
                                            </div>
                                        </div>

                                        {/* Crisis dose card */}
                                        <div className="column is-half">
                                            <div className="card has-background-danger-light">
                                                <div className="card-content">
                                                    <span className="tag is-danger is-pulled-right">
                                                        CRISIS DOSE
                                                    </span>
                                                    <div className="content">
                                                        <h4 className="title is-5 has-text-centered">
                                                            {selected.drug.name}{" "}
                                                            {
                                                                selected.drug
                                                                    .strength
                                                            }
                                                        </h4>
                                                        <div
                                                            id={`crisis-label-${index}`}
                                                        >
                                                            <p className="has-text-centered">
                                                                {`Inject ${calculateMl(selected.drug.crisisDoseMg || "", selected.drug.ratio || 1)}ml (a ${selected.drug.crisisDoseMg}mg dose) ${selected.drug.route} ${selected.drug.crisisInstructions}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <footer className="card-footer">
                                                    <button
                                                        className="card-footer-item button is-danger is-light"
                                                        onClick={() =>
                                                            handleCopyDirections(
                                                                `crisis-label-${index}`,
                                                            )
                                                        }
                                                    >
                                                        Copy Crisis Directions
                                                    </button>
                                                </footer>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            }

                            // For all other drugs, just render a single card
                            return (
                                <div key={index} className="column is-half">
                                    <div className="card">
                                        <div className="card-content">
                                            <div className="content">
                                                <h4 className="title is-5 has-text-centered">
                                                    {selected.drug.name}{" "}
                                                    {selected.drug.strength}
                                                </h4>
                                                <div id={`label-${index}`}>
                                                    <p className="has-text-centered">
                                                        {directionsText}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <footer className="card-footer">
                                            <button
                                                className="card-footer-item button is-primary is-light"
                                                onClick={() =>
                                                    handleCopyDirections(
                                                        `label-${index}`,
                                                    )
                                                }
                                            >
                                                Copy Directions
                                            </button>
                                        </footer>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PalliativeLabelGenerator;
