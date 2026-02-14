"use client";
import GetContacts from "@/app/webApps/contacts/GetContacts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "phonebook_session";

function ContactsPage() {
    const [search, setSearch] = useState("");
    const [warfarinOnly, setWarfarinOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);
    const itemsPerPage = 20;
    const router = useRouter();

    useEffect(() => {
        const checkSession = () => {
            try {
                const sessionData = localStorage.getItem(SESSION_KEY);
                if (!sessionData) {
                    router.push("/webApps/contacts/login");
                    return;
                }

                const session = JSON.parse(sessionData);
                if (Date.now() > session.expiry) {
                    // Session expired
                    localStorage.removeItem(SESSION_KEY);
                    router.push("/webApps/contacts/login");
                    return;
                }

                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem(SESSION_KEY);
                router.push("/webApps/contacts/login");
            } finally {
                setChecking(false);
            }
        };

        checkSession();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem(SESSION_KEY);
        router.push("/webApps/contacts/login");
    };

    if (checking) {
        return (
            <div className="container" style={{ marginTop: "100px", textAlign: "center" }}>
                <button className="button is-loading is-large is-ghost">Loading</button>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <div
                className={"container"}
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
                <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                    <h1 className="title is-1 mb-0">Phone Book</h1>
                    <div className="buttons">
                        <button
                            className="button is-info is-light"
                            onClick={() => router.push("/webApps/contacts/admin")}
                        >
                            Admin
                        </button>
                        <button className="button is-light" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
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
