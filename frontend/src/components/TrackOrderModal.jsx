import React, { useState } from 'react';
import axios from 'axios';
import { X, Search, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TrackOrderModal = ({ isOpen, onClose }) => {
    const [orderId, setOrderId] = useState('');
    const [orderStatus, setOrderStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError('');
        setOrderStatus(null);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/orders/${orderId}`);
            setOrderStatus(res.data);
        } catch (err) {
            setError('Order not found. Please check your Order ID.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'text-green-500';
            case 'confirmed': return 'text-blue-500';
            case 'cancelled': return 'text-red-500';
            default: return 'text-yellow-500';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-dark border border-gray-800 rounded-2xl p-6 md:p-8 w-full max-w-md relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <h3 className="text-2xl font-bold text-white mb-6 font-heading flex items-center">
                    <Package className="mr-2 h-6 w-6 text-primary" /> Track Your Order
                </h3>

                <form onSubmit={handleTrack} className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter Order ID or Phone Number"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full bg-darker border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-white focus:border-primary focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1.5 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <Search className="h-4 w-4" />}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> {error}</p>}
                </form>

                {orderStatus && (
                    <div className="bg-darker rounded-xl p-4 border border-gray-700 animate-slideUp">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-white font-bold">{orderStatus.serviceName}</h4>
                                <p className="text-gray-400 text-sm">{new Date(orderStatus.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`font-bold uppercase text-sm ${getStatusColor(orderStatus.status)}`}>
                                {orderStatus.status}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center text-gray-300 text-sm">
                                <Clock className="h-4 w-4 mr-2 text-primary" />
                                {new Date(orderStatus.appointmentDate).toLocaleDateString()} at {orderStatus.appointmentTime}
                            </div>
                            <div className="flex items-center text-gray-300 text-sm">
                                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                                {orderStatus.carDetails?.make} {orderStatus.carDetails?.model} ({orderStatus.carDetails?.plateNumber})
                            </div>
                            {orderStatus.adminNote && (
                                <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <p className="text-xs text-primary font-bold mb-1 uppercase">Update from Admin</p>
                                    <p className="text-white text-sm">{orderStatus.adminNote}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderModal;
