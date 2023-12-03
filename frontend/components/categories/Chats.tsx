import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDemoStage } from '../../utils/DemoContext';


export default function Chats() {
    const navigation = useNavigation();
    const {demoStage, setDemoStage, demoDealID, setDemoDealID} = useDemoStage();

    const mockChats = [
        { id: 1, brandName: `Macdonald's`, lastMessage: "This is the last message of the conversation", brandlogo:require("../../images/macdonald.jpg") },
        // ... more chats
    ];

    // In Chats component
        const selectChat = (chatId) => {
            navigation.navigate("ChatScreen", { chatId });
        };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Messages</Text>
            <ScrollView style={styles.scrollView}>
                {mockChats.map(chat => (
                    <TouchableOpacity key={chat.id} onPress={() => selectChat(chat.id)}>
                        <View style={styles.chatSummary}>
                            <Image 
                                source={chat.brandlogo} 
                                style={styles.brandLogo} 
                            />
                            <View style={styles.chatInfo}>
                                <Text style={styles.chatTitle}>{chat.brandName}</Text>
                                <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
                            </View>
                            <Icon name="chevron-forward-outline" size={20} color="grey" />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "white"
    },
    scrollView: {
        marginTop: 10,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chatSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    
    brandLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    chatInfo: {
        flex: 1,
    },

    chatTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lastMessage: {
        fontSize: 14,
        color: 'grey',
    },
    // ... other styles
});
