import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
    const [services, setServices] = React.useState([]);

    React.useEffect(() => {
        const fetchServices = async () => {
            try {
                // Determine API URL based on environment or default to localhost
                const API_URL = import.meta.env.VITE_API_URL || 'https://car-9hr9.onrender.com';
                const response = await fetch(`${API_URL}/api/services`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setServices(data.slice(0, 5)); // Limit to 5 services for footer
                }
            } catch (error) {
                console.error("Error fetching services for footer:", error);
            }
        };

        fetchServices();
    }, []);

    return (
        <footer className="bg-darker border-t border-gray-900 pt-20 pb-10 font-sans">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="GLO CAR" className="h-16 w-auto" />
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Premium car detailing services delivered to your doorstep. We make your car look brand new.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 font-heading">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors text-sm">Home</Link></li>
                            <li><Link to="/services" className="text-gray-400 hover:text-primary transition-colors text-sm">Services</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 font-heading">Services</h3>
                        <ul className="space-y-4">
                            {services.length > 0 ? (
                                services.map((service) => (
                                    <li key={service._id}>
                                        <Link
                                            to="/services"
                                            className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                                        >
                                            {service.title}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                // Fallback if fetch fails or loading
                                <>
                                    <li><Link to="/services" className="text-gray-400 hover:text-primary transition-colors text-sm">Exterior Wash</Link></li>
                                    <li><Link to="/services" className="text-gray-400 hover:text-primary transition-colors text-sm">Interior Detailing</Link></li>
                                    <li><Link to="/services" className="text-gray-400 hover:text-primary transition-colors text-sm">Ceramic Coating</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 font-heading">Contact Us</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start space-x-4 group">
                                <MapPin className="h-5 w-5 text-primary mt-0.5 group-hover:text-white transition-colors" />
                                <span className="text-gray-400 text-sm group-hover:text-white transition-colors">Surat, Gujarat</span>
                            </li>
                            <li className="flex items-center space-x-4 group">
                                <Phone className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                                <span className="text-gray-400 text-sm group-hover:text-white transition-colors">+91 7984042938</span>
                            </li>
                            <li className="flex items-center space-x-4 group">
                                <Mail className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                                <span className="text-gray-400 text-sm group-hover:text-white transition-colors">glocar.services@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">© 2025 GLO CAR. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="https://www.facebook.com/people/GLO-CAR/61584732298585/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
                        <a href="https://www.instagram.com/glocar.services/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
