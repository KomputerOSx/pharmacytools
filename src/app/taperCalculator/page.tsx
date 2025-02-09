"use client";

import React, { useState } from 'react';

function TaperCalculator() {
    const [taperLines, setTaperLines] = useState([{}]);

    const handleAddTaper = () => {
        setTaperLines([...taperLines, {}]);
    };

    const handleDeleteTaper = (index) => {
        setTaperLines(taperLines.filter((_, i) => i !== index));
    };

    return (
        <>
            <div>
                <h1 className={'title is-1'}>Taper Calculator</h1>

                {taperLines.map((_, index) => (
                    <span key={index} style={{display: 'flex', gap: '1rem'}}>
                        <div className="field">
                            <label className="label">Dose</label>
                            <div className="control">
                                <input className="input" type="number" placeholder="Enter Taper Length"/>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Taper Amount</label>
                            <div className="control">
                                <input className="input" type="number" placeholder="Enter Taper Angle"/>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Interval</label>
                            <div className="control">
                                <input className="input" type="number" placeholder="Enter Taper Diameter"/>
                            </div>
                        </div>

                        <div className="field" style={{marginTop: '1.5rem'}}>
                            <label className="label"></label>
                            <button className="button is-danger" onClick={() => handleDeleteTaper(index)}>X</button>
                        </div>
                    </span>
                ))}

                {/* add a div to display the results of the taper calculation*/}
                <div className="field">
                    <button className="button is-warning" style={{marginRight: '1rem'}} onClick={handleAddTaper}>Add Taper</button>
                    <button className="button is-primary" >Calculate</button>
                </div>

            </div>

        </>
    );
}

export default TaperCalculator;
