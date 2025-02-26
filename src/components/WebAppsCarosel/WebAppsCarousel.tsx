"use client";

import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import path from "path";
import fs from "fs/promises";
import "./WebAppsCarousel.css";

interface WebApp {
    name: string;
    description: string;
    link: string;
}

// This component needs to be used with a Next.js API route that reads the directories
const WebAppsCarousel: React.FC<{ visibleCards?: number }> = ({
    visibleCards = 3,
}) => {
    const [webApps, setWebApps] = useState<WebApp[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Fetch web apps from API
        const fetchWebApps = async () => {
            try {
                console.log("Fetching web apps from API...");
                const response = await fetch("/api/web-apps");

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch: ${response.status} ${response.statusText}`,
                    );
                }

                const data = await response.json();
                console.log(`Received ${data.length} web apps from API:`, data);
                setWebApps(data);
            } catch (error) {
                console.error("Error fetching web apps:", error);

                // Fallback to hardcoded data if API fails
                const fallbackData = [
                    {
                        name: "Taper Calculator",
                        description: "Calculate medication tapering schedules",
                        link: "/webApps/taperCalculator",
                    },
                    {
                        name: "Contact Finder",
                        description: "Find pharmacy contacts easily",
                        link: "/webApps/contacts",
                    },
                    {
                        name: "Creatinine Clearance",
                        description: "Cockcroft-Gault CrCl Formula",
                        link: "/webApps/crclCalculator",
                    },
                    {
                        name: "Fourth App",
                        description: "Description for the fourth app",
                        link: "/webApps/fourthApp",
                    },
                ];
                console.log("Using fallback data with 4 apps");
                setWebApps(fallbackData);
            }
        };

        fetchWebApps();
    }, []);

    useEffect(() => {
        // Auto-scroll the carousel
        if (webApps.length > visibleCards) {
            intervalRef.current = setInterval(() => {
                nextSlide();
            }, 5000); // Change slide every 5 seconds
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [webApps, currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === webApps.length - 1 ? 0 : prevIndex + 1,
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? webApps.length - 1 : prevIndex - 1,
        );
    };

    const getVisibleApps = () => {
        console.log(
            `Getting visible apps: current index ${currentIndex}, total apps ${webApps.length}, visible cards ${visibleCards}`,
        );

        if (webApps.length <= visibleCards) {
            return webApps;
        }

        let visible = [];
        for (let i = 0; i < visibleCards; i++) {
            const index = (currentIndex + i) % webApps.length;
            visible.push(webApps[index]);
        }

        console.log(
            `Visible apps: ${visible.map((app) => app.name).join(", ")}`,
        );
        return visible;
    };

    return (
        <div className="web-apps-carousel">
            <div className="carousel-navigation">
                <button
                    className="button is-rounded carousel-button prev"
                    onClick={prevSlide}
                    aria-label="Previous apps"
                >
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>

                <div
                    className="columns is-centered carousel-container"
                    ref={carouselRef}
                >
                    {getVisibleApps().map((app, index) => (
                        <div className="column" key={`${app.name}-${index}`}>
                            <div className="card">
                                <div className="card-content">
                                    <p className="title is-4">{app.name}</p>
                                    <p>{app.description}</p>
                                </div>
                                <footer className="card-footer">
                                    <a
                                        href={app.link}
                                        className="card-footer-item animated-link"
                                    >
                                        Use Tool
                                    </a>
                                </footer>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="button is-rounded carousel-button next"
                    onClick={nextSlide}
                    aria-label="Next apps"
                >
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </div>

            <div className="carousel-dots">
                {webApps.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? "is-active" : ""}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default WebAppsCarousel;
