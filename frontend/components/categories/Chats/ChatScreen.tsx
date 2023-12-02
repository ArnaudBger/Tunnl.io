import React, {useState}from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = ({ route }) => {
    const navigation = useNavigation();
    const { chatId, demoStage, setDemoStage } = route.params;
    const [isDealSigned, setIsDealSigned] = useState(false);
    const [isContentPosted, setIsContentPosted] = useState(false);
    const [isContentVerified, setIsContentVerified] = useState(true);

  

    //GET INFORMATION RELATED TO THIS CHAT ID...
    
    const mockChats = [
        { id: 1, brandName: `Macdonald's`, brandlogo: require("../../../images/macdonald.jpg") },
        // ... more chats
    ];

    // Find the chat details based on the chatId
    const chatDetails = mockChats.find(chat => chat.id === chatId);

    const goBackToChats = () => {
        // Navigate back to Home and set Chats as active category
        navigation.navigate('Home');
    };
    
    const handleSignDeal = () => {
        // Simulate a transaction (e.g., signing the deal)
        const transactionSuccessful = true; // Replace with actual transaction logic

        if (transactionSuccessful) {
            setIsDealSigned(true); // Update deal signing status
            setDemoStage(2); // Update the demo stage to 3
        } else {
            // Handle transaction failure (e.g., show an error message)
        }
    };
    
    const handlePostContent = () => {
        // Simulate a transaction (e.g., posting the content)
        const transactionSuccessful = true; // Replace with actual transaction logic

        if (transactionSuccessful) {
            setIsContentPosted(true);
            setDemoStage(4); // Update the demo stage to 3
        } else {
            // Handle transaction failure (e.g., show an error message)
        }
    };

    // Mock messages for the chat. In a real app, you would fetch these from your backend.
    const mockMessages = [
        // Stage 0: Find a agreement on a specific content
        { sender: 'other', text: 'Hi! We’re excited to collaborate with you on our Big Mac campaign.', time: '09:00 AM', stage:0},
        { sender: 'user', text: 'Hello! I’m thrilled to be part of this. What’s the plan?', time: '09:05 AM', stage:0},
        { sender: 'other', text: 'We’d like you to create a post featuring the Big Mac. Here’s an image and a suggested caption: "Can’t get enough of the classic Big Mac! #BigMac #McDonaldsLove"', image: require("../../../images/big_mac.jpg"), time:'09:10 AM', stage:0},
        { sender: 'user', text: 'Sounds great. What’s the deadline for posting?', time: '9:15 AM', stage:0},
        { sender: 'other', text: 'Please post it within the next 3 days. We’ll verify it within 3 hours of posting.', time: '9:20 AM', stage:0},
        { sender: 'user', text: 'Got it. And what about the performance targets?', time: '9:25 AM', stage:0},
        { sender: 'other', text: 'We are aiming for 100,000 impressions on your post. If this target is reached, we will pay you $1,000.', time: '9:30 AM', stage:0},
        { sender: 'user', text: 'That sounds fair. I’m confident we can hit that target. Let’s do this!', time: '9:35 AM', stage:0},
        { sender: 'other', text: 'Great! We’ll formalize this in the deal. Looking forward to seeing the results.', time: '9:40 AM', stage:0},
        { sender: 'user', text: 'Perfect! I’ll start preparing the post. Excited for this collaboration!', time: '9:45 AM', stage:0},

        // Stage 1: Deal for Signing the Content 
        { 
            sender: 'other', 
            text: 'Here’s the deal for our campaign. Please review and sign it.', 
            stage: 1,
            deal: {
                description: 'Agreement for Big Mac Campaign',
                terms: 'Post content within 3 days, verification in 3 hours, performance evaluation after 2 days.',
                actionCategory: "Signing"
            },
            time: '9:40 AM'
        },
        // Stage 2: Deal for Posting the Content
        { 
            sender: 'other', 
            text: 'Now that the deal is signed, it’s time to post the content for our Big Mac campaign. Please use the following image and caption for your post.', 
            caption: "Loving the iconic taste of the Big Mac! #BigMac #McDonaldsLove",
            time: '10:00 AM',
            stage: 2,
            deal: {
                description: 'Post the Content for Big Mac Campaign',
                terms: 'Use the provided image and caption for your post.',
                actionCategory: "Posting"
            }
        },

        // Stage 3: User prompts for content verification
        {
            sender: 'user',
            text: "I've posted the content as agreed. It's time for you to verify it.",
            time: '11:00 AM',
            stage: 3,
            deal: {
                description: 'Verify Posted Content',
                terms: 'Please verify the content for the Big Mac Campaign.',
                actionCategory: "Verification",
                verifyAction: () => {
                    // Add logic for verification action
                }
            }
        },
        // ... more messages ...
    ];

    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={goBackToChats} style={styles.backButton}>
                    <Icon name="arrow-back-outline" size={30} color="#000" />
                </TouchableOpacity>
                <Image source={chatDetails.brandlogo} style={styles.brandLogo} />
                <Text style={styles.brandName}>{chatDetails.brandName}</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                {mockMessages.map((message, index) => (
                    (message.stage <= demoStage) && (
                        <View key={index} style={[styles.messageContainer, message.sender === 'user' ? styles.userMessage : styles.otherMessage]}>
                            <Text style={styles.messageText}>{message.text}</Text>
                            {message.image && <Image source={message.image} style={styles.messageImage} onError={(e) => console.log(e.nativeEvent.error)}/>}
                            {message.deal && (
                                <View style={styles.dealContainer}>
                                    <Text style={styles.dealDescription}>{message.deal.description}</Text>
                                    <Text style={styles.dealTerms}>{message.deal.terms}</Text>
                                    {message.deal.actionCategory === "Signing" && !isDealSigned && (
                                        <TouchableOpacity style={styles.signButton} onPress={handleSignDeal}>
                                            <Text style={styles.signButtonText}>Sign Deal</Text>
                                        </TouchableOpacity>
                                    )}
                                    {message.deal.actionCategory === "Signing" && isDealSigned && (
                                        <View style={styles.signedContainer}>
                                            <Icon name="checkmark-circle" size={20} color="green" />
                                            <Text style={styles.signedText}>Signed Verified</Text>
                                        </View>
                                    )}
                                    {message.deal.actionCategory === "Posting" && !isContentPosted && (
                                        <TouchableOpacity style={styles.signButton} onPress={handlePostContent}>
                                            <Text style={styles.signButtonText}>Post Content</Text>
                                        </TouchableOpacity>
                                    )}
                                    {message.deal.actionCategory === "Posting" && isContentPosted && (
                                        <View style={styles.signedContainer}>
                                            <Icon name="checkmark-circle" size={20} color="green" />
                                            <Text style={styles.signedText}>Content Posted Verified</Text>
                                        </View>
                                    )}
                                    {message.deal.actionCategory === "Verification" && isContentVerified && (
                                        <View style={styles.signedContainer}>
                                            <Icon name="checkmark-circle" size={20} color="green" />
                                            <Text style={styles.signedText}>Content Verified</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                            <Text style={styles.messageTime}>{message.time}</Text>
                        </View>
                    )
                ))}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection:"column",
    },
    scrollView: {
        padding: 20,
        marginTop: 104,
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        borderBottomWidth: 1,
        borderColor: "#cccccc",
        height: 104,
        paddingTop: 50,
    },
    backButton: {
        marginRight: 10,
    },
    brandLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    brandName: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '70%',
        alignItems: "center",
    },
    userMessage: {
        backgroundColor: '#ADD8E6', // Light blue
        marginLeft: 'auto', // Align to right
    },
    otherMessage: {
        backgroundColor: '#FFFFFF', // White
        marginRight: 'auto', // Align to left
    },
    messageText: {
        fontSize: 16,
    },

    messageImage: {
        marginTop: 10,
        width: 220,
        height: 200
    },

    dealContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    dealDescription: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dealTerms: {
        fontSize: 14,
        marginTop: 5,
    },
    signButton: {
        marginTop: 10,
        backgroundColor: '#ADD8E6',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    signButtonText: {
        fontSize: 16,
        color: 'white',
    },

    signedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    signedText: {
        marginLeft: 5,
        fontSize: 16,
        color: 'green',
    },

    messageTime: {
        fontSize: 12,
        color: 'grey',
        marginTop: 5,
        alignSelf: 'flex-end', // Align the timestamp to the end of the message container
    },
});

export default ChatScreen;
