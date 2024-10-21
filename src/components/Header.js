import React from 'react';
import { Link } from 'react-router-dom';


import '../styles/Header.css';
import logo from '../assets/images/OU-Logo.png';
import { FaHome, FaAngellist, FaInfoCircle, FaPhone } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="OU Logo" />
                <h1 className="logo-text">Advise Me</h1>
            </div>
            <nav className="nav">
                <ul>
                    <li>
                        <Link to="/" className="nav-link">
                            <FaHome className="nav-icon" />
                            <span className="nav-text">Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="nav-link">
                            <FaAngellist className="nav-icon" />
                            <span className="nav-text">About</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/services" className="nav-link">
                            <FaInfoCircle className="nav-icon" />
                            <span className="nav-text">Services</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="nav-link">
                            <FaPhone className="nav-icon" />
                            <span className="nav-text">Contact</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
