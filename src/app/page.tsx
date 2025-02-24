"use client";

import React from "react";
import "bulma/css/bulma.min.css";
import ScrollVelocity from "@/TextAnimations/ScrollVelocity/ScrollVelocity";
import "./app.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faSync,
    faFastForward,
} from "@fortawesome/free-solid-svg-icons";

const App: React.FC = () => {
    return (
        <>
            <ScrollVelocity
                texts={["Pharmacy Tools", "Your Trusted Pharmacy Companion"]}
                velocity={90}
                className=""
                parallaxClassName={"parallax"}
            />
            <div className={"container"}>
                <section className="section">
                    <div className="container">
                        <h2 className="title is-2">Our Web Apps</h2>
                        <div className="columns">
                            {Object.entries({
                                "Taper Calculator": {
                                    description:
                                        "Calculate medication tapering schedules",
                                    link: "/taperCalculator",
                                },
                                "Contact Finder": {
                                    description:
                                        "Find pharmacy contacts easily",
                                    link: "/contacts",
                                },
                                "Creatinine Clearance": {
                                    description:
                                        "Cockcroft-Gault CrCl Calculator, for renal dosing",
                                    link: "/crclCalculator",
                                },
                            }).map(([appName, appInfo]) => (
                                <div className="column" key={appName}>
                                    <div className="card">
                                        <div className="card-content">
                                            <p className="title is-4">
                                                {appName}
                                            </p>
                                            <p>{appInfo.description}</p>
                                        </div>
                                        <footer className="card-footer">
                                            <a
                                                href={appInfo.link}
                                                className="card-footer-item animated-link"
                                            >
                                                Use Tool
                                            </a>
                                        </footer>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <h2 className="title is-2">
                            Why Choose Pharmacy Tools?
                        </h2>
                        <div className="columns">
                            {[
                                {
                                    title: "User-Friendly",
                                    icon: faUser,
                                    color: "success",
                                    description:
                                        "My tools are designed with the user in mind, making them easy to use.",
                                },
                                {
                                    title: "Speedy",
                                    icon: faFastForward,
                                    color: "info",
                                    description:
                                        "Speed up your work, and stop repeating the same calculations.",
                                },
                                {
                                    title: "One Stop Shop",
                                    icon: faSync,
                                    color: "warning",
                                    description:
                                        "Find all the tools you need in one place. No more searching.",
                                },
                            ].map((feature, index) => (
                                <div className="column" key={index}>
                                    <div className="box">
                                        <h3 className="title is-4">
                                            <FontAwesomeIcon
                                                icon={feature.icon}
                                                className={`has-text-${feature.color} mr-2`}
                                            />
                                            {feature.title}
                                        </h3>
                                        <p>{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default App;
