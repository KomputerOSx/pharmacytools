"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import "./WebAppsCarousel.css";

interface WebApp {
    name: string;
    description: string;
    link: string;
}

interface WebAppsCarouselProps {
    visibleCards: number;
}

const WebAppsCarousel: React.FC<WebAppsCarouselProps> = () => {
    const [webApps, setWebApps] = useState<WebApp[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [visibleCards, setVisibleCards] = useState(3);
    const carouselRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setVisibleCards(1);
            } else {
                setVisibleCards(3);
            }
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Clean up
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Fetch web apps from API
        const fetchWebApps = async () => {
            try {
                const response = await fetch("/api/web-apps");

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch: ${response.status} ${response.statusText}`,
                    );
                }

                const data = await response.json();
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
                setWebApps(fallbackData);
            }
        };

        fetchWebApps();
    }, []);

    // Define nextSlide as a useCallback so it can be used in dependency arrays
    const nextSlide = useCallback(() => {
        if (isTransitioning || webApps.length <= visibleCards) return;

        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % webApps.length);

        // Reset transition state after animation completes
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    }, [isTransitioning, webApps.length, visibleCards]);

    const prevSlide = useCallback(() => {
        if (isTransitioning || webApps.length <= visibleCards) return;

        setIsTransitioning(true);
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? webApps.length - 1 : prevIndex - 1,
        );

        // Reset transition state after animation completes
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    }, [isTransitioning, webApps.length, visibleCards]);

    // Auto-scroll effect - now with proper dependency array
    useEffect(() => {
        if (webApps.length > visibleCards) {
            intervalRef.current = setInterval(() => {
                if (!isTransitioning) {
                    nextSlide();
                }
            }, 5000); // Change slide every 5 seconds
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [webApps.length, visibleCards, isTransitioning, nextSlide]); // nextSlide added to dependency array

    const goToSlide = useCallback(
        (index: number) => {
            if (isTransitioning) return;

            setIsTransitioning(true);
            setCurrentIndex(index);

            setTimeout(() => {
                setIsTransitioning(false);
            }, 500);
        },
        [isTransitioning],
    );

    // Calculate translateX value for smooth sliding
    const getTranslateX = () => {
        const slideWidth = 100 / visibleCards;
        return `-${currentIndex * slideWidth}%`;
    };

    return (
        <div className="web-apps-carousel">
            <div className="carousel-navigation">
                <button
                    className="button is-rounded carousel-button prev"
                    onClick={prevSlide}
                    aria-label="Previous apps"
                    disabled={webApps.length <= visibleCards}
                >
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>

                <div className="carousel-outer-container">
                    <div
                        className="carousel-inner-container"
                        ref={carouselRef}
                        style={{
                            transform: `translateX(${getTranslateX()})`,
                            gridTemplateColumns: `repeat(${webApps.length}, ${100 / visibleCards}%)`,
                            transition: isTransitioning
                                ? "transform 0.5s ease-in-out"
                                : "none",
                        }}
                    >
                        {webApps.map((app, index) => (
                            <div
                                className="carousel-item"
                                key={`${app.name}-${index}`}
                            >
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
                </div>

                <button
                    className="button is-rounded carousel-button next"
                    onClick={nextSlide}
                    aria-label="Next apps"
                    disabled={webApps.length <= visibleCards}
                >
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </div>

            <div className="carousel-dots">
                {webApps.length > visibleCards &&
                    webApps.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentIndex ? "is-active" : ""}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
            </div>
        </div>
    );
};

export default WebAppsCarousel;
