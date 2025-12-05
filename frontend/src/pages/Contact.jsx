import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleWhatsAppSubmit = (e) => {
        e.preventDefault();
        const { name, email, subject, message } = formData;
        const text = `*New Inquiry from Website*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Subject:* ${subject}%0A*Message:* ${message}`;
        const phoneNumber = "917984042938";
        window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
    };

    return (
        <div className="bg-darker min-h-screen font-sans">
            {/* Hero Section */}
            <div className="relative py-32 bg-dark overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2000"
                        alt="Contact Background"
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
                        <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block font-heading">Get In Touch</span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading">Contact Us</h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
                            Have questions? We're here to help. Reach out to us directly via WhatsApp or visit our detailing studio.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-10">
                        <div className="bg-dark p-10 border border-gray-800 relative overflow-hidden group hover:border-primary/50 transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MapPin className="h-32 w-32 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-8 font-heading">Contact Details</h3>
                            <div className="space-y-8 relative z-10">
                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 bg-darker border border-gray-700 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Headquarters</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">Surat, Gujarat</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 bg-darker border border-gray-700 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Phone Support</h4>
                                        <p className="text-gray-400 font-light">+91 7984042938</p>
                                        <p className="text-gray-500 text-sm mt-1">(Mon-Sat, 9AM - 7PM)</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 bg-darker border border-gray-700 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Email</h4>
                                        <p className="text-gray-400 font-light">glocar.services@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-dark p-10 border border-gray-800 relative">
                            <div className="flex items-center mb-8">
                                <MessageCircle className="h-8 w-8 text-[#25D366] mr-4" />
                                <h3 className="text-3xl font-bold text-white font-heading">Chat on WhatsApp</h3>
                            </div>

                            <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Your Name</label>
                                        <input
                                            name="name"
                                            required
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full bg-darker border border-gray-700 px-6 py-4 text-white focus:border-primary focus:outline-none transition-colors placeholder-gray-600"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Your Email</label>
                                        <input
                                            name="email"
                                            required
                                            onChange={handleChange}
                                            type="email"
                                            className="w-full bg-darker border border-gray-700 px-6 py-4 text-white focus:border-primary focus:outline-none transition-colors placeholder-gray-600"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Subject</label>
                                    <input
                                        name="subject"
                                        required
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full bg-darker border border-gray-700 px-6 py-4 text-white focus:border-primary focus:outline-none transition-colors placeholder-gray-600"
                                        placeholder="Inquiry about Ceramic Coating..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full bg-darker border border-gray-700 px-6 py-4 text-white focus:border-primary focus:outline-none transition-colors placeholder-gray-600 resize-none"
                                        placeholder="Hi, I would like to know more about..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-5 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center text-lg uppercase tracking-wide">
                                    <MessageCircle className="mr-3 h-6 w-6" />
                                    Start WhatsApp Chat
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
