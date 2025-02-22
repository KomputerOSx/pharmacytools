"use client";

import React, { useState } from "react";
import Link from "next/link";
import SwitchTheme from "@/components/SwitchTheme";
import "./navbar.css";
const Navbar: React.FC = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleNavbar = () => {
        setIsActive(!isActive);
    };

    return (
        <nav
            className="navbar is-spaced"
            role="navigation"
            aria-label="main navigation"
        >
            <div className="navbar-brand">
                <div className="navbar-item">
                    <img
                        src="/favicon.ico"
                        alt="Pharmacy Tools"
                        width={28}
                        height={28}
                    />
                </div>

                <a
                    role="button"
                    className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
                    aria-label="menu"
                    aria-expanded="false"
                    onClick={toggleNavbar}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div
                id="navbarBasicExample"
                className={`navbar-menu ${isActive ? "is-active" : ""}`}
            >
                <div className="navbar-start">
                    <Link href="/" className="navbar-item is-tab">
                        Home
                    </Link>
                    <Link
                        href="/taperCalculator"
                        className="navbar-item is-tab"
                    >
                        Taper Calculator
                    </Link>
                    <Link href="/contacts" className="navbar-item is-tab">
                        Contacts
                    </Link>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <span>
                                <SwitchTheme />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
