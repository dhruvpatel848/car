import React, { createContext, useState, useEffect, useContext } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [city, setCity] = useState(localStorage.getItem('userCity') || null);
    const [isModalOpen, setIsModalOpen] = useState(!localStorage.getItem('userCity'));

    const updateCity = (newCity) => {
        setCity(newCity);
        localStorage.setItem('userCity', newCity);
        setIsModalOpen(false);
    };

    const openLocationModal = () => {
        setIsModalOpen(true);
    };

    return (
        <LocationContext.Provider value={{ city, updateCity, isModalOpen, setIsModalOpen, openLocationModal }}>
            {children}
        </LocationContext.Provider>
    );
};
