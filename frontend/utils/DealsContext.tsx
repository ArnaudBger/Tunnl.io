import React, { useState, useEffect, useCallback, createContext } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DEALS_BY_INFLUENCER } from '../queries/getUserDeals';

export const DealsContext = createContext({
    deals: [],
    loading: true,
    error: null
});

export const DealsProvider = ({ children, wallet }) => {
    const influencerId = wallet ? wallet.toLowerCase() : '';

    const { data, loading, error, refetch } = useQuery(GET_DEALS_BY_INFLUENCER, {
        variables: { influencerId },
        fetchPolicy: 'network-only'
    });

    const [deals, setDeals] = useState([]);

    useEffect(() => {
        if (data && data.user && data.user.dealsAsInfluencer) {
            setDeals(data.user.dealsAsInfluencer);
        }
    }, [data]);

    // Function to completely refetch deals
    const updateDeals = useCallback(() => {
        console.log("DealsProvider: completely refetching deals");
        refetch({ influencerId }) // Refetch with the same variables but ensure it goes to the network
            .then(updatedData => {
                console.log("DealsProvider: refetched data", updatedData);
            })
            .catch(error => {
                console.error("DealsProvider: error during refetch", error);
            });
    }, [refetch, influencerId]);

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
