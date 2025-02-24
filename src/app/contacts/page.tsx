"use client";

import GetContacts from "@/app/contacts/GetContacts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function ContactsPage() {
    const [search, setSearch] = useState("");

    return (
        <>
            <div
                className={"container"}
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
                <div>
                    <h1 className="title is-1">Phone Book</h1>
                </div>

                <div className="field mb-4">
                    <div className="control has-icons-left has-icons-right is-flex">
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
                                style={{ marginTop: "14px", scale: "1.5" }}
                            />
                        </span>
                    </div>
                </div>

                <GetContacts search={search} />
            </div>
        </>
    );
}

export default ContactsPage;
