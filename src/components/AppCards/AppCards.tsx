"use client";

import React from "react";
import Link from "next/link";
import "./AppCards.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faPhone,
    faCalculator,
    faSyringe,
    faInfoCircle,
    faClipboardList,
    faChartLine,
    faFlask,
    faBook,
    faTags,
    faTablets,
} from "@fortawesome/free-solid-svg-icons";

// Map of icon names to actual icons for easy reference
const iconMap: { [key: string]: IconDefinition } = {
    phone: faPhone,
    calculator: faCalculator,
    syringe: faSyringe,
    info: faInfoCircle,
    clipboard: faClipboardList,
    chart: faChartLine,
    flask: faFlask,
    book: faBook,
    tablets: faTablets,
};

// App data structure
interface AppData {
    title: string;
    description: string;
    route: string;
    icon: string;
    tags: string[];
    version: string;
    author: string;
    color?: string;
}

// Component Props

function AppCards() {
    // Manually defined app data
    const apps: AppData[] = [
        {
            title: "Phone Book",
            description: "Easily look up the contacts from pharmacy department",
            route: "/webApps/contacts",
            icon: "phone",
            tags: ["pharmacy", "phone", "contacts", "bleeps"],
            version: "2.0",
            author: "Ramyar Abdullah",
            color: "info",
        },
        {
            title: "Taper Calculator",
            description: "Generate Taper Labels that are not possible in V6",
            route: "/webApps/taperCalculator",
            icon: "tablets",
            tags: ["sei", "eye drops", "oral steroids"],
            version: "2.2",
            author: "Ramyar Abdullah",
            color: "success",
        },
        {
            title: "Creatinine Clearance Calculator",
            description:
                "Use Cockcroft-Gault CrCl Formula to calculate renal function",
            route: "/webApps/crclCalculator",
            icon: "calculator",
            tags: ["calculator", "creatinine", "crcl"],
            version: "1.0",
            author: "Ramyar Abdullah",
            color: "warning",
        },
        {
            title: "Palliative Label Generator",
            description: "Generate Palliative Care Labels & speed up your TTOs",
            route: "/webApps/palliativeLabelGenerator",
            icon: "syringe",
            tags: ["palliative", "tto", "eol"],
            version: "1.2",
            author: "Ramyar Abdullah",
            color: "danger",
        },
    ];

    // Get the corresponding FontAwesome icon or default to info
    const getIcon = (iconName: string): IconDefinition => {
        return iconMap[iconName] || faInfoCircle;
    };

    return (
        <div className="app-cards">
            <div className="container">
                <div className="columns is-multiline">
                    {apps.map((app, index) => (
                        <div className="column is-3" key={index}>
                            <Link href={app.route} className="app-link">
                                <div
                                    className={`box app-card has-background-${app.color || "white"}-light`}
                                >
                                    <div
                                        className={`app-icon has-text-${app.color || "info"}`}
                                    >
                                        <FontAwesomeIcon
                                            icon={getIcon(app.icon)}
                                            size="2x"
                                        />
                                    </div>
                                    <h3 className="title is-4 mt-3">
                                        {app.title}
                                    </h3>
                                    <p className="app-description mb-4">
                                        {app.description}
                                    </p>
                                    <div className="app-tags mb-2">
                                        <FontAwesomeIcon
                                            icon={faTags}
                                            className="mr-2"
                                            size="sm"
                                        />
                                        <small>{app.tags.join(", ")}</small>
                                    </div>
                                    <div className="app-meta">
                                        <small>
                                            v{app.version} · By {app.author}
                                        </small>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AppCards;
