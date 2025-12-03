import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const SlotCheckerModal = ({ isOpen, onClose }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    const timeSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
        "05:00 PM", "06:00 PM"
    ];

    useEffect(() => {
        if (isOpen && date) {
            fetchSlots();
        }
    }, [isOpen, date]);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/orders/slots?date=${new Date(date).toISOString()}`);
            setBookedSlots(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-dark border border-gray-800 rounded-2xl p-6 md:p-8 w-full max-w-md relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <h3 className="text-2xl font-bold text-white mb-6 font-heading flex items-center">
                    <Calendar className="mr-2 h-6 w-6 text-primary" /> Check Availability
                </h3>

                <div className="mb-6">
                    <label className="block text-gray-400 text-sm mb-2">Select Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-darker border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                    />
                </div>

                <div className="space-y-3">
                    <p className="text-gray-400 text-sm mb-2">Available Slots</p>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading slots...</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {timeSlots.map(slot => {
                                const isBooked = bookedSlots.includes(slot);
                                return (
                                    <div
                                        key={slot}
                                        className={`p-3 rounded-xl border flex items-center justify-between ${isBooked
                                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                            : 'bg-green-500/10 border-green-500/30 text-green-400'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{slot}</span>
                                        {isBooked ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SlotCheckerModal;
