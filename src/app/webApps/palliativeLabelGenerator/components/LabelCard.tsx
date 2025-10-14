// components/LabelCard.tsx
import React from "react";
import { SelectedDrug } from "../types";
import { calculateMl, getDirectionsText } from "../utils";

type LabelCardProps = {
    selected: SelectedDrug;
    index: number;
    handleCopyDirections: (labelId: string) => void;
};

const LabelCard: React.FC<LabelCardProps> = ({
    selected,
    index,
    handleCopyDirections,
}) => {
    // For Midazolam with crisis dose, we return multiple components
    if (selected.drug.id === "midazolam" && selected.useCrisisDose) {
        return [
            // Regular dose card
            <div key={`regular-${index}`} className="column is-half">
                <div className="card">
                    <div className="card-content">
                        <div className="content">
                            <h4 className="title is-5 has-text-centered">
                                {selected.drug.name} {selected.drug.strength}
                            </h4>
                            <div id={`label-${index}`}>
                                <p className="has-text-centered">
                                    {`Inject ${calculateMl(
                                        selected.doseMg ||
                                            selected.drug.defaultDoseMg ||
                                            "",
                                        selected.drug.ratio || 1,
                                    )}ml (a ${
                                        selected.doseMg ||
                                        selected.drug.defaultDoseMg
                                    }mg dose) ${
                                        selected.drug.route
                                    } when required, ${
                                        selected.frequency ||
                                        selected.drug.frequency
                                    }, ${selected.drug.indication}`}
                                </p>
                            </div>
                        </div>
                    </div>
                    <footer className="card-footer">
                        <button
                            className="card-footer-item button is-primary is-light"
                            onClick={() =>
                                handleCopyDirections(`label-${index}`)
                            }
                        >
                            Copy Directions
                        </button>
                    </footer>
                </div>
            </div>,

            // Crisis dose card
            <div key={`crisis-${index}`} className="column is-half">
                <div className="card has-background-danger-light">
                    <div className="card-content">
                        <span className="tag is-danger is-pulled-right">
                            CRISIS DOSE
                        </span>
                        <div className="content">
                            <h4 className="title is-5 has-text-centered">
                                {selected.drug.name} {selected.drug.strength}
                            </h4>
                            <div id={`crisis-label-${index}`}>
                                <p className="has-text-centered">
                                    {`Inject ${calculateMl(
                                        selected.drug.crisisDoseMg || "",
                                        selected.drug.ratio || 1,
                                    )}ml (a ${
                                        selected.drug.crisisDoseMg
                                    }mg dose) ${selected.drug.route} ${
                                        selected.drug.crisisInstructions
                                    }`}
                                </p>
                            </div>
                        </div>
                    </div>
                    <footer className="card-footer">
                        <button
                            className="card-footer-item button is-danger is-light"
                            onClick={() =>
                                handleCopyDirections(`crisis-label-${index}`)
                            }
                        >
                            Copy Crisis Directions
                        </button>
                    </footer>
                </div>
            </div>,
        ];
    }

    // For all other drugs, just render a single card
    const directionsText = getDirectionsText(selected);
    return (
        <div className="column is-half">
            <div className="card">
                <div className="card-content">
                    <div className="content">
                        <h4 className="title is-5 has-text-centered">
                            {selected.drug.name} {selected.drug.strength}
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
                        onClick={() => handleCopyDirections(`label-${index}`)}
                    >
                        Copy Directions
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default LabelCard;
