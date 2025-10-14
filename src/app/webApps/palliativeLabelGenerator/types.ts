// types.ts
export type Drug = {
    id: string;
    name: string;
    strength: string;
    defaultDoseMg: string | null;
    defaultDoseRangeMgMin?: string;
    defaultDoseRangeMgMax?: string;
    frequency: string;
    route: string;
    category: string;
    indication: string;
    ratio?: number; // Ratio of mg per ml for calculation
    hasCrisisDose?: boolean;
    crisisDoseMg?: string;
    crisisInstructions?: string;
};

export type SelectedDrug = {
    drug: Drug;
    doseMg?: string;
    doseRangeMgMin?: string;
    doseRangeMgMax?: string;
    frequency?: string;
    isRange: boolean;
    useCrisisDose?: boolean;
};
