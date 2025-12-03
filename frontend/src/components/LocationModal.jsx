import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Navigation, X } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';

const LocationModal = () => {
    const { isModalOpen, setIsModalOpen, updateCity } = useLocationContext();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detecting, setDetecting] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            fetchLocations();
        }
    }, [isModalOpen]);

    const fetchLocations = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/locations`);
            setLocations(res.data);
        } catch (err) {
            console.error('Error fetching locations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAutoDetect = () => {
        setDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                // In a real app, you'd use a reverse geocoding API here (Google Maps, OpenCage, etc.)
                // to get the city name from lat/long.
                // For this demo, we'll simulate it or just pick the first available location.

                // Mocking detection for demo purposes since we don't have a geocoding key
                setTimeout(() => {
                    const detectedCity = "Surat"; // Mock result for user testing
                    const exists = locations.find(l => l.city === detectedCity);
                    if (exists) {
                        updateCity(detectedCity);
                    } else {
                        alert("Sorry, we don't serve in your area yet.");
                    }
                    setDetecting(false);
                }, 1500);
            }, (error) => {
                console.error("Geolocation error:", error);
                setDetecting(false);
                alert("Could not detect location. Please select manually.");
            });
        } else {
            setDetecting(false);
            alert("Geolocation is not supported by your browser.");
        }
    };

    if (!isModalOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => {
                        // Only close if a city is already selected (allow closing to just view site, or force selection?)
                        // Let's allow closing if they already have a city, otherwise force selection
                        if (localStorage.getItem('userCity')) setIsModalOpen(false);
                    }}
                ></motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-dark border border-gray-800 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl"
                >
                    {localStorage.getItem('userCity') && (
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    )}

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-darker border border-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 font-heading">Select Your City</h2>
                        <p className="text-gray-400 text-sm">To show you the best services and offers available in your area.</p>
                    </div>

                    <button
                        onClick={handleAutoDetect}
                        disabled={detecting}
                        className="w-full bg-darker border border-primary/30 text-primary hover:bg-primary hover:text-white font-bold py-3 rounded-xl mb-6 flex items-center justify-center transition-all group"
                    >
                        {detecting ? (
                            <span className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                                Detecting...
                            </span>
                        ) : (
                            <>
                                <Navigation className="h-4 w-4 mr-2 group-hover:rotate-45 transition-transform" />
                                Detect My Location
                            </>
                        )}
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-dark text-gray-500">OR SELECT MANUALLY</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {locations.map((loc) => (
                                <button
                                    key={loc._id}
                                    onClick={() => updateCity(loc.city)}
                                    className="bg-darker border border-gray-700 hover:border-primary text-white py-3 rounded-xl font-medium transition-all hover:bg-gray-800"
                                >
                                    {loc.city}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LocationModal;
