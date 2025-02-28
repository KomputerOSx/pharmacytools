"use client";

import React, { useState } from "react";
import Link from "next/link";
// import SwitchTheme from "@/components/SwitchTheme";
import "./navbar.css";
import Image from "next/image";
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
            style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
            <div className="navbar-brand">
                <div className="navbar-item">
                    <Image
                        src={"/static/logo.png"}
                        alt={"Pharmacy tools"}
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
                        <strong>Home</strong>
                    </Link>
                    <Link
                        href="/webApps/taperCalculator"
                        className="navbar-item is-tab"
                    >
                        <strong>Taper Calculator</strong>
                    </Link>
                    <Link
                        href="/webApps/contacts"
                        className="navbar-item is-tab"
                    >
                        <strong>Phone Book</strong>
                    </Link>
                    <Link
                        href="/webApps/crclCalculator"
                        className="navbar-item is-tab"
                    >
                        <strong>CrCl Calculator</strong>
                    </Link>
                    <Link
                        href="/webApps/palliativeLabelGenerator"
                        className="navbar-item is-tab"
                    >
                        <strong>Palliative Labels</strong>
                    </Link>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <span>{/*<SwitchTheme />*/}</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
