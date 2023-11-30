import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { MobileNav } from '../Footer/NavBar/Navbar';

export default function Discover() {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>This feature is not implemented yet, Coming soon...</ Text>
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

    title : {
        justifyContent: "center",
        alignItems: "center",
        fontSize: 30
    },
    
})
