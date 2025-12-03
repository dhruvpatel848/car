import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
import { useLocationContext } from '../context/LocationContext';

import { useCarSelection } from '../context/CarSelectionContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { city, openLocationModal } = useLocationContext();
    const { openCarModal } = useCarSelection();

    // ... (keep existing useEffect)

    const isHome = location.pathname === '/';
    const navbarClass = `fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-darker/95 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
        }`;

    return (
        <nav className={navbarClass}>
            <div className="container-custom">
                <div className="flex items-center justify-between">

                    {/* Left: Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['Home', 'Services', 'About', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="text-white hover:text-primary font-medium text-sm uppercase tracking-wider transition-colors font-heading"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2">
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="GLO CAR" className="h-16 md:h-24 w-auto" />
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={openLocationModal}
                            className="flex items-center text-white hover:text-primary transition-colors text-sm font-medium"
                        >
                            <MapPin className="h-4 w-4 mr-1" />
                            {city || 'Select City'}
                        </button>

                        <button className="text-white hover:text-primary transition-colors">
                            <Search className="h-5 w-5" />
                        </button>

                        <button
                            onClick={openCarModal}
                            className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide transition-all transform hover:scale-105"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden ml-auto">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-darker border-t border-gray-800 absolute w-full left-0 top-full">
                    <div className="px-4 py-6 space-y-4 flex flex-col items-center">
                        {['Home', 'Services', 'About', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="text-white hover:text-primary font-bold text-lg uppercase tracking-wider"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                openCarModal();
                            }}
                            className="bg-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-wide mt-4"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
