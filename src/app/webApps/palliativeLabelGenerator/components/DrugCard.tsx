// components/DrugCard.tsx
import React from "react";
import { SelectedDrug } from "../types";
import { calculateMl } from "../utils";
import { frequencyOptions } from "../data";

type DrugCardProps = {
    selected: SelectedDrug;
    index: number;
    updateDrug: (index: number, field: string, value: string) => void;
    toggleRangeMode: (index: number) => void;
    toggleCrisisDose: (index: number) => void;
};

const DrugCard: React.FC<DrugCardProps> = ({
    selected,
    index,
    updateDrug,
    toggleRangeMode,
    toggleCrisisDose,
}) => {
    return (
        <div className="card">
            <header className="card-header">
                <p className="card-header-title">
                    {selected.drug.name} - {selected.drug.strength}
                </p>
                <span
                    className={`tag m-2 is-${
                        selected.drug.category === "pain"
                            ? "danger"
                            : selected.drug.category === "nausea"
                              ? "warning"
                              : selected.drug.category === "sedation"
                                ? "info"
                                : selected.drug.category === "secretions"
                                  ? "primary"
                                  : "light"
                    }`}
                >
                    {selected.drug.category}
                </span>
            </header>

            <div className="card-content" style={{ padding: "0.75rem" }}>
                {selected.drug.id !== "water" && (
                    <div className="content">
                        {/* Dose fields - with Range toggle for specific drugs */}
                        {(selected.drug.id === "morphine/oxycodone" ||
                            selected.drug.id === "alfentanil") && (
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
                                                className={`button is-small mb-1 is-outlined ${
                                                    selected.isRange
                                                        ? "is-danger"
                                                        : "is-link"
                                                }`}
                                                onClick={() =>
                                                    toggleRangeMode(index)
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
                                            marginBottom: "0.5rem",
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
                                                            onChange={(e) =>
                                                                updateDrug(
                                                                    index,
                                                                    "doseRangeMgMin",
                                                                    e.target
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
                                                <span>to</span>
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
                                                            onChange={(e) =>
                                                                updateDrug(
                                                                    index,
                                                                    "doseRangeMgMax",
                                                                    e.target
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
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        <p className="control">
                                            <input
                                                className="input"
                                                style={{
                                                    width: "80px",
                                                }}
                                                type="text"
                                                value={selected.doseMg || ""}
                                                onChange={(e) =>
                                                    updateDrug(
                                                        index,
                                                        "doseMg",
                                                        e.target.value,
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
                                        <strong>ML Value:</strong>{" "}
                                        {selected.drug.ratio &&
                                        selected.doseRangeMgMin
                                            ? calculateMl(
                                                  selected.doseRangeMgMin,
                                                  selected.drug.ratio,
                                              )
                                            : "?"}{" "}
                                        -
                                        {selected.drug.ratio &&
                                        selected.doseRangeMgMax
                                            ? calculateMl(
                                                  selected.doseRangeMgMax,
                                                  selected.drug.ratio,
                                              )
                                            : "?"}{" "}
                                        ml
                                    </p>
                                ) : (
                                    <p className="help">
                                        <strong>ML Value:</strong>{" "}
                                        {selected.drug.ratio && selected.doseMg
                                            ? calculateMl(
                                                  selected.doseMg,
                                                  selected.drug.ratio,
                                              )
                                            : "?"}{" "}
                                        ml
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Regular dose fields for non-range drugs */}
                        {selected.drug.id !== "morphine/oxycodone" &&
                            selected.drug.id !== "alfentanil" && (
                                <div className="field">
                                    <label className="label mb-1">Dose:</label>
                                    <div
                                        className="field has-addons"
                                        style={{
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        <p className="control">
                                            <input
                                                className="input"
                                                style={{
                                                    width: "80px",
                                                }}
                                                type="text"
                                                value={selected.doseMg || ""}
                                                onChange={(e) =>
                                                    updateDrug(
                                                        index,
                                                        "doseMg",
                                                        e.target.value,
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
                                        <strong>ML Value:</strong>{" "}
                                        {selected.drug.ratio && selected.doseMg
                                            ? calculateMl(
                                                  selected.doseMg,
                                                  selected.drug.ratio,
                                              )
                                            : "?"}{" "}
                                        ml
                                    </p>
                                </div>
                            )}

                        {/* Frequency dropdown */}
                        <div className="field">
                            <label className="label mb-1">Frequency:</label>
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
                                            selected.drug.frequency
                                        }
                                        onChange={(e) =>
                                            updateDrug(
                                                index,
                                                "frequency",
                                                e.target.value,
                                            )
                                        }
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        {frequencyOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Crisis dose toggle for Midazolam */}
                        {selected.drug.id === "midazolam" && (
                            <div className="field mt-2">
                                <div className="control">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={!!selected.useCrisisDose}
                                            onChange={() =>
                                                toggleCrisisDose(index)
                                            }
                                            style={{
                                                marginRight: "8px",
                                            }}
                                        />
                                        <span className="has-text-danger has-text-weight-bold">
                                            Crisis dose required
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {selected.drug.id === "water" && (
                    <p className="italic">
                        Water for injection - used for reconstitution
                    </p>
                )}
            </div>
        </div>
    );
};

export default DrugCard;
