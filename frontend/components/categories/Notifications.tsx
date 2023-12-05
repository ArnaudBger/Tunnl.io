import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Modal, Text, TouchableOpacity } from "react-native";
import NotificationCard from "./Notifications/NotificationCard";
import Chat from './Chats/ChatScreen';
import { useNavigation } from '@react-navigation/native';
import { useDemoStage } from '../../utils/DemoContext';
import { useWeb3 } from '../../utils/Web3Context';

export default function Notifications({}
    ) {
        const [isModalVisible, setIsModalVisible] = useState(false);
        const [isDemoEnded, setDemoEnded] = useState(false);
        const  {demoStage, setDemoStage, demoDealID, setDemoDealID}  = useDemoStage();
        const provider = useWeb3();
        const navigation = useNavigation();

        const startDemo = () => {
            setDemoStage(1);
            setIsModalVisible(false);
            //Create a new deal 
            setDemoDealID
        }

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
            navigation.navigate("ChatScreen", { chatId, demoStage, setDemoStage});
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
