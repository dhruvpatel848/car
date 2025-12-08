import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Search, Car } from 'lucide-react';
import { useCarSelection } from '../context/CarSelectionContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CarSelectionModal = () => {
    const { isCarModalOpen, closeCarModal, selectCarModel } = useCarSelection();
    const navigate = useNavigate();

    const [step, setStep] = useState('brand'); // 'brand' or 'model'
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Brands on Open
    useEffect(() => {
        if (isCarModalOpen) {
            setStep('brand');
            setSearchTerm('');
            fetchBrands();
        }
    }, [isCarModalOpen]);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || 'https://car-9hr9.onrender.com';
            const res = await axios.get(`${API_URL}/api/cars/brands`);
            setBrands(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBrandSelect = async (brand) => {
        setSelectedBrand(brand);
        setStep('model');
        setSearchTerm('');
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || 'https://car-9hr9.onrender.com';
            const res = await axios.get(`${API_URL}/api/cars/models/${brand._id}`);
            setModels(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleModelSelect = (model) => {
        selectCarModel(selectedBrand, model);
        navigate('/services');
    };

    const handleBack = () => {
        setStep('brand');
        setSearchTerm('');
        setSelectedBrand(null);
    };

    const filteredItems = step === 'brand'
        ? brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : models.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!isCarModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-dark border border-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-4xl relative shadow-2xl transform transition-all scale-100 h-[80vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        {step === 'model' && (
                            <button onClick={handleBack} className="mr-4 text-gray-400 hover:text-white transition-colors">
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">
                                {step === 'brand' ? 'Select Car Brand' : `Select ${selectedBrand?.name} Model`}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {step === 'brand' ? 'Choose your vehicle manufacturer' : 'Which model do you drive?'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={closeCarModal}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                        type="text"
                        placeholder={step === 'brand' ? "Search Brand..." : "Search Model..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-darker border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:outline-none"
                    />
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredItems.map((item) => (
                                <button
                                    key={item._id}
                                    onClick={() => step === 'brand' ? handleBrandSelect(item) : handleModelSelect(item)}
                                    // Removed border classes: border border-gray-800 hover:border-primary/50
                                    className="group flex flex-col items-center p-4 rounded-2xl bg-darker hover:bg-gray-800 transition-all duration-300"
                                >
                                    <div className="w-16 h-16 mb-3 flex items-center justify-center">
                                        {item.logo || item.image ? (
                                            <img src={item.logo || item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <Car className="h-10 w-10 text-gray-600" />
                                        )}
                                    </div>
                                    <span className="font-bold text-white text-center group-hover:text-primary transition-colors">{item.name}</span>
                                    {step === 'model' && (
                                        <span className="text-xs text-gray-500 mt-1 uppercase">{item.type}</span>
                                    )}
                                </button>
                            ))}
                            {filteredItems.length === 0 && (
                                <div className="col-span-full text-center py-10 text-gray-500">
                                    No results found.
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CarSelectionModal;
