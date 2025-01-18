import React from 'react';

const BulmaLoading = () => {
    return (
        <div className="hero is-fullheight" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-half">
                            <div className="box has-text-centered">
                                <progress className="progress is-primary is-small" max="100">
                                    Loading...
                                </progress>
                                <span className="icon is-large">
                  <i className="fas fa-spinner fa-pulse fa-3x"></i>
                </span>
                                <h1 className="title is-4 mt-4">
                                    Loading Content
                                </h1>
                                <h2 className="subtitle is-6 has-text-grey">
                                    Fetching your blog posts...
                                </h2>
                                <div className="tags is-centered mt-4">
                  <span className="tag is-info is-light is-medium">
                    <span className="icon">
                      <i className="fas fa-sync-alt fa-spin"></i>
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
};

export default BulmaLoading;