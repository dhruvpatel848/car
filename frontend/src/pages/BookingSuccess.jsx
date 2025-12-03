import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Calendar, MapPin } from 'lucide-react';

const BookingSuccess = () => {
    const location = useLocation();
    const { orderId, serviceName, date, time, amount, paymentMethod } = location.state || {};

    return (
        <div className="min-h-screen bg-darker pt-24 pb-12 font-sans text-white flex items-center justify-center">
            <div className="container-custom max-w-2xl">
                <div className="bg-dark border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-500/20 p-4 rounded-full">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-white">Booking Confirmed!</h1>
                    <p className="text-gray-400 mb-8">
                        Thank you for choosing GLO CAR. Your booking has been successfully placed.
                    </p>

                    {orderId && (
                        <div className="bg-darker p-6 rounded-xl border border-gray-800 text-left mb-8">
                            <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">Booking Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Service</p>
                                    <p className="font-medium text-white">{serviceName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Amount</p>
                                    <p className="font-medium text-primary">₹{amount} ({paymentMethod})</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm flex items-center"><Calendar className="h-3 w-3 mr-1" /> Date & Time</p>
                                    <p className="font-medium text-white">{new Date(date).toDateString()} at {time}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Order ID</p>
                                    <p className="font-medium text-white font-mono text-xs">{orderId}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <Link
                            to="/"
                            className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center"
                        >
                            <Home className="mr-2 h-5 w-5" /> Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
