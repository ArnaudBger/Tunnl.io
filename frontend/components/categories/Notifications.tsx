import React, { useContext, useState } from 'react';
import { View, StyleSheet, Dimensions, Modal, Text, TouchableOpacity } from "react-native";
import NotificationCard from "./Notifications/NotificationCard";
import { useNavigation } from '@react-navigation/native';
import { useDemoStage } from '../../utils/DemoContext';
import { useWeb3 } from '../../utils/Web3Context';
import { ethers } from 'ethers';
import { Alert } from 'react-native';
import { BRAND_ACCOUNT_PRIVATE_KEY } from '@env'
import {tunnlContractABI, tunnlContractAddress, stcContractABI, stcContractAddress} from '../../utils/contractInfo'; // Path to your contract ABI
import { DealsContext } from '../../utils/DealsContext';
import { useTransaction } from '../../utils/TransactionContext';

export default function Notifications({wallet, pk}
    ) { 
        const { startTransaction, endTransaction } = useTransaction();
        const [isModalVisible, setIsModalVisible] = useState(false);
        const [isDemoEnded, setDemoEnded] = useState(false);
        const  {demoStage, setDemoStage, demoDealID, setDemoDealID}  = useDemoStage();
        const provider = useWeb3();
        const navigation = useNavigation();
        const {deals, loading, error, updateDeals} = useContext(DealsContext)

        const startDemo = async () => {
            try {
                // Create a wallet instance from the private key
                const signer = new ethers.Wallet(BRAND_ACCOUNT_PRIVATE_KEY, provider);
        
                // Create a new instance of the contract
                const tunnlContract = new ethers.Contract(tunnlContractAddress, tunnlContractABI, signer);
        
                // Get the next deal ID (assuming it's a BigInt)
                let dealIdBigInt = await tunnlContract.nextDealId();
                let dealId = dealIdBigInt.toString(); // Convert BigInt to string to safely handle large numbers
        
                // Update transaction state to "started"
                startTransaction();
                
                // Call the createDeal function
                const transaction = await tunnlContract.createDeal(
                    wallet, 10000, 3600, 3600, 10, 1000, "0xaf0ce9c95a4a15b4aca49063258060870978337d4dd662521086aca28af1fcfb"
                );

                // Wait for the transaction to be mined
                const receipt = await transaction.wait();
        
                // Update transaction state to "ended"
                // After the transaction is completed
                endTransaction(receipt.status === 1 ? 'success' : 'failed', transaction.hash);
        
                // Update the demo stage and deal ID
                setDemoStage(1);
                setDemoDealID(dealId);
        
                // Close the modal and show success alert
                setIsModalVisible(false);
                
                 // Wait for a while before updating deals to give the subgraph time to update
                setTimeout(() => {
                    updateDeals();
                }, 10000); // Wait for 5 seconds (5000 milliseconds)
                 
            } catch (error) {
                console.error('Transaction failed:', error);
        
                // Update transaction state to "failed"
                endTransaction('failed');
            }
        };

        const closeDemo = () => {
            setIsModalVisible(false);
        }

        const endDemo = () => {
            setDemoEnded(true);
            setIsModalVisible(true);
        }

        const openModal = () => {
            setIsModalVisible(true);
        };


        const openAgreementChat = () => {
            chatId = 1
            navigation.navigate("ChatScreen", { chatId, pk});
        };

    return (
        <View style={styles.container}>
                 {(demoStage >= 3) && (
                    <NotificationCard 
                        type="endDemo" 
                        brand="Macdonald's" 
                        time="11:05 AM"
                        onPress={endDemo}
                    />
                )}
                {(demoStage >= 3) && (
                    <NotificationCard 
                        type="verification" 
                        brand="Macdonald's" 
                        time="11:05 AM"
                        onPress={openAgreementChat}
                    />
                )}
                {(demoStage >= 3) && (
                    <NotificationCard 
                        type="waitVerification" 
                        brand="Macdonald's" 
                        time="11:00 AM"
                        onPress={openAgreementChat}
                    />
                )}
                {(demoStage >= 2) && (
                    <NotificationCard 
                        type="post" 
                        brand="Macdonald's" 
                        time="9:45 AM"
                        onPress={openAgreementChat}
                    />
                )}
               {(demoStage >= 1) && (
                <NotificationCard 
                    type="sign" 
                    brand="Macdonald's" 
                    time="9:40 AM"
                    onPress={openAgreementChat}
                />
            )}
            <NotificationCard type="startDemo" brand="Macdonald's" time="Now" onPress={openModal} />
            <Modal
                animationType="slide"
                transparent={false}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                {!isDemoEnded ? (
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Demo Steps</Text>
                        <Text style={styles.modalContent}>
                        Welcome to our application demo featuring a marketing campaign with Macdonald's.{"\n\n"}
                        This demo simulates a real-world scenario where you collaborate with Macdonald's to post specific content on Instagram. Here's how it works:{"\n\n"}

                        Context:{"\n"}
                        Macdonald's approaches you for a marketing campaign. Together, you agree on specific content to be posted on Instagram. A deal is then created to formalize this agreement.{"\n\n"}

                        Step 1:{"\n"}
                        Review and sign the deal provided by Macdonald's. This involves verifying the deal's content and signing it on-chain.{"\n\n"}

                        Step 2:{"\n"}
                        Post the agreed content on Instagram as per the terms of the deal.{"\n\n"}

                        Step 3:{"\n"}
                        Macdonald's will review your posted content. In a real scenario, if Macdonald's disputes the content, then our DApp acts as a third-party verifier to check the content against the agreed terms in the deal. For this demo, we'll assume Macdonald's accepts the content, initiating the performance period.{"\n\n"}

                        Step 4:{"\n"}
                        After the performance deadline, your payment is processed automatically using Chainlink functions.{"\n\n"}

                        Please note, each demo initiation creates an on-chain deal, incurring some ETH costs. Please use this feature judiciously!
                        </Text>


                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={startDemo}
                        >
                            <Text>Start Demo</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Demo Ended</Text>
                        <Text style={styles.modalContent}>
                            Thank you for participating in the demo. You have successfully completed all the steps.
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeDemo}
                        >
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalContent: {
        fontSize: 16,
        color: 'grey',
        textAlign: 'left',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#ADD8E6',
        padding: 10,
        borderRadius: 5,
    },
    // ... other styles ...
});
