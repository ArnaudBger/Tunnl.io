import React, { createContext, useContext, useState, useEffect } from 'react';

import "@ethersproject/shims"
import { ethers, JsonRpcProvider} from "ethers";


const Web3Context = createContext(null);

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initWeb3 = () => {
      const web3Provider = new JsonRpcProvider("https://virulent-methodical-fire.ethereum-sepolia.quiknode.pro/8a036bae16c1e82885836ef28400854986f06d03/");
      setProvider(web3Provider);
    };

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={provider}>
      {children}
    </Web3Context.Provider>
  );
};
