import { Contact } from "@/firebase/types";
import "./contactsGrid.css";
import { useState } from "react";
import contactJSON from "./contacts.json";

interface GetContactsProps {
    warfarinOnly: boolean;
    search: string;
}

function GetContacts({ warfarinOnly, search }: GetContactsProps) {
    //@ts-expect-error // Contacts saved as JSON, to save on Firestore bandwidth
    const [contacts] = useState<Contact[]>(contactJSON);
    let filteredContacts = contacts;

    if (warfarinOnly) {
        filteredContacts = contacts.filter(
            (contact) => contact.warfarinTrained === true,
        );
    }

    filteredContacts = filteredContacts.filter((contact) =>
        // @ts-expect-error // search is a string
        contact.name.toLowerCase().includes(String(search).toLowerCase()),
    );

    return (
        <div className="contact-grid">
            {filteredContacts.map((contact: Contact, index) => (
                <div className="contact-card" key={index}>
                    <div className="contact-info">
                        <h2 className="contact-name">{contact.name}</h2>
                        <p className="contact-number">{contact.number}</p>
                        <div className="contact-details">
                            <span className="contact-site">{contact.site}</span>
                            <span className="contact-department">
                                {contact.department}
                            </span>
                            {contact.warfarinTrained && (
                                <span className="contact-warfarinTrained">
                                    Warfarin
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GetContacts;
