import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const TitleNavBar = () => {
    const spanStyle = {
        fontWeight: 'bold',
        fontSize: '2rem', // Adjust the value as needed
        opacity: '0.7',
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#88AB8E', fontFamily: 'Diphylleia, sans-serif' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <Link
                        className="navbar-brand"
                        to='/'
                        style={{ ...spanStyle, margin: 'auto' }}
                    >
                        Platepal
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default TitleNavBar;
