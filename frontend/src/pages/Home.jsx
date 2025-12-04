import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MousePointer2, CheckCircle, Star, Users, Trophy, Clock, MapPin } from 'lucide-react';
import { useCarSelection } from '../context/CarSelectionContext';
import { useLocationContext } from '../context/LocationContext';
import ServiceSlider from '../components/ServiceSlider';

const Home = () => {
    const { openCarModal, selectedModel } = useCarSelection();
    const { city, openLocationModal } = useLocationContext();

    // Auto-trigger flow on mount
    useEffect(() => {
        if (!city) {
            openLocationModal();
        } else if (!selectedModel) {
            openCarModal();
        }
    }, [city, selectedModel, openLocationModal, openCarModal]);

    const handleGetStarted = () => {
        if (!city) {
            openLocationModal();
        } else {
            openCarModal();
        }
    };

    return (
        <div className="bg-darker min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=2000"
                        alt="Car Detailing"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-darker via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="container-custom relative z-10 text-center mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-white/80 font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-6 block font-heading">
                            Fueled by Passion
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight font-heading">
                            Experience superior <br /> car detailing
                        </h1>

                        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
                            <button
                                onClick={handleGetStarted}
                                className="bg-primary hover:bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all transform hover:scale-105 shadow-lg shadow-primary/30"
                            >
                                Get Started Now
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side Indicators */}
                <div className="absolute right-8 md:right-12 top-1/2 transform -translate-y-1/2 hidden md:flex flex-col gap-8 z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-[2px] bg-white"></div>
                        <span className="text-white font-bold font-heading">01</span>
                    </div>
                    <div className="flex items-center gap-4 opacity-50">
                        <span className="text-white font-bold font-heading">02</span>
                    </div>
                    <div className="flex items-center gap-4 opacity-50">
                        <span className="text-white font-bold font-heading">03</span>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                    <div className="w-[30px] h-[50px] border-2 border-white/30 rounded-full flex justify-center p-2">
                        <div className="w-1 h-2 bg-white rounded-full animate-scroll"></div>
                    </div>
                </div>
            </section>

            {/* Service Slider */}
            <ServiceSlider />



            {/* About Teaser */}
            <section className="py-24 bg-darker relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-dark/50 skew-x-12 transform translate-x-20"></div>
                <div className="container-custom relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -inset-4 border-2 border-primary/30 rounded-none transform rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=1000"
                                alt="Detailing Process"
                                className="relative shadow-2xl grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                        <div>
                            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block font-heading">About Us</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-heading leading-tight">
                                We Care About Your Car <br /> As Much As You Do
                            </h2>
                            <p className="text-gray-400 mb-8 leading-relaxed text-lg font-light">
                                At GLO CAR, we believe that every vehicle deserves to look its best. Our team of certified professionals uses the latest technology and premium products to restore your car's original glory.
                            </p>
                            <ul className="space-y-4 mb-10">
                                {['Certified Technicians', 'Eco-Friendly Products', '100% Satisfaction Guarantee'].map((item, i) => (
                                    <li key={i} className="flex items-center text-gray-300 font-medium">
                                        <span className="w-2 h-2 bg-primary rounded-full mr-4"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/about" className="text-white font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors uppercase tracking-wider text-sm">
                                Read More About Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-dark border-y border-gray-800">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { count: '5000+', label: 'Happy Clients' },
                            { count: '12+', label: 'Awards Won' },
                            { count: '10k+', label: 'Hours Worked' },
                            { count: '2', label: 'Cities Covered' },
                        ].map((stat, index) => (
                            <div key={index} className="text-white group">
                                <div className="text-5xl font-bold mb-3 font-heading text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 group-hover:from-primary group-hover:to-blue-400 transition-all">
                                    {stat.count}
                                </div>
                                <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 bg-darker">
                <div className="container-custom">
                    <div className="text-center mb-20">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block font-heading">Process</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-heading">How It Works</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { step: '01', title: 'Book Online', desc: 'Choose your service and preferred time slot through our website.' },
                            { step: '02', title: 'We Arrive', desc: 'Our fully equipped van arrives at your doorstep on time.' },
                            { step: '03', title: 'You Relax', desc: 'We make your car shine while you enjoy your free time.' }
                        ].map((item, index) => (
                            <div key={index} className="relative group">
                                <div className="text-8xl font-bold text-gray-800/30 absolute -top-10 -left-4 font-heading group-hover:text-primary/10 transition-colors">
                                    {item.step}
                                </div>
                                <div className="relative z-10 pt-8 pl-8">
                                    <h4 className="text-2xl font-bold text-white mb-4 font-heading">{item.title}</h4>
                                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=2000"
                        alt="CTA Background"
                        className="w-full h-full object-cover grayscale opacity-30"
                    />
                    <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>
                </div>
                <div className="container-custom relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-heading">Ready to Transform Your Car?</h2>
                    <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">Book your appointment today and experience the premium care your vehicle deserves.</p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="bg-white text-primary px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-dark hover:text-white transition-colors shadow-2xl"
                    >
                        Start Booking
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
