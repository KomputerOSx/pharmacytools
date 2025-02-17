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
                        Our cute little website is getting a makeover!
                    </p>
                    <p className="is-size-5">
                        We are working hard to bring you something amazing. <br />
                        Please check back soon!
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