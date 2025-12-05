import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp = () => {
    const phoneNumber = "919876543210"; // Using the number from Footer
    const message = "Hello, I need help with GLO CAR services.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="h-8 w-8" />
            <span className="absolute right-full mr-4 bg-white text-darker px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
                Need Help?
            </span>
        </a>
    );
};

export default FloatingWhatsApp;
