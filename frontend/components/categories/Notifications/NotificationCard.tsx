import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"
import { ethers } from 'ethers';
import { useWeb3 } from '../../../utils/Web3Context'; // Adjust the path as needed
import {contractAddress, contractABI} from '../../../utils/contractInfo'
import React, { useState } from 'react';

export default function NotificationCard({
    type = "mintStableCoin",
    iconName ="logo-bitcoin",
    brand = "",
    time = "",
    userPrivateKey="ecbbf75c6176b50e33cb6b86206958c183ae5754d4b6ee16ac566631a09609ab"
}
) {

const [isLoading, setIsLoading] = useState(false);


const provider = useWeb3();

  const handleNotificationClick = async () => {
    setIsLoading(true);
    if (type === "mintStableCoin" && provider) {
      try {
        // Create a wallet instance using the private key and provider
        const wallet = new ethers.Wallet(userPrivateKey, provider);

        // Create a contract instance
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);

        const tx = await contract.mintToken();
        const receipt = await tx.wait();

        setIsLoading(false);
        alert(`Minting successful! Transaction Hash: ${receipt.transactionHash}`);

      } catch (error) {
        console.error('Minting failed:', error);
        alert('Minting failed. Please try again.');
      }
    }
  };

    return (
        <View style={styles.container}>
             <TouchableOpacity style={styles.container} onPress={() => handleNotificationClick(type)}>
            <View style={styles.iconCircle}>
            <Icon name={iconName} size={30} />
            </View>
            <View style={styles.notificationContentContainer}>
            <Text style={styles.notificationTitle}>You can mint your test stable coin by cliking here!</Text>
            <Text style={styles.notificationSubTitle}>{time}</Text>
            </View>
            {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
            </TouchableOpacity>
        </View>
    );
}


const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
      justifyContent: "space-between",
      flexDirection:"row",
      marginTop: 20,
      alignItems: "center",
  },

  iconCircle: {
    borderRadius: 25, // Half of the width and height to make it circular
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Width of the border
    borderColor: '#000000', // Color of the border
  },

  notificationTitle: {
    fontSize: 15,
    width: 310,
    fontWeight: "500"
  },

  notificationSubTitle: {
    fontWeight: "600"
  },

  notificationContentContainer: {
    flexDirection:"column",
    marginLeft: 15,
  }
})
