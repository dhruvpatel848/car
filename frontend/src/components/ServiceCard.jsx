import React from 'react';
import { motion } from 'framer-motion';
import { Check, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCarSelection } from '../context/CarSelectionContext';

const ServiceCard = ({ service, onBook }) => {
    const navigate = useNavigate();
    const { carType } = useCarSelection();

    // carType here is actually the 'segment' (e.g., 'Compact Sedan') because we updated the context to use it?
    // Wait, let's check CarSelectionContext. It likely stores 'selectedCar' object which has 'segment'.
    // But the hook exposes 'carType' which was originally 'hatchback'/'sedan' etc.
    // We need to ensure we are getting the 'segment'.
    // For now, let's assume 'carType' holds the segment string if we updated the context, 
    // OR we need to access the full car object. 
    // Let's use 'selectedCar' from context if available.

    // Actually, let's look at how Services.jsx passes data. 
    // Services.jsx uses `getDynamicPrice` but we want to move that logic here or use the one passed in.
    // Services.jsx: `price: getDynamicPrice(service.price)`
    // But `getDynamicPrice` in Services.jsx uses the OLD settings logic.
    // We need to update Services.jsx too.

    // For this file, let's just display `service.price` which should be passed correctly calculated from parent.
    // OR calculate it here if we have the context.

    // Let's stick to the plan: Update ServiceCard to use pricing rules? 
    // Actually, Services.jsx is the parent and it iterates services. 
    // It's better to calculate price in Services.jsx and pass it down, OR calculate here.
    // Let's calculate here to be self-contained if we have the context.

    // But wait, the previous edit messed up the file. Let's restore it first.

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="bg-dark border border-gray-800 rounded-2xl overflow-hidden group hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/10 flex flex-col h-full"
        >
            <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent z-10 opacity-60"></div>
                <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute top-4 right-4 z-20 bg-dark/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700">
                    <span className="text-primary font-bold font-heading">₹{service.price}</span>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-3 font-heading group-hover:text-primary transition-colors">{service.title}</h3>

                <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">{service.description}</p>

                <div className="space-y-3 mb-8">
                    {service.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-start text-sm text-gray-300">
                            <Check className="h-4 w-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto">
                    <div className="flex items-center text-xs text-gray-500 mb-6 uppercase tracking-wider font-medium">
                        <MapPin className="h-3 w-3 mr-2" />
                        {service.availableLocations.map(loc => typeof loc === 'object' ? loc.city : loc).join(', ')}
                    </div>

                    <button
                        onClick={onBook}
                        aria-label={`Book ${service.title}`}
                        className="w-full bg-white text-darker font-bold py-4 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center group/btn"
                    >
                        Book Now
                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
