"use client";
import GetContacts from "@/app/webApps/contacts/GetContacts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function ContactsPage() {
    const [search, setSearch] = useState("");
    const [warfarinOnly, setWarfarinOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    return (
        <>
            <div
                className={"container"}
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
                <div>
                    <h1 className="title is-1 mb-3">Phone Book</h1>
                </div>
                <div className="field is-flex is-align-items-center is-flex-wrap-wrap mb-4">
                    <div className="control has-icons-left mr-4 mb-2">
                        <input
                            className="input"
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
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
                    <div className={"field subtitle mr-1 mb-2"}>
                        <strong>Warfarin Only</strong>
                    </div>
                    <div className="field mb-2">
                        <input
                            id="switchRoundedDefault"
                            type="checkbox"
                            name="switchRoundedDefault"
                            className="switch is-rounded is-large is-middle"
                            checked={warfarinOnly}
                            onChange={(e) => {
                                setWarfarinOnly(e.target.checked);
                                setCurrentPage(1);
                            }}
                        />
                        <label htmlFor="switchRoundedDefault"></label>
                    </div>
                </div>

                <div className="mb-4">
                <GetContacts
                    search={search}
                    warfarinOnly={warfarinOnly}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}

                />
                </div>
            </div>
        </>
    );
}

export default ContactsPage;