import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"
import { ethers } from 'ethers';
import { useWeb3 } from '../../../utils/Web3Context'; // Adjust the path as needed
import {contractAddress, contractABI} from '../../../utils/contractInfo'
import React, { useState } from 'react';
import { Demo } from "../../../icons/Demo/Demo";
import { Signature } from "../../../icons/Signature/Signature";
import { Post } from "../../../icons/Post/Post";
import { PendingVerification } from "../../../icons/PendingVerification/PendingVerification";
import { Verification } from "../../../icons/Verification/Verification";

export default function NotificationCard({
    type = "startDemo",
    brand = "Macdonald's",
    dealId= "1",
    time = "Now",
    onPress,
}) 

{

let icon = () => {
    switch (type) {
        case "startDemo":
            return <Demo />
        case "endDemo":
            return <Demo />
        case "sign":
            return <Signature />
        case "post":
            return <Post />
        case "waitVerification":
            return <PendingVerification />
        case "verification":
            return <Verification />
    }
    };

let text = () =>{
    switch (type) {
        case "startDemo":
            return "Ready to embark on an exciting journey? Click here to start the demo now!";
        case "sign":
            return `Opportunity knocks! Sign your marketing campaign deal with ${brand} and set things in motion.`;
        case "post":
            return `Great job on sealing the deal! Now, it's showtime. You have 3 days to create and post your amazing content. Let's make it count!`;
        case "waitVerification":
            return `Your content is out there for the world to see! Sit back and relax while ${brand} reviews and verifies your submission.`;
        case "verification":
            return `Your content has passed the verification stage! Hold tight, the performance evaluation is underway. Payment is just around the corner.`;
        case "endDemo":
            return `Demo complete. Thank you!`;
        default:
            return "Welcome! Ready to explore? Choose an option to get started.";
    }
}

const provider = useWeb3();
    return (
        <View style={styles.container}>
             <TouchableOpacity style={styles.container} onPress={onPress}>
            {icon()}
            <View style={styles.notificationContentContainer}>
            <Text style={styles.notificationTitle}>{text()}</Text>
            <Text style={styles.notificationSubTitle}>{time}</Text>
            </View>
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
    fontWeight: "400",
    marginTop: 10,
  },

  notificationContentContainer: {
    flexDirection:"column",
    marginLeft: 15,
  }
})
