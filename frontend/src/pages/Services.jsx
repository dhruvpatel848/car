import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocationContext } from '../context/LocationContext';
import { useCarSelection } from '../context/CarSelectionContext';
import ServiceCard from '../components/ServiceCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { city } = useLocationContext();
    const { selectedCar, openCarModal } = useCarSelection();
    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedCar) {
            const timer = setTimeout(() => {
                openCarModal();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [selectedCar, openCarModal]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                let url = `${API_URL}/api/services`;
                if (city) {
                    url += `?location=${city}`;
                }
                const servicesRes = await axios.get(url);
                setServices(servicesRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [city]);

    const getDynamicPrice = (service) => {
        if (!selectedCar || !selectedCar.segment) return service.basePrice;
        if (service.pricingRules && service.pricingRules[selectedCar.segment]) {
            return service.pricingRules[selectedCar.segment];
        }
        return service.basePrice;
    };

    const handleBookNow = (service) => {
        if (!selectedCar) {
            openCarModal();
        } else {
            const finalPrice = getDynamicPrice(service);
            navigate('/booking', { state: { service: { ...service, price: finalPrice } } });
        }
    };

    return (
        <div className="bg-darker min-h-screen font-sans">
            {/* Hero Section */}
            <div className="relative py-32 bg-dark overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=2000"
                        alt="Services Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-darker to-transparent"></div>
                </div>
                <div className="container-custom relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block font-heading">What We Do</span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading">Our Services</h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
                            Showing services available in <span className="text-primary font-bold">{city || 'All Locations'}</span>
                        </p>
                        {selectedCar && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 inline-block bg-primary/20 border border-primary/50 rounded-full px-6 py-2"
                            >
                                <span className="text-white">
                                    Pricing for: <span className="font-bold text-primary uppercase">{selectedCar.brand} {selectedCar.name}</span>
                                    <span className="text-gray-400 text-xs ml-2">({selectedCar.segment})</span>
                                </span>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-20">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                        {Array.isArray(services) && services.length > 0 ? (
                            services.map((service, index) => (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, rotateY: 90 }}
                                    whileInView={{ opacity: 1, rotateY: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{
                                        duration: 0.8,
                                        delay: index * 0.2,
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 20
                                    }}
                                    style={{ transformOrigin: "left center" }}
                                >
                                    <ServiceCard
                                        service={{
                                            ...service,
                                            price: getDynamicPrice(service)
                                        }}
                                        onBook={() => handleBookNow(service)}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 bg-dark rounded-2xl border border-gray-800 border-dashed">
                                <p className="text-gray-400 text-lg">No services found for this location.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
