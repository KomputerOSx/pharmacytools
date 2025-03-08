// utils.ts
import { SelectedDrug } from "./types";

// Calculate ml based on mg and ratio
export const calculateMl = (mg: string, ratio: number): string => {
    if (!mg || !ratio) return "";
    const calculated = parseFloat(mg) / ratio;
    // If it's a whole number, return without decimal places
    return Number.isInteger(calculated)
        ? calculated.toString()
        : calculated.toFixed(2);
};

export const getDirectionsText = (selected: SelectedDrug): string => {
    if (selected.drug.id === "water") {
        return "Use for reconstitution";
    }

    let doseText;
    let directionsText;

    if (
        selected.isRange &&
        (selected.drug.id === "morphine/oxycodone" ||
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
