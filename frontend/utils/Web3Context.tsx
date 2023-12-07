import React, { createContext, useContext, useState, useEffect } from 'react';

import "@ethersproject/shims"
import { ethers, JsonRpcProvider} from "ethers";


const Web3Context = createContext(null);

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initWeb3 = () => {
      const web3Provider = new JsonRpcProvider("https://autumn-old-asphalt.avalanche-testnet.quiknode.pro/16128feba576c573fdc199c73c4ba1aa35490344/ext/bc/C/rpc/");
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
