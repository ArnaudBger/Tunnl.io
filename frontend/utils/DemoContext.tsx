// DemoStageContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const DemoStageContext = createContext();

// Create a provider component
export const DemoStageProvider = ({ children }) => {
    const [demoStage, setDemoStage] = useState("0");
    const [demoDealID, setDemoDealID] = useState(null);

    return (
        <DemoStageContext.Provider value={{ demoStage, setDemoStage, demoDealID, setDemoDealID }}>
            {children}
        </DemoStageContext.Provider>
    );
};

// Hook to use the context
export const useDemoStage = () => {
    const context = useContext(DemoStageContext);
    if (!context) {
        throw new Error('useDemoStage must be used within a DemoStageProvider');
    }
    return context;
};
