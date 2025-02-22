"use client";

import React from "react";
import "bulma/css/bulma.min.css";
import ScrollVelocity from "@/TextAnimations/ScrollVelocity/ScrollVelocity";

const App: React.FC = () => {
    return (
        <>
            <ScrollVelocity
                texts={["Pharmacy Tools", "Your Trusted Pharmacy Companion"]}
                velocity={90}
                className="custom-scroll-text"
            />

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
                                description: "Find pharmacy contacts easily",
                                link: "/contacts",
                            },
                            "TBC...": {
                                description: "More exciting tools coming soon!",
                                link: "#",
                            },
                        }).map(([appName, appInfo]) => (
                            <div className="column" key={appName}>
                                <div className="card">
                                    <div className="card-content">
                                        <p className="title is-4">{appName}</p>
                                        <p>{appInfo.description}</p>
                                    </div>
                                    <footer className="card-footer">
                                        <a
                                            href={appInfo.link}
                                            className="card-footer-item"
                                        >
                                            Learn More
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
                    <h2 className="title is-2">Why Choose Pharmacy Tools?</h2>
                    <div className="columns">
                        {[
                            {
                                title: "User-Friendly",
                                icon: "check-circle",
                                color: "success",
                                description:
                                    "Our tools are designed with pharmacists in mind, ensuring ease of use and efficiency.",
                            },
                            {
                                title: "Secure",
                                icon: "lock",
                                color: "info",
                                description:
                                    "We prioritize the security of your data and comply with all relevant regulations.",
                            },
                            {
                                title: "Always Updated",
                                icon: "sync",
                                color: "warning",
                                description:
                                    "Our tools are regularly updated to reflect the latest in pharmaceutical practices.",
                            },
                        ].map((feature, index) => (
                            <div className="column" key={index}>
                                <div className="box">
                                    <h3 className="title is-4">
                                        <i
                                            className={`fas fa-${feature.icon} has-text-${feature.color}`}
                                        ></i>{" "}
                                        {feature.title}
                                    </h3>
                                    <p>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    constructionIcon: {
        fontSize: "5rem",
        marginRight: "1rem",
    },
};

export default App;
