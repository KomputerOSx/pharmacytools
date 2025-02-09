"use client";

import React, { useState } from "react";
import Link from "next/link";
import SwitchTheme from "@/components/SwitchTheme";

const Navbar: React.FC = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleNavbar = () => {
        setIsActive(!isActive);
    };

    return (
        <nav className="navbar is-spaced" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a
                    role="button"
                    className={`navbar-burger ${isActive ? 'is-active' : ''}`}
                    aria-label="menu"
                    aria-expanded={isActive}
                    onClick={toggleNavbar}
                    data-target="navbarBasicExample"
                >

                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                <div className="navbar-start">
                    <Link href="/" className="navbar-item is-tab">Home</Link>
                    <Link href="/taperCalculator" className="navbar-item is-tab">Taper Calculator</Link>
                    <Link href="/blogs" className="navbar-item is-tab">Read Blogs</Link>

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">More</a>
                        <div className="navbar-dropdown">
                            <Link href="/about_me" className="navbar-item">About Me</Link>
                            <Link href="/contact_info" className="navbar-item">Contact Info</Link>
                            <Link href="/newsletter" className="navbar-item">Newsletter</Link>
                            <hr className="navbar-divider"/>
                            <Link href="/funny_joke" className="navbar-item">A Funny Joke</Link>
                        </div>
                    </div>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <span>
                                <SwitchTheme/>
                            </span>

                            <span>
                                <a className="button is-primary is-rounded">
                                    <strong>Sign up</strong>
                                </a>
                            </span>

                            <span>
                                <a className="button is-light is-rounded">Log in</a>
                            </span>

                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
