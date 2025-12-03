import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';
import { motion } from 'framer-motion';
import { useLocationContext } from '../context/LocationContext';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { city } = useLocationContext();

    useEffect(() => {
        fetchServices();
    }, [city]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            let url = 'http://localhost:5000/api/services';
            if (city) {
                url += `?location=${city}`;
            }
            const res = await axios.get(url);
            if (Array.isArray(res.data)) {
                setServices(res.data);
            } else {
                console.error("API did not return an array:", res.data);
                setServices([]);
            }
        } catch (err) {
            console.error('Error fetching services:', err);
            setServices([]);
        } finally {
            setLoading(false);
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
                        {Array.isArray(services) && services.map((service, index) => (
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
                                <ServiceCard service={service} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && services.length === 0 && (
                    <div className="text-center py-20 bg-dark rounded-2xl border border-gray-800 border-dashed">
                        <p className="text-gray-400 text-lg">No services found for this location.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
