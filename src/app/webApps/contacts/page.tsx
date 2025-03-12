"use client";

import GetContacts from "@/app/webApps/contacts/GetContacts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function ContactsPage() {
    const [search, setSearch] = useState("");
    const [warfarinOnly, setWarfarinOnly] = useState(false);

    const handleWarfarinOnlyChange = () => {
        const newState = !warfarinOnly;
        setWarfarinOnly(newState);
    };

    return (
        <>
            <div
                className={"container"}
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
                <div>
                    <h1 className="title is-1 mb-3">Phone Book</h1>
                </div>

                <div className="field is-flex is-align-items-center">
                    <div className="control has-icons-left has-icons-right mr-4">
                        <input
                            className="input"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Enter Name"
                            style={{ maxWidth: "300px" }}
                        />
                        <span className="icon is-large is-left">
                            <FontAwesomeIcon
                                icon={faPhone}
                                className="is-large"
                                style={{ scale: "1.5" }}
                            />
                        </span>
                    </div>

                    <div className={"field subtitle mr-1"}>
                        <strong>Warfarin Only</strong>
                    </div>
                    <div className="field">
                        <input
                            id="switchRoundedDefault"
                            type="checkbox"
                            name="switchRoundedDefault"
                            className="switch is-rounded is-large is-middle"
                            checked={warfarinOnly}
                            onChange={(e) => setWarfarinOnly(e.target.checked)}
                        />
                        <label htmlFor="switchRoundedDefault"></label>
                    </div>
                </div>

                <GetContacts search={search} warfarinOnly={warfarinOnly} />
            </div>
        </>
    );
}

export default ContactsPage;
