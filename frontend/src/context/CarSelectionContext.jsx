import React, { createContext, useState, useContext, useEffect } from 'react';

const CarSelectionContext = createContext();

export const useCarSelection = () => useContext(CarSelectionContext);

export const CarSelectionProvider = ({ children }) => {
    const [carType, setCarType] = useState(localStorage.getItem('carType') || null);
    const [selectedBrand, setSelectedBrand] = useState(JSON.parse(localStorage.getItem('selectedBrand')) || null);
    const [selectedModel, setSelectedModel] = useState(JSON.parse(localStorage.getItem('selectedModel')) || null);
    const [isCarModalOpen, setIsCarModalOpen] = useState(false);

    useEffect(() => {
        if (carType) localStorage.setItem('carType', carType);
        else localStorage.removeItem('carType');

        if (selectedBrand) localStorage.setItem('selectedBrand', JSON.stringify(selectedBrand));
        else localStorage.removeItem('selectedBrand');

        if (selectedModel) localStorage.setItem('selectedModel', JSON.stringify(selectedModel));
        else localStorage.removeItem('selectedModel');
    }, [carType, selectedBrand, selectedModel]);

    const selectCarModel = (brand, model) => {
        setSelectedBrand(brand);
        setSelectedModel(model);
        setCarType(model.type); // Derive car type from model
        setIsCarModalOpen(false);
    };

    const openCarModal = () => {
        setIsCarModalOpen(true);
    };

    const closeCarModal = () => {
        setIsCarModalOpen(false);
    };

    return (
        <CarSelectionContext.Provider value={{
            carType,
            selectedBrand,
            selectedModel,
            selectCarModel,
            isCarModalOpen,
            openCarModal,
            closeCarModal
        }}>
            {children}
        </CarSelectionContext.Provider>
    );
};
