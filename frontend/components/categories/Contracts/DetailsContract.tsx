import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have this package installed

const DetailsContract = ({ route, navigation }) => {
    const { deal } = route.params;

    const goBackToHome = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={goBackToHome} style={styles.backButton}>
                    <Icon name="arrow-back-outline" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Deal Details</Text>
            </View>

            <View style={styles.contentContainer}>
                <Text>Deal ID: {deal.id}</Text>
                <Text>Brand Deposit: {deal.brandDeposit}</Text>
                {/* Render other deal details */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        height: 104,
        borderBottomWidth: 1,
        borderColor: "#cccccc",
        paddingTop: 50, // Adjust this value based on your status bar height
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
});

export default DetailsContract;
