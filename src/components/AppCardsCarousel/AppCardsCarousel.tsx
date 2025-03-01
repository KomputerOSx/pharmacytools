"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./AppCardsCarousel.css";
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
    faSpinner,
    faExclamationTriangle,
    faSearch,
    faChevronLeft,
    faChevronRight,
    faTablets,
} from "@fortawesome/free-solid-svg-icons";

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

// App data structure from the API
interface WebAppData {
    name: string;
    description: string;
    version: string;
    author: string;
    tags: string[];
    icon: string;
    color?: string;
}

interface WebApp {
    id: string;
    path: string;
    data: WebAppData;
}

// Color assignment based on app index
const colors = ["info", "success", "warning", "danger", "primary", "link"];

function AppCardsCarousel() {
    const [apps, setApps] = useState<WebApp[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const carouselRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);

    const filteredApps = apps.filter((app) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            app.data.name.toLowerCase().includes(searchLower) ||
            app.data.description.toLowerCase().includes(searchLower) ||
            app.data.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
    });

    // Fetch apps from the API
    useEffect(() => {
        async function fetchApps() {
            try {
                setIsLoading(true);
                const response = await fetch("/api/webApps");

                if (!response.ok) {
                    throw new Error("Failed to fetch apps");
                }

                const data = await response.json();
                setApps(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred",
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchApps();
    }, []);

    // Calculate max scroll when apps or container size changes
    useEffect(() => {
        function updateMaxScroll() {
            if (carouselRef.current) {
                const containerWidth = carouselRef.current.clientWidth;
                const scrollWidth = carouselRef.current.scrollWidth;
                setMaxScroll(Math.max(0, scrollWidth - containerWidth));
            }
        }

        updateMaxScroll();
        // Add resize listener
        window.addEventListener("resize", updateMaxScroll);

        return () => {
            window.removeEventListener("resize", updateMaxScroll);
        };
    }, [apps, filteredApps.length]);

    // Update scroll position when scrolling
    const handleScroll = () => {
        if (carouselRef.current) {
            setScrollPosition(carouselRef.current.scrollLeft);
        }
    };

    // Scroll left
    const scrollLeft = () => {
        if (carouselRef.current) {
            const newPosition = Math.max(0, scrollPosition - 300);
            carouselRef.current.scrollTo({
                left: newPosition,
                behavior: "smooth",
            });
        }
    };

    // Scroll right with wrap-around
    const scrollRight = () => {
        if (carouselRef.current) {
            // If we're near the end, go back to the beginning
            if (scrollPosition > maxScroll - 50) {
                carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                // Otherwise just scroll forward
                const newPosition = scrollPosition + 300;
                carouselRef.current.scrollTo({
                    left: newPosition,
                    behavior: "smooth",
                });
            }
        }
    };

    // Get the corresponding FontAwesome icon or default to info
    const getIcon = (iconName: string) => {
        return iconMap[iconName] || faInfoCircle;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="app-carousel-container has-text-centered my-6">
                <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    size="3x"
                    className="has-text-info"
                />
                <p className="mt-3">Loading applications...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="app-carousel-container has-text-centered my-6">
                <div className="notification is-danger is-light">
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="mr-2"
                    />
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="app-carousel-container">
            {/* Search Bar */}
            <div className="search-container mb-4">
                <div className="field has-addons">
                    <div className="control has-icons-left is-expanded">
                        <input
                            className="input"
                            type="text"
                            placeholder="Search apps by name, description or tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faSearch} />
                        </span>
                    </div>
                    {searchTerm && (
                        <div className="control">
                            <button
                                className="button is-info"
                                onClick={() => setSearchTerm("")}
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="carousel-navigation">
                <button
                    className={`carousel-arrow left ${scrollPosition <= 0 ? "is-hidden" : ""}`}
                    onClick={scrollLeft}
                    aria-label="Scroll left"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <button
                    className="carousel-arrow right"
                    onClick={scrollRight}
                    aria-label="Scroll right"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>

            {/* Carousel Container with Fixed Fading Edges */}
            <div className="carousel-wrapper">
                <div className="fade-edge left"></div>
                <div className="fade-edge right"></div>

                <div
                    className="carousel-container"
                    ref={carouselRef}
                    onScroll={handleScroll}
                >
                    <div className="carousel-track">
                        {filteredApps.length > 0 ? (
                            // Main items without clones
                            filteredApps.map((app) => {
                                // Find the original index of this app in the full apps array
                                const originalIndex = apps.findIndex(
                                    (a) => a.id === app.id,
                                );

                                return (
                                    <Link
                                        href={app.path}
                                        className="carousel-item-link"
                                        key={app.id}
                                    >
                                        <div
                                            className={`box carousel-item has-background-${app.data.color || colors[originalIndex % colors.length]}-light`}
                                        >
                                            <div
                                                className={`app-icon has-text-${app.data.color || colors[originalIndex % colors.length]}`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={getIcon(
                                                        app.data.icon,
                                                    )}
                                                    size="2x"
                                                />
                                            </div>
                                            <h3 className="title is-5 mt-3">
                                                {app.data.name}
                                            </h3>
                                            <p className="app-description mb-3">
                                                {app.data.description}
                                            </p>
                                            <div className="app-tags mb-2">
                                                <FontAwesomeIcon
                                                    icon={faTags}
                                                    className="mr-2"
                                                    size="sm"
                                                />
                                                <small>
                                                    {app.data.tags.join(", ")}
                                                </small>
                                            </div>
                                            <div className="app-meta">
                                                <small>
                                                    v{app.data.version} · By{" "}
                                                    {app.data.author}
                                                </small>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="no-results">
                                <p>
                                    No applications found matching {searchTerm}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppCardsCarousel;
