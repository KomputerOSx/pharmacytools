export interface Contact {
    id?: string;
    name: string;
    number: string;
    site: string;
    department: string;
    warfarinTrained?: boolean;
    _pin?: string; // Used for Firestore rules validation
}
