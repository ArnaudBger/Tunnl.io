import React, { createContext, useContext, useState } from 'react';

const TransactionContext = createContext();

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('pending');
  const [transactionHash, setTransactionHash] = useState('');

  const startTransaction = () => {
    setTransactionHash('')
    setIsModalVisible(true);
    setTransactionStatus('pending');
  };

  const endTransaction = (status, hash) => {
    setTransactionStatus(status);
    setTransactionHash(hash);
    setTimeout(() => setIsModalVisible(false), 3000); // Close modal after 3 seconds
  };

  return (
    <TransactionContext.Provider value={{ isModalVisible, transactionStatus, transactionHash, startTransaction, endTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};
