import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Car, Calendar as CalendarIcon, MapPin, ChevronLeft, ChevronRight, Check, Clock, AlertCircle, CreditCard, Banknote, Edit2 } from 'lucide-react';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Initial State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        make: '',
        model: '',
        year: '',
        plateNumber: '',
        serviceId: location.state?.service?._id || '',
        serviceName: location.state?.service?.title || '',
        price: location.state?.service?.price || 0,
        date: null,
        timeSlot: '',
        address: '',
        city: '',
        zip: '',
        paymentMethod: 'Razorpay' // Default
    });

    // Services for dropdown if not pre-selected
    const [services, setServices] = useState([]);

    useEffect(() => {
        if (!formData.serviceId) {
            fetchServices();
        }
    }, []);

    const fetchServices = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/services`);
            setServices(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on change
    };

    const validateStep = (currentStep) => {
        if (currentStep === 1) {
            if (!formData.name || !formData.email || !formData.phone) return "Please fill in all personal details.";
        }
        if (currentStep === 2) {
            if (!formData.make || !formData.model || !formData.year || !formData.plateNumber) return "Please fill in all car details.";
        }
        if (currentStep === 3) {
            if (!formData.serviceId) return "Please select a service.";
            if (!formData.date) return "Please select a date.";
            if (!formData.timeSlot) return "Please select a time slot.";
        }
        if (currentStep === 4) {
            if (!formData.address || !formData.city || !formData.zip) return "Please fill in all address details.";
        }
        return null;
    };

    const handleNext = () => {
        const validationError = validateStep(step);
        if (validationError) {
            setError(validationError);
            return;
        }
        setError('');
        if (step < 5) setStep(step + 1);
    };

    const handleBack = () => {
        setError('');
        if (step > 1) setStep(step - 1);
    };

    const jumpToStep = (stepNumber) => {
        setStep(stepNumber);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            // Combine date and time
            const appointmentDate = new Date(formData.date);

            const orderData = {
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                serviceId: formData.serviceId,
                serviceName: formData.serviceName,
                amount: formData.price,
                appointmentDate: appointmentDate,
                appointmentTime: formData.timeSlot,
                carDetails: {
                    make: formData.make,
                    model: formData.model,
                    year: formData.year,
                    plateNumber: formData.plateNumber
                },
                address: `${formData.address}, ${formData.city} - ${formData.zip}`,
                city: formData.city,
                paymentMethod: formData.paymentMethod,
                paymentStatus: formData.paymentMethod === 'COD' ? 'Pending' : 'Pending' // Initially pending for both
            };

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${API_URL}/api/orders`, orderData);

            if (formData.paymentMethod === 'Razorpay') {
                // 1. Create Razorpay Order on Backend
                const orderRes = await axios.post(`${API_URL}/api/orders/create-razorpay-order`, {
                    amount: formData.price,
                    receipt: res.data._id
                });

                const { id: razorpayOrderId, amount: razorpayAmount, currency } = orderRes.data;

                // 2. Initialize Razorpay
                const options = {
                    key: "rzp_test_Rn58DGpaayS7uR", // Use env var in real app
                    amount: razorpayAmount,
                    currency: currency,
                    name: "GLO CAR",
                    description: `Booking for ${formData.serviceName}`,
                    order_id: razorpayOrderId,
                    handler: async function (response) {
                        try {
                            // 3. Verify Payment on Backend
                            await axios.post(`${API_URL}/api/orders/verify-payment`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: res.data._id
                            });

                            // 4. Redirect to Success Page
                            navigate('/booking-success', {
                                state: {
                                    orderId: res.data._id,
                                    serviceName: formData.serviceName,
                                    date: formData.date,
                                    time: formData.timeSlot,
                                    amount: formData.price,
                                    paymentMethod: 'Razorpay'
                                }
                            });
                        } catch (verifyErr) {
                            console.error("Payment Verification Failed", verifyErr);
                            alert("Payment successful but verification failed. Please contact support.");
                        }
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: {
                        color: "#3b82f6"
                    },
                    modal: {
                        ondismiss: function () {
                            setLoading(false);
                            alert("Payment Cancelled. You can try again.");
                        }
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    console.error(response.error);
                    alert(`Payment Failed: ${response.error.description}`);
                    setLoading(false);
                });
                rzp1.open();

            } else {
                // COD Flow
                navigate('/booking-success', {
                    state: {
                        orderId: res.data._id,
                        serviceName: formData.serviceName,
                        date: formData.date,
                        time: formData.timeSlot,
                        amount: formData.price,
                        paymentMethod: 'COD'
                    }
                });
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Steps Configuration
    const steps = [
        { id: 1, title: 'Personal', icon: User },
        { id: 2, title: 'Car', icon: Car },
        { id: 3, title: 'Schedule', icon: CalendarIcon },
        { id: 4, title: 'Address', icon: MapPin },
        { id: 5, title: 'Review', icon: Check },
    ];

    return (
        <div className="min-h-screen bg-darker pt-24 pb-12 font-sans text-white">
            <div className="container-custom max-w-4xl">

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between items-center relative">
                        {/* Line Background */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-800 -z-0"></div>

                        {/* Active Line */}
                        <div
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary -z-0 transition-all duration-500"
                            style={{ width: `${((step - 1) / 4) * 100}%` }}
                        ></div>

                        {steps.map((s) => (
                            <div key={s.id} className="relative z-10 flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= s.id
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-dark border-gray-600 text-gray-400'
                                        }`}
                                >
                                    {step > s.id ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : <s.icon className="h-4 w-4 md:h-5 md:w-5" />}
                                </div>
                                <span className={`mt-2 text-[10px] md:text-sm font-medium ${step >= s.id ? 'text-white' : 'text-gray-500'}`}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-dark border border-gray-800 rounded-2xl p-6 md:p-10 shadow-2xl">

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    )}

                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 1 && (
                                <PersonalInfoStep formData={formData} handleChange={handleChange} />
                            )}
                            {step === 2 && (
                                <CarDetailsStep formData={formData} handleChange={handleChange} />
                            )}
                            {step === 3 && (
                                <ScheduleStep
                                    formData={formData}
                                    setFormData={setFormData}
                                    services={services}
                                    setError={setError}
                                />
                            )}
                            {step === 4 && (
                                <AddressStep formData={formData} handleChange={handleChange} />
                            )}
                            {step === 5 && (
                                <ReviewStep
                                    formData={formData}
                                    setFormData={setFormData}
                                    jumpToStep={jumpToStep}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-10 pt-6 border-t border-gray-800">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            Back
                        </button>

                        {step < 5 ? (
                            <button
                                onClick={handleNext}
                                className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center"
                            >
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center"
                            >
                                {loading ? 'Processing...' : `Pay ₹${formData.price}`}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- Step Components ---

const PersonalInfoStep = ({ formData, handleChange }) => (
    <div>
        <h2 className="text-2xl font-bold mb-6 font-heading">Personal Information</h2>
        <div className="space-y-6">
            <div>
                <label className="block text-gray-400 text-sm mb-2">Full Name <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="John Doe"
                />
            </div>
            <div>
                <label className="block text-gray-400 text-sm mb-2">Email Address <span className="text-red-500">*</span></label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="john@example.com"
                />
            </div>
            <div>
                <label className="block text-gray-400 text-sm mb-2">Phone Number <span className="text-red-500">*</span></label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="+91 98765 43210"
                />
            </div>
        </div>
    </div>
);

const CarDetailsStep = ({ formData, handleChange }) => (
    <div>
        <h2 className="text-2xl font-bold mb-6 font-heading">Car Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-gray-400 text-sm mb-2">Car Make <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="Toyota, Honda, etc."
                />
            </div>
            <div>
                <label className="block text-gray-400 text-sm mb-2">Car Model <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="Camry, City, etc."
                />
            </div>
            <div>
                <label className="block text-gray-400 text-sm mb-2">Year <span className="text-red-500">*</span></label>
                <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="2023"
                />
            </div>
            <div>
                <label className="block text-gray-400 text-sm mb-2">Plate Number <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                    className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="GJ-01-AB-1234"
                />
            </div>
        </div>
    </div>
);

const ScheduleStep = ({ formData, setFormData, services, setError }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Calendar Logic
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Fetch slots when date changes
    useEffect(() => {
        if (formData.date) {
            fetchBookedSlots(formData.date);
        }
    }, [formData.date]);

    const fetchBookedSlots = async (date) => {
        try {
            setLoadingSlots(true);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/orders/slots?date=${date.toISOString()}`);
            setBookedSlots(res.data);
        } catch (err) {
            console.error("Error fetching slots:", err);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Prevent selecting past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (newDate < today) {
            setError("Cannot select past dates.");
            return;
        }

        setFormData({ ...formData, date: newDate, timeSlot: '' }); // Reset time slot on date change
        setError('');
    };

    const handlePrevMonth = () => {
        const today = new Date();
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        // Allow going back only if it's not before current month
        if (prevMonth.getMonth() >= today.getMonth() || prevMonth.getFullYear() > today.getFullYear()) {
            setCurrentDate(prevMonth);
        }
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const timeSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 font-heading">Service & Schedule</h2>

            {/* Service Selection (if not pre-selected) */}
            {!formData.serviceId && (
                <div className="mb-8">
                    <label className="block text-gray-400 text-sm mb-2">Select Service <span className="text-red-500">*</span></label>
                    <select
                        name="serviceId"
                        value={formData.serviceId}
                        onChange={(e) => {
                            const service = services.find(s => s._id === e.target.value);
                            setFormData({
                                ...formData,
                                serviceId: service._id,
                                serviceName: service.title,
                                price: service.price
                            });
                        }}
                        className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none"
                    >
                        <option value="">-- Choose a Service --</option>
                        {services.map(s => (
                            <option key={s._id} value={s._id}>{s.title} - ₹{s.price}</option>
                        ))}
                    </select>
                </div>
            )}

            {formData.serviceName && (
                <div className="bg-darker p-4 rounded-xl mb-8 border border-gray-800 flex justify-between items-center">
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Selected Service</p>
                        <p className="font-bold text-lg">{formData.serviceName}</p>
                    </div>
                    <div className="text-primary font-bold text-xl">₹{formData.price}</div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                        <div className="flex space-x-2">
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-800 rounded"><ChevronLeft className="h-5 w-5" /></button>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-800 rounded"><ChevronRight className="h-5 w-5" /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} className="text-gray-500 font-medium">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-10"></div>
                        ))}
                        {Array.from({ length: days }).map((_, i) => {
                            const day = i + 1;
                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const isSelected = formData.date && date.toDateString() === new Date(formData.date).toDateString();
                            const isToday = date.toDateString() === new Date().toDateString();
                            const isPast = date < new Date().setHours(0, 0, 0, 0);

                            return (
                                <button
                                    key={day}
                                    disabled={isPast}
                                    onClick={() => handleDateClick(day)}
                                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' :
                                        isToday ? 'border border-primary text-primary' :
                                            isPast ? 'text-gray-700 cursor-not-allowed' :
                                                'hover:bg-gray-800 text-gray-300'
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Slots */}
                <div>
                    <h3 className="font-bold text-white mb-4 flex items-center"><Clock className="h-4 w-4 mr-2" /> Available Slots</h3>
                    {!formData.date ? (
                        <p className="text-gray-500 text-sm">Please select a date first.</p>
                    ) : loadingSlots ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {timeSlots.map((slot) => {
                                const isBooked = bookedSlots.includes(slot);
                                return (
                                    <button
                                        key={slot}
                                        disabled={isBooked}
                                        onClick={() => setFormData({ ...formData, timeSlot: slot })}
                                        className={`py-3 rounded-lg text-sm font-medium border transition-all ${formData.timeSlot === slot
                                            ? 'bg-primary border-primary text-white'
                                            : isBooked
                                                ? 'bg-darker border-gray-800 text-gray-600 cursor-not-allowed line-through'
                                                : 'bg-darker border-gray-700 text-gray-400 hover:border-gray-500'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AddressStep = ({ formData, handleChange }) => (
    <div>
        <h2 className="text-2xl font-bold mb-6 font-heading">Address Details</h2>
        <div className="space-y-6">
            <div>
                <label className="block text-gray-400 text-sm mb-2">Street Address <span className="text-red-500">*</span></label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="123, Main Street, Near Landmark"
                ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-400 text-sm mb-2">City <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"
                        placeholder="Ahmedabad"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-2">ZIP Code <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none transition-colors"
                        placeholder="380001"
                    />
                </div>
            </div>
        </div>
    </div>
);

const ReviewStep = ({ formData, setFormData, jumpToStep }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 font-heading">Review & Payment</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Personal Info Review */}
                <div className="bg-darker p-5 rounded-xl border border-gray-800 relative group">
                    <button onClick={() => jumpToStep(1)} className="absolute top-4 right-4 text-gray-500 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Personal Info</h3>
                    <p className="font-medium text-white">{formData.name}</p>
                    <p className="text-sm text-gray-400">{formData.email}</p>
                    <p className="text-sm text-gray-400">{formData.phone}</p>
                </div>

                {/* Car Details Review */}
                <div className="bg-darker p-5 rounded-xl border border-gray-800 relative group">
                    <button onClick={() => jumpToStep(2)} className="absolute top-4 right-4 text-gray-500 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Car Details</h3>
                    <p className="font-medium text-white">{formData.make} {formData.model}</p>
                    <p className="text-sm text-gray-400">{formData.year}</p>
                    <p className="text-sm text-gray-400 font-mono">{formData.plateNumber}</p>
                </div>

                {/* Service Review */}
                <div className="bg-darker p-5 rounded-xl border border-gray-800 relative group">
                    <button onClick={() => jumpToStep(3)} className="absolute top-4 right-4 text-gray-500 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Service & Time</h3>
                    <p className="font-medium text-white">{formData.serviceName}</p>
                    <p className="text-sm text-gray-400">{new Date(formData.date).toDateString()}</p>
                    <p className="text-sm text-gray-400">{formData.timeSlot}</p>
                </div>

                {/* Address Review */}
                <div className="bg-darker p-5 rounded-xl border border-gray-800 relative group">
                    <button onClick={() => jumpToStep(4)} className="absolute top-4 right-4 text-gray-500 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Address</h3>
                    <p className="text-sm text-gray-300">{formData.address}</p>
                    <p className="text-sm text-gray-400">{formData.city} - {formData.zip}</p>
                </div>
            </div>

            {/* Payment Selection */}
            <h3 className="text-xl font-bold mb-4 font-heading">Select Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Razorpay' })}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${formData.paymentMethod === 'Razorpay'
                        ? 'bg-primary/10 border-primary text-white'
                        : 'bg-darker border-gray-800 text-gray-400 hover:bg-gray-800'
                        }`}
                >
                    <div className="flex items-center">
                        <CreditCard className="h-6 w-6 mr-3 text-blue-400" />
                        <span className="font-medium">Pay Online (Razorpay)</span>
                    </div>
                    {formData.paymentMethod === 'Razorpay' && <Check className="h-5 w-5 text-primary" />}
                </button>

                <button
                    onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${formData.paymentMethod === 'COD'
                        ? 'bg-primary/10 border-primary text-white'
                        : 'bg-darker border-gray-800 text-gray-400 hover:bg-gray-800'
                        }`}
                >
                    <div className="flex items-center">
                        <Banknote className="h-6 w-6 mr-3 text-green-400" />
                        <span className="font-medium">Cash on Delivery</span>
                    </div>
                    {formData.paymentMethod === 'COD' && <Check className="h-5 w-5 text-primary" />}
                </button>
            </div>

            <div className="mt-8 bg-gray-800/50 p-4 rounded-xl flex justify-between items-center">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-2xl font-bold text-white">₹{formData.price}</span>
            </div>
        </div>
    );
};

export default Booking;
