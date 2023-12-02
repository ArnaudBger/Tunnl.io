import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Discover() {
    // Placeholder for any action you might want to add
    const handleInterest = () => {
        console.log("User interested in upcoming feature!");
        // Add logic for user interest (e.g., open a sign-up form, navigate to a different screen, etc.)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Something Exciting is on the Way!</Text>
            <Text style={styles.subtitle}>
                Our team is working hard on this feature. Stay tuned for updates.
            </Text>
           
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
    },
    image: {
        width: 150, // Adjust as needed
        height: 150, // Adjust as needed
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#007bff", // Adjust color as needed
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});
