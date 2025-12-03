import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingBag, Settings, LogOut, Download, Plus, Trash2, Edit, Eye, X,
    CreditCard, Banknote, MapPin, Menu, Bell, Search, ChevronDown, User, Calendar, Check, Clock
} from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) navigate('/admin/login');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-darker flex font-sans text-white">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark border-r border-gray-800 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="p-6 border-b border-gray-800 flex items-center justify-center">
                        <img src="/logo.png" alt="GLO CAR" className="h-12 w-auto" />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                        <SidebarItem icon={ShoppingBag} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                        <SidebarItem icon={Settings} label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
                        <SidebarItem icon={MapPin} label="Locations" active={activeTab === 'locations'} onClick={() => setActiveTab('locations')} />
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center mb-4 px-2">
                            <img src="/admin_pfp.png" alt="Admin" className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">Admin User</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="bg-dark border-b border-gray-800 h-16 flex items-center justify-between px-6">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-400 hover:text-white">
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex items-center space-x-4 ml-auto">
                        <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800">
                            <Bell className="h-5 w-5" />
                        </button>
                        <img src="/admin_pfp.png" alt="Admin" className="h-8 w-8 rounded-full object-cover border border-primary" />
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-darker">
                    {activeTab === 'dashboard' && <DashboardOverview setActiveTab={setActiveTab} />}
                    {activeTab === 'orders' && <OrdersPanel />}
                    {activeTab === 'services' && <ServicesPanel />}
                    {activeTab === 'locations' && <LocationsPanel />}
                </main>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
    >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
    </button>
);

const DashboardOverview = ({ setActiveTab }) => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        confirmed: 0,
        pending: 0,
        recentBookings: [],
        topLocations: []
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/orders`);
            const orders = Array.isArray(res.data) ? res.data : [];

            const totalBookings = orders.length;
            const totalRevenue = orders.reduce((sum, order) => sum + (order.paymentStatus === 'Paid' ? order.amount : 0), 0);
            const confirmed = orders.filter(o => o.status === 'Confirmed' || o.status === 'Completed').length;
            const pending = orders.filter(o => o.status === 'Pending').length;

            // Top Locations Logic
            const locationCounts = orders.reduce((acc, order) => {
                acc[order.city] = (acc[order.city] || 0) + 1;
                return acc;
            }, {});
            const topLocations = Object.entries(locationCounts).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count);

            setStats({
                totalBookings,
                totalRevenue,
                confirmed,
                pending,
                recentBookings: orders.slice(0, 5),
                topLocations
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white font-heading">Dashboard</h2>
                <div className="text-sm text-gray-400">Welcome back, Admin User</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Bookings" value={stats.totalBookings} icon={Calendar} color="bg-blue-500" />
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={Banknote} color="bg-green-500" />
                <StatCard title="Confirmed" value={stats.confirmed} icon={Check} color="bg-purple-500" />
                <StatCard title="Pending" value={stats.pending} icon={Clock} color="bg-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="bg-dark rounded-2xl border border-gray-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-white">Recent Bookings</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-sm text-primary hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {stats.recentBookings.length === 0 ? (
                            <p className="text-gray-500 text-sm">No bookings yet.</p>
                        ) : (
                            stats.recentBookings.map(order => (
                                <div key={order._id} className="flex justify-between items-center p-3 bg-darker rounded-xl border border-gray-800/50">
                                    <div>
                                        <p className="font-medium text-white text-sm">{order.customerName}</p>
                                        <p className="text-xs text-gray-500">{order.serviceName}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase ${order.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                        order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Locations */}
                <div className="bg-dark rounded-2xl border border-gray-800 p-6">
                    <h3 className="font-bold text-lg text-white mb-6">Top Locations</h3>
                    <div className="space-y-4">
                        {stats.topLocations.length === 0 ? (
                            <p className="text-gray-500 text-sm">No location data yet.</p>
                        ) : (
                            stats.topLocations.map((loc, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-darker rounded-xl border border-gray-800/50">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-white">{loc.city}</span>
                                    </div>
                                    <span className="text-xl font-bold text-white">{loc.count}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-dark rounded-2xl border border-gray-800 p-6 flex items-center justify-between">
        <div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white font-heading">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-20 flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
    </div>
);

// --- Existing Panels (Orders, Services) ---

const OrdersPanel = () => {
    const [orders, setOrders] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/orders`);
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setOrders([]);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.put(`${API_URL}/api/orders/${id}`, { status });
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    const downloadCSV = () => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        let url = `${API_URL}/api/orders/csv`;
        if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        window.open(url, '_blank');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white font-heading">Orders</h2>
                <div className="flex space-x-4">
                    <input type="date" onChange={(e) => setStartDate(e.target.value)} className="bg-dark border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
                    <input type="date" onChange={(e) => setEndDate(e.target.value)} className="bg-dark border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
                    <button onClick={downloadCSV} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">
                        <Download className="h-4 w-4 mr-2" /> CSV
                    </button>
                </div>
            </div>

            <div className="bg-dark rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Service</th>
                            <th className="p-4">Payment</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {Array.isArray(orders) && orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order._id} className="text-gray-300 hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 font-mono text-xs text-gray-500">#{order._id.slice(-6)}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-white text-sm">{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">{order.serviceName}</div>
                                        <div className="text-xs text-gray-500">₹{order.amount}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            {order.paymentMethod === 'Razorpay' ? (
                                                <CreditCard className="h-3 w-3 text-blue-400" />
                                            ) : (
                                                <Banknote className="h-3 w-3 text-green-400" />
                                            )}
                                            <span className="text-xs">{order.paymentMethod}</span>
                                        </div>
                                        <span className={`text-[10px] uppercase ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${order.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                                            order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                'bg-blue-500/20 text-blue-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center space-x-2">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-1.5 bg-gray-700/50 rounded-lg hover:bg-primary hover:text-white text-gray-400 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <div className="relative">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className="bg-darker border border-gray-700 rounded-lg px-2 py-1 text-xs focus:outline-none appearance-none pr-6 cursor-pointer hover:border-gray-500"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-dark border border-gray-800 rounded-2xl p-8 w-full max-w-2xl relative shadow-2xl">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <h3 className="text-2xl font-bold text-white mb-6 font-heading">Order Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-1">Customer</h4>
                                    <p className="text-white font-medium">{selectedOrder.customerName}</p>
                                    <p className="text-gray-400 text-sm">{selectedOrder.customerEmail}</p>
                                    <p className="text-gray-400 text-sm">{selectedOrder.customerPhone}</p>
                                </div>
                                <div>
                                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-1">Service</h4>
                                    <p className="text-white font-medium">{selectedOrder.serviceName}</p>
                                    <p className="text-primary font-bold">₹{selectedOrder.amount}</p>
                                </div>
                                <div>
                                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-1">Appointment</h4>
                                    <p className="text-white font-medium">{new Date(selectedOrder.appointmentDate).toDateString()}</p>
                                    <p className="text-white font-medium">{selectedOrder.appointmentTime}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-1">Car Details</h4>
                                    <p className="text-white font-medium">{selectedOrder.carDetails?.make} {selectedOrder.carDetails?.model} ({selectedOrder.carDetails?.year})</p>
                                    <p className="text-gray-400 text-sm">{selectedOrder.carDetails?.plateNumber}</p>
                                </div>
                                <div>
                                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-1">Address</h4>
                                    <p className="text-white text-sm leading-relaxed">{selectedOrder.address}</p>
                                    <p className="text-gray-400 text-sm">{selectedOrder.city}</p>
                                </div>
                                <div>
                                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-1">Payment Info</h4>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-white font-medium">{selectedOrder.paymentMethod}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${selectedOrder.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                            {selectedOrder.paymentStatus}
                                        </span>
                                    </div>
                                    {selectedOrder.paymentMethod === 'Razorpay' && selectedOrder.razorpayPaymentId && (
                                        <p className="text-gray-500 text-xs font-mono">ID: {selectedOrder.razorpayPaymentId}</p>
                                    )}
                                    {selectedOrder.paymentMethod === 'COD' && selectedOrder.paymentStatus === 'Pending' && (
                                        <p className="text-yellow-500 text-xs">Payment Remaining: ₹{selectedOrder.amount}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ServicesPanel = () => {
    const [services, setServices] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/services`);
            setServices(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setServices([]);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.delete(`${API_URL}/api/services/${id}`);
            fetchServices();
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.features = data.features.split(',').map(s => s.trim());
        data.availableLocations = data.availableLocations.split(',').map(s => s.trim());

        if (currentService) {
            await axios.put(`http://localhost:5000/api/services/${currentService._id}`, data);
        } else {
            await axios.post('http://localhost:5000/api/services', data);
        }
        setIsEditing(false);
        setCurrentService(null);
        fetchServices();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white font-heading">Services</h2>
                <button
                    onClick={() => { setCurrentService(null); setIsEditing(true); }}
                    className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Service
                </button>
            </div>

            {isEditing ? (
                <div className="bg-dark p-8 rounded-2xl border border-gray-800 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 font-heading">{currentService ? 'Edit Service' : 'Add New Service'}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <input name="title" defaultValue={currentService?.title} placeholder="Service Title" required className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none" />
                        <textarea name="description" defaultValue={currentService?.description} placeholder="Description" required className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none" />
                        <input name="price" type="number" defaultValue={currentService?.price} placeholder="Price" required className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none" />
                        <input name="image" defaultValue={currentService?.image} placeholder="Image URL" required className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none" />
                        <input name="features" defaultValue={currentService?.features.join(', ')} placeholder="Features (comma separated)" required className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none" />
                        <input name="availableLocations" defaultValue={currentService?.availableLocations.map(loc => typeof loc === 'object' ? loc.city : loc).join(', ')} placeholder="Locations (comma separated: Ahmedabad, Surat)" required className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none" />

                        <div className="flex space-x-4 pt-4">
                            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">Save Service</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors">Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(services) && services.length > 0 ? (
                        services.map(service => (
                            <div key={service._id} className="bg-dark p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-white text-lg">{service.title}</h3>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setCurrentService(service); setIsEditing(true); }} className="p-2 bg-gray-800 rounded-lg text-blue-400 hover:text-white hover:bg-blue-500 transition-colors"><Edit className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(service._id)} className="p-2 bg-gray-800 rounded-lg text-red-400 hover:text-white hover:bg-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </div>
                                <p className="text-primary font-bold text-xl mb-2">₹{service.price}</p>
                                <p className="text-gray-500 text-xs bg-darker inline-block px-2 py-1 rounded-md">
                                    {service.availableLocations.map(loc => typeof loc === 'object' ? loc.city : loc).join(', ')}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center text-gray-500 py-10">
                            No services found or failed to load.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const LocationsPanel = () => {
    const [locations, setLocations] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newLocation, setNewLocation] = useState({ city: '', areas: '' });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/locations`);
            setLocations(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setLocations([]);
        }
    };

    const handleAddLocation = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const areasArray = newLocation.areas.split(',').map(area => area.trim());
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${API_URL}/api/locations`, {
                city: newLocation.city,
                areas: areasArray
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAdding(false);
            setNewLocation({ city: '', areas: '' });
            fetchLocations();
        } catch (err) {
            console.error(err);
            alert('Failed to add location');
        }
    };

    const handleDeleteLocation = async (id) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
            try {
                const token = localStorage.getItem('adminToken');
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                await axios.delete(`${API_URL}/api/locations/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchLocations();
            } catch (err) {
                console.error(err);
                alert('Failed to delete location');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white font-heading">Locations</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Location
                </button>
            </div>

            {isAdding && (
                <div className="bg-dark p-8 rounded-2xl border border-gray-800 shadow-xl mb-8">
                    <h3 className="text-xl font-bold text-white mb-6 font-heading">Add New Location</h3>
                    <form onSubmit={handleAddLocation} className="space-y-4">
                        <input
                            value={newLocation.city}
                            onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                            placeholder="City Name"
                            required
                            className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none"
                        />
                        <input
                            value={newLocation.areas}
                            onChange={(e) => setNewLocation({ ...newLocation, areas: e.target.value })}
                            placeholder="Areas (comma separated)"
                            required
                            className="w-full bg-darker border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:outline-none"
                        />
                        <div className="flex space-x-4 pt-4">
                            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">Save Location</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(locations) && locations.map(loc => (
                    <div key={loc._id} className="bg-dark p-6 rounded-2xl border border-gray-800 relative group">
                        <button
                            onClick={() => handleDeleteLocation(loc._id)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-4">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{loc.city}</h3>
                                <p className="text-gray-500 text-sm">{loc.areas.length} Areas Covered</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {loc.areas.slice(0, 3).map((area, idx) => (
                                <span key={idx} className="text-xs bg-darker text-gray-400 px-2 py-1 rounded">
                                    {area}
                                </span>
                            ))}
                            {loc.areas.length > 3 && (
                                <span className="text-xs text-gray-500 px-2 py-1">+{loc.areas.length - 3} more</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
