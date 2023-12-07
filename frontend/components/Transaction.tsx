import React from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTransaction } from '../utils/TransactionContext';

const TransactionModal = () => {
  const { isModalVisible, transactionStatus, transactionHash } = useTransaction();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {transactionStatus === 'pending' && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          <Text style={styles.modalText}>
            Transaction Status: {transactionStatus.charAt(0).toUpperCase() + transactionStatus.slice(1)}
          </Text>
          {transactionHash && (
            <Text style={styles.modalText}>
              Transaction Hash: {transactionHash}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center'
  }
});

export default TransactionModal;
