import React, { useState, useEffect, useCallback, createContext} from 'react';
import { useQuery } from '@apollo/client';
import { GET_DEALS_QUERY } from '../queries/getUserDeals';


export const DealsContext = createContext({
    deals: [],
    loading: true,
    error: null
});

export const DealsProvider = ({ children }) => {
    const { loading, error, data, refetch } = useQuery(GET_DEALS_QUERY);
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        if (data && data.deals) {
            setDeals(data.deals);
        }
    }, [data]);

    // Function to update deals
    const updateDeals = useCallback(() => {
        refetch();
    }, [refetch]);

    // Context value includes both data and functions to manipulate it
    const contextValue = {
        deals,
        loading,
        error,
        updateDeals 
    };

    return (
        <DealsContext.Provider value={contextValue}>
            {children}
        </DealsContext.Provider>
    );
};
