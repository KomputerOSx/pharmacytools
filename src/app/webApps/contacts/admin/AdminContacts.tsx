"use client";

import { useState, useEffect, FormEvent } from "react";
import { Contact } from "@/firebase/types";
import { firebaseService } from "@/firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/Firebase";
import "./admin.css";

interface ContactFormData {
    name: string;
    number: string;
    site: string;
    department: string;
    warfarinTrained: boolean;
}

const emptyFormData: ContactFormData = {
    name: "",
    number: "",
    site: "",
    department: "",
    warfarinTrained: false,
};

const SESSION_KEY = "admin_session";

// Get admin PIN from session
const getAdminPin = (): string => {
    try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (sessionData) {
            const session = JSON.parse(sessionData);
            return session.pin || "";
        }
    } catch {
        console.error("Error getting admin PIN from session");
    }
    return "";
};

export default function AdminContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [formData, setFormData] = useState<ContactFormData>(emptyFormData);
    const [saving, setSaving] = useState(false);

    // Fetch contacts
    const fetchContacts = async () => {
        setLoading(true);
        try {
            const contactsRef = collection(db, "contacts");
            const querySnapshot = await getDocs(contactsRef);
            const fetchedContacts: Contact[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedContacts.push({
                    id: doc.id,
                    name: data.name || "",
                    number: data.number || "",
                    site: data.site || "",
                    department: data.department || "",
                    warfarinTrained: data.warfarinTrained || false,
                });
            });

            fetchedContacts.sort((a, b) => a.name.localeCompare(b.name));
            setContacts(fetchedContacts);
            setFilteredContacts(fetchedContacts);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // Filter contacts when search changes
    useEffect(() => {
        setCurrentPage(1); // Reset to first page on search
        if (search.trim() === "") {
            setFilteredContacts(contacts);
        } else {
            const searchLower = search.toLowerCase();
            setFilteredContacts(
                contacts.filter(
                    (contact) =>
                        (contact.name || "").toLowerCase().includes(searchLower) ||
                        String(contact.number || "").toLowerCase().includes(searchLower) ||
                        (contact.site || "").toLowerCase().includes(searchLower) ||
                        (contact.department || "").toLowerCase().includes(searchLower)
                )
            );
        }
    }, [search, contacts]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

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
                pages.push("...");
            }
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) {
                pages.push("...");
            }
            pages.push(totalPages);
        }
        return pages;
    };

    // Handle Add
    const handleAddClick = () => {
        setFormData(emptyFormData);
        setShowAddModal(true);
    };

    const handleAddSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const pin = getAdminPin();
            console.log("Adding contact with PIN:", pin ? "PIN present" : "NO PIN - please logout and login again");
            if (!pin) {
                alert("Session expired. Please logout and login again to save contacts.");
                setSaving(false);
                return;
            }
            await firebaseService.addContact({ ...formData, _pin: pin });
            setShowAddModal(false);
            await fetchContacts();
        } catch (error) {
            console.error("Error adding contact:", error);
            alert("Failed to add contact. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Handle Edit
    const handleEditClick = (contact: Contact) => {
        setSelectedContact(contact);
        setFormData({
            name: contact.name,
            number: contact.number,
            site: contact.site,
            department: contact.department,
            warfarinTrained: contact.warfarinTrained || false,
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedContact?.id) return;

        setSaving(true);
        try {
            const pin = getAdminPin();
            if (!pin) {
                alert("Session expired. Please logout and login again to save contacts.");
                setSaving(false);
                return;
            }
            await firebaseService.updateContact(selectedContact.id, { ...formData, _pin: pin });
            setShowEditModal(false);
            setSelectedContact(null);
            await fetchContacts();
        } catch (error) {
            console.error("Error updating contact:", error);
            alert("Failed to update contact. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Handle Delete
    const handleDeleteClick = (contact: Contact) => {
        setSelectedContact(contact);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedContact?.id) return;

        setSaving(true);
        try {
            await firebaseService.deleteContact(selectedContact.id);
            setShowDeleteModal(false);
            setSelectedContact(null);
            await fetchContacts();
        } catch (error) {
            console.error("Error deleting contact:", error);
            alert("Failed to delete contact. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Form input handler
    const handleInputChange = (field: keyof ContactFormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <button className="button is-loading is-large is-ghost">Loading</button>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="title is-3">Manage Contacts</h1>
                <div className="admin-header-actions">
                    <input
                        type="text"
                        className="input admin-search"
                        placeholder="Search contacts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="button is-primary" onClick={handleAddClick}>
                        Add Contact
                    </button>
                </div>
            </div>

            <div className="admin-stats">
                Showing {paginatedContacts.length > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length} contacts
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Number</th>
                            <th className="hide-mobile">Site</th>
                            <th className="hide-mobile">Department</th>
                            <th>Warfarin</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedContacts.map((contact) => (
                            <tr key={contact.id}>
                                <td>{contact.name}</td>
                                <td>{contact.number}</td>
                                <td className="hide-mobile">{contact.site}</td>
                                <td className="hide-mobile">{contact.department}</td>
                                <td>
                                    {contact.warfarinTrained && (
                                        <span className="warfarin-badge">Yes</span>
                                    )}
                                </td>
                                <td className="actions-cell">
                                    <button
                                        className="button is-small is-info"
                                        onClick={() => handleEditClick(contact)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="button is-small is-danger"
                                        onClick={() => handleDeleteClick(contact)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredContacts.length === 0 && (
                <div className="admin-empty">
                    <p>No contacts found.</p>
                </div>
            )}

            {totalPages > 1 && (
                <nav className="pagination is-centered mt-5" role="navigation" aria-label="pagination">
                    <button
                        className="pagination-previous"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="pagination-next"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                    <ul className="pagination-list">
                        {getPageNumbers().map((page, index) => (
                            <li key={index}>
                                {page === "..." ? (
                                    <span className="pagination-ellipsis">&hellip;</span>
                                ) : (
                                    <button
                                        className={`pagination-link ${currentPage === page ? "is-current" : ""}`}
                                        aria-label={`Go to page ${page}`}
                                        onClick={() => setCurrentPage(page as number)}
                                    >
                                        {page}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal is-active admin-modal">
                    <div className="modal-background" onClick={() => setShowAddModal(false)}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Add Contact</p>
                            <button
                                className="delete"
                                aria-label="close"
                                onClick={() => setShowAddModal(false)}
                            ></button>
                        </header>
                        <form onSubmit={handleAddSubmit}>
                            <section className="modal-card-body">
                                <div className="admin-form">
                                    <div className="field">
                                        <label className="label">Name</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Number</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="text"
                                                value={formData.number}
                                                onChange={(e) => handleInputChange("number", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Site</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="text"
                                                value={formData.site}
                                                onChange={(e) => handleInputChange("site", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Department</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="text"
                                                value={formData.department}
                                                onChange={(e) => handleInputChange("department", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="field checkbox-field">
                                        <input
                                            type="checkbox"
                                            id="warfarinTrained"
                                            checked={formData.warfarinTrained}
                                            onChange={(e) => handleInputChange("warfarinTrained", e.target.checked)}
                                        />
                                        <label htmlFor="warfarinTrained">Warfarin Trained</label>
                                    </div>
                                </div>
                            </section>
                            <footer className="modal-card-foot">
                                <button
                                    type="submit"
                                    className={`button is-success ${saving ? "is-loading" : ""}`}
                                    disabled={saving}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="button"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal is-active admin-modal">
                    <div className="modal-background" onClick={() => setShowEditModal(false)}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Edit Contact</p>
                            <button
                                className="delete"
                                aria-label="close"
                                onClick={() => setShowEditModal(false)}
                            ></button>
                        </header>
                        <form onSubmit={handleEditSubmit}>
                            <section className="modal-card-body">
                                <div className="admin-form">
                                    <div className="field">
                                        <label className="label">Name</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Number</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="text"
                                                value={formData.number}
                                                onChange={(e) => handleInputChange("number", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Site</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="text"
                                                value={formData.site}
                                                onChange={(e) => handleInputChange("site", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Department</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="text"
                                                value={formData.department}
                                                onChange={(e) => handleInputChange("department", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="field checkbox-field">
                                        <input
                                            type="checkbox"
                                            id="editWarfarinTrained"
                                            checked={formData.warfarinTrained}
                                            onChange={(e) => handleInputChange("warfarinTrained", e.target.checked)}
                                        />
                                        <label htmlFor="editWarfarinTrained">Warfarin Trained</label>
                                    </div>
                                </div>
                            </section>
                            <footer className="modal-card-foot">
                                <button
                                    type="submit"
                                    className={`button is-success ${saving ? "is-loading" : ""}`}
                                    disabled={saving}
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="button"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedContact && (
                <div className="modal is-active admin-modal">
                    <div className="modal-background" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Confirm Delete</p>
                            <button
                                className="delete"
                                aria-label="close"
                                onClick={() => setShowDeleteModal(false)}
                            ></button>
                        </header>
                        <section className="modal-card-body">
                            <p className="delete-confirm-text">
                                Are you sure you want to delete{" "}
                                <span className="delete-confirm-name">{selectedContact.name}</span>?
                            </p>
                            <p>This action cannot be undone.</p>
                        </section>
                        <footer className="modal-card-foot">
                            <button
                                className={`button is-danger ${saving ? "is-loading" : ""}`}
                                onClick={handleDeleteConfirm}
                                disabled={saving}
                            >
                                Delete
                            </button>
                            <button
                                className="button"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}
