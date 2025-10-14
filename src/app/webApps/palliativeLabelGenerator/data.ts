// data.ts
import { Drug } from "./types";

// Default drug data
export const drugs: Drug[] = [
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
        indication: "for pain or shortness of breath",
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
        indication: "for nausea and vomiting",
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
        indication: "for nausea and vomiting",
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
        indication: "for respiratory tract secretions",
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
        indication: "for anxiety/agitations/distress",
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
        indication: "for pain and shortness of breath",
        ratio: 10, // 10mg/1ml
    },
    {
        id: "water",
        name: "Water for injection",
        strength: "10ml",
        defaultDoseMg: null,
        frequency: "as needed",
        indication: "",
        route: "for reconstitution",
        category: "other",
        ratio: 0,
    },
];

// Frequency options
export const frequencyOptions = [
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
export const sortedDrugs = [...drugs].sort((a, b) => {
    if (a.id === "water") return 1;
    if (b.id === "water") return -1;
    return a.name.localeCompare(b.name);
});
