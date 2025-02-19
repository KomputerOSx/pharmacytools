// import React, { useState } from "react";
// import "./EyeDropTaper.css";
// import EyeButtonGroup from "@/app/taperCalculator/EyeButtonGroup";
// // @ts-expect-error ignore this line
// import {CopyToClipboard} from 'react-copy-to-clipboard';
//
// function EyeDropTaper() {
//     const [taperLines, setTaperLines] = useState([
//         { dropCount: 0, frequency: 0, interval: 0 },
//     ]);
//
//     // Add state to track selected eye
//     const [selectedEye, setSelectedEye] = useState("Left");
//
//     const handleAddTaper = () => {
//         setTaperLines([
//             ...taperLines,
//             { dropCount: 0, frequency: 0, interval: 0 },
//         ]);
//     };
//
//     const handleDeleteTaper = (index: number) => {
//         setTaperLines(taperLines.filter((_, i) => i !== index));
//     };
//
//     const handleInputChange = (index: number, field: string, value: number) => {
//         const updatedTaperLines = [...taperLines];
//         // @ts-expect-error ignore this line
//         updatedTaperLines[index][field] = value;
//         setTaperLines(updatedTaperLines);
//     };
//
//     const [calculationResult, setCalculationResult] = useState<string[]>([]);
//     const [totalMls, setTotalMls] = useState<number>(0);
//
//
//
//     // Properly handle eye selection from the EyeButtonGroup
//     const handleEyeSelection = (eye: string) => {
//         console.log("Eye selected:", eye); // Add logging to debug
//         setSelectedEye(eye);
//     };
//
//     const handleCalculate = () => {
//         const results: string[] = [];
//         let totalDropCount = 0;
//         const normalFrequency = [16, 8, 6, 4, 3, 2, 1];
//         let textToCopy = ''; // Initialize the textToCopy variable
//
//
//         // Process each taper line
//         for (let lineIndex = 0; lineIndex < taperLines.length; lineIndex++) {
//             const currentLine = taperLines[lineIndex];
//             const nextLine = lineIndex < taperLines.length - 1 ? taperLines[lineIndex + 1] : null;
//
//             if (currentLine.frequency === 0) continue;
//
//             const startIndex = normalFrequency.indexOf(currentLine.frequency);
//             if (startIndex === -1) continue;
//
//             // Find end index based on next taper line
//             let endIndex = nextLine
//                 ? normalFrequency.indexOf(nextLine.frequency)
//                 : normalFrequency.length;
//
//             // If next frequency not found, go to end
//             if (endIndex === -1) endIndex = normalFrequency.length;
//
//             // Generate taper schedule for current section
//             for (let i = startIndex; i < endIndex; i++) {
//                 const currentFreq = normalFrequency[i];
//                 const text = `Apply ${currentLine.dropCount} drop${currentLine.dropCount > 1 ? 's' : ''} ${numberToWords(currentFreq)} for ${currentLine.interval} days`;
//                 results.push(text);
//                 textToCopy += text + '\n'; // Update the textToCopy variable
//
//                 totalDropCount += currentLine.dropCount * currentFreq * currentLine.interval;
//             }
//
//             //If there's a next line and taper frequency is the same, state the current taper with interval once, and they continue with the next taper
//             if (nextLine && currentLine.frequency === nextLine.frequency) {
//                 const text = `Apply ${currentLine.dropCount} drop${currentLine.dropCount > 1 ? 's' : ''} ${numberToWords(currentLine.frequency)} for ${currentLine.interval} days`;
//                 results.push(text);
//                 textToCopy += text + '\n'; // Update the textToCopy variable
//
//                 totalDropCount += currentLine.dropCount * currentLine.frequency * currentLine.interval;
//                 continue;
//             }
//             // If there's a next line, continue the taper with the new interval
//             if (nextLine && endIndex < normalFrequency.length) {
//                 for (let i = endIndex; i < normalFrequency.length; i++) {
//                     const currentFreq = normalFrequency[i];
//                     const text = `Apply ${nextLine.dropCount} drop${nextLine.dropCount > 1 ? 's' : ''} ${numberToWords(currentFreq)} for ${nextLine.interval} days`;
//                     results.push(text);
//                     textToCopy += text + '\n'; // Update the textToCopy variable
//
//                     totalDropCount += nextLine.dropCount * currentFreq * nextLine.interval;
//                 }
//                 break; // Exit after processing the transition
//             }
//
//
//         }
//
//         const totalMls = totalDropCount / 20;
//         setTotalMls(totalMls);
//         setCalculationResult(results);
//         setTextToCopy(textToCopy); // Update the textToCopy state
//     };
//
//     function numberToWords(num: number): string {
//         const ones = ['', 'ONCE a day', 'TWICE a day', 'THREE times a day', 'FOUR times a day', 'FIVE', 'SIX times a day', 'SEVEN', 'every TWO hours', 'NINE', ];
//         const teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'every HOUR', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
//
//         if (num < 10) {
//             return ones[num];
//         } else if (num < 20) {
//             return teens[num - 10];
//         } else {
//             // implement hundreds, thousands, etc.
//             return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 === 0 ? '' : ' and ' + numberToWords(num % 100));
//         }
//     }
//
//     const [textToCopy, setTextToCopy] = useState(''); // The text you want to copy
//     const [copyStatus, setCopyStatus] = useState(false); // To indicate if the text was copied
//
//     const onCopyText = () => {
//         setCopyStatus(true);
//         setTimeout(() => setCopyStatus(false), 5000); // Reset status after 5 seconds
//     };
//
//
//
//     return (
//         <div style={{padding: '1rem'}}>
//
//             {/* Make sure the prop name matches what EyeButtonGroup expects */}
//             <EyeButtonGroup onSelect={(eye) => {
//                 console.log("Selected eye in parent:", eye);
//                 handleEyeSelection(eye);
//             }} />
//
//             {taperLines.map((taperLine, index) => (
//                 <div key={index} className="taper-input-row">
//                     <div className="field">
//                         <label className="label">Drop(s)</label>
//                         <div className="control">
//                             <input
//                                 className="input"
//                                 type="number"
//                                 min="0"
//                                 step="1"
//                                 placeholder="Enter Drops per Dose"
//                                 value={taperLine.dropCount}
//                                 onChange={(e) => {
//                                     const value = e.target.value === '' ? '' : Math.max(0, Math.floor(Number(e.target.value)));
//                                     handleInputChange(index, "dropCount", value as number);
//                                 }}
//                             />
//                         </div>
//                     </div>
//
//                     <div className="field">
//                         <label className="label">Frequency / Day</label>
//                         <div className="control">
//                             <select
//                                 className="input"
//                                 value={taperLine.frequency}
//                                 onChange={(e) => {
//                                     handleInputChange(index, "frequency", Number(e.target.value));
//                                 }}
//                             >
//                                 <option value="0">Select Frequency</option>
//                                 <option value="16">16</option>
//                                 <option value="8">8</option>
//                                 <option value="6">6</option>
//                                 <option value="4">4</option>
//                                 <option value="3">3</option>
//                                 <option value="2">2</option>
//                                 <option value="1">1</option>
//                             </select>
//                         </div>
//                     </div>
//
//                     <div className="field">
//                         <label className="label">Taper Interval</label>
//                         <div className="control">
//                             <input
//                                 className="input"
//                                 type="number"
//                                 min="0"
//                                 step="1"
//                                 placeholder="Enter Taper Interval"
//                                 value={taperLine.interval}
//                                 onChange={(e) => {
//                                     const value = e.target.value === '' ? '' : Math.max(0, Math.floor(Number(e.target.value)));
//                                     handleInputChange(index, "interval", value as number);
//                                 }}
//                             />
//                         </div>
//                     </div>
//
//                     <div className="field delete-button-container">
//                         <label className="label">&nbsp;</label>
//                         <div className="control">
//                             <button
//                                 className="button is-danger"
//                                 onClick={() => handleDeleteTaper(index)}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//
//             <div className="action-buttons-container">
//                 <button className="button is-warning" onClick={handleAddTaper}>
//                     Add Taper
//                 </button>
//                 <button className="button is-primary" onClick={handleCalculate}>
//                     Calculate
//                 </button>
//
//                 <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
//                     <button className="button is-secondary">Copy Label</button>
//                 </CopyToClipboard>
//                 {/*<CopyToClipboard*/}
//                 {/*    text={textToCopy}*/}
//                 {/*    onCopy={onCopyText}*/}
//                 {/*>*/}
//                 {/*    <button className="button is-secondary">Document Copy</button>*/}
//                 {/*</CopyToClipboard>*/}
//                 {copyStatus && (
//                     <div className="notification is-success animated fadeInDown" style={{
//                         position: 'fixed',
//                         top: '10px',
//                         left: '50%',
//                         transform: 'translateX(-50%)',
//                         zIndex: 1000,
//                         opacity: copyStatus ? 1 : 0,
//                         transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
//                     }}>
//                         <button className="delete" onClick={() => setCopyStatus(false)}></button>
//                         Text copied to clipboard!
//                     </div>
//                 )}
//
//             </div>
//
//             <div id="taperLabel" className="mt-4">
//                 {/* Display the selected eye in the taper label */}
//                 {calculationResult.length > 0 && (
//                     <p className="field has-text-weight-bold">Apply to {selectedEye.toUpperCase()} EYE</p>
//                 )}
//                 {calculationResult.map((result, index) => (
//                     <p key={index} className="field">{result}</p>
//                 ))}
//                 {totalMls > 0 && (
//                     <p className="field subtitle">
//                         <strong>Total mls needed:</strong> <br/>
//                         <strong>{totalMls.toFixed(1)}</strong>
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// }
//
// export default EyeDropTaper;



import React, { useState } from "react";
import "./EyeDropTaper.css";
import EyeButtonGroup from "@/app/taperCalculator/EyeButtonGroup";
// @ts-expect-error ignore this line
import { CopyToClipboard } from 'react-copy-to-clipboard';

function EyeDropTaper() {
    const [taperLines, setTaperLines] = useState([
        { dropCount: 0, frequency: 0, interval: 0 },
    ]);

    // Add state to track selected eye
    const [selectedEye, setSelectedEye] = useState("Left");
    const [calculationResult, setCalculationResult] = useState<string[]>([]);
    const [totalMls, setTotalMls] = useState<number>(0);
    const [textToCopy, setTextToCopy] = useState(''); // The text you want to copy
    const [copyStatus, setCopyStatus] = useState(false); // To indicate if the text was copied

    const handleAddTaper = () => {
        setTaperLines([
            ...taperLines,
            { dropCount: 0, frequency: 0, interval: 0 },
        ]);
    };

    const handleDeleteTaper = (index: number) => {
        setTaperLines(taperLines.filter((_, i) => i !== index));
    };

    const handleInputChange = (index: number, field: string, value: number) => {
        const updatedTaperLines = [...taperLines];
        // @ts-expect-error ignore this line
        updatedTaperLines[index][field] = value;
        setTaperLines(updatedTaperLines);
    };

    // Properly handle eye selection from the EyeButtonGroup
    const handleEyeSelection = (eye: string) => {
        console.log("Eye selected:", eye); // Add logging to debug
        setSelectedEye(eye);
    };

    const handleCalculate = () => {
        const results: string[] = [];
        let totalDropCount = 0;
        const normalFrequency = [16, 8, 6, 4, 3, 2, 1];
        let copyText = `[Apply to ${selectedEye.toUpperCase()} eye(s)]\n`; // Initialize with eye info

        // Process each taper line
        for (let lineIndex = 0; lineIndex < taperLines.length; lineIndex++) {
            const currentLine = taperLines[lineIndex];
            const nextLine = lineIndex < taperLines.length - 1 ? taperLines[lineIndex + 1] : null;

            if (currentLine.frequency === 0) continue;

            const startIndex = normalFrequency.indexOf(currentLine.frequency);
            if (startIndex === -1) continue;

            // Find end index based on next taper line
            let endIndex = nextLine
                ? normalFrequency.indexOf(nextLine.frequency)
                : normalFrequency.length;

            // If next frequency not found, go to end
            if (endIndex === -1) endIndex = normalFrequency.length;

            // Generate taper schedule for current section
            for (let i = startIndex; i < endIndex; i++) {
                const currentFreq = normalFrequency[i];
                const text = `Apply ${currentLine.dropCount} drop${currentLine.dropCount > 1 ? 's' : ''} ${numberToWords(currentFreq)} for ${currentLine.interval} days`;
                results.push(text);
                copyText += text + '\n'; // Update the copyText variable

                totalDropCount += currentLine.dropCount * currentFreq * currentLine.interval;
            }

            //If there's a next line and taper frequency is the same, state the current taper with interval once, and they continue with the next taper
            if (nextLine && currentLine.frequency === nextLine.frequency) {
                const text = `Apply ${currentLine.dropCount} drop${currentLine.dropCount > 1 ? 's' : ''} ${numberToWords(currentLine.frequency)} for ${currentLine.interval} days`;
                results.push(text);
                copyText += text + '\n'; // Update the copyText variable

                totalDropCount += currentLine.dropCount * currentLine.frequency * currentLine.interval;
                continue;
            }
            // If there's a next line, continue the taper with the new interval
            if (nextLine && endIndex < normalFrequency.length) {
                for (let i = endIndex; i < normalFrequency.length; i++) {
                    const currentFreq = normalFrequency[i];
                    const text = `Apply ${nextLine.dropCount} drop${nextLine.dropCount > 1 ? 's' : ''} ${numberToWords(currentFreq)} for ${nextLine.interval} days`;
                    results.push(text);
                    copyText += text + '\n'; // Update the copyText variable

                    totalDropCount += nextLine.dropCount * currentFreq * nextLine.interval;
                }
                break; // Exit after processing the transition
            }
        }

        const totalMls = totalDropCount / 20;

        setTotalMls(totalMls);
        setCalculationResult(results);
        setTextToCopy(copyText); // Set the formatted text for copying
    };

    function numberToWords(num: number): string {
        const ones = ['', 'ONCE a day', 'TWICE a day', 'THREE times a day', 'FOUR times a day', 'FIVE', 'SIX times a day', 'SEVEN', 'every TWO hours', 'NINE', ];
        const teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'every HOUR', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];

        if (num < 10) {
            return ones[num];
        } else if (num < 20) {
            return teens[num - 10];
        } else {
            // implement hundreds, thousands, etc.
            return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 === 0 ? '' : ' and ' + numberToWords(num % 100));
        }
    }

    const onCopyText = () => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 5000); // Reset status after 5 seconds
    };

    return (
        <div style={{padding: '1rem'}}>
            {/* Make sure the prop name matches what EyeButtonGroup expects */}
            <EyeButtonGroup onSelect={(eye) => {
                console.log("Selected eye in parent:", eye);
                handleEyeSelection(eye);
            }} />

            {taperLines.map((taperLine, index) => (
                <div key={index} className="taper-input-row">
                    <div className="field">
                        <label className="label">Drop(s)</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                min="0"
                                step="1"
                                placeholder="Enter Drops per Dose"
                                value={taperLine.dropCount}
                                onChange={(e) => {
                                    const value = e.target.value === '' ? '' : Math.max(0, Math.floor(Number(e.target.value)));
                                    handleInputChange(index, "dropCount", value as number);
                                }}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Frequency / Day</label>
                        <div className="control">
                            <select
                                className="input"
                                value={taperLine.frequency}
                                onChange={(e) => {
                                    handleInputChange(index, "frequency", Number(e.target.value));
                                }}
                            >
                                <option value="0">Select Frequency</option>
                                <option value="16">16</option>
                                <option value="8">8</option>
                                <option value="6">6</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Taper Interval</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                min="0"
                                step="1"
                                placeholder="Enter Taper Interval"
                                value={taperLine.interval}
                                onChange={(e) => {
                                    const value = e.target.value === '' ? '' : Math.max(0, Math.floor(Number(e.target.value)));
                                    handleInputChange(index, "interval", value as number);
                                }}
                            />
                        </div>
                    </div>

                    <div className="field delete-button-container">
                        <label className="label">&nbsp;</label>
                        <div className="control">
                            <button
                                className="button is-danger"
                                onClick={() => handleDeleteTaper(index)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="action-buttons-container">
                <button className="button is-warning" onClick={handleAddTaper}>
                    Add Taper
                </button>
                <button className="button is-primary" onClick={handleCalculate}>
                    Calculate
                </button>

                <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
                    <button className="button is-secondary">Copy Label</button>
                </CopyToClipboard>

                {copyStatus && (
                    <div className="notification is-success animated fadeInDown" style={{
                        position: 'fixed',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        opacity: copyStatus ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                    }}>
                        <button className="delete" onClick={() => setCopyStatus(false)}></button>
                        Text copied to clipboard!
                    </div>
                )}
            </div>

            <div id="taperLabel" className="mt-4">
                {/* Display the selected eye in the taper label */}
                {calculationResult.length > 0 && (
                    <p className="field has-text-weight-bold">Apply to {selectedEye.toUpperCase()} EYE</p>
                )}
                {calculationResult.map((result, index) => (
                    <p key={index} className="field">{result}</p>
                ))}
                {totalMls > 0 && (
                    <p className="field subtitle">
                        <strong>Total mls needed:</strong> <br/>
                        <strong>{totalMls.toFixed(1)}</strong>
                    </p>
                )}
            </div>
        </div>
    );
}

export default EyeDropTaper;