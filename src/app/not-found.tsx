"use client";

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    // SVG for the 404 illustration
    const NotFoundSVG = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 600"
            className="has-text-primary"
            width="300"
            height="300"
            style={{ margin: 'auto' }}
        >
            <g fill="currentColor">
                {/* Desktop/Laptop illustration */}
                <path d="M300 300 h200 v120 h-200 v-120 z" fill="none" stroke="currentColor" strokeWidth="8"/>
                <rect x="320" y="320" width="160" height="80" fill="none" stroke="currentColor" strokeWidth="4"/>
                <path d="M250 420 h300 v20 h-300 z" fill="currentColor"/>
                {/* Question marks floating around */}
                <text x="360" y="380" fontSize="40" fill="currentColor">?</text>
                <text x="420" y="350" fontSize="30" fill="currentColor">?</text>
                <text x="380" y="330" fontSize="25" fill="currentColor">?</text>
                {/* 404 text in background */}
                <text x="340" y="390" fontSize="24" fill="currentColor" opacity="0.5">404</text>
            </g>
        </svg>
    );

    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered is-vcentered" style={{ minHeight: '80vh' }}>
                    <div className="column is-half has-text-centered">
                        {/* Main content */}
                        <div className="mb-6">
                            <NotFoundSVG />
                        </div>

                        <h1 className="title is-1 mb-4">
                            404
                        </h1>

                        <h2 className="subtitle is-3 mb-5">
                            Page Not Found
                        </h2>

                        <p className="is-size-5 mb-6">
                            Oops! It seems you&apos;ve ventured into uncharted territory.
                            The page you&apos;re looking for has gone on an adventure.
                        </p>

                        {/* Action buttons */}
                        <div className="buttons is-centered">
                            <Link href="/" className="button is-primary is-medium">
                <span className="icon">
                  <Home size={20} />
                </span>
                                <span>Go Home</span>
                            </Link>

                            <button
                                onClick={() => window.history.back()}
                                className="button is-light is-medium"
                            >
                <span className="icon">
                  <ArrowLeft size={20} />
                </span>
                                <span>Go Back</span>
                            </button>
                        </div>

                        {/* Extra flair - animated dots */}
                        <div className="mt-6">
                            <style jsx>{`
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-10px); }
                }
                .dot {
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  margin: 0 4px;
                  border-radius: 50%;
                  animation: bounce 1s infinite;
                }
                .dot:nth-child(2) { animation-delay: 0.2s; }
                .dot:nth-child(3) { animation-delay: 0.4s; }
              `}</style>
                            <div className="dot has-background-primary"></div>
                            <div className="dot has-background-primary"></div>
                            <div className="dot has-background-primary"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotFound;