"use client";

import "./crclCalculator.css";
import React from "react";
import GenderSelectButton from "@/app/crclCalculator/GenderSelectButton";

interface Patient {
    ibwBase: number;
    crclBase: number;
}

function CrClCalculator() {
    const [selectedGender, setSelectedGender] = React.useState("Male");

    const handleGenderChange = () => {
        setSelectedGender(selectedGender);
    };

    const male: Patient = {
        ibwBase: 50,
        crclBase: 1.23,
    };

    const female: Patient = {
        ibwBase: 45.5,
        crclBase: 1.04,
    };

    const handleIBW = (heightInCm: number, selectedGender: string): number => {
        if (selectedGender.toLowerCase() === "male") {
            return male.ibwBase + 2.3 * (heightInCm / 2.54 - 60);
        } else {
            return female.ibwBase + 2.3 * (heightInCm / 2.54 - 60);
        }
    };

    const handleABW = (
        weightInKg: number,
        heightInCm: number,
        selectedGender: string,
    ): number | boolean => {
        if (weightInKg < handleIBW(heightInCm, selectedGender)) {
            return false;
        } else {
            return (
                handleIBW(heightInCm, selectedGender) +
                0.4 * (weightInKg - handleIBW(heightInCm, selectedGender))
            );
        }
    };

    const handleCrCl = (
        age: number,
        weightInKg: number,
        heightInCm: number,
        serumCreatinine: number,
        selectedGender: string,
    ): number | boolean => {
        if (weightInKg < handleIBW(heightInCm, selectedGender)) {
            return false;
        }
        if (selectedGender.toLowerCase() === "male") {
            return ((140 - age) * weightInKg * male.crclBase) / serumCreatinine;
        } else {
            return (
                ((140 - age) * weightInKg * female.crclBase) / serumCreatinine
            );
        }
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

                <div className="field has-addons-right">
                    <div className={"block"}>
                        <label className="label">Age</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                min={18}
                                placeholder="Enter Age"
                            />
                        </div>
                    </div>
                </div>
                <div className="field has-addons-right">
                    <div className={"block"}>
                        <label className="label">Weight</label>
                        <div className="control">
                            <input
                                className="input "
                                type="number"
                                min={30}
                                placeholder="Enter Weight"
                            />
                        </div>
                    </div>

                    <div className={"block"}>
                        <label className="label">Height</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                min={120}
                                placeholder="Enter Height"
                            />
                        </div>
                    </div>

                    <div className={"block"}>
                        <label className="label">Serum Creatinine</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                min={1}
                                placeholder="Enter Serum Creatinine"
                            />
                        </div>
                    </div>
                </div>

                <div className="action-buttons-container">
                    <button className="button is-seconday is-light">
                        Clear
                    </button>
                    <button className="button is-primary">Calculate</button>
                </div>
            </div>
        </>
    );
}

export default CrClCalculator;
