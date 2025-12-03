import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Heart, Award, PenTool, Clock } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-darker min-h-screen font-sans">
            {/* Hero Section */}
            <div className="relative py-32 bg-dark overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=2000"
                        alt="About Background"
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
                        <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block font-heading">Our Story</span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading">About GLO CAR</h1>
                        <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light">
                            Redefining automotive care with precision, passion, and premium technology. We don't just wash cars; we rejuvenate them.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-24 relative">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <span className="text-primary font-bold tracking-widest uppercase text-sm block font-heading">Who We Are</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight font-heading">
                                The Premier Choice for <br />Auto Detailing
                            </h2>
                            <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed">
                                <p>
                                    GLO CAR was established with a singular vision: to provide a showroom-quality finish to every vehicle we touch. We understand that your car is more than just a mode of transport; it's an investment and a reflection of your personality.
                                </p>
                                <p>
                                    Operating across <strong className="text-white">Ahmedabad</strong> and <strong className="text-white">Surat</strong>, we bring professional detailing services directly to your doorstep. Our mobile units are fully equipped with water, power, and industry-leading products.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-800">
                                <div>
                                    <div className="text-4xl font-bold text-white font-heading mb-1">5k+</div>
                                    <div className="text-primary text-sm uppercase tracking-wider font-bold">Cars Detailed</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-white font-heading mb-1">98%</div>
                                    <div className="text-primary text-sm uppercase tracking-wider font-bold">Satisfaction</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 border-2 border-primary/20 rounded-none transform rotate-6 z-0"></div>
                            <img
                                src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=800"
                                className="relative z-10 shadow-2xl w-full object-cover h-[600px] grayscale hover:grayscale-0 transition-all duration-700"
                                alt="GLO CAR Team at work"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Grid */}
            <section className="py-24 bg-dark border-t border-gray-900">
                <div className="container-custom">
                    <div className="text-center mb-20">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block font-heading">Why Choose Us</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-heading">The GLO CAR Difference</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: PenTool,
                                title: 'Precision Detailing',
                                desc: 'Our technicians are trained to pay attention to every nook and cranny, ensuring a flawless finish.'
                            },
                            {
                                icon: Award,
                                title: 'Premium Products',
                                desc: 'We strictly use pH-neutral shampoos, high-grade waxes, and ceramic coatings that are safe for your paint.'
                            },
                            {
                                icon: Clock,
                                title: 'Time Saving',
                                desc: 'No need to drive to a garage and wait. We come to you, saving you valuable time and effort.'
                            },
                            {
                                icon: Shield,
                                title: 'Insured Service',
                                desc: 'Rest easy knowing your vehicle is in safe hands. We are fully insured against any accidental damages.'
                            },
                            {
                                icon: Users,
                                title: 'Trusted Team',
                                desc: 'Every member of our team undergoes background checks and rigorous training before handling your car.'
                            },
                            {
                                icon: Heart,
                                title: 'Eco-Friendly',
                                desc: 'We use water-saving techniques and biodegradable products to minimize our environmental impact.'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                className="bg-darker p-10 border border-gray-800 hover:border-primary/50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <item.icon className="h-24 w-24 text-white" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-dark border border-gray-700 rounded-full flex items-center justify-center mb-8 group-hover:border-primary group-hover:bg-primary transition-all">
                                        <item.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 font-heading">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed font-light">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
