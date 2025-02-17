import React from 'react';
import 'bulma/css/bulma.min.css';

const App: React.FC = () => {
    return (
        <div className="hero">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <h1 className="title is-1">
                        <span style={styles.constructionIcon}>🚧 Under Construction</span>
                    </h1>
                    <p className="subtitle is-3">
                        The Home Page is getting a makeover!
                    </p>
                    <p className="is-size-5">
                        {"Don\'t much time with all these TTOs & Histories to be done"} <br />
                        Check back soon!
                        <br/>
                        <br/>
                        You can still use the Apps on here though!
                        <br/>
                        <br/>
                        - Ramyar
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    constructionIcon: {
        fontSize: '5rem',
        marginRight: '1rem',
    },
};

export default App;