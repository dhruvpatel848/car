import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, MapPin, Calendar, Clock, Car } from 'lucide-react';
import logo from '../assets/logo.png';
import SlotCheckerModal from './SlotCheckerModal';

import TrackOrderModal from './TrackOrderModal';

import { useCarSelection } from '../context/CarSelectionContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
    const location = useLocation();
    const { openCarModal, selectedModel, selectedBrand } = useCarSelection();

    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = React.useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Background logic
            if (currentScrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // Hide/Show logic
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false); // Hide when scrolling down
            } else {
                setIsVisible(true);  // Show when scrolling up
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';
    const navbarClass = `fixed w-full z-50 transition-all duration-300 transform ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${scrolled ? 'bg-darker/95 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`;

    return (
        <>
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
                                <img src={logo} alt="GLO CAR" className="h-24 md:h-32 w-auto" />
                            </Link>
                        </div>

                        {/* Right: Actions */}
                        <div className="hidden md:flex items-center space-x-6">
                            <button
                                onClick={() => setIsSlotModalOpen(true)}
                                className="flex items-center text-white hover:text-primary transition-colors text-sm font-medium"
                                title="Check Available Slots"
                            >
                                <Calendar className="h-4 w-4 mr-1" />
                                Check Slots
                            </button>



                            <button
                                onClick={openCarModal}
                                className="flex items-center text-white hover:text-primary transition-colors text-sm font-medium"
                            >
                                <Car className="h-4 w-4 mr-1" />
                                {selectedModel ? `${selectedBrand?.name} ${selectedModel.name}` : 'Select Car'}
                            </button>

                            <button
                                onClick={() => setIsTrackOrderOpen(true)}
                                className="text-white hover:text-primary transition-colors flex items-center text-sm font-medium"
                            >
                                <Clock className="h-4 w-4 mr-1" /> Track Order
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
                                    setIsSlotModalOpen(true);
                                }}
                                className="flex items-center text-white hover:text-primary font-medium"
                            >
                                <Calendar className="h-5 w-5 mr-2" /> Check Slots
                            </button>



                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    openCarModal();
                                }}
                                className="flex items-center text-white hover:text-primary font-medium"
                            >
                                <Car className="h-5 w-5 mr-2" /> {selectedModel ? `${selectedBrand?.name} ${selectedModel.name}` : 'Select Car'}
                            </button>

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsTrackOrderOpen(true);
                                }}
                                className="flex items-center text-white hover:text-primary font-medium"
                            >
                                <Clock className="h-5 w-5 mr-2" /> Track Order
                            </button>

                        </div>
                    </div>
                )}
            </nav >
            <SlotCheckerModal isOpen={isSlotModalOpen} onClose={() => setIsSlotModalOpen(false)} />
            <TrackOrderModal isOpen={isTrackOrderOpen} onClose={() => setIsTrackOrderOpen(false)} />
        </>
    );
};

export default Navbar;
