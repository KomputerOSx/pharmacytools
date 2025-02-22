import { firebaseService } from "@/firebase/Firebase";
import { Contact } from "@/firebase/types";
import "./contactsGrid.css";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

interface GetContactsProps {
    search: string;
}

function GetContacts({ search }: GetContactsProps) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(true);
        firebaseService.getContacts().then((contacts) => {
            setContacts(contacts);
            setLoading(false);
        });
    }, []);

    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="contact-grid">
            {filteredContacts.map((contact: Contact) => (
                <div className="contact-card" key={contact.id}>
                    <div className="contact-info">
                        <h2 className="contact-name">{contact.name}</h2>
                        <p className="contact-number">{contact.number}</p>
                        <div className="contact-details">
                            <span className="contact-site">{contact.site}</span>
                            <span className="contact-department">
                                {contact.department}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GetContacts;
