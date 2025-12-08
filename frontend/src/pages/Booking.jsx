import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Car, Calendar as CalendarIcon, MapPin, CreditCard, Banknote, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useCarSelection } from '../context/CarSelectionContext';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { carType, selectedBrand, selectedModel, openCarModal } = useCarSelection();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState({});
    const [services, setServices] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);

    const [formData, setFormData] = useState({
        // Service
        serviceId: location.state?.service?._id || '',
        serviceName: location.state?.service?.title || '',
        basePrice: location.state?.service?.price || 0,

        // Personal
        name: '',
        email: '',
        phone: '',

        // Schedule
        date: '',
        timeSlot: '',

        // Address
        address: '',
        city: 'Surat', // Default city
        zip: '',

        // Payment
        paymentMethod: 'Razorpay'
    });

    // Redirect if no car model selected
    useEffect(() => {
        if (!selectedModel) {
            openCarModal();
            navigate('/services');
        }
    }, [selectedModel, navigate, openCarModal]);

    // Fetch Settings & Services on Mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'https://car-9hr9.onrender.com';

                // Fetch Settings
                const settingsRes = await axios.get(`${API_URL}/api/settings`);
                setSettings(settingsRes.data);

                // Fetch Services if not pre-selected
                if (!formData.serviceId) {
                    const servicesRes = await axios.get(`${API_URL}/api/services`);
                    setServices(servicesRes.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    // Fetch Slots when Date Changes
    useEffect(() => {
        if (formData.date) {
            const fetchSlots = async () => {
                try {
                    const API_URL = import.meta.env.VITE_API_URL || 'https://car-9hr9.onrender.com';
                    const res = await axios.get(`${API_URL}/api/orders/slots?date=${new Date(formData.date).toISOString()}`);
                    setBookedSlots(res.data);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchSlots();
        }
    }, [formData.date]);

    // Total Price
    const calculateTotal = () => {
        return formData.basePrice;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getDynamicPrice = (service) => {
        if (!selectedModel || !selectedModel.segment) return service.basePrice;
        if (service.pricingRules && service.pricingRules[selectedModel.segment]) {
            return service.pricingRules[selectedModel.segment];
        }
        return service.basePrice;
    };

    const handleServiceChange = (e) => {
        const service = services.find(s => s._id === e.target.value);
        if (service) {
            const finalPrice = getDynamicPrice(service);
            setFormData({
                ...formData,
                serviceId: service._id,
                serviceName: service.title,
                basePrice: finalPrice
            });
        }
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const zipRegex = /^\d{6}$/;

        if (!formData.serviceId) newErrors.serviceId = "Please select a service";
        if (!formData.name.trim()) newErrors.name = "Full Name is required";
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone Number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Phone Number must be exactly 10 digits";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email Address is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid Email Address";
        }

        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.timeSlot) newErrors.timeSlot = "Time Slot is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.zip.trim()) {
            newErrors.zip = "ZIP Code is required";
        } else if (!zipRegex.test(formData.zip)) {
            newErrors.zip = "ZIP Code must be exactly 6 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://car-9hr9.onrender.com';
            const totalPrice = calculateTotal();

            const orderData = {
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                serviceId: formData.serviceId,
                serviceName: formData.serviceName,
                amount: totalPrice,
                appointmentDate: formData.date,
                appointmentTime: formData.timeSlot,
                carDetails: {
                    make: selectedBrand?.name,
                    model: selectedModel?.name,
                    year: new Date().getFullYear(),
                    plateNumber: "N/A",
                    type: carType
                },
                address: `${formData.address}, ${formData.city} - ${formData.zip}`,
                city: formData.city,
                paymentMethod: formData.paymentMethod,
                paymentStatus: 'Pending'
            };

            // Create Order
            const res = await axios.post(`${API_URL}/api/orders`, orderData);

            if (formData.paymentMethod === 'Razorpay') {
                // Razorpay Flow
                const orderRes = await axios.post(`${API_URL}/api/orders/create-razorpay-order`, {
                    amount: totalPrice,
                    receipt: res.data._id
                });

                const options = {
                    key: "rzp_test_Rn58DGpaayS7uR", // Replace with real key in production or env
                    amount: orderRes.data.amount,
                    currency: orderRes.data.currency,
                    name: "GLO CAR",
                    description: `Booking for ${formData.serviceName}`,
                    order_id: orderRes.data.id,
                    handler: async function (response) {
                        try {
                            await axios.post(`${API_URL}/api/orders/verify-payment`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: res.data._id
                            });
                            navigate('/booking-success', { state: { ...orderData, orderId: res.data.orderId, amount: totalPrice } });
                        } catch (err) {
                            alert("Payment verification failed");
                        }
                    },
                    prefill: { name: formData.name, email: formData.email, contact: formData.phone },
                    theme: { color: "#3b82f6" }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                // COD Flow
                navigate('/booking-success', { state: { ...orderData, orderId: res.data.orderId, amount: totalPrice } });
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    if (!selectedModel) return null;

    return (
        <div className="min-h-screen bg-darker pt-20 md:pt-24 pb-12 font-sans text-white">
            <div className="container-custom max-w-4xl px-4">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 font-heading text-center">Complete Your Booking</h1>

                <form onSubmit={handleSubmit} className="bg-dark border border-gray-800 rounded-2xl p-4 md:p-10 shadow-2xl space-y-6 md:space-y-8" noValidate>

                    {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/50 text-sm">{error}</div>}

                    {/* 1. Service Details */}
                    <section>
                        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center text-primary"><CheckCircle className="mr-2 h-5 w-5" /> Service Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {!location.state?.service && (
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Select Service <span className="text-red-500">*</span></label>
                                    <select
                                        name="serviceId"
                                        value={formData.serviceId}
                                        onChange={handleServiceChange}
                                        className={`w-full bg-darker border rounded-xl p-3 md:p-4 text-white focus:outline-none text-base ${errors.serviceId ? 'border-red-500' : 'border-gray-700 focus:border-primary'}`}
                                        required
                                    >
                                        <option value="">-- Choose Service --</option>
                                        {services.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                                    </select>
                                    {errors.serviceId && <p className="text-red-500 text-xs mt-1">{errors.serviceId}</p>}
                                </div>
                            )}
                            <div className="bg-darker p-4 rounded-xl border border-gray-700">
                                <p className="text-gray-400 text-xs uppercase">Selected Service</p>
                                <p className="font-bold text-lg">{formData.serviceName || 'No Service Selected'}</p>
                                <p className="text-primary font-bold mt-1">Total Price: ₹{formData.basePrice}</p>
                            </div>
                        </div>
                    </section>

                    {/* 2. Car Details */}
                    <section>
                        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center text-primary"><Car className="mr-2 h-5 w-5" /> Car Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="flex flex-col">
                                <label className="block text-gray-400 text-sm mb-2">Car Model <span className="text-red-500">*</span></label>
                                <div className="w-full bg-darker border border-gray-700 rounded-xl p-3 md:p-4 text-white flex items-center justify-between flex-1 min-h-[50px]">
                                    <div>
                                        <span className="block font-bold text-base md:text-lg">{selectedBrand?.name} {selectedModel?.name}</span>
                                        <span className="text-xs text-gray-500 uppercase">{carType}</span>
                                    </div>
                                    <button type="button" onClick={openCarModal} className="text-xs text-primary hover:underline px-2 py-1">Change</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. Personal Info */}
                    <section>
                        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center text-primary"><User className="mr-2 h-5 w-5" /> Personal Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <input
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full bg-darker border rounded-xl p-3 md:p-4 text-white focus:outline-none text-base ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-primary'}`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full bg-darker border rounded-xl p-3 md:p-4 text-white focus:outline-none text-base ${errors.phone ? 'border-red-500' : 'border-gray-700 focus:border-primary'}`}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <input
                                    id="email-input"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full bg-darker border rounded-xl p-3 md:p-4 text-white focus:outline-none text-base ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-primary'}`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>
                    </section>

                    {/* 4. Schedule */}
                    <section>
                        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center text-primary"><CalendarIcon className="mr-2 h-5 w-5" /> Schedule</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <input
                                    type="date"
                                    name="date"
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full bg-darker border rounded-xl p-3 md:p-4 text-white focus:outline-none text-base ${errors.date ? 'border-red-500' : 'border-gray-700 focus:border-primary'}`}
                                />
                                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                            </div>
                            <div>
                                <select
                                    name="timeSlot"
                                    value={formData.timeSlot}
                                    onChange={handleChange}
                                    className={`w-full bg-darker border rounded-xl p-3 md:p-4 text-white focus:outline-none text-base ${errors.timeSlot ? 'border-red-500' : 'border-gray-700 focus:border-primary'}`}
                                >
                                    <option value="">-- Select Time Slot --</option>
                                    {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"].map(slot => (
                                        <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                                            {slot} {bookedSlots.includes(slot) ? '(Booked)' : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>}
                            </div>
                        </div>
                    </section>

                    {/* 5. Address */}
                    <section>
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                            <h2 className="text-lg md:text-xl font-bold flex items-center text-primary"><MapPin className="mr-2 h-5 w-5" /> Address</h2>
                        </div>
                        <div>
                            <textarea
                                name="address"
                                placeholder="Full Address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className={`w-full bg-darker border rounded-xl p-3 md:p-4 text-white focus:outline-none mb-4 text-base ${errors.address ? 'border-red-500' : 'border-gray-700 focus:border-primary'}`}
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1 -translate-y-3">{errors.address}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <input
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    disabled
                                    className={`w-full bg-darker border border-gray-700 rounded-xl p-3 md:p-4 text-gray-400 cursor-not-allowed text-base`}
                                />
                            </div>
                            <div>
                                <input
                                    name="zip"
                                    placeholder="ZIP Code"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    className={`w-full bg-darker border rounded-xl p-3 md:p-4 text-white focus:outline-none text-base ${errors.zip ? 'border-red-500' : 'border-gray-700 focus:border-primary'}`}
                                />
                                {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                            </div>
                        </div>
                    </section>

                    {/* 6. Payment & Total */}
                    <section className="bg-darker p-4 md:p-6 rounded-2xl border border-gray-700">
                        <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center text-white">Payment Summary</h2>
                        <div className="flex justify-between mb-2 text-gray-400 text-sm md:text-base">
                            <span>Service Price</span>
                            <span>₹{formData.basePrice}</span>
                        </div>
                        <div className="flex justify-between mb-6 text-lg md:text-xl font-bold text-white border-t border-gray-600 pt-4">
                            <span>Total Amount</span>
                            <span className="text-primary">₹{calculateTotal()}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, paymentMethod: 'Razorpay' })}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${formData.paymentMethod === 'Razorpay' ? 'bg-primary/20 border-primary text-white' : 'bg-dark border-gray-700 text-gray-400'}`}
                            >
                                <CreditCard className="mb-2" /> Pay Online
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${formData.paymentMethod === 'COD' ? 'bg-primary/20 border-primary text-white' : 'bg-dark border-gray-700 text-gray-400'}`}
                            >
                                <Banknote className="mb-2" /> Cash on Delivery
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center shadow-lg shadow-green-600/20"
                        >
                            {loading ? 'Processing...' : `Confirm Booking - ₹${calculateTotal()}`}
                        </button>
                    </section>

                </form>
            </div>
        </div>
    );
};

export default Booking;
