"use client";

import React, { useState } from "react";
import "./crclCalculator.css";
import GenderSelectButton from "@/app/webApps/crclCalculator/GenderSelectButton";
import CrClDisplay from "@/app/webApps/crclCalculator/CrClDisplay";

interface Patient {
    ibwBase: number;
    crclBase: number;
}

function CrClCalculator() {
    const [selectedGender, setSelectedGender] = useState("Male");
    const [age, setAge] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [height, setHeight] = useState<number | null>(null);
    const [serumCreatinine, setSerumCreatinine] = useState<number | null>(null);
    const [results, setResults] = useState<{
        actualCrCl: number | null;
        ibwCrCl: number | null;
        abwCrCl: number | null;
        ibwError?: string;
        abwError?: string;
    }>({
        actualCrCl: null,
        ibwCrCl: null,
        abwCrCl: null,
    });

    const handleGenderChange = (gender: string) => {
        setSelectedGender(gender);
    };

    const male: Patient = {
        ibwBase: 50,
        crclBase: 1.23,
    };

    const female: Patient = {
        ibwBase: 45.5,
        crclBase: 1.04,
    };

    const handleIBW = (heightInCm: number, gender: string): number => {
        if (gender.toLowerCase() === "male") {
            return male.ibwBase + 2.3 * (heightInCm / 2.54 - 60);
        } else {
            return female.ibwBase + 2.3 * (heightInCm / 2.54 - 60);
        }
    };

    const handleABW = (
        weightInKg: number,
        heightInCm: number,
        gender: string,
    ): number => {
        const ibw = handleIBW(heightInCm, gender);
        if (weightInKg < ibw) {
            return weightInKg;
        } else {
            return ibw + 0.4 * (weightInKg - ibw);
        }
    };

    const calculateCrCl = (
        weight: number,
        age: number,
        gender: string,
        serumCr: number,
    ): number => {
        const genderFactor =
            gender.toLowerCase() === "male" ? male.crclBase : female.crclBase;
        const crcl = ((140 - age) * weight * genderFactor) / serumCr;
        if (crcl >= 120) {
            return 120;
        } else {
            return crcl;
        }
    };

    const handleCalculate = () => {
        if (age && weight && height && serumCreatinine) {
            const ibw = handleIBW(height, selectedGender);
            const abw = handleABW(weight, height, selectedGender);

            const actualCrCl = calculateCrCl(
                weight,
                age,
                selectedGender,
                serumCreatinine,
            );

            let ibwCrCl = null;
            let abwCrCl = null;
            let ibwError = undefined;
            let abwError = undefined;

            if (height < 152) {
                ibwError = "Not calculated: Height is less than 154cm";
                abwError = "Not calculated: Height is less than 154cm";
            } else if (weight < ibw) {
                ibwError = "Not calculated: Actual weight is less than IBW";
                abwError = "Not calculated: Actual weight is less than IBW";
            } else {
                ibwCrCl = calculateCrCl(
                    ibw,
                    age,
                    selectedGender,
                    serumCreatinine,
                );
                abwCrCl = calculateCrCl(
                    abw,
                    age,
                    selectedGender,
                    serumCreatinine,
                );
            }

            setResults({
                actualCrCl,
                ibwCrCl,
                abwCrCl,
                ibwError,
                abwError,
            });
        }
    };

    const handleClear = () => {
        setAge(null);
        setWeight(null);
        setHeight(null);
        setSerumCreatinine(null);
        setResults({ actualCrCl: null, ibwCrCl: null, abwCrCl: null });
    };

    return (
        <>
            <div
                className={"container"}
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
                <div className={"block"}>
                    <h1 className={"title is-1"}>CrCl Calculator</h1>
                </div>

                <GenderSelectButton onSelect={handleGenderChange} />

                <div className="inputs-container">
                    <div className="field">
                        <label className="label">Age</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                min={18}
                                placeholder="Enter Age"
                                value={age || ""}
                                onChange={(e) =>
                                    setAge(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Weight (kg)</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                min={30}
                                placeholder="Enter Weight"
                                value={weight || ""}
                                onChange={(e) =>
                                    setWeight(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Height (cm)</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                min={120}
                                placeholder="Enter Height"
                                value={height || ""}
                                onChange={(e) =>
                                    setHeight(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">
                            Serum Creatinine (μmol/L)
                        </label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                min={20}
                                step="1"
                                placeholder="Enter Serum Creatinine"
                                value={serumCreatinine || ""}
                                onChange={(e) =>
                                    setSerumCreatinine(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="action-buttons-container">
                    <button
                        className="button is-secondary is-light"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                    <button
                        className="button is-primary"
                        onClick={handleCalculate}
                        disabled={
                            !age || !weight || !height || !serumCreatinine
                        }
                    >
                        Calculate
                    </button>
                </div>

                {/* Results Display */}

                <div className="">
                    {results.actualCrCl !== null && (
                        <h2 className="title is-2 has-text-centered">
                            Results
                        </h2>
                    )}

                    <div className="crcl-results-container">
                        {results.actualCrCl !== null && (
                            <div className="crcl-results-item">
                                <CrClDisplay
                                    crcl={results.actualCrCl}
                                    title="Actual Weight CrCl"
                                />
                            </div>
                        )}

                        {results.ibwCrCl !== null && (
                            <div className="crcl-results-item">
                                <CrClDisplay
                                    crcl={results.ibwCrCl}
                                    title="Ideal Body Weight CrCl"
                                />
                                {results.ibwError && (
                                    <div className="error-message">
                                        {results.ibwError}
                                    </div>
                                )}
                            </div>
                        )}

                        {results.abwCrCl !== null && (
                            <div className="crcl-results-item">
                                <CrClDisplay
                                    crcl={results.abwCrCl}
                                    title="Adjusted Body Weight CrCl"
                                />
                                {results.abwError && (
                                    <div className="error-message">
                                        {results.abwError}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CrClCalculator;
