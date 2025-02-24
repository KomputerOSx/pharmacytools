import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faSyncAlt } from "@fortawesome/free-solid-svg-icons";

function Loading() {
    return (
        <div
            className="hero is-fullheight"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-half">
                            <div className="box has-text-centered">
                                <progress className="progress is-primary is-small">
                                    Loading...
                                </progress>
                                <span className="icon is-large">
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                        spin
                                        style={{
                                            scale: "2",
                                            animation:
                                                "fa-spin 1.5s linear infinite",
                                        }}
                                    />
                                </span>
                                <h1 className="title is-4">Loading Content</h1>
                                <div className="tags is-centered">
                                    <span className="tag is-info is-light is-medium">
                                        <span className="icon">
                                            <FontAwesomeIcon
                                                icon={faSyncAlt}
                                                spin
                                            />
                                        </span>
                                        <span>Please wait</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loading;
