import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ServiceSlider = () => {
    const [services, setServices] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${API_URL}/api/services`);
                setServices(res.data);
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        };
        fetchServices();
    }, []);

    // Auto-slide logic
    useEffect(() => {
        if (services.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % services.length);
        }, 2000); // 2 seconds per slide
        return () => clearInterval(interval);
    }, [services.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % services.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
    };

    const handleServiceClick = (service) => {
        // Navigate to services page (or booking if we want direct booking)
        navigate('/services');
    };

    if (services.length === 0) return null;

    // We'll show 3 cards at a time on desktop, 1 on mobile
    // For simplicity in this slider implementation, let's just slide one by one but show a "window" of 3
    // Actually, the screenshot shows a row of cards. Let's implement a carousel that shifts.

    const visibleServices = () => {
        if (window.innerWidth < 768) return [services[currentIndex]];

        const items = [];
        for (let i = 0; i < 3; i++) {
            items.push(services[(currentIndex + i) % services.length]);
        }
        return items;
    };

    return (
        <section className="py-24 bg-black text-white overflow-hidden">
            <div className="container-custom">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-bold font-heading mb-4">Our services</h2>
                    </div>
                    <button
                        onClick={() => navigate('/services')}
                        className="hidden md:flex items-center text-white font-bold hover:text-primary transition-colors uppercase tracking-wider text-sm"
                    >
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                </div>

                <div className="relative">
                    <div className="flex gap-6 overflow-hidden">
                        <AnimatePresence mode='popLayout'>
                            {visibleServices().map((service, index) => (
                                <motion.div
                                    key={`${service._id}-${index}`}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-1 min-w-[300px] h-[400px] relative group cursor-pointer rounded-3xl overflow-hidden"
                                    onClick={() => handleServiceClick(service)}
                                >
                                    {/* Background Image */}
                                    <img
                                        src={service.image || "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600"}
                                        alt={service.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                                    {/* Content */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                        <div className="text-4xl font-bold text-white/20 font-heading">
                                            {String((currentIndex + index) % services.length + 1).padStart(2, '0')}.
                                        </div>

                                        <div>
                                            <h3 className="text-3xl font-bold text-white mb-2 font-heading group-hover:text-primary transition-colors">
                                                {service.name}
                                            </h3>
                                            <p className="text-gray-400 line-clamp-2 mb-6 text-sm">
                                                {service.description || "Professional detailing service for your car."}
                                            </p>

                                            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                                                <ArrowRight className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex justify-center gap-4 mt-8 md:hidden">
                        <button onClick={handlePrev} className="p-2 rounded-full border border-gray-700 hover:bg-primary hover:border-primary transition-colors">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button onClick={handleNext} className="p-2 rounded-full border border-gray-700 hover:bg-primary hover:border-primary transition-colors">
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceSlider;
