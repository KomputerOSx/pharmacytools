import React from "react";
import "./crclDisplay.css";

interface CrClDisplayProps {
    crcl: number;
    title?: string;
    subtitle?: string;
    error?: string | undefined;
}

const CrClDisplay: React.FC<CrClDisplayProps> = ({
    crcl,
    title = "Creatinine Clearance",
    subtitle = "mL/min",
}) => {
    // Determine color based on CrCl value
    const getColorClass = (value: number): string => {
        if (value >= 90) return "crcl-normal";
        if (value >= 60) return "crcl-mild";
        if (value >= 30) return "crcl-moderate";
        if (value >= 15) return "crcl-severe";
        return "crcl-failure";
    };

    // Determine kidney function label
    const getKidneyFunction = (value: number): string => {
        if (value >= 90) return "Normal";
        if (value >= 60) return "Mild Decrease";
        if (value >= 30) return "Moderate Decrease";
        if (value >= 15) return "Severe Decrease";
        return "Kidney Failure";
    };

    const colorClass = getColorClass(crcl);
    const kidneyFunction = getKidneyFunction(crcl);

    return (
        <div className="crcl-display-container">
            <div className={`crcl-card ${colorClass}`}>
                <div className="crcl-header">
                    <h3 className="crcl-title">{title}</h3>
                </div>
                <div className="crcl-body">
                    <div className="crcl-value-container">
                        <span className="crcl-value">
                            {crcl >= 120 ? ">" : ""}
                            {crcl !== null ? crcl.toFixed(1) : "N/A"}
                        </span>
                        <span className="crcl-unit">{subtitle}</span>
                    </div>
                    <div className="crcl-gauge">
                        <div
                            className="crcl-gauge-fill"
                            style={{
                                width: `${Math.min(100, (crcl / 120) * 100)}%`,
                            }}
                        ></div>
                    </div>
                    <div className="crcl-function">
                        <span className="crcl-function-label">
                            Kidney Function:
                        </span>
                        <span className="crcl-function-value">
                            {kidneyFunction}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrClDisplay;
