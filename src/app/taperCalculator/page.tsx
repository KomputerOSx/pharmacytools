"use client";
import React, { useState } from "react";
import Dropdown from "@/app/taperCalculator/Dropdown";
import TabletTaper from "@/app/taperCalculator/TabletTaper";
import EyeDropTaper from "@/app/taperCalculator/EyeDropTaper"; // Assuming you have this component

function TaperCalculator() {
    const [selectedTaper, setSelectedTaper] = useState<string>("Tablet Taper");

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
                    />

                    {selectedTaper === "Tablet Taper" && <TabletTaper />}
                    {selectedTaper === "Eye Drop Taper" && <EyeDropTaper />}
                </div>
            </div>
        </>
    );
}

export default TaperCalculator;
