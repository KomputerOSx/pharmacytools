import { Contact } from "@/firebase/types";
import "./contactsGrid.css";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebase/Firebase"; // Adjust import path as needed

interface GetContactsProps {
    warfarinOnly: boolean;
    search: string;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

function GetContacts({
    warfarinOnly,
    search,
    currentPage,
    itemsPerPage,
    onPageChange
}: GetContactsProps) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            setError(null);

            try {
                const contactsRef = collection(db, "contacts");
                let q;

                // Apply warfarin filter if needed
                if (warfarinOnly) {
                    q = query(contactsRef, where("warfarinTrained", "==", true));
                } else {
                    q = query(contactsRef);
                }

                const querySnapshot = await getDocs(q);
                const fetchedContacts: Contact[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedContacts.push({
                        id: doc.id,
                        name: data.name || '',
                        number: data.number || '',
                        site: data.site || '',
                        department: data.department || '',
                        warfarinTrained: data.warfarinTrained || false
                    } as Contact);
                });

                // Sort by name client-side
                fetchedContacts.sort((a, b) => a.name.localeCompare(b.name));

                console.log(`Fetched ${fetchedContacts.length} contacts from Firestore`);
                setContacts(fetchedContacts);
            } catch (err) {
                console.error("Error fetching contacts:", err);
                setError("Failed to load contacts. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [warfarinOnly]);

    // Filter contacts by search term (client-side)
    let filteredContacts = contacts;
    if (search && search.trim() !== '') {
        filteredContacts = contacts.filter((contact) =>
            contact.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    if (loading) {
        return (
            <div className="has-text-centered mt-6">
                <button className="button is-loading is-large is-ghost">Loading</button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="notification is-danger mt-4">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-4">
                <p className="subtitle is-6">
                    Showing {paginatedContacts.length > 0 ? startIndex + 1 : 0} - {endIndex > filteredContacts.length ? filteredContacts.length : endIndex} of {filteredContacts.length} contacts
                </p>
            </div>

            <div className="contact-grid">
                {paginatedContacts.map((contact: Contact) => (
                    <div className="contact-card" key={contact.id}>
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

            {filteredContacts.length === 0 && !loading && (
                <div className="notification is-info mt-4">
                    <p>No contacts found matching your criteria.</p>
                </div>
            )}

            {totalPages > 1 && (
                <nav className="pagination is-centered mt-5" role="navigation" aria-label="pagination">
                    <button
                        className="pagination-previous"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="pagination-next"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                    <ul className="pagination-list">
                        {getPageNumbers().map((page, index) => (
                            <li key={index}>
                                {page === '...' ? (
                                    <span className="pagination-ellipsis">&hellip;</span>
                                ) : (
                                    <button
                                        className={`pagination-link ${currentPage === page ? 'is-current' : ''}`}
                                        aria-label={`Go to page ${page}`}
                                        onClick={() => onPageChange(page as number)}
                                    >
                                        {page}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </>
    );
}

export default GetContacts;