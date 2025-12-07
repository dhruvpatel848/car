import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingBag, Settings, LogOut, Download, Plus, Trash2, Edit, Eye, X,
    CreditCard, Banknote, MapPin, Menu, Bell, Search, ChevronDown, User, Calendar, Check, Clock, DollarSign, Car
} from 'lucide-react';

// --- CARS PANEL ---
const CarsPanel = () => {
    const [activeTab, setActiveTab] = useState('brands'); // 'brands' or 'models'
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(false);

    // Brand State
    const [newBrand, setNewBrand] = useState({ name: '', logo: '', logoFile: null });
    const [editingBrand, setEditingBrand] = useState(null);

    // Model State
    const [newModel, setNewModel] = useState({ name: '', brand: '', type: 'hatchback', segment: '', image: '', imageFile: null });
    const [editingModel, setEditingModel] = useState(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        if (activeTab === 'models' && brands.length > 0 && !newModel.brand && !editingModel) {
            setNewModel(prev => ({ ...prev, brand: brands[0]._id }));
        }
    }, [activeTab, brands, editingModel]);

    useEffect(() => {
        if (newModel.brand) {
            fetchModels(newModel.brand);
        }
    }, [newModel.brand]);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/cars/brands?t=${Date.now()}`);
            setBrands(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchModels = async (brandId) => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/cars/models/${brandId}?t=${Date.now()}`);
            setModels(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- BRAND HANDLERS ---
    const handleSaveBrand = async (e) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const formData = new FormData();
            formData.append('name', newBrand.name);
            if (newBrand.logoFile) {
                formData.append('logo', newBrand.logoFile);
            } else {
                formData.append('logo', newBrand.logo);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editingBrand) {
                await axios.put(`${API_URL}/api/cars/brands/${editingBrand._id}`, formData, config);
                alert('Brand updated successfully');
            } else {
                await axios.post(`${API_URL}/api/cars/brands`, formData, config);
                alert('Brand added successfully');
            }
            setNewBrand({ name: '', logo: '', logoFile: null });
            setEditingBrand(null);
            fetchBrands();
            // Reset file input if possible, or just rely on state reset
        } catch (err) {
            console.error(err);
            alert('Failed to save brand');
        }
    };

    const handleEditBrand = (brand) => {
        setEditingBrand(brand);
        setNewBrand({ name: brand.name, logo: brand.logo, logoFile: null });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelBrandEdit = () => {
        setEditingBrand(null);
        setNewBrand({ name: '', logo: '', logoFile: null });
    };

    const handleDeleteBrand = async (id) => {
        if (!window.confirm('Are you sure? This will delete all associated models.')) return;
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.delete(`${API_URL}/api/cars/brands/${id}`);
            fetchBrands();
        } catch (err) {
            console.error(err);
            alert('Failed to delete brand');
        }
    };

    // --- MODEL HANDLERS ---
    const handleSaveModel = async (e) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const formData = new FormData();
            formData.append('name', newModel.name);
            formData.append('brand', newModel.brand);
            formData.append('type', newModel.type);
            formData.append('segment', newModel.segment);

            if (newModel.imageFile) {
                formData.append('image', newModel.imageFile);
            } else {
                formData.append('image', newModel.image);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editingModel) {
                await axios.put(`${API_URL}/api/cars/models/${editingModel._id}`, formData, config);
                alert('Model updated successfully');
            } else {
                await axios.post(`${API_URL}/api/cars/models`, formData, config);
                alert('Model added successfully');
            }

            // Refresh models
            fetchModels(newModel.brand);

            // Reset form but keep brand selected if adding new
            if (editingModel) {
                setEditingModel(null);
                setNewModel({ name: '', brand: newModel.brand, type: 'hatchback', segment: '', image: '', imageFile: null });
            } else {
                setNewModel(prev => ({ ...prev, name: '', image: '', imageFile: null }));
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save model');
        }
    };

    const handleEditModel = (model) => {
        setEditingModel(model);
        setNewModel({
            name: model.name,
            brand: model.brand,
            type: model.type,
            segment: model.segment,
            image: model.image || '',
            imageFile: null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelModelEdit = () => {
        setEditingModel(null);
        // Reset to default state, keeping current brand if possible
        setNewModel({ name: '', brand: newModel.brand || (brands[0]?._id || ''), type: 'hatchback', segment: '', image: '', imageFile: null });
    };

    const handleDeleteModel = async (id, brandId) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.delete(`${API_URL}/api/cars/models/${id}`);
            if (brandId) fetchModels(brandId);
            else if (newModel.brand) fetchModels(newModel.brand);
        } catch (err) {
            console.error(err);
            alert('Failed to delete model');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 font-heading">Car Management</h2>

            <div className="flex space-x-4 mb-8 border-b border-gray-700 pb-4">
                <button
                    onClick={() => setActiveTab('brands')}
                    className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'brands' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    Brands
                </button>
                <button
                    onClick={() => setActiveTab('models')}
                    className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'models' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    Models
                </button>
            </div>

            {activeTab === 'brands' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add/Edit Brand Form */}
                    <div className="bg-darker p-6 rounded-2xl border border-gray-700 h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
                            {editingBrand && (
                                <button onClick={handleCancelBrandEdit} className="text-sm text-gray-400 hover:text-white">Cancel</button>
                            )}
                        </div>
                        <form onSubmit={handleSaveBrand} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Brand Name</label>
                                <input
                                    value={newBrand.name}
                                    onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                                    className="w-full bg-dark border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Brand Logo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setNewBrand({ ...newBrand, logoFile: file, logo: URL.createObjectURL(file) });
                                        }
                                    }}
                                    className="w-full bg-dark border border-gray-700 rounded-xl p-2 text-white text-sm"
                                />
                                {newBrand.logo && (
                                    <img src={newBrand.logo} alt="Preview" className="mt-2 h-16 w-auto object-contain bg-white rounded p-1" />
                                )}
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors">
                                {editingBrand ? 'Update Brand' : 'Add Brand'}
                            </button>
                        </form>
                    </div>

                    {/* Brands List */}
                    <div className="space-y-4">
                        {brands.map(brand => (
                            <div key={brand._id} className="bg-darker p-4 rounded-xl border border-gray-700 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <img src={brand.logo} alt={brand.name} className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
                                    <span className="font-bold text-lg">{brand.name}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditBrand(brand)}
                                        className="text-blue-500 hover:text-blue-400 p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBrand(brand._id)}
                                        className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add/Edit Model Form */}
                    <div className="bg-darker p-6 rounded-2xl border border-gray-700 h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingModel ? 'Edit Model' : 'Add New Model'}</h3>
                            {editingModel && (
                                <button onClick={handleCancelModelEdit} className="text-sm text-gray-400 hover:text-white">Cancel</button>
                            )}
                        </div>
                        <form onSubmit={handleSaveModel} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Select Brand</label>
                                <select
                                    value={newModel.brand}
                                    onChange={(e) => setNewModel({ ...newModel, brand: e.target.value })}
                                    className="w-full bg-dark border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                                    required
                                    disabled={!!editingModel} // Disable brand change during edit for simplicity, or enable if backend supports it
                                >
                                    {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Model Name</label>
                                <input
                                    value={newModel.name}
                                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                                    className="w-full bg-dark border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Segment</label>
                                <select
                                    value={newModel.segment || ''}
                                    onChange={(e) => {
                                        const seg = e.target.value;
                                        let type = 'hatchback';
                                        if (seg.includes('Sedan')) type = 'sedan';
                                        if (seg.includes('SUV')) type = 'suv';
                                        if (seg.includes('Luxury')) type = 'luxury';
                                        setNewModel({ ...newModel, segment: seg, type: type });
                                    }}
                                    className="w-full bg-dark border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                                    required
                                >
                                    <option value="">Select Segment</option>
                                    {[
                                        'Hatchback', 'Premium Hatchback',
                                        'Compact Sedan', 'Mid-size Sedan', 'Executive Sedan',
                                        'Compact SUV', 'Mid-size SUV', 'Full-size SUV',
                                        'Entry Luxury', 'Executive Luxury', 'Premium Luxury'
                                    ].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Car Model Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setNewModel({ ...newModel, imageFile: file, image: URL.createObjectURL(file) });
                                        }
                                    }}
                                    className="w-full bg-dark border border-gray-700 rounded-xl p-2 text-white text-sm"
                                />
                                {newModel.image && (
                                    <img src={newModel.image} alt="Preview" className="mt-2 h-16 w-auto object-cover rounded" />
                                )}
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors">
                                {editingModel ? 'Update Model' : 'Add Model'}
                            </button>
                        </form>
                    </div>

                    {/* Models List */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-400">Models for selected brand</h3>
                        </div>
                        {models.length > 0 ? (
                            models.map(model => (
                                <div key={model._id} className="bg-darker p-4 rounded-xl border border-gray-700 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {model.image && <img src={model.image} alt={model.name} className="w-16 h-10 object-cover rounded" />}
                                        <div>
                                            <span className="font-bold text-lg block">{model.name}</span>
                                            <span className="text-xs text-primary uppercase font-bold">{model.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditModel(model)}
                                            className="text-blue-500 hover:text-blue-400 p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteModel(model._id, model.brand)}
                                            className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No models found for this brand.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- SERVICES PANEL ---
const ServicesPanel = () => {
    const [services, setServices] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        duration: '',
        features: '',
        image: null,
        availableLocations: [],
        pricingRules: {}
    });
    const [previewImage, setPreviewImage] = useState('');

    const segments = [
        'Hatchback', 'Premium Hatchback',
        'Compact Sedan', 'Mid-size Sedan', 'Executive Sedan',
        'Compact SUV', 'Mid-size SUV', 'Full-size SUV',
        'Entry Luxury', 'Executive Luxury', 'Premium Luxury'
    ];

    useEffect(() => {
        fetchServices();
        fetchLocations();
    }, []);

    const fetchServices = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/services?t=${Date.now()}`);
            setServices(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchLocations = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/locations`);
            setLocations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('basePrice', Number(formData.price));
            data.append('price', Number(formData.price));
            data.append('duration', formData.duration);
            data.append('features', formData.features);
            data.append('availableLocations', JSON.stringify(formData.availableLocations));
            data.append('pricingRules', JSON.stringify(formData.pricingRules));

            if (formData.image instanceof File) {
                data.append('image', formData.image);
            } else if (typeof formData.image === 'string' && formData.image) {
                data.append('image', formData.image);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editingService) {
                await axios.put(`${API_URL}/api/services/${editingService._id}`, data, config);
            } else {
                await axios.post(`${API_URL}/api/services`, data, config);
            }
            setIsModalOpen(false);
            setEditingService(null);
            setFormData({ title: '', description: '', price: '', duration: '', features: '', image: null, availableLocations: [], pricingRules: {} });
            setPreviewImage('');
            fetchServices();
        } catch (err) {
            console.error(err);
            alert('Failed to save service');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.delete(`${API_URL}/api/services/${id}`);
            fetchServices();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description,
            price: service.basePrice,
            duration: service.duration || '45 mins',
            features: service.features.join(', '),
            image: service.image,
            availableLocations: service.availableLocations.map(loc => typeof loc === 'object' ? loc.city : loc),
            pricingRules: service.pricingRules || {}
        });
        setPreviewImage(service.image);
        setIsModalOpen(true);
    };

    const toggleLocation = (city) => {
        setFormData(prev => {
            const current = prev.availableLocations;
            if (current.includes(city)) {
                return { ...prev, availableLocations: current.filter(c => c !== city) };
            } else {
                return { ...prev, availableLocations: [...current, city] };
            }
        });
    };

    const handlePricingRuleChange = (segment, price) => {
        setFormData(prev => ({
            ...prev,
            pricingRules: {
                ...prev.pricingRules,
                [segment]: Number(price)
            }
        }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white font-heading">Services</h2>
                <button
                    onClick={() => {
                        setEditingService(null);
                        setFormData({ title: '', description: '', price: '', duration: '', features: '', image: null, availableLocations: [], pricingRules: {} });
                        setPreviewImage('');
                        setIsModalOpen(true);
                    }}
                    className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" /> Add Service
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div key={service._id} className="bg-dark rounded-2xl border border-gray-800 overflow-hidden group hover:border-primary/50 transition-all">
                        <div className="h-48 overflow-hidden relative">
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <button onClick={() => handleEdit(service)} className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-primary transition-colors"><Edit className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(service._id)} className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-primary font-bold text-lg">Starts ₹{service.basePrice}</span>
                                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{service.duration || '45 mins'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-dark border border-gray-800 rounded-2xl p-8 w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
                        <h3 className="text-2xl font-bold text-white mb-6 font-heading">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-darker border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none" required />
                                <input placeholder="Base Price" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="bg-darker border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Duration (e.g. 45 mins)" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="bg-darker border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none" required />
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Service Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setFormData({ ...formData, image: file });
                                                setPreviewImage(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="bg-darker border border-gray-700 rounded-xl p-2 text-white w-full text-sm"
                                    />
                                    {previewImage && (
                                        <img src={previewImage} alt="Preview" className="mt-2 h-16 w-auto rounded border border-gray-600" />
                                    )}
                                </div>
                            </div>
                            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-darker border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none" rows="3" required />
                            <input placeholder="Features (comma separated)" value={formData.features} onChange={e => setFormData({ ...formData, features: e.target.value })} className="w-full bg-darker border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none" required />

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Available Locations</label>
                                <div className="flex flex-wrap gap-2">
                                    {locations.map(loc => (
                                        <button
                                            key={loc._id}
                                            type="button"
                                            onClick={() => toggleLocation(loc.city)}
                                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${formData.availableLocations.includes(loc.city) ? 'bg-primary border-primary text-white' : 'bg-darker border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                        >
                                            {loc.city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-700 pt-4 mt-4">
                                <label className="block text-gray-400 text-sm mb-4 font-bold">Segment Pricing Rules (Overrides Base Price)</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {segments.map(segment => (
                                        <div key={segment} className="flex flex-col">
                                            <label className="text-xs text-gray-500 mb-1">{segment}</label>
                                            <input
                                                type="number"
                                                placeholder={`Price for ${segment}`}
                                                value={formData.pricingRules[segment] || ''}
                                                onChange={(e) => handlePricingRuleChange(segment, e.target.value)}
                                                className="bg-darker border border-gray-700 rounded-lg p-2 text-white text-sm focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors mt-6">
                                {editingService ? 'Update Service' : 'Create Service'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- PRICING PANEL ---
const PricingPanel = () => {
    const [settings, setSettings] = useState({
        charge_hatchback: 0,
        charge_sedan: 0,
        charge_suv: 0,
        charge_luxury: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/settings`);
            if (res.data) {
                setSettings(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: parseInt(e.target.value) || 0 });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.put(`${API_URL}/api/settings`, settings);
            alert('Pricing updated successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to update pricing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 font-heading">Dynamic Pricing Configuration</h2>
            <div className="bg-darker p-8 rounded-2xl border border-gray-700 max-w-4xl">
                <p className="text-gray-400 mb-6">Set additional charges for different car segments. These will be added to the base service price if no specific pricing rule exists.</p>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            'Hatchback', 'Premium Hatchback',
                            'Compact Sedan', 'Mid-size Sedan', 'Executive Sedan',
                            'Compact SUV', 'Mid-size SUV', 'Full-size SUV',
                            'Entry Luxury', 'Executive Luxury', 'Premium Luxury'
                        ].map(segment => {
                            const key = `charge_${segment.replace(/ /g, '_')}`;
                            return (
                                <div key={key}>
                                    <label className="block text-gray-400 text-sm mb-2">{segment} Extra Charge (₹)</label>
                                    <input
                                        type="number"
                                        name={key}
                                        value={settings[key] || 0}
                                        onChange={handleChange}
                                        className="w-full bg-dark border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- LOCATIONS PANEL ---
const LocationsPanel = () => {
    const [locations, setLocations] = useState([]);
    const [newCity, setNewCity] = useState('');

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/locations`);
            setLocations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${API_URL}/api/locations`, { city: newCity });
            setNewCity('');
            fetchLocations();
        } catch (err) {
            console.error(err);
            alert('Failed to add location');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.delete(`${API_URL}/api/locations/${id}`);
            fetchLocations();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white font-heading mb-8">Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-dark rounded-2xl border border-gray-800 p-6 h-fit">
                    <h3 className="text-lg font-bold text-white mb-4">Add New Location</h3>
                    <form onSubmit={handleAdd} className="flex gap-4">
                        <input
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            placeholder="City Name"
                            className="flex-1 bg-darker border border-gray-700 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                            required
                        />
                        <button type="submit" className="bg-primary hover:bg-blue-600 text-white px-6 rounded-xl font-bold transition-colors">
                            Add
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    {locations.map(loc => (
                        <div key={loc._id} className="bg-dark rounded-xl border border-gray-800 p-4 flex justify-between items-center">
                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 text-primary mr-3" />
                                <span className="font-medium text-white">{loc.city}</span>
                            </div>
                            <button onClick={() => handleDelete(loc._id)} className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        confirmed: 0,
        pending: 0,
        recentBookings: [],
        topLocations: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) navigate('/admin/login');
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
                        <SidebarItem icon={Banknote} label="Pricing" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
                        <SidebarItem icon={Car} label="Cars" active={activeTab === 'cars'} onClick={() => setActiveTab('cars')} />
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
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'dashboard' && (
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
                    )}
                    {activeTab === 'orders' && <OrdersPanel />}
                    {activeTab === 'services' && <ServicesPanel />}
                    {activeTab === 'locations' && <LocationsPanel />}
                    {activeTab === 'pricing' && <PricingPanel />}
                    {activeTab === 'cars' && <CarsPanel />}
                </main>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
    </button>
);

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

    const updateStatus = async (id, status, adminNote) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const payload = {};
            if (status) payload.status = status;
            if (adminNote !== undefined) payload.adminNote = adminNote;

            await axios.put(`${API_URL}/api/orders/${id}`, payload);
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
                                    <td className="p-4 font-mono text-xs text-gray-500">#{order.orderId}</td>
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
                                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-1">Payment</h4>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-white font-medium">{selectedOrder.paymentMethod}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${selectedOrder.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                            {selectedOrder.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-1">Tracking Note (Visible to User)</h4>
                                    <textarea
                                        className="w-full bg-darker border border-gray-700 rounded-lg p-2 text-white text-sm focus:border-primary focus:outline-none"
                                        rows="3"
                                        placeholder="Add details about the order status..."
                                        defaultValue={selectedOrder.adminNote || ''}
                                        onBlur={(e) => updateStatus(selectedOrder._id, undefined, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
